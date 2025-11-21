import { Media } from "../models/media.model";

type UploadResult = {
  fileId?: string;
  link?: string;
  directLink?: string;
  name?: string;
  size?: number;
  mimeType?: string;
  [k: string]: any;
};

class MediaService {

  // upload a file buffer to GoFile
  async uploadFile(buffer: Buffer, filename: string, token?: string): Promise<UploadResult> {
    const url = `https://upload.gofile.io/uploadfile`;
    const form = new (global as any).FormData();
    form.append("file", buffer, filename);
    if (token) form.append("token", token);

    const res = await fetch(url, { method: "POST", body: form as any });
    const json = await res.json();
    if (json.status !== "ok") throw new Error("gofile upload failed: " + JSON.stringify(json));
    const data = json.data as UploadResult;
    // persist metadata to MongoDB if possible
    try {
      await Media.create({
        fileId: data.fileId,
        name: data.name || filename,
        link: data.link,
        directLink: data.directLink,
        size: data.size,
        mimeType: data.mimeType,
        metadata: data,
      });
    } catch (err) {
      // if DB persist fails, don't block the upload — log and continue
      // eslint-disable-next-line no-console
      console.warn("Failed to persist media metadata:", err);
    }

    return data;
  }

  // Return a public page for the file - gofile exposes a download page
  getFilePageUrl(fileId: string) {
    return `https://gofile.io/d/${fileId}`;
  }

  async findByFileId(fileId: string) {
    return Media.findOne({ fileId }).lean();
  }
}

export default new MediaService();
