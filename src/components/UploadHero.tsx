import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UploadHeroProps {
  heading: string;
  subtitle: string;
  onFileSelect: () => void;
}

const UploadHero = ({ heading, subtitle, onFileSelect }: UploadHeroProps) => (
  <div className="flex flex-col items-center pt-20 pb-10 px-4">
    <h1 className="text-[36px] font-semibold text-foreground text-center leading-tight">{heading}</h1>
    <p className="text-[16px] text-muted-foreground text-center max-w-[520px] mt-3 leading-relaxed">{subtitle}</p>

    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={onFileSelect}
        className="bg-amber-500 hover:bg-amber-600 text-white text-[15px] font-medium w-[280px] h-[48px] rounded-btn transition-all duration-200"
      >
        Select video file
      </button>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-amber-400 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4.433 22l-3.4-6 7.967-13.8h6.8L4.433 22z" fill="#4285F4"/>
                <path d="M23.067 16L19.667 22H4.433l3.4-6H23.067z" fill="#34A853"/>
                <path d="M15.8 2.2L23.067 16H16.233L8.967 2.2H15.8z" fill="#FBBC04"/>
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent><p>Upload from Google Drive</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-amber-400 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0061FF">
                <path d="M6 2l6 3.75L6 9.5 0 5.75zM18 2l6 3.75-6 3.75-6-3.75zM0 13.25L6 9.5l6 3.75L6 17zM18 9.5l6 3.75L18 17l-6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75z"/>
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent><p>Upload from Dropbox</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <p className="text-[13px] text-muted-foreground mt-3 text-center">or drop video here</p>

    <div className="flex items-center justify-center gap-2 mt-4">
      {["MP4", "MOV", "WEBM", "AVI", "MKV"].map((f) => (
        <span key={f} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-pill">
          {f}
        </span>
      ))}
    </div>
  </div>
);

export default UploadHero;
