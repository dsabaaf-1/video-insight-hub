import { useState } from "react";
import UploadHero from "../components/UploadHero";
import PreloadedBanner from "../components/PreloadedBanner";
import NextSteps from "../components/NextSteps";

type Page = "analyze" | "extract" | "transcribe" | "summarize" | "search";

interface SummarizePageProps {
  onNavigate: (page: Page) => void;
  preloadedVideo: string | null;
  onVideoLoaded: (f: string) => void;
}

const mockKeyMoments = [
  { time: "0:00", desc: "Opening shot — stadium exterior, crowd arriving" },
  { time: "0:04", desc: "Teams emerge from the tunnel onto the pitch" },
  { time: "0:08", desc: "Match begins — fast-paced opening attack" },
  { time: "0:11", desc: "Goal scored — spectacular long-range strike" },
  { time: "0:14", desc: "Celebration — team gathers at corner flag" },
];

const SummarizePage = ({ onNavigate, preloadedVideo, onVideoLoaded }: SummarizePageProps) => {
  const [hasVideo, setHasVideo] = useState(!!preloadedVideo);
  const [showBanner, setShowBanner] = useState(!!preloadedVideo);
  const [summarized, setSummarized] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleUpload = (file: File) => {
    setHasVideo(true);
    onVideoLoaded(file.name);
  };

  const startSummarize = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSummarized(true);
    }, 2000);
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Summarize your video"
        subtitle="Get an AI-written summary with key moments and highlights"
        onFileSelect={handleUpload}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {showBanner && preloadedVideo && (
        <PreloadedBanner filename={preloadedVideo} onDismiss={() => setShowBanner(false)} />
      )}

      {!summarized ? (
        <div className="text-center animate-slide-up">
          <button
            onClick={startSummarize}
            disabled={processing}
            className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[14px] font-medium px-8 py-3 rounded-btn transition-all disabled:opacity-50"
          >
            {processing ? "Generating summary…" : "Generate Summary"}
          </button>
        </div>
      ) : (
        <div className="animate-slide-up space-y-6">
          {/* Summary */}
          <div className="bg-card border border-border rounded-card p-6">
            <h2 className="text-[15px] font-semibold mb-3">Video Summary</h2>
            <p className="text-[14px] text-foreground leading-relaxed">
              This 14-second video captures a pivotal moment during a football match. The footage opens with an establishing shot of the stadium as fans fill the stands. Both teams emerge from the tunnel to roaring applause. The match kicks off with an immediate attacking play down the left wing. The highlight is a remarkable long-range strike that sails past the goalkeeper into the top corner of the net. The video concludes with jubilant celebrations as teammates converge at the corner flag.
            </p>
          </div>

          {/* Key Moments */}
          <div className="bg-card border border-border rounded-card p-6">
            <h2 className="text-[15px] font-semibold mb-4">Key Moments</h2>
            <div className="space-y-3">
              {mockKeyMoments.map((m, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1 h-full bg-amber-300 rounded-full shrink-0 self-stretch min-h-[20px]" />
                  <span className="font-mono text-[12px] text-amber-600 shrink-0 pt-0.5">{m.time}</span>
                  <p className="text-[13px] text-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-btn transition-all">
              Copy summary
            </button>
            <button className="border border-border text-foreground bg-card hover:bg-muted text-[13px] font-medium px-4 py-2 rounded-btn transition-all">
              Download as PDF
            </button>
          </div>

          <NextSteps currentPage="summarize" onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
};

export default SummarizePage;
