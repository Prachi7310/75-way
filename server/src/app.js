import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// 👇 NEW IMPORTS
import messageRoutes from "./routes/message.routes.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import websiteRoutes from "./routes/website.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// =========================
// Middlewares
// =========================
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// 👇 NEW ROUTES
app.use("/api/message", messageRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/website", websiteRoutes);
app.use("/api/admin", adminRoutes);

// =========================
// Health Check Route
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 BN Technology AI Assistant API is Running...",
  });
});

export default app;