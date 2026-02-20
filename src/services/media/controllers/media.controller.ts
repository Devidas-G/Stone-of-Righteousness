import { Request, Response, NextFunction } from "express";
import mediaService from "../services/media.service";
import { created, success, error as respError } from "../../../core/utils/responseWrapper";
import { FileUpload } from "../models/fileUpload.model";

export const upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = (req as any).file as any | undefined;
    if (!file) return respError(res, "No file uploaded", 400);
    const userId = req.user.id;
    const result = await mediaService.uploadFile(file.buffer, file.originalname, userId);
    // 2. Store in MongoDB
    const doc = await FileUpload.create({
      userId,
      fileName: result.fileName,
      fileSize: result.fileSize,
      gofileId: result.gofileId,
      gofileUrl: result.gofileUrl,
    });

    return created(res, result);
  } catch (err) {
    next(err);
  }
};

// export const info = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id as string;
//     const data = await mediaService.findByFileId(id as string);
//     if (!data) return respError(res, "Not found", 404);
//     return success(res, data);
//   } catch (err) {
//     next(err);
//   }
// };

// export const downloadPage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const id = req.params.id as string;
//     const data = await mediaService.findByFileId(id as string);
//     if (data?.directLink) return res.redirect(data.directLink as string);
//     // fallback to public page
//     const page = mediaService.getFilePageUrl(id as string);
//     return res.redirect(page);
//   } catch (err) {
//     next(err);
//   }
// };
