import { Router } from "express";
import { getExample } from "../controllers/example.controller";
import healthRouter from "./health.route";
import itemRouter from "./item.route";
import wishRouter from "../features/wishes/routes";
import mediaRouter from "../features/media/routes";
import authRouter from "../features/auth/routes";

const router = Router();

router.get("/example", getExample);
router.use("/health", healthRouter);
router.use("/items", itemRouter);
router.use("/wishes", wishRouter);
router.use("/media", mediaRouter);
router.use("/auth", authRouter);

export default router;
