import { Router } from "express";
import wishRouter from "../services/wishes/routes";
import mediaRouter from "../services/media/routes";
import authRouter from "../services/auth/routes";

const router = Router();

router.use("/wishes", wishRouter);
router.use("/auth", authRouter);

export default router;
