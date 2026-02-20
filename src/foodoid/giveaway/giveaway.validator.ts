// src/features/giveaway/giveaway.validator.ts
import { z } from "zod";

/**
 * GeoJSON Point Schema
 * CRITICAL: matches your mongoose model
 */
export const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z
    .tuple([
      z.number().min(-180).max(180), // lng
      z.number().min(-90).max(90),   // lat
    ])
});

/**
 * Create Giveaway Schema
 */
export const createGiveawaySchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
  location: geoPointSchema,
  address: z.string().min(3).max(500),
  foodType: z.enum(["veg", "non-veg", "both"]),
  quantityEstimate: z.number().int().positive(),
  startTime: z.coerce.date(), // auto converts string → Date
  endTime: z.coerce.date(),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: "endTime must be greater than startTime",
    path: ["endTime"],
  }
);

/**
 * Filters Schema (for body)
 */
export const filtersSchema = z.object({
  filters: z
    .object({
      status: z
        .array(z.enum(["active", "scheduled", "expired", "closed"]))
        .optional(),
      foodType: z
        .array(z.enum(["veg", "non-veg", "both"]))
        .optional(),
    })
    .optional(),
});

/**
 * Nearby Query Schema
 */
export const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().default(5000),
});

/**
 * Mongo ID param schema
 */
export const idParamSchema = z.object({
  id: z.string().min(1, "Giveaway ID is required"),
});