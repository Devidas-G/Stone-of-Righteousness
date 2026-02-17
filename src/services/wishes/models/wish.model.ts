import { Schema, model, Document } from "mongoose";

export interface IWish extends Document {
  festival: string;
  lang: string;
  tone: string;
  text: string;
  tags: string[];
  approved: boolean;
  author?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const WishSchema = new Schema<IWish>({
  festival: { type: String, required: true, index: true },
  lang: { type: String, required: true, default: "en" },
  tone: { type: String, required: true, default: "celebratory" },
  text: { type: String, required: true },
  tags: [String],
  approved: { type: Boolean, default: false },
  author: String
}, { timestamps: true });

export const Wish = model<IWish>("Wish", WishSchema);
