interface UploadHeroProps {
  heading: string;
  subtitle: string;
  onFileSelect: () => void;
}

const UploadHero = ({ heading, subtitle, onFileSelect }: UploadHeroProps) => (
  <div className="flex flex-col items-center pt-20 pb-10">
    <h1 className="text-[36px] font-semibold text-foreground text-center">{heading}</h1>
    <p className="text-[16px] text-muted-foreground text-center max-w-[520px] mt-3">{subtitle}</p>

    <div className="flex items-center gap-3 mt-8">
      <button
        onClick={onFileSelect}
        className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[15px] font-medium w-[280px] h-[48px] rounded-btn transition-all duration-200"
      >
        Select video file
      </button>
      <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-amber-400 transition-colors text-[14px]">
        G
      </button>
      <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-amber-400 transition-colors text-[14px]">
        D
      </button>
    </div>

    <p className="text-[13px] text-muted-foreground mt-3">or drop video here</p>

    <div className="flex gap-2 mt-4">
      {["MP4", "MOV", "WEBM", "AVI", "MKV"].map((f) => (
        <span key={f} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-pill">
          {f}
        </span>
      ))}
    </div>
  </div>
);

export default UploadHero;
