import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({
  messages = [],
  onRegenerate,
  onFeedback,
  loading = false,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // =====================================
  // Auto Scroll
  // =====================================

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const isNearBottom =
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
      250;

    // Always scroll when a new message starts.
    // During streaming, only scroll if user is
    // already near the bottom.
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({
        behavior: loading ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [messages, loading]);

  // =====================================
  // Find Last AI Message
  // =====================================

  const lastAIIndex = messages.reduce(
    (lastIndex, message, index) => {
      if (message.sender === "ai") {
        return index;
      }

      return lastIndex;
    },
    -1
  );

  // =====================================
  // Empty State
  // =====================================

  if (messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-5xl mx-auto min-h-full flex items-center justify-center">
          <div className="text-center">

            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-3xl">
              ✨
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Start a new conversation
            </h2>

            <p className="text-slate-500 mt-2 max-w-md">
              Ask BN Technology AI anything about the
              company, services, courses, internships,
              or other available knowledge.
            </p>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scroll-smooth"
    >
      <div className="max-w-5xl mx-auto">

        {/* =================================
            Messages
        ================================= */}

        <div className="space-y-5">

          {messages.map((msg, index) => {
            const isAI =
              msg.sender === "ai";

            const isLastAI =
              isAI &&
              index === lastAIIndex;

            const hasContent =
              typeof msg.content === "string" &&
              msg.content.trim().length > 0;

            return (
              <MessageBubble
                key={
                  msg._id ||
                  `message-${index}`
                }
                sender={msg.sender}
                content={msg.content || ""}

                /*
                 * Regenerate only the latest
                 * completed AI response.
                 */
                canRegenerate={
                  isLastAI &&
                  hasContent &&
                  !loading
                }

                loading={
                  loading &&
                  isLastAI
                }

                onRegenerate={() =>
                  onRegenerate?.(
                    msg,
                    index
                  )
                }

                onFeedback={(type) =>
                  onFeedback?.(
                    msg,
                    type
                  )
                }
              />
            );
          })}

        </div>

        {/* =================================
            Bottom Anchor
        ================================= */}

        <div
          ref={bottomRef}
          className="h-6"
          aria-hidden="true"
        />

      </div>
    </div>
  );
}