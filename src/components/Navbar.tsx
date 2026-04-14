import { Diamond } from "lucide-react";

type Page = "analyze" | "extract" | "transcribe" | "summarize" | "search";

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { page: Page; label: string }[] = [
  { page: "analyze", label: "Analyze" },
  { page: "extract", label: "Extract Frames" },
  { page: "transcribe", label: "Transcribe" },
  { page: "summarize", label: "Summarize" },
  { page: "search", label: "Search Moments" },
];

const Navbar = ({ activePage, onNavigate }: NavbarProps) => {
  return (
    <nav className="h-[52px] bg-card border-b border-border flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center gap-1.5 shrink-0">
        <Diamond className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-[15px] font-semibold text-foreground">Video Analysis</span>
      </div>

      <div className="flex items-center gap-6 mx-auto">
        {navLinks.map(({ page, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`text-[13px] font-medium transition-all duration-200 pb-0.5 border-b-2 ${
              activePage === page
                ? "text-amber-600 border-amber-500"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </button>
        <button className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-1.5 rounded-btn transition-all duration-200">
          Get started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
