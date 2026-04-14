import { useState } from "react";
import UploadHero from "../components/UploadHero";
import PreloadedBanner from "../components/PreloadedBanner";
import NextSteps from "../components/NextSteps";

type Page = "analyze" | "extract" | "transcribe" | "summarize" | "search";

interface ExtractPageProps {
  onNavigate: (page: Page) => void;
  preloadedVideo: string | null;
  onVideoLoaded: (f: string) => void;
}

const ExtractPage = ({ onNavigate, preloadedVideo, onVideoLoaded }: ExtractPageProps) => {
  const [hasVideo, setHasVideo] = useState(!!preloadedVideo);
  const [showBanner, setShowBanner] = useState(!!preloadedVideo);
  const [extracted, setExtracted] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [interval, setIntervalVal] = useState("2s");
  const [format, setFormat] = useState("JPG");

  const handleUpload = (file: File) => {
    setHasVideo(true);
    onVideoLoaded(file.name);
  };

  const handleExtract = () => {
    setExtracting(true);
    setTimeout(() => {
      setExtracting(false);
      setExtracted(true);
    }, 2000);
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Extract video frames"
        subtitle="Pull keyframes from any video as high-quality images"
        onFileSelect={handleUpload}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {showBanner && preloadedVideo && (
        <PreloadedBanner filename={preloadedVideo} onDismiss={() => setShowBanner(false)} />
      )}

      {/* Settings */}
      <div className="bg-card border border-border rounded-card p-6 mb-6 animate-slide-up">
        <h2 className="text-[15px] font-semibold mb-4">Extraction Settings</h2>
        <div className="flex gap-6 items-end">
          <div>
            <label className="text-[12px] text-muted-foreground block mb-1">Extract every</label>
            <select
              value={interval}
              onChange={(e) => setIntervalVal(e.target.value)}
              className="border border-border rounded-btn px-3 py-1.5 text-[13px] bg-card"
            >
              <option>1s</option>
              <option>2s</option>
              <option>5s</option>
              <option>Keyframes only</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground block mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="border border-border rounded-btn px-3 py-1.5 text-[13px] bg-card"
            >
              <option>JPG</option>
              <option>PNG</option>
              <option>WEBP</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground block mb-1">Quality</label>
            <input type="range" min="50" max="100" defaultValue="90" className="w-32 accent-amber-500" />
          </div>
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-btn transition-all disabled:opacity-50"
          >
            {extracting ? "Extracting…" : "Extract Frames"}
          </button>
        </div>
      </div>

      {/* Frames Grid */}
      {extracted && (
        <div className="animate-slide-up">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-btn overflow-hidden relative shadow-sm"
                style={{
                  background: `linear-gradient(135deg, hsl(${200 + i * 12}, 20%, ${40 + i * 4}%), hsl(${220 + i * 8}, 15%, ${55 + i * 3}%))`,
                }}
              >
                <span className="absolute bottom-1.5 left-1.5 font-mono text-[10px] bg-foreground/60 text-primary-foreground px-1.5 py-0.5 rounded">
                  0:{String(i * 2).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-btn transition-all">
              Download all frames
            </button>
            <button className="border border-amber-500 text-amber-600 bg-card hover:bg-amber-50 text-[13px] font-medium px-5 py-2 rounded-btn transition-all">
              Download selected
            </button>
          </div>
          <NextSteps currentPage="extract" onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
};

export default ExtractPage;
