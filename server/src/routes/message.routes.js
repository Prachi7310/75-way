import express from "express";
import {
  sendMessage,
  sendMessageStream,
  getMessages,
} from "../controllers/message.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================
// Normal Message
// ======================================
router.post("/send", protect, sendMessage);

// ======================================
// Streaming Message (ChatGPT Style)
// ======================================
router.post("/stream", protect, sendMessageStream);

// ======================================
// Get Messages
// ======================================
router.get("/:chatId", protect, getMessages);

export default router;