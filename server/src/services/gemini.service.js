import dotenv from "dotenv";
dotenv.config();

import systemPrompt from "../config/systemPrompt.js";

// ==========================================
// Gemini REST API Configuration
// ==========================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL = "gemini-3.6-flash";

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";


if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from server .env");
} else {
  console.log("✅ Gemini REST API key loaded");
  console.log("Gemini Model:", GEMINI_MODEL);
}


const buildPrompt = (
  conversation,
  knowledge = ""
) => `
${systemPrompt}

========================
BN Technology Knowledge
========================

${knowledge || "No company knowledge found."}

========================
Conversation
========================

${conversation}

========================
Instructions
========================

1. Use BN Technology knowledge whenever available.
2. If the question is about BN Technology, answer ONLY from the provided knowledge.
3. If unrelated, answer normally.
4. Never invent BN Technology-specific facts.
5. Give detailed answers.
6. Explain step-by-step whenever needed.
7. Use headings and bullet points.
8. Finish the complete response.

AI:
`;

// ==========================================
// Headers
// ==========================================

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-goog-api-key": GEMINI_API_KEY,
});

// ==========================================
// Request Body
// ==========================================

const buildRequestBody = (
  conversation,
  knowledge
) => ({
  contents: [
    {
      role: "user",
      parts: [
        {
          text: buildPrompt(
            conversation,
            knowledge
          ),
        },
      ],
    },
  ],

  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  },
});

// ==========================================
// Normal Generate URL
// ==========================================

const getGenerateUrl = () =>
  `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent`;

// ==========================================
// Streaming Generate URL
// ==========================================

const getStreamUrl = () =>
  `${GEMINI_BASE_URL}/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;

// ==========================================
// Normal Response
// ==========================================

export const generateAIResponse = async (
  conversation,
  knowledge = ""
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing from server .env"
      );
    }

    console.log("=================================");
    console.log("GEMINI REST REQUEST");
    console.log("MODEL:", GEMINI_MODEL);
    console.log("=================================");

    const response = await fetch(
      getGenerateUrl(),
      {
        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify(
          buildRequestBody(
            conversation,
            knowledge
          )
        ),
      }
    );

    const responseText =
      await response.text();

    if (!response.ok) {
      console.error(
        "========== GEMINI REST ERROR =========="
      );

      console.error(
        "STATUS:",
        response.status
      );

      console.error(
        "BODY:",
        responseText
      );

      console.error(
        "======================================="
      );

      throw new Error(
        `Gemini API Error ${response.status}: ${responseText}`
      );
    }

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(
        `Gemini returned invalid JSON: ${responseText}`
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(
          (part) => part.text || ""
        )
        .join("") || "";

    if (!text) {
      console.error(
        "Gemini returned empty response:"
      );

      console.error(
        JSON.stringify(
          data,
          null,
          2
        )
      );

      throw new Error(
        "Gemini returned an empty response"
      );
    }

    return text;

  } catch (err) {

    console.error(
      "========== GEMINI ERROR =========="
    );

    console.error(
      "MESSAGE:",
      err?.message
    );

    console.error(err);

    console.error(
      "=================================="
    );

    throw err;
  }
};

// ==========================================
// Streaming Response
// ==========================================

export const generateAIResponseStream = async (
  conversation,
  knowledge = ""
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing from server .env"
      );
    }

    console.log(
      "=========================================="
    );

    console.log(
      "GEMINI REST STREAM REQUEST"
    );

    console.log(
      "MODEL:",
      GEMINI_MODEL
    );

    console.log(
      "=========================================="
    );

    const response = await fetch(
      getStreamUrl(),
      {
        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify(
          buildRequestBody(
            conversation,
            knowledge
          )
        ),
      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "========== GEMINI STREAM REST ERROR =========="
      );

      console.error(
        "STATUS:",
        response.status
      );

      console.error(
        "BODY:",
        errorText
      );

      console.error(
        "=============================================="
      );

      throw new Error(
        `Gemini Stream API Error ${response.status}: ${errorText}`
      );
    }

    if (!response.body) {
      throw new Error(
        "Gemini streaming response body is empty"
      );
    }

    // ==========================================
    // WebStream Reader
    // ==========================================

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let buffer = "";

    // ==========================================
    // Parse Gemini SSE Stream
    // ==========================================

    async function* parseGeminiStream() {

      try {

        while (true) {

          const {
            done,
            value,
          } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(
            value,
            {
              stream: true,
            }
          );

          const lines =
            buffer.split("\n");

          buffer =
            lines.pop() || "";

          for (const line of lines) {

            const trimmed =
              line.trim();

            if (!trimmed) {
              continue;
            }

            if (
              !trimmed.startsWith(
                "data:"
              )
            ) {
              continue;
            }

            const jsonString =
              trimmed
                .slice(5)
                .trim();

            if (
              !jsonString ||
              jsonString === "[DONE]"
            ) {
              continue;
            }

            try {

              const data =
                JSON.parse(
                  jsonString
                );

              const text =
                data
                  ?.candidates?.[0]
                  ?.content?.parts
                  ?.map(
                    (part) =>
                      part.text || ""
                  )
                  .join("") || "";

              if (text) {

                yield {
                  text,
                };

              }

            } catch (
              parseError
            ) {

              console.error(
                "Gemini SSE JSON Parse Error:",
                parseError
              );

              console.error(
                "RAW DATA:",
                jsonString
              );

            }
          }
        }

        // ======================================
        // Process Remaining Buffer
        // ======================================

        if (buffer.trim()) {

          const trimmed =
            buffer.trim();

          if (
            trimmed.startsWith(
              "data:"
            )
          ) {

            const jsonString =
              trimmed
                .slice(5)
                .trim();

            if (
              jsonString &&
              jsonString !== "[DONE]"
            ) {

              try {

                const data =
                  JSON.parse(
                    jsonString
                  );

                const text =
                  data
                    ?.candidates?.[0]
                    ?.content?.parts
                    ?.map(
                      (part) =>
                        part.text || ""
                    )
                    .join("") || "";

                if (text) {

                  yield {
                    text,
                  };

                }

              } catch (err) {

                console.error(
                  "Final SSE Parse Error:",
                  err
                );

              }
            }
          }
        }

      } finally {

        reader.releaseLock();

      }
    }

    return parseGeminiStream();

  } catch (err) {

    console.error(
      "========== GEMINI STREAM ERROR =========="
    );

    console.error(
      "MESSAGE:",
      err?.message
    );

    console.error(err);

    console.error(
      "=========================================="
    );

    throw err;
  }
};