import { useState } from "react";
import UploadHero from "../components/UploadHero";
import NextSteps from "../components/NextSteps";
import VideoPlayer from "../components/VideoPlayer";
import VideoDNA from "../components/VideoDNA";
import AnalyzeChat from "../components/AnalyzeChat";
import { DNASkeleton, FramesSkeleton } from "../components/SkeletonLoader";
import { useVideo } from "@/contexts/VideoContext";

const mockScenes = [
  { label: "Scene 1", time: "0:00–0:04" },
  { label: "Scene 2", time: "0:05–0:08" },
  { label: "Scene 3", time: "0:09–0:14" },
];

const AnalyzePage = () => {
  const { hasVideo, setVideo, filename } = useVideo();
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [retrievedBars, setRetrievedBars] = useState<Set<number>>(new Set());
  const [retrievedFrames, setRetrievedFrames] = useState<Set<number>>(new Set());

  const handleUpload = (file: File) => setVideo(file);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleRetrieve = () => {
    const newBars = new Set(retrievedBars);
    const newFrames = new Set(retrievedFrames);
    for (let i = 0; i < 3; i++) {
      newBars.add(Math.floor(Math.random() * 28));
      newFrames.add(Math.floor(Math.random() * 8));
    }
    setRetrievedBars(newBars);
    setRetrievedFrames(newFrames);
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
              <div className="h-full bg-amber-500 rounded-full animate-pulse" style={{ width: "60%" }} />
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
            <VideoDNA retrievedBars={retrievedBars} />

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
        <AnalyzeChat onRetrieve={handleRetrieve} />
      </div>
    </div>
  );
};

export default AnalyzePage;
