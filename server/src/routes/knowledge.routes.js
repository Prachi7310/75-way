import express from "express";

import {
  createKnowledge,
  getKnowledge,
  getKnowledgeById,
  updateKnowledge,
  deleteKnowledge,
  searchKnowledge,
} from "../controllers/knowledge.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// User
router.get("/", protect, getKnowledge);
router.get("/search", protect, searchKnowledge);
router.get("/:id", protect, getKnowledgeById);

// Admin
router.post("/", protect, adminOnly, createKnowledge);
router.put("/:id", protect, adminOnly, updateKnowledge);
router.delete("/:id", protect, adminOnly, deleteKnowledge);

export default router;