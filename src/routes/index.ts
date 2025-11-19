import { Router } from "express";
import { getExample } from "../controllers/example.controller";
import healthRouter from "./health.route";
import itemRouter from "./item.route";

const router = Router();

router.get("/example", getExample);
router.use("/health", healthRouter);
router.use("/items", itemRouter);

export default router;
