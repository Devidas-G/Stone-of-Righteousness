import { Router } from "express";
import * as wishesController from "../controllers/wishes.controller";

const router = Router();

router.get("/list", wishesController.list);
router.get("/render", wishesController.render);
router.get("/random", wishesController.random);
router.post("/create", wishesController.create);
router.put("/update/:id", wishesController.update);
router.delete("/delete/:id", wishesController.remove);

export default router;
