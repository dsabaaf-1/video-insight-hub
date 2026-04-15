import { useEffect, useRef, useState } from "react";
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
  onRetrieve: (query: string) => void;
}

const getAssistantReply = (query: string) => {
  const normalizedQuery = query.toLowerCase();

  if (/(start|begin|intro|opening)/.test(normalizedQuery)) {
    return {
      text: "The opening seconds establish the scene and subject, with the first visual beat happening right at the start of the clip.",
      frames: 3,
    };
  }

  if (/(scene change|scene|transition|when)/.test(normalizedQuery)) {
    return {
      text: "The clearest scene changes happen around the middle of the clip and again near the last third, where framing and motion shift noticeably.",
      frames: 3,
    };
  }

  if (/(main|action|describe|middle)/.test(normalizedQuery)) {
    return {
      text: "The main action happens in the middle section, where the subject movement is most concentrated and visually distinct.",
      frames: 4,
    };
  }

  if (/(summary|summarize|key|moment|overview)/.test(normalizedQuery)) {
    return {
      text: "The key moments are the opening setup, the central action beat, and the final resolving section at the end of the clip.",
      frames: 3,
    };
  }

  if (/(end|final|finish|outro|last)/.test(normalizedQuery)) {
    return {
      text: "The ending section settles the motion and closes the sequence with a calmer final beat.",
      frames: 2,
    };
  }

  return {
    text: "I found the most relevant moments around the current playback area and pulled the nearest matching frames from the timeline.",
    frames: 3,
  };
};

const AnalyzeChat = ({ onRetrieve }: AnalyzeChatProps) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const reply = getAssistantReply(msg);

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);
    onRetrieve(msg);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: reply.text,
          frames: reply.frames,
        },
      ]);
    }, 1800);
  };

  return (
    <div className="flex h-[400px] w-full flex-col rounded-card border border-border bg-card p-4 lg:h-[600px] lg:w-[40%]">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-foreground">Ask about your video</h2>
        <span className="rounded-pill bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
          ● Ready
        </span>
      </div>
      <p className="mb-3 text-[12px] text-muted-foreground">Responses grounded in your video frames</p>

      <div ref={chatRef} className="mb-3 flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 && !isTyping && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="rounded-pill border border-primary/20 bg-accent px-3 py-1.5 text-[12px] text-accent-foreground transition-colors hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-[85%] rounded-[12px] px-3 py-2 text-[13px] ${
                msg.role === "user"
                  ? "border border-primary/20 bg-accent text-foreground"
                  : "border border-border bg-card text-foreground shadow-sm"
              }`}
            >
              <p>{msg.text}</p>
              {msg.frames && (
                <details className="mt-1.5">
                  <summary className="cursor-pointer text-[11px] text-primary hover:text-primary/80">
                    ▶ {msg.frames} frames retrieved
                  </summary>
                  <div className="mt-1.5 flex gap-1.5">
                    {Array.from({ length: msg.frames }).map((_, frameIndex) => (
                      <div
                        key={frameIndex}
                        className="h-[28px] w-[40px] rounded-sm"
                        style={{
                          background: `linear-gradient(135deg, hsl(${210 + frameIndex * 20}, 20%, 45%), hsl(${230 + frameIndex * 15}, 15%, 55%))`,
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
            <div className="flex items-center gap-1 rounded-[12px] border border-border bg-card px-3 py-2 shadow-sm">
              <div className="animate-dot-1 h-2 w-2 rounded-full bg-primary" />
              <div className="animate-dot-2 h-2 w-2 rounded-full bg-primary" />
              <div className="animate-dot-3 h-2 w-2 rounded-full bg-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-pill border border-border px-3 py-1.5 transition-colors focus-within:border-primary">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSend()}
          placeholder="Ask a question about your video…"
          className="min-h-[36px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full bg-primary transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default AnalyzeChat;
