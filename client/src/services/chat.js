import api from "./api";

// =====================================
// Base URL
// =====================================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// =====================================
// Chat APIs
// =====================================

export const createChat = async () => {
  const { data } = await api.post("/chat", {});
  return data;
};

export const getChats = async () => {
  const { data } = await api.get("/chat");
  return data;
};

export const deleteChat = async (id) => {
  const { data } = await api.delete(`/chat/${id}`);
  return data;
};

// =====================================
// Normal Message
// =====================================

export const sendMessage = async (chatId, message) => {
  const { data } = await api.post("/message/send", {
    chatId,
    message,
  });

  return data;
};

// =====================================
// Streaming Message
// =====================================

export const sendMessageStream = async (
  chatId,
  message,
  onToken,
  signal
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/message/stream`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        chatId,
        message,
      }),

      // Allows ChatWindow to cancel generation
      signal,
    }
  );

  if (!response.ok) {
    const text = await response.text();

    console.error("STREAM ERROR:", text);

    throw new Error(
      `Server Error (${response.status})`
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming not supported by this browser"
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  try {
    while (true) {
      const {
        done,
        value,
      } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      const lines = buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) continue;

        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const json = trimmed
         .slice(5)
          .trim();

        if (!json) continue;

        if (json === "[DONE]") {
          return;
        }

        try {
          const parsed = JSON.parse(json);

          if (parsed.error) {
            throw new Error(
              parsed.error
            );
          }

          if (parsed.token) {
            onToken(parsed.token);
          }

        } catch (err) {
          // Ignore JSON parsing errors caused
          // by incomplete SSE chunks.
          if (
            err?.message &&
            !err.message.includes(
              "Unexpected"
            )
          ) {
            throw err;
          }

          console.error(
            "SSE Parse Error:",
            err
          );
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      const trimmed = buffer.trim();

      if (trimmed.startsWith("data:")) {
        const json = trimmed
          .slice(5)
          .trim();

        if (
          json &&
          json !== "[DONE]"
        ) {
          try {
            const parsed =
              JSON.parse(json);

            if (parsed.error) {
              throw new Error(
                parsed.error
              );
            }

            if (parsed.token) {
              onToken(parsed.token);
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

  } catch (err) {

    // AbortController cancellation
    // is an expected action, not an error.
    if (
      err?.name ===
      "AbortError"
    ) {
      console.log(
        "🛑 AI generation stopped by user"
      );

      return;
    }

    throw err;

  } finally {

    try {
      reader.releaseLock();
    } catch (_) {}

  }
};

// =====================================
// Get Messages
// =====================================

export const getMessages = async (
  chatId
) => {
  const { data } = await api.get(
    `/message/${chatId}`
  );

  return data;
};