import { Router } from "express";
import { getExample } from "../controllers/example.controller";
import healthRouter from "./health.route";
import wishRouter from "../services/wishes/routes";
import mediaRouter from "../services/media/routes";
import authRouter from "../services/auth/routes";

const router = Router();

router.get("/example", getExample);
router.use("/health", healthRouter);
router.use("/wishes", wishRouter);
router.use("/auth", authRouter);

export default router;
