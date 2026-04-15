import { useEffect, useState } from "react";

const dnaHeights = [18, 24, 12, 28, 20, 14, 26, 10, 22, 16, 28, 20, 8, 24, 18, 12, 26, 22, 14, 28, 16, 20, 10, 24, 18, 26, 12, 22];
const dnaTimestamps = ["0s", "3s", "6s", "9s", "12s", "14s"];

interface VideoDNAProps {
  retrievedBars: Set<number>;
}

const VideoDNA = ({ retrievedBars }: VideoDNAProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-slide-up">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Video DNA</p>
      <div className="flex items-end gap-[3px] h-[32px]">
        {dnaHeights.map((h, i) => (
          <div
            key={i}
            className={`flex-1 min-w-[4px] max-w-[10px] rounded-t-sm transition-all duration-500 cursor-pointer hover:opacity-80 ${
              retrievedBars.has(i)
                ? "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                : i < 14
                ? "bg-amber-300/60"
                : "bg-muted-foreground/30"
            }`}
            style={{
              height: visible ? `${h}px` : "0px",
              transitionDelay: `${i * 40}ms`,
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {dnaTimestamps.map((t) => (
          <span key={t} className="font-mono text-[10px] text-muted-foreground">{t}</span>
        ))}
      </div>
    </div>
  );
};

export default VideoDNA;
