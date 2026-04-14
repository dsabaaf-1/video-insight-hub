type Page = "analyze" | "extract" | "transcribe" | "summarize" | "search";

interface NextStepsProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const allSteps: { page: Page; icon: string; title: string; subtitle: string }[] = [
  { page: "extract", icon: "🖼", title: "Extract Frames", subtitle: "Download all keyframes as images" },
  { page: "transcribe", icon: "🎙", title: "Transcribe Audio", subtitle: "Get full text transcript" },
  { page: "summarize", icon: "📄", title: "Summarize Video", subtitle: "AI-written summary of content" },
  { page: "search", icon: "🔍", title: "Search Moments", subtitle: "Find specific moments by description" },
  { page: "analyze", icon: "📥", title: "Export Report", subtitle: "Download Q&A as PDF" },
];

const NextSteps = ({ currentPage, onNavigate }: NextStepsProps) => {
  const steps = allSteps.filter((s) => s.page !== currentPage);

  return (
    <div className="animate-slide-up mt-8 pt-6 border-t border-amber-200">
      <p className="text-[13px] text-muted-foreground uppercase tracking-wider text-center mb-4">
        What would you like to do next?
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        {steps.map((step) => (
          <button
            key={step.page}
            onClick={() => onNavigate(step.page)}
            className="w-[180px] bg-card border border-border rounded-card p-4 shadow-sm hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-amber-100 rounded-badge flex items-center justify-center text-lg mb-2">
              {step.icon}
            </div>
            <p className="text-[13px] font-medium text-foreground">{step.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{step.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NextSteps;
