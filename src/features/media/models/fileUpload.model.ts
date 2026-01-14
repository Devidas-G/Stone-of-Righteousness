
import { Schema, model } from "mongoose";

const fileUploadSchema = new Schema(
  {
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    gofileId: { type: String, required: true },
    gofileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const FileUpload = model("FileUpload", fileUploadSchema);
