export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-8 py-4">

      <div className="w-10 h-10 rounded-full bg-blue-600"></div>

      <div className="bg-slate-800 rounded-2xl px-5 py-4 flex gap-2">

        <span className="w-2 h-2 rounded-full bg-white animate-bounce"></span>

        <span
          className="w-2 h-2 rounded-full bg-white animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></span>

        <span
          className="w-2 h-2 rounded-full bg-white animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></span>

      </div>

    </div>
  );
}