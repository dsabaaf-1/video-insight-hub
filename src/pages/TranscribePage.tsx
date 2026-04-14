import { useState } from "react";
import { Search } from "lucide-react";
import UploadHero from "../components/UploadHero";
import PreloadedBanner from "../components/PreloadedBanner";
import NextSteps from "../components/NextSteps";
import VideoPlayer from "../components/VideoPlayer";
import { useVideo } from "@/contexts/VideoContext";

const mockTranscript = [
  { time: "0:00", text: "Welcome to today's match coverage. We're here at the stadium with thousands of fans eagerly waiting for kickoff." },
  { time: "0:04", text: "The teams are walking out onto the pitch now. You can feel the energy in the crowd, it's absolutely electric." },
  { time: "0:08", text: "And we're underway! The ball is played forward quickly. There's a great run down the left wing." },
  { time: "0:11", text: "What a strike! The ball flies past the goalkeeper and into the top corner. Incredible technique on display." },
  { time: "0:14", text: "The celebrations are wild. The scorer runs to the corner flag as teammates pile on. What a moment." },
];

const TranscribePage = () => {
  const { hasVideo, setVideo, filename } = useVideo();
  const [showBanner, setShowBanner] = useState(true);
  const [transcribed, setTranscribed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpload = (file: File) => setVideo(file);

  const startTranscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setTranscribed(true);
    }, 2500);
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Transcribe your video"
        subtitle="Convert speech to text with timestamps using Whisper AI"
        onFileSelect={handleUpload}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 animate-fade-in">
      {showBanner && filename && (
        <PreloadedBanner filename={filename} onDismiss={() => setShowBanner(false)} />
      )}

      <VideoPlayer compact />

      {!transcribed ? (
        <div className="text-center animate-slide-up mt-6">
          <button
            onClick={startTranscribe}
            disabled={processing}
            className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[14px] font-medium px-8 py-3 rounded-btn transition-all disabled:opacity-50 min-h-[48px] hover:scale-[1.02] active:scale-[0.98]"
          >
            {processing ? "Transcribing with Whisper AI…" : "Start Transcription"}
          </button>
        </div>
      ) : (
        <div className="animate-slide-up mt-6">
          <div className="flex items-center gap-2 border border-border rounded-pill px-3 py-1.5 mb-6 focus-within:border-amber-400 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript…"
              className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-muted-foreground min-h-[36px]"
            />
          </div>

          <div className="bg-card border border-border rounded-card p-4 md:p-6 space-y-4 mb-6">
            {mockTranscript.map((line, i) => {
              const highlight = searchTerm && line.text.toLowerCase().includes(searchTerm.toLowerCase());
              const highlightedText = searchTerm
                ? line.text.replace(
                    new RegExp(`(${searchTerm})`, "gi"),
                    '<mark class="bg-amber-200 rounded px-0.5">$1</mark>'
                  )
                : line.text;

              return (
                <div key={i} className={`flex gap-3 md:gap-4 transition-colors ${highlight ? "bg-amber-50 -mx-2 px-2 py-1 rounded-badge" : ""}`}>
                  <span className="font-mono text-[12px] text-amber-600 shrink-0 pt-0.5">[{line.time}]</span>
                  <p className="text-[13px] md:text-[14px] text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightedText }} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mb-2">
            <button className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Copy transcript
            </button>
            <button className="border border-border text-foreground bg-card hover:bg-muted text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Download as TXT
            </button>
            <button className="border border-border text-foreground bg-card hover:bg-muted text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Download as SRT
            </button>
          </div>

          <NextSteps currentPage="/transcribe" />
        </div>
      )}
    </div>
  );
};

export default TranscribePage;
