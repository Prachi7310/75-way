import dotenv from "dotenv";

// Load .env ONCE, before anything else
dotenv.config();

console.log("=================================");
console.log("ENV CHECK");
console.log("=================================");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY loaded");
console.log(
  "KEY PREFIX:",
  process.env.GEMINI_API_KEY.substring(0, 4)
);
console.log(
  "KEY LENGTH:",
  process.env.GEMINI_API_KEY.length
);

console.log("VERTEX:", process.env.GOOGLE_GENAI_USE_VERTEXAI);
console.log(
  "GOOGLE CREDENTIALS:",
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);

console.log("=================================");

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});