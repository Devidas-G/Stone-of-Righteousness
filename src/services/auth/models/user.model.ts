import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role?: string;
  isAnonymous?: boolean;
  refreshTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String, required: true },
    name: String,
    role: { type: String, default: "user" },
    isAnonymous: { type: Boolean, default: false },
    refreshTokens: [String],
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", UserSchema);
