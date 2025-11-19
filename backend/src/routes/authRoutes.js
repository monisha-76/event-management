import express from "express";
import { register, login, logout,getMe,updateProfile } from "../controllers/authController.js";
import { authRequired } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authRequired, getMe);
router.put("/update-profile", authRequired, updateProfile);

export default router;
