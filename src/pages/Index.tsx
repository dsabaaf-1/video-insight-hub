import { useState } from "react";
import Navbar from "../components/Navbar";
import AnalyzePage from "./AnalyzePage";
import ExtractPage from "./ExtractPage";
import TranscribePage from "./TranscribePage";
import SummarizePage from "./SummarizePage";
import SearchPage from "./SearchPage";

type Page = "analyze" | "extract" | "transcribe" | "summarize" | "search";

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("analyze");
  const [preloadedVideo, setPreloadedVideo] = useState<string | null>(null);

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVideoLoaded = (filename: string) => {
    setPreloadedVideo(filename);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />
      {activePage === "analyze" && (
        <AnalyzePage onNavigate={handleNavigate} onVideoLoaded={handleVideoLoaded} />
      )}
      {activePage === "extract" && (
        <ExtractPage onNavigate={handleNavigate} preloadedVideo={preloadedVideo} onVideoLoaded={handleVideoLoaded} />
      )}
      {activePage === "transcribe" && (
        <TranscribePage onNavigate={handleNavigate} preloadedVideo={preloadedVideo} onVideoLoaded={handleVideoLoaded} />
      )}
      {activePage === "summarize" && (
        <SummarizePage onNavigate={handleNavigate} preloadedVideo={preloadedVideo} onVideoLoaded={handleVideoLoaded} />
      )}
      {activePage === "search" && (
        <SearchPage onNavigate={handleNavigate} preloadedVideo={preloadedVideo} onVideoLoaded={handleVideoLoaded} />
      )}
    </div>
  );
};

export default Index;
