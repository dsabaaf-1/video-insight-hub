import { useVideo } from "@/contexts/VideoContext";

interface VideoPlayerProps {
  compact?: boolean;
}

const VideoPlayer = ({ compact = false }: VideoPlayerProps) => {
  const { objectUrl, filename } = useVideo();

  if (!objectUrl) return null;

  return (
    <div className="animate-fade-in">
      <div className={`bg-foreground/5 rounded-[12px] overflow-hidden ${compact ? "h-[120px] md:h-[160px]" : "h-[160px] md:h-[240px]"}`}>
        <video
          src={objectUrl}
          controls
          className="w-full h-full object-contain bg-black rounded-[12px]"
        />
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="font-mono text-[12px] text-muted-foreground truncate max-w-[70%]">{filename}</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
