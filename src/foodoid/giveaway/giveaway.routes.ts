// giveaway.routes.ts
import express from "express";
import * as controller from "./giveaway.controller";
import { validate } from "../../core/middleware/validate.middleware";
import {
  createGiveawaySchema,
  nearbyQuerySchema,
  filtersSchema,
  idParamSchema,
} from "./giveaway.validator";

const router = express.Router();

// Create Giveaway
router.post(
  "/create",
  validate(createGiveawaySchema, "body"),
  controller.createGiveaway
);

// Nearby (query + optional filters body)
router.get(
  "/nearby",
  validate(nearbyQuerySchema, "query"),
  validate(filtersSchema, "body"),
  controller.getNearbyGiveaways
);

// Confirm
router.patch(
  "/:id/confirm",
  validate(idParamSchema, "params"),
  controller.confirmGiveaway
);

// Report
router.patch(
  "/:id/report",
  validate(idParamSchema, "params"),
  controller.reportGiveaway
);

export default router;