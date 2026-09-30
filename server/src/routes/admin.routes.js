import express from "express";

import {

getDashboardStats,

getUsers,

} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get(
"/dashboard",
protect,
adminOnly,
getDashboardStats
);

router.get(
"/users",
protect,
adminOnly,
getUsers
);

export default router;