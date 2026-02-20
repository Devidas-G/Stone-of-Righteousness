import { Router, Request, Response  } from "express";
const multer = require("multer");
import * as mediaController from "../controllers/media.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { success } from "../../../core/utils/responseWrapper";
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req: Request, res: Response) => {
  return success(res, {
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

router.post("/upload", requireAuth, upload.single("file"), mediaController.upload);
// router.get("/info/:id", mediaController.info);
// router.get("/download/:id", mediaController.downloadPage);

export default router;
