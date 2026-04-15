import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const suggestions = [
  "What happens at the start?",
  "Describe the main action",
  "When does the scene change?",
  "Summarize key moments",
];

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
  frames?: number;
}

interface AnalyzeChatProps {
  onRetrieve: () => void;
}

const AnalyzeChat = ({ onRetrieve }: AnalyzeChatProps) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);
    onRetrieve();

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Based on the video analysis, the footage shows a dynamic sequence with clear motion patterns. The key action occurs between 0:04 and 0:08, featuring rapid movement and scene transitions.",
          frames: 3,
        },
      ]);
    }, 1800);
  };

  return (
    <div className="w-full lg:w-[40%] bg-card border border-border rounded-card p-4 flex flex-col h-[400px] lg:h-[600px]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[15px] font-semibold text-foreground">Ask about your video</h2>
        <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-pill font-medium">
          ● Ready
        </span>
      </div>
      <p className="text-[12px] text-muted-foreground mb-3">Responses grounded in your video frames</p>

      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-[12px] bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-pill hover:bg-amber-100 transition-colors hover:scale-[1.02] active:scale-[0.98]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-[12px] text-[13px] ${
                msg.role === "user"
                  ? "bg-amber-100 border border-amber-200 text-foreground"
                  : "bg-card border border-border shadow-sm text-foreground"
              }`}
            >
              <p>{msg.text}</p>
              {msg.frames && (
                <details className="mt-1.5">
                  <summary className="text-[11px] text-amber-600 cursor-pointer hover:text-amber-700">
                    ▶ {msg.frames} frames retrieved
                  </summary>
                  <div className="flex gap-1.5 mt-1.5">
                    {Array.from({ length: msg.frames }).map((_, j) => (
                      <div
                        key={j}
                        className="w-[40px] h-[28px] rounded-sm"
                        style={{
                          background: `linear-gradient(135deg, hsl(${210 + j * 20}, 20%, 45%), hsl(${230 + j * 15}, 15%, 55%))`,
                        }}
                      />
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border shadow-sm px-3 py-2 rounded-[12px] flex gap-1 items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-dot-1" />
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-dot-2" />
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-dot-3" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border border-border rounded-pill px-3 py-1.5 focus-within:border-amber-400 transition-colors">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question about your video…"
          className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-muted-foreground min-h-[36px]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="w-8 h-8 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 active:scale-95 min-w-[32px]"
        >
          <Send className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default AnalyzeChat;
