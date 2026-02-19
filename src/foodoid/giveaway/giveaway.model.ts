import mongoose, { Schema, Document } from "mongoose";

export interface IGiveaway extends Document {
  title: string;
  description?: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  address?: string;
  foodType: "veg" | "non-veg" | "both";
  quantityEstimate?: number;
  startTime: Date;
  endTime: Date;
  status: "posted" | "closed" ;
  confirmCount: number;
  reportCount: number;
  createdAt: Date;
}

const GiveawaySchema = new Schema<IGiveaway>({
  title: { type: String, required: true },
  description: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  address: String,
  foodType: {
    type: String,
    enum: ["veg", "non-veg", "both"],
    default: "veg",
  },
  quantityEstimate: Number,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["posted", "closed"],
    default: "posted",
  },
  confirmCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// CRITICAL for nearby search
GiveawaySchema.index({ location: "2dsphere" });

export default mongoose.model<IGiveaway>("Giveaway", GiveawaySchema);
