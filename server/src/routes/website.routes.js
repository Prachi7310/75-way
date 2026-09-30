import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { syncCompanyWebsite } from "../controllers/website.controller.js";

const router = express.Router();

router.post("/sync", protect, syncCompanyWebsite);

export default router;