import { Router } from "express";
import {
  createGiveaway,
  getNearbyGiveaways,
  confirmGiveaway,
  reportGiveaway,
} from "./giveaway.controller";

const router = Router();

router.post("/create", createGiveaway);
router.get("/nearby", getNearbyGiveaways);
router.post("/:id/confirm", confirmGiveaway);
router.post("/:id/report", reportGiveaway);

export default router;
