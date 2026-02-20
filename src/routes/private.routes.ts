import { Router } from "express";
import mediaRouter from "../services/media/routes";
import authRouter from "../services/auth/routes";
import giveawayRouter from "../foodoid/giveaway/giveaway.routes";

const router = Router();

router.use("/media", mediaRouter);
router.use("/auth", authRouter);
router.use("/foodoid", giveawayRouter);

export default router;
