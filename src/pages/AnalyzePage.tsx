import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import UploadHero from "../components/UploadHero";
import NextSteps from "../components/NextSteps";
import VideoPlayer from "../components/VideoPlayer";
import { DNASkeleton, FramesSkeleton } from "../components/SkeletonLoader";
import { useVideo } from "@/contexts/VideoContext";

const suggestions = [
  "What happens at the start?",
  "Describe the main action",
  "When does the scene change?",
  "Summarize key moments",
];

const mockScenes = [
  { label: "Scene 1", time: "0:00–0:04" },
  { label: "Scene 2", time: "0:05–0:08" },
  { label: "Scene 3", time: "0:09–0:14" },
];

const dnaHeights = [18, 24, 12, 28, 20, 14, 26, 10, 22, 16, 28, 20, 8, 24, 18, 12, 26, 22, 14, 28, 16, 20, 10, 24, 18, 26, 12, 22];
const dnaTimestamps = ["0s", "3s", "6s", "9s", "12s", "14s"];

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
  frames?: number;
}

const AnalyzePage = () => {
  const { hasVideo, setVideo, filename } = useVideo();
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [retrievedBars, setRetrievedBars] = useState<Set<number>>(new Set());
  const [retrievedFrames, setRetrievedFrames] = useState<Set<number>>(new Set());
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleUpload = (file: File) => setVideo(file);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);

    const newBars = new Set(retrievedBars);
    const newFrames = new Set(retrievedFrames);
    for (let i = 0; i < 3; i++) {
      newBars.add(Math.floor(Math.random() * 28));
      newFrames.add(Math.floor(Math.random() * 8));
    }
    setRetrievedBars(newBars);
    setRetrievedFrames(newFrames);

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

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Analyze your video"
        subtitle="Extract frames, ask questions, and understand any video with AI"
        onFileSelect={handleUpload}
      />
    );
  }

  if (!isAnalyzed && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center pt-12 md:pt-20 pb-10 px-4 animate-fade-in">
        <div className="bg-card border border-border rounded-card p-6 md:p-8 w-full max-w-md text-center shadow-sm">
          <VideoPlayer compact />
          <p className="text-[13px] text-muted-foreground mt-3">Ready to analyze</p>
          <button
            onClick={handleAnalyze}
            className="mt-6 w-full h-[48px] bg-amber-500 hover:bg-amber-600 text-white text-[15px] font-medium rounded-btn transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            ✦ Analyze Video
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center pt-12 md:pt-20 pb-10 px-4 animate-fade-in">
        <div className="bg-card border border-border rounded-card p-6 md:p-8 w-full max-w-md text-center shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">⏳</span>
          </div>
          <p className="text-[15px] font-medium text-foreground">Analyzing {filename}...</p>
          <p className="text-[13px] text-muted-foreground mt-1">Extracting frames & building index</p>
          <div className="mt-4 space-y-3">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: "60%", animation: "pulse 2s infinite" }} />
            </div>
            <DNASkeleton />
            <FramesSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="w-full lg:w-[60%]">
          <VideoPlayer />

          <div className="space-y-6 mt-4">
            {/* Video DNA */}
            <div className="animate-slide-up">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Video DNA</p>
              <div className="flex items-end gap-[3px] h-[32px]">
                {dnaHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 min-w-[4px] max-w-[10px] rounded-t-sm animate-grow-up transition-all duration-300 cursor-pointer hover:opacity-80 ${
                      retrievedBars.has(i)
                        ? "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                        : i < 14
                        ? "bg-amber-300/60"
                        : "bg-muted-foreground/30"
                    }`}
                    style={{ height: `${h}px`, animationDelay: `${i * 40}ms` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {dnaTimestamps.map((t) => (
                  <span key={t} className="font-mono text-[10px] text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>

            {/* Scenes */}
            <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {mockScenes.map((s, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 bg-muted border-l-[3px] border-amber-400 px-3 py-1.5 rounded-badge hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    <span className="text-[12px] font-medium text-foreground">{s.label}</span>
                    <span className="text-[11px] text-muted-foreground ml-1.5">· {s.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyframes */}
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-[100px] md:w-[120px] h-[66px] md:h-[80px] rounded-btn relative overflow-hidden shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                      retrievedFrames.has(i) ? "ring-2 ring-amber-500 -translate-y-[3px]" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, hsl(${200 + i * 15}, 20%, ${40 + i * 5}%), hsl(${220 + i * 10}, 15%, ${55 + i * 3}%))`,
                    }}
                  >
                    <span className="absolute top-1 left-1.5 text-[10px] text-primary-foreground/70">Scene {Math.ceil((i + 1) / 3)}</span>
                    <span className="absolute bottom-1 left-1.5 font-mono text-[10px] bg-foreground/60 text-primary-foreground px-1 rounded">
                      0:{String(i * 2).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <NextSteps currentPage="/" />
          </div>
        </div>

        {/* Right Panel - Chat */}
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
      </div>
    </div>
  );
};

export default AnalyzePage;
