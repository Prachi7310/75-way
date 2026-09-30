import {
  Copy,
  Bot,
  User,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MessageBubble({
  sender,
  content,
  onRegenerate,
  onFeedback,
  canRegenerate = false,
  loading = false,
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isAI = sender === "ai";

  // =====================================
  // Copy Full Message
  // =====================================

  const handleCopy = async () => {
    if (!content?.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        content
      );

      setCopied(true);

      toast.success("Copied to clipboard");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);

      toast.error("Copy failed");
    }
  };

  // =====================================
  // Copy Code
  // =====================================

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      toast.success("Code copied");
    } catch (error) {
      console.error("Code copy error:", error);

      toast.error("Failed to copy code");
    }
  };

  // =====================================
  // Feedback
  // =====================================

  const handleFeedback = (type) => {
    const nextValue =
      feedback === type ? null : type;

    setFeedback(nextValue);

    onFeedback?.(nextValue);

    if (nextValue === "like") {
      toast.success("Thanks for the feedback 👍");
    }

    if (nextValue === "dislike") {
      toast.success("Thanks for the feedback");
    }
  };

  // =====================================
  // Regenerate
  // =====================================

  const handleRegenerate = () => {
    if (
      loading ||
      !canRegenerate ||
      !onRegenerate
    ) {
      return;
    }

    onRegenerate();
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 mb-7 ${
        isAI
          ? "justify-start"
          : "justify-end"
      }`}
    >
      {/* =================================
          AI Avatar
      ================================= */}

      {isAI && (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shrink-0 mt-1">
          <Bot
            size={19}
            className="text-white"
          />
        </div>
      )}

      {/* =================================
          Message Content
      ================================= */}

      <div
        className={`min-w-0 max-w-[88%] sm:max-w-3xl ${
          isAI
            ? ""
            : "flex flex-col items-end"
        }`}
      >

        {/* =================================
            Bubble
        ================================= */}

        <div
          className={`rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 shadow-lg overflow-hidden ${
            isAI
              ? "bg-slate-800/90 border border-slate-700/70 text-white"
              : "bg-blue-600 text-white"
          }`}
        >

          {content?.trim() ? (
            <div
              className={`text-[15px] leading-7 break-words ${
                isAI
                  ? "prose prose-invert max-w-none"
                  : ""
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // =========================
                  // Paragraph
                  // =========================

                  p({
                    children,
                  }) {
                    return (
                      <p className="mb-3 last:mb-0">
                        {children}
                      </p>
                    );
                  },

                  // =========================
                  // Headings
                  // =========================

                  h1({
                    children,
                  }) {
                    return (
                      <h1 className="text-xl font-bold mt-4 mb-2">
                        {children}
                      </h1>
                    );
                  },

                  h2({
                    children,
                  }) {
                    return (
                      <h2 className="text-lg font-bold mt-4 mb-2">
                        {children}
                      </h2>
                    );
                  },

                  h3({
                    children,
                  }) {
                    return (
                      <h3 className="text-base font-semibold mt-3 mb-2">
                        {children}
                      </h3>
                    );
                  },

                  // =========================
                  // Lists
                  // =========================

                  ul({
                    children,
                  }) {
                    return (
                      <ul className="list-disc pl-6 mb-3 space-y-1">
                        {children}
                      </ul>
                    );
                  },

                  ol({
                    children,
                  }) {
                    return (
                      <ol className="list-decimal pl-6 mb-3 space-y-1">
                        {children}
                      </ol>
                    );
                  },

                  li({
                    children,
                  }) {
                    return (
                      <li className="pl-1">
                        {children}
                      </li>
                    );
                  },

                  // =========================
                  // Blockquote
                  // =========================

                  blockquote({
                    children,
                  }) {
                    return (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-3 text-slate-300 italic">
                        {children}
                      </blockquote>
                    );
                  },

                  // =========================
                  // Links
                  // =========================

                  a({
                    href,
                    children,
                  }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                      >
                        {children}
                      </a>
                    );
                  },

                  // =========================
                  // Inline / Block Code
                  // =========================

                  code({
                    inline,
                    className,
                    children,
                  }) {
                    const codeText =
                      String(children).replace(
                        /\n$/,
                        ""
                      );

                    const match =
                      /language-(\w+)/.exec(
                        className || ""
                      );

                    // Inline code
                    if (inline || !match) {
                      return (
                        <code className="bg-slate-950/80 border border-slate-700 px-1.5 py-0.5 rounded-md text-cyan-300 text-[13px]">
                          {children}
                        </code>
                      );
                    }

                    // Code block
                    return (
                      <div className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">

                        {/* Code Header */}

                        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900">

                          <span className="text-xs text-slate-400 uppercase">
                            {match[1]}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyCode(
                                codeText
                              )
                            }
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                          >
                            <Copy size={13} />

                            Copy
                          </button>

                        </div>

                        {/* Code */}

                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: "16px",
                            background:
                              "transparent",
                            fontSize: "13px",
                            lineHeight: "1.6",
                            overflowX: "auto",
                          }}
                        >
                          {codeText}
                        </SyntaxHighlighter>

                      </div>
                    );
                  },

                  // =========================
                  // Horizontal Rule
                  // =========================

                  hr() {
                    return (
                      <hr className="border-slate-700 my-4" />
                    );
                  },

                  // =========================
                  // Table
                  // =========================

                  table({
                    children,
                  }) {
                    return (
                      <div className="overflow-x-auto my-4">
                        <table className="w-full text-sm border-collapse">
                          {children}
                        </table>
                      </div>
                    );
                  },

                  th({
                    children,
                  }) {
                    return (
                      <th className="border border-slate-700 bg-slate-900 px-3 py-2 text-left font-semibold">
                        {children}
                      </th>
                    );
                  },

                  td({
                    children,
                  }) {
                    return (
                      <td className="border border-slate-700 px-3 py-2">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">

              <span>
                Thinking
              </span>

              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />

                <span
                  className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                  style={{
                    animationDelay:
                      "150ms",
                  }}
                />

                <span
                  className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                  style={{
                    animationDelay:
                      "300ms",
                  }}
                />
              </span>

            </div>
          )}

        </div>

        {/* =================================
            AI Actions
        ================================= */}

        {isAI && content?.trim() && (
          <div className="flex flex-wrap items-center gap-1 mt-2 ml-1">

            {/* Copy */}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>

            {/* Regenerate */}

            {canRegenerate && (
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={loading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Regenerate response"
              >
                <RefreshCw
                  size={14}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Regenerate
              </button>
            )}

            {/* Like */}

            <button
              type="button"
              onClick={() =>
                handleFeedback("like")
              }
              className={`p-2 rounded-lg transition ${
                feedback === "like"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>

            {/* Dislike */}

            <button
              type="button"
              onClick={() =>
                handleFeedback("dislike")
              }
              className={`p-2 rounded-lg transition ${
                feedback === "dislike"
                  ? "bg-red-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Bad response"
            >
              <ThumbsDown size={14} />
            </button>

          </div>
        )}

      </div>

      {/* =================================
          User Avatar
      ================================= */}

      {!isAI && (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center shadow-lg shrink-0 mt-1">
          <User
            size={19}
            className="text-white"
          />
        </div>
      )}

    </div>
  );
}