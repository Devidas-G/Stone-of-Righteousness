import { Router, Request, Response } from "express";
import { success } from "../utils/responseWrapper";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return success(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

export default router;
