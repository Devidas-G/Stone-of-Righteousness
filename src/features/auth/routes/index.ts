import { Router } from "express";
import { register, login, refresh, logout, anonymous, deleteMe } from "../controllers/auth.controller";
import { requireAuth } from "../../../middleware/auth.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/anonymous", anonymous);
router.delete("/me", requireAuth, deleteMe);

export default router;
