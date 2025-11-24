import fs from "fs";
import path from "path";
import { Media } from "../models/media.model";

class GofileService {
  private baseUrl = "https://api.gofile.io";
  private token = process.env.GOFILE_API_KEY!;

  // ------------------------------
  // UTILITIES
  // ------------------------------

  async getServer() {
    try {
      const res = await fetch(`${this.baseUrl}/getServer`);
      const json = await res.json();
      return json?.data?.server;
    } catch (e) {
      const res = await fetch(`${this.baseUrl}/servers`);
      const data = await res.json();
      if (!data?.data?.servers?.length) throw new Error("Unable to fetch servers");
      return data.data.servers[0].name;
    }
  }

  async getContent(folderId: string) {
    const url = `${this.baseUrl}/getContent?token=${this.token}&contentId=${folderId}`;
    const res = await fetch(url);
    return res.json();
  }

  async createFolder(parentId: string, folderName: string) {
    const url = `${this.baseUrl}/createFolder`;
    const form = new (global as any).FormData();
    form.append("token", this.token);
    form.append("parentFolderId", parentId);
    form.append("folderName", folderName);

    const res = await fetch(url, { method: "POST", body: form });
    const json = await res.json();
    if (json.status !== "ok") throw new Error("Failed to create folder");
    return json.data.folderId;
  }

  // ------------------------------
  // FOLDER LOGIC
  // ------------------------------

  private rootFolderCache: string | null = null;
  private usersFolderCache: string | null = null;
  private userSubFolders: Record<string, string> = {};

  async getRootFolder() {
    if (this.rootFolderCache) return this.rootFolderCache;

    const info = await fetch(`${this.baseUrl}/getAccountDetails?token=${this.token}`);
    const json = await info.json();
    this.rootFolderCache = json?.data?.rootFolder || json?.data?.rootFolderId;
    return this.rootFolderCache;
  }

  async getUsersFolder() {
    if (this.usersFolderCache) return this.usersFolderCache;

    const root = await this.getRootFolder();
    if (!root) throw new Error("Unable to resolve Gofile root folder");
    const content = await this.getContent(root);

    // Find if "users" exists
    const folders = content?.data?.contents || {};
    for (const key in folders) {
      if (folders[key].type === "folder" && folders[key].name === "users") {
        this.usersFolderCache = folders[key].id;
        return folders[key].id;
      }
    }

    // Create "users" folder
    const folderId = await this.createFolder(root, "users");
    this.usersFolderCache = folderId;
    return folderId;
  }

  async getUserFolder(userId: string) {
    if (this.userSubFolders[userId]) return this.userSubFolders[userId];

    const usersFolder = await this.getUsersFolder();
    const content = await this.getContent(usersFolder);

    const folders = content?.data?.contents || {};
    for (const key in folders) {
      if (folders[key].type === "folder" && folders[key].name === userId) {
        this.userSubFolders[userId] = folders[key].id;
        return folders[key].id;
      }
    }

    // Create user folder if not exists
    const userFolderId = await this.createFolder(usersFolder, userId);
    this.userSubFolders[userId] = userFolderId;
    return userFolderId;
  }

  // ------------------------------
  // UPLOAD
  // ------------------------------

  async uploadFile(bufferOrPath: Buffer | string, filename: string, userId: string) {
    let buffer: Buffer;
    let fileName = filename;

    if (typeof bufferOrPath === "string") {
      buffer = fs.readFileSync(bufferOrPath);
      fileName = filename || path.basename(bufferOrPath);
    } else {
      buffer = bufferOrPath;
    }

    // Ensure user folder exists
    const userFolderId = await this.getUserFolder(userId);

    // Get upload servers
    const servers: string[] = [];
    try {
      const primary = await this.getServer();
      if (primary) servers.push(primary);
    } catch {}

    try {
      const listRes = await fetch(`${this.baseUrl}/servers`);
      const listJson = await listRes.json();
      for (const s of listJson?.data?.servers || []) {
        if (s?.name && !servers.includes(s.name)) servers.push(s.name);
      }
    } catch {}

    if (servers.length === 0) throw new Error("No gofile servers found");

    let json: any = null;
    let lastErr: any = null;

    for (const server of servers) {
      const uploadUrl = `https://${server}.gofile.io/uploadFile`;

      try {
        const form = new (global as any).FormData();
        const blob = new (global as any).Blob([buffer]);

        form.append("file", blob, fileName);
        form.append("token", this.token);
        form.append("folderId", userFolderId);
        form.append("privacy", "private"); // 🔒 make file private

        const controller = new AbortController();
        const timeoutMs = 20000;
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(uploadUrl, {
          method: "POST",
          body: form as any,
          signal: controller.signal,
        });

        clearTimeout(timer);

        json = await res.json();
        if (json?.status === "ok") break;
        lastErr = json;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!json || json.status !== "ok") {
      throw new Error("Upload failed: " + JSON.stringify(lastErr));
    }

    const data = json.data || {};

    // Persist in DB
    try {
      await Media.create({
        userId,
        fileId: data.fileId,
        name: data.fileName || fileName,
        folderId: userFolderId,
        size: data.size || buffer.length,
        directLink: data.directLink,
        metadata: data,
      });
    } catch (err) {
      console.warn("Failed to persist media:", err);
    }

    return {
      fileName: data.fileName || fileName,
      fileSize: data.size,
      gofileId: data.fileId,
      folderId: userFolderId,
      gofileUrl: data.link || data.page || this.getFilePageUrl(data.fileId || data.code || data.id),
      raw: data,
    };
  }

  getFilePageUrl(fileId: string) {
    return `https://gofile.io/d/${fileId}`;
  }
}

export default new GofileService();
