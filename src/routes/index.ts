import { Router } from "express";
import { getExample } from "../controllers/example.controller";
import healthRouter from "./health.route";

const router = Router();

router.get("/example", getExample);
router.use("/health", healthRouter);

export default router;
