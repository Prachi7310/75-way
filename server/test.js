import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  // ===========================
  // Normal Response
  // ===========================

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Say hello in one line.",
  });

  let normalText = "";

  if (typeof response.text === "function") {
    normalText = response.text();
  } else if (typeof response.text === "string") {
    normalText = response.text;
  } else {
    normalText =
      response?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("") || "";
  }

  console.log("NORMAL:");
  console.log(normalText);

  console.log("\n========================\n");

  // ===========================
  // Streaming Response
  // ===========================

  const result = await ai.models.generateContentStream({
    model: "gemini-3.6-flash",
    contents: "Count from 1 to 5.",
  });

  const stream = result.stream ?? result;

  console.log("STREAM:");

  for await (const chunk of stream) {
    let text = "";

    if (typeof chunk.text === "function") {
      text = chunk.text();
    } else if (typeof chunk.text === "string") {
      text = chunk.text;
    } else {
      text =
        chunk?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("") || "";
    }

    process.stdout.write(text);
  }

  console.log("\n\nDONE");

} catch (err) {
  console.error(err);
}