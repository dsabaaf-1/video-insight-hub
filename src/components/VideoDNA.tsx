import { forwardRef, useEffect, useMemo, useState } from "react";

const dnaHeights = [18, 24, 12, 28, 20, 14, 26, 10, 22, 16, 28, 20, 8, 24, 18, 12, 26, 22, 14, 28, 16, 20, 10, 24, 18, 26, 12, 22];
const TIMESTAMP_MARKERS = 6;
const DEFAULT_DURATION = 14;

interface VideoDNAProps {
  retrievedBars: Set<number>;
  currentBarIndex: number;
  duration?: number;
  onBarClick?: (barIndex: number) => void;
}

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return minutes > 0 ? `${minutes}:${String(remainingSeconds).padStart(2, "0")}` : `${remainingSeconds}s`;
};

const VideoDNA = forwardRef<HTMLDivElement, VideoDNAProps>(
  ({ retrievedBars, currentBarIndex, duration = DEFAULT_DURATION, onBarClick }, ref) => {
    const [visible, setVisible] = useState(false);
    const [allowStagger, setAllowStagger] = useState(true);

    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : DEFAULT_DURATION;
    const dnaTimestamps = useMemo(
      () =>
        Array.from({ length: TIMESTAMP_MARKERS }, (_, index) => {
          const seconds = index === 0 ? 0 : Math.ceil((safeDuration / (TIMESTAMP_MARKERS - 1)) * index);
          return formatTime(seconds);
        }),
      [safeDuration],
    );

    useEffect(() => {
      const animationFrame = requestAnimationFrame(() => setVisible(true));
      const staggerTimeout = window.setTimeout(() => setAllowStagger(false), dnaHeights.length * 35 + 300);

      return () => {
        cancelAnimationFrame(animationFrame);
        window.clearTimeout(staggerTimeout);
      };
    }, []);

    return (
      <div ref={ref} className="animate-slide-up">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Video DNA</p>
          <span className="text-[10px] text-muted-foreground">Click a strip to jump</span>
        </div>

        <div className="flex h-[42px] items-end gap-[3px]" aria-label="Video DNA timeline">
          {dnaHeights.map((height, index) => {
            const isRetrieved = retrievedBars.has(index);
            const isActive = currentBarIndex === index;
            const isViewed = index < currentBarIndex;
            const barTime = (safeDuration * index) / dnaHeights.length;

            const colorClass = isActive
              ? "bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.35)]"
              : isRetrieved
                ? "bg-primary/75 shadow-[0_0_10px_hsl(var(--primary)/0.25)]"
                : isViewed
                  ? "bg-primary/40"
                  : "bg-muted-foreground/30";

            return (
              <button
                key={index}
                type="button"
                title={`Jump to ${formatTime(barTime)}`}
                aria-label={`Jump to ${formatTime(barTime)}`}
                aria-current={isActive ? "time" : undefined}
                onClick={() => onBarClick?.(index)}
                className={`flex-1 min-w-[5px] max-w-[10px] rounded-sm border-0 p-0 transition-[height,transform,background-color,box-shadow,opacity] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:opacity-90 ${colorClass} ${isActive ? "-translate-y-0.5" : ""}`}
                style={{
                  height: visible ? `${height}px` : "0px",
                  transitionDelay: allowStagger ? `${index * 35}ms` : "0ms",
                  transformOrigin: "bottom",
                }}
              />
            );
          })}
        </div>

        <div className="mt-2 flex justify-between">
          {dnaTimestamps.map((timestamp) => (
            <span key={timestamp} className="font-mono text-[10px] text-muted-foreground">
              {timestamp}
            </span>
          ))}
        </div>
      </div>
    );
  },
);

VideoDNA.displayName = "VideoDNA";

export default VideoDNA;
