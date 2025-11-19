import mongoose, { Document, Schema } from "mongoose";

export interface ItemDocument extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<ItemDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Item = mongoose.model<ItemDocument>("Item", ItemSchema);
export default Item;
