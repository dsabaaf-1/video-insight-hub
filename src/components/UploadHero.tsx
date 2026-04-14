import { useRef, useState, useCallback } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UploadHeroProps {
  heading: string;
  subtitle: string;
  onFileSelect: (file: File) => void;
}

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska"];
const MAX_SIZE_MB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const UploadHero = ({ heading, subtitle, onFileSelect }: UploadHeroProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = useCallback((file: File) => {
    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
      setError("Unsupported format. Please upload MP4, MOV, WEBM, AVI, or MKV.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  }, [validateAndSelect]);

  return (
    <div className="flex flex-col items-center pt-12 md:pt-20 pb-10 px-4 animate-fade-in">
      <h1 className="text-[28px] md:text-[36px] font-semibold text-foreground text-center leading-tight">{heading}</h1>
      <p className="text-[14px] md:text-[16px] text-muted-foreground text-center max-w-[520px] mt-3 leading-relaxed">{subtitle}</p>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-8 w-full max-w-lg border-2 border-dashed rounded-card p-8 flex flex-col items-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-amber-400 bg-amber-50 scale-[1.02] shadow-lg"
            : "border-border hover:border-amber-300 hover:bg-accent/30"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
          isDragging ? "bg-amber-200" : "bg-amber-100"
        }`}>
          <Upload className={`w-6 h-6 transition-colors ${isDragging ? "text-amber-700" : "text-amber-500"}`} />
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
          className="bg-amber-500 hover:bg-amber-600 text-white text-[15px] font-medium w-[240px] md:w-[280px] h-[48px] rounded-btn transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload size={18} />
          Upload video file
        </button>

        <p className="text-[13px] text-muted-foreground mt-3 text-center">
          {isDragging ? "Drop your video here!" : "or drag & drop your video here"}
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mt-3 text-destructive text-[13px] animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Cloud upload buttons */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-amber-400 hover:scale-105 transition-all">
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
              <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-amber-400 hover:scale-105 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0061FF">
                  <path d="M6 2l6 3.75L6 9.5 0 5.75zM18 2l6 3.75-6 3.75-6-3.75zM0 13.25L6 9.5l6 3.75L6 17zM18 9.5l6 3.75L18 17l-6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75z"/>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Upload from Dropbox</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {["MP4", "MOV", "WEBM", "AVI", "MKV"].map((f) => (
          <span key={f} className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-pill">
            {f}
          </span>
        ))}
        <span className="text-[11px] text-muted-foreground">· Max {MAX_SIZE_MB}MB</span>
      </div>
    </div>
  );
};

export default UploadHero;
