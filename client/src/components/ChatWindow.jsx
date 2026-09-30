import { useEffect, useRef, useState } from "react";

import PromptCards from "./PromptCards";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";

import {
  sendMessageStream,
  getMessages,
} from "../services/chat";

import { useChat } from "../context/ChatContext";

export default function ChatWindow() {
  const {
    selectedChat,
    createNewChat,
    loadChats,
  } = useChat();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null);

  // =====================================
  // Load Messages
  // =====================================

  const loadMessages = async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    try {
      const res = await getMessages(chatId);

      setMessages(res?.messages || []);
    } catch (err) {
      console.error(
        "Load Messages Error:",
        err
      );

      setMessages([]);
    }
  };

  // =====================================
  // Watch Selected Chat
  // =====================================

  useEffect(() => {
    if (!selectedChat?._id) {
      setMessages([]);
      return;
    }

    loadMessages(selectedChat._id);
  }, [selectedChat?._id]);

  // =====================================
  // Stop Generation
  // =====================================

  const handleStop = () => {
    const controller =
      abortControllerRef.current;

    if (!controller) {
      return;
    }

    controller.abort();

    abortControllerRef.current = null;

    setLoading(false);
  };

  // =====================================
  // Stream AI Response
  // =====================================

  const streamResponse = async (
    chatId,
    text,
    aiId,
    controller
  ) => {
    await sendMessageStream(
      chatId,
      text,
      (token) => {
        if (controller.signal.aborted) {
          return;
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === aiId
              ? {
                  ...msg,
                  content:
                    msg.content + token,
                }
              : msg
          )
        );
      },
      controller.signal
    );
  };

  // =====================================
  // Send Message
  // =====================================

  const handleSend = async (text) => {
    const cleanText = text?.trim();

    if (!cleanText || loading) {
      return;
    }

    try {
      setLoading(true);

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      let currentChat = selectedChat;

      // =================================
      // Create Chat Automatically
      // =================================

      if (!currentChat?._id) {
        const res =
          await createNewChat();

        if (!res?.chat?._id) {
          throw new Error(
            "Unable to create chat"
          );
        }

        currentChat = res.chat;
      }

      // =================================
      // Temporary User Message
      // =================================

      const userMessage = {
        _id:
          `user-${Date.now()}`,
        sender: "user",
        content: cleanText,
      };

      // =================================
      // Temporary AI Message
      // =================================

      const aiId =
        `ai-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

      const aiMessage = {
        _id: aiId,
        sender: "ai",
        content: "",
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
        aiMessage,
      ]);

      // =================================
      // Stream Response
      // =================================

      await streamResponse(
        currentChat._id,
        cleanText,
        aiId,
        controller
      );

      // =================================
      // Refresh Sidebar
      // =================================

      if (!controller.signal.aborted) {
        await loadChats();
      }

      // =================================
      // Reload DB Messages
      // =================================

      if (!controller.signal.aborted) {
        await loadMessages(
          currentChat._id
        );
      }
    } catch (err) {
      // Stop is expected
      if (
        err?.name === "AbortError"
      ) {
        console.log(
          "🛑 Generation stopped"
        );

        return;
      }

      console.error(
        "Chat Error:",
        err
      );

      setMessages((prev) => [
        ...prev,
        {
          _id:
            `error-${Date.now()}`,
          sender: "ai",
          content:
            "❌ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      abortControllerRef.current =
        null;

      setLoading(false);
    }
  };

  // =====================================
  // Prompt Card
  // =====================================

  const handlePromptClick = (prompt) => {
    if (!prompt || loading) {
      return;
    }

    handleSend(prompt);
  };

  // =====================================
  // Regenerate Last AI Response
  // =====================================

  const handleRegenerate = async (
    aiMessage,
    aiIndex
  ) => {
    if (loading) {
      return;
    }

    if (!aiMessage?._id) {
      return;
    }

    if (!selectedChat?._id) {
      return;
    }

    // Find previous user message
    let userMessage = null;

    for (
      let i = aiIndex - 1;
      i >= 0;
      i--
    ) {
      if (
        messages[i]?.sender ===
        "user"
      ) {
        userMessage = messages[i];
        break;
      }
    }

    if (!userMessage?.content) {
      return;
    }

    try {
      setLoading(true);

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      // Clear current AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === aiMessage._id
            ? {
                ...msg,
                content: "",
              }
            : msg
        )
      );

      // Generate again
      await streamResponse(
        selectedChat._id,
        userMessage.content,
        aiMessage._id,
        controller
      );

      // Refresh sidebar
      if (!controller.signal.aborted) {
        await loadChats();
      }

      // Reload saved messages
      if (!controller.signal.aborted) {
        await loadMessages(
          selectedChat._id
        );
      }
    } catch (err) {
      if (
        err?.name === "AbortError"
      ) {
        console.log(
          "🛑 Regeneration stopped"
        );

        return;
      }

      console.error(
        "Regenerate Error:",
        err
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === aiMessage._id
            ? {
                ...msg,
                content:
                  "❌ Failed to regenerate response. Please try again.",
              }
            : msg
        )
      );
    } finally {
      abortControllerRef.current =
        null;

      setLoading(false);
    }
  };

  // =====================================
  // Feedback
  // =====================================

  const handleFeedback = (
    message,
    type
  ) => {
    if (!message?._id) {
      return;
    }

    console.log(
      "AI Feedback:",
      {
        messageId:
          message._id,
        type,
      }
    );

    // Backend feedback API
    // can be connected later.
  };

  // =====================================
  // Cleanup
  // =====================================

  useEffect(() => {
    return () => {
      if (
        abortControllerRef.current
      ) {
        abortControllerRef.current.abort();
        abortControllerRef.current =
          null;
      }
    };
  }, []);

  // =====================================
  // UI
  // =====================================

  return (
    <div className="flex flex-col h-full bg-[#020617]">

      {/* =================================
          Empty Chat / Prompt Cards
      ================================= */}

      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center overflow-y-auto">

          <PromptCards
            onPromptClick={
              handlePromptClick
            }
            disabled={loading}
          />

        </div>
      ) : (

        /* =================================
           Messages
        ================================= */

        <MessageList
          messages={messages}
          onRegenerate={
            handleRegenerate
          }
          onFeedback={
            handleFeedback
          }
          loading={loading}
        />

      )}

      {/* =================================
          Typing Indicator
      ================================= */}

      {loading && (
        <TypingIndicator />
      )}

      {/* =================================
          Message Input
      ================================= */}

      <MessageInput
        onSend={handleSend}
        onStop={handleStop}
        loading={loading}
      />

    </div>
  );
}