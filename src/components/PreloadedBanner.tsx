import { X } from "lucide-react";

interface PreloadedBannerProps {
  filename: string;
  onDismiss: () => void;
}

const PreloadedBanner = ({ filename, onDismiss }: PreloadedBannerProps) => (
  <div className="bg-amber-100 border border-amber-200 rounded-badge px-4 py-2 flex items-center justify-between mb-6 animate-slide-up">
    <span className="text-[13px] text-amber-700">
      ✦ Using your previously analyzed video — <span className="font-medium">{filename}</span>
    </span>
    <button onClick={onDismiss} className="text-amber-600 hover:text-amber-800 transition-colors">
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default PreloadedBanner;
