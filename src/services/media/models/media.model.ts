import { Schema, model, Document } from "mongoose";

export interface MediaDocument extends Document {
  fileId: string;
  name: string;
  link?: string;
  directLink?: string;
  size?: number;
  mimeType?: string;
  uploader?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<MediaDocument>(
  {
    fileId: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    link: String,
    directLink: String,
    size: Number,
    mimeType: String,
    uploader: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Media = model<MediaDocument>("Media", MediaSchema);
