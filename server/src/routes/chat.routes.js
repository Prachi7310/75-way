import express from "express";

import {
  createChat,
  getAllChats,
  getSingleChat,
  deleteChat,
} from "../controllers/chat.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// =========================
// Protected Routes
// =========================

// Create New Chat
router.post("/", protect, createChat);

// Get All Chats
router.get("/", protect, getAllChats);

// Get Single Chat
router.get("/:id", protect, getSingleChat);

// Delete Chat
router.delete("/:id", protect, deleteChat);

export default router;