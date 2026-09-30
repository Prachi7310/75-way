import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// =========================
// Public Routes
// =========================
router.post("/register", registerUser);
router.post("/login", loginUser);

// =========================
// Protected Routes
// =========================
router.get("/me", protect, getMe);

export default router;