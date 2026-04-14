import { useState } from "react";
import { Search, Send } from "lucide-react";
import UploadHero from "../components/UploadHero";
import PreloadedBanner from "../components/PreloadedBanner";
import NextSteps from "../components/NextSteps";

type Page = "analyze" | "extract" | "transcribe" | "summarize" | "search";

interface SearchPageProps {
  onNavigate: (page: Page) => void;
  preloadedVideo: string | null;
  onVideoLoaded: (f: string) => void;
}

const mockResults = [
  { time: "0:02", desc: "Stadium exterior wide shot with crowd gathering", confidence: 92 },
  { time: "0:06", desc: "Players walking side by side onto the pitch", confidence: 88 },
  { time: "0:09", desc: "Ball played forward, attacking run begins", confidence: 85 },
  { time: "0:11", desc: "Striker winds up and hits a powerful shot", confidence: 96 },
  { time: "0:13", desc: "Ball hits the back of the net, crowd erupts", confidence: 94 },
];

const SearchPage = ({ onNavigate, preloadedVideo, onVideoLoaded }: SearchPageProps) => {
  const [hasVideo, setHasVideo] = useState(!!preloadedVideo);
  const [showBanner, setShowBanner] = useState(!!preloadedVideo);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [searching, setSearching] = useState(false);

  const handleUpload = () => {
    setHasVideo(true);
    onVideoLoaded("football_kick.mp4");
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults(mockResults);
    }, 1500);
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Search Moments"
        subtitle="Find specific moments in your video by describing what you're looking for"
        onFileSelect={handleUpload}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {showBanner && preloadedVideo && (
        <PreloadedBanner filename={preloadedVideo} onDismiss={() => setShowBanner(false)} />
      )}

      {/* Search Input */}
      <div className="flex items-center gap-2 border border-border rounded-pill px-4 py-2 mb-6 focus-within:border-amber-400 transition-colors bg-card">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Describe a moment to find… e.g. 'someone kicks the ball'"
          className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="w-7 h-7 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>

      {searching && (
        <div className="text-center text-[13px] text-muted-foreground animate-slide-up">Searching moments…</div>
      )}

      {results && (
        <div className="animate-slide-up space-y-3 mb-6">
          <p className="text-[12px] text-muted-foreground">{results.length} moments found</p>
          {results.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-card p-4 flex gap-4 items-center hover:border-amber-400 transition-all cursor-pointer">
              <div
                className="w-[100px] h-[60px] rounded-btn shrink-0"
                style={{
                  background: `linear-gradient(135deg, hsl(${200 + i * 15}, 20%, ${40 + i * 5}%), hsl(${220 + i * 10}, 15%, ${55 + i * 3}%))`,
                }}
              />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-foreground">{r.desc}</p>
                <span className="font-mono text-[11px] text-amber-600">{r.time}</span>
              </div>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-pill">{r.confidence}%</span>
            </div>
          ))}
        </div>
      )}

      {results && <NextSteps currentPage="search" onNavigate={onNavigate} />}
    </div>
  );
};

export default SearchPage;
