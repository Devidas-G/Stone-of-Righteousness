// src/shared/utils/validate.ts
import { ZodSchema } from "zod";
import { Request, Response } from "express";

export const validate =
  (schema: ZodSchema, target: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: any) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    // Replace with parsed + typed data
    req[target] = result.data;
    next();
  };