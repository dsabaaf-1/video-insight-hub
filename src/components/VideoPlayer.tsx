import type { Ref, SyntheticEvent } from "react";
import { useVideo } from "@/contexts/VideoContext";

interface VideoPlayerProps {
  compact?: boolean;
  videoElementRef?: Ref<HTMLVideoElement>;
  onTimeUpdate?: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onLoadedMetadata?: (event: SyntheticEvent<HTMLVideoElement>) => void;
}

const VideoPlayer = ({
  compact = false,
  videoElementRef,
  onTimeUpdate,
  onLoadedMetadata,
}: VideoPlayerProps) => {
  const { objectUrl, filename } = useVideo();

  if (!objectUrl) return null;

  return (
    <div className="animate-fade-in">
      <div className={`overflow-hidden rounded-[12px] bg-foreground/5 ${compact ? "h-[120px] md:h-[160px]" : "h-[160px] md:h-[240px]"}`}>
        <video
          ref={videoElementRef}
          src={objectUrl}
          controls
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          className="h-full w-full rounded-[12px] bg-foreground object-contain"
        />
      </div>
      <div className="mt-2 flex items-center justify-between px-1">
        <span className="max-w-[70%] truncate font-mono text-[12px] text-muted-foreground">{filename}</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
