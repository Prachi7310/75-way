import Message from "../models/message.js";
import Chat from "../models/Chat.js";

import {
  generateAIResponse,
  generateAIResponseStream,
} from "../services/gemini.service.js";

import { searchKnowledge } from "../services/knowledge.service.js";

// =======================================
// Send Message (Normal)
// =======================================

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and Message are required",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Save User Message
    const userMessage = await Message.create({
      chat: chatId,
      sender: "user",
      content: message,
    });

    // Conversation History
    const history = await Message.find({
      chat: chatId,
    })
      .sort({ createdAt: 1 })
      .select("sender content");

    const conversation = history
      .map(
        (msg) =>
          `${msg.sender.toUpperCase()}: ${msg.content}`
      )
      .join("\n");

    // Search Knowledge
    const knowledge = await searchKnowledge(message);

    const knowledgeText =
      knowledge.length > 0
        ? knowledge
            .map(
              (item) =>
                `Title: ${item.title}
Category: ${item.category}
Content: ${item.content}`
            )
            .join("\n\n")
        : "";

    // Gemini Response
    const aiReply = await generateAIResponse(
      conversation,
      knowledgeText
    );

    // Save AI Message
    const aiMessage = await Message.create({
      chat: chatId,
      sender: "ai",
      content: aiReply,
    });

    // Rename Chat
    const totalMessages =
      await Message.countDocuments({
        chat: chatId,
      });

    if (totalMessages <= 2) {
      chat.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;

      await chat.save();
    }

    return res.status(200).json({
      success: true,
      userMessage,
      aiMessage,
      knowledgeUsed: knowledge.length,
    });

  } catch (err) {
    console.error("SEND MESSAGE ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// STREAM MESSAGE (Part 1)
// =======================================

export const sendMessageStream = async (req, res) => {
  try {

    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and Message are required",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    await Message.create({
      chat: chatId,
      sender: "user",
      content: message,
    });

    const history = await Message.find({
      chat: chatId,
    })
      .sort({ createdAt: 1 })
      .select("sender content");

    const conversation = history
      .map(
        (msg) =>
          `${msg.sender.toUpperCase()}: ${msg.content}`
      )
      .join("\n");

    const knowledge =
      await searchKnowledge(message);

    const knowledgeText =
      knowledge.length > 0
        ? knowledge
            .map(
              (item) =>
                `Title: ${item.title}
Category: ${item.category}
Content: ${item.content}`
            )
            .join("\n\n")
        : "";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    if (res.flushHeaders) {
      res.flushHeaders();
    }

    const stream = await generateAIResponseStream(
      conversation,
      knowledgeText
    );

    let fullResponse = "";
        for await (const chunk of stream) {

      console.log("RAW CHUNK =>", chunk);

      let text = "";

      // SDK Compatibility
      if (typeof chunk.text === "function") {
        text = chunk.text();
      } else if (typeof chunk.text === "string") {
        text = chunk.text;
      } else if (
        chunk?.candidates?.length > 0
      ) {
        text = chunk.candidates[0].content.parts
          ?.map((part) => part.text || "")
          .join("") || "";
      }

      if (!text) continue;

      console.log("TOKEN =>", text);

      fullResponse += text;

      res.write(
        `data: ${JSON.stringify({
          token: text,
        })}\n\n`
      );
    }

    console.log("FULL RESPONSE =>", fullResponse);

    // Save AI Message
    await Message.create({
      chat: chatId,
      sender: "ai",
      content: fullResponse,
    });

    // Rename Chat
    const totalMessages =
      await Message.countDocuments({
        chat: chatId,
      });

    if (totalMessages <= 2) {
      chat.title =
        message.length > 40
          ? message.substring(0, 40) + "..."
          : message;

      await chat.save();
    }

    // Finish Stream
    res.write("data: [DONE]\n\n");
    res.end();

  } catch (err) {

    console.error("========== STREAM ERROR ==========");
    console.error(err);
    console.error("==================================");

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    try {
      res.write(
        `data: ${JSON.stringify({
          error: err.message,
        })}\n\n`
      );

      res.end();

    } catch (_) {}
  }
};
// =======================================
// Get Messages
// =======================================

export const getMessages = async (req, res) => {
  try {

    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const messages = await Message.find({
      chat: chatId,
    })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (err) {

    console.error("GET MESSAGE ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};