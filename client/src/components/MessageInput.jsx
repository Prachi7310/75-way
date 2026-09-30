import {
  SendHorizontal,
  Square,
  Paperclip,
} from "lucide-react";

import { useRef, useState } from "react";

export default function MessageInput({
  onSend,
  onStop,
  loading,
}) {
  const [message, setMessage] = useState("");

  const textareaRef = useRef(null);

  const MAX_LENGTH = 4000;

  // =====================================
  // Submit
  // =====================================

  const handleSubmit = () => {
    const cleanMessage = message.trim();

    if (loading) {
      return;
    }

    if (!cleanMessage) {
      return;
    }

    onSend(cleanMessage);

    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // =====================================
  // Keyboard
  // =====================================

  const handleKeyDown = (e) => {
    // Enter = Send
    // Shift + Enter = New line

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit();
    }
  };

  // =====================================
  // Input Change
  // =====================================

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length > MAX_LENGTH) {
      return;
    }

    setMessage(value);

    // Auto resize
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        180
      )}px`;
    }
  };

  const remaining =
    MAX_LENGTH - message.length;

  const canSend =
    message.trim().length > 0 &&
    !loading;

  return (
    <div className="border-t border-slate-800 bg-[#020617] p-4 md:p-6">

      <div className="max-w-5xl mx-auto">

        {/* =================================
            Input Container
        ================================= */}

        <div
          className={`relative flex items-end gap-2 rounded-2xl bg-slate-900 border transition-all ${
            loading
              ? "border-slate-700"
              : "border-slate-700 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/20"
          }`}
        >

          {/* Attachment */}

          <button
            type="button"
            disabled={loading}
            className="hidden sm:flex w-11 h-11 mb-1 ml-1 items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Attachments coming soon"
          >
            <Paperclip size={19} />
          </button>

          {/* Textarea */}

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            maxLength={MAX_LENGTH}
            placeholder={
              loading
                ? "BN AI is thinking..."
                : "Ask BN Technology AI..."
            }
            className="flex-1 resize-none bg-transparent text-white placeholder:text-slate-500 outline-none px-3 py-4 max-h-[180px] min-h-[56px] leading-6 disabled:opacity-60"
          />

          {/* Send / Stop */}

          <div className="p-2">

            {loading ? (
              <button
                type="button"
                onClick={onStop}
                className="w-11 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white transition flex items-center justify-center"
                title="Stop generation"
              >
                <Square
                  size={18}
                  fill="currentColor"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSend}
                className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white transition flex items-center justify-center"
                title="Send message"
              >
                <SendHorizontal size={19} />
              </button>
            )}

          </div>

        </div>

        {/* =================================
            Bottom Info
        ================================= */}

        <div className="flex items-center justify-between px-2 mt-2">

          <p className="text-[11px] text-slate-600">
            Enter to send · Shift + Enter for new line
          </p>

          <p
            className={`text-[11px] ${
              remaining < 200
                ? "text-yellow-500"
                : "text-slate-600"
            }`}
          >
            {message.length}/{MAX_LENGTH}
          </p>

        </div>

        {/* =================================
            Disclaimer
        ================================= */}

        <p className="text-center text-[11px] text-slate-600 mt-2">
          BN Technology AI can make mistakes.
          Verify important information.
        </p>

      </div>

    </div>
  );
}