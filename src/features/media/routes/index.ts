import { Router } from "express";
const multer = require("multer");
import * as mediaController from "../controllers/media.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), mediaController.upload);
router.get("/info/:id", mediaController.info);
router.get("/download/:id", mediaController.downloadPage);

export default router;
