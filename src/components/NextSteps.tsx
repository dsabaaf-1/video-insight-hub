import { useNavigate } from "react-router-dom";

interface NextStepsProps {
  currentPage: string;
}

const allSteps = [
  { path: "/extract", icon: "🖼", title: "Extract Frames", subtitle: "Download all keyframes as images" },
  { path: "/transcribe", icon: "🎙", title: "Transcribe Audio", subtitle: "Get full text transcript" },
  { path: "/summarize", icon: "📄", title: "Summarize Video", subtitle: "AI-written summary of content" },
  { path: "/search", icon: "🔍", title: "Search Moments", subtitle: "Find specific moments by description" },
  { path: "/", icon: "📥", title: "Analyze Video", subtitle: "Ask questions about your video" },
];

const NextSteps = ({ currentPage }: NextStepsProps) => {
  const navigate = useNavigate();
  const steps = allSteps.filter((s) => s.path !== currentPage);

  return (
    <div className="animate-slide-up mt-8 pt-6 border-t border-amber-200">
      <p className="text-[13px] text-muted-foreground uppercase tracking-wider text-center mb-4">
        What would you like to do next?
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {steps.map((step) => (
          <button
            key={step.path}
            onClick={() => { navigate(step.path); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="bg-card border border-border rounded-card p-4 shadow-sm hover:border-amber-400 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="w-9 h-9 bg-amber-100 rounded-badge flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">
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
