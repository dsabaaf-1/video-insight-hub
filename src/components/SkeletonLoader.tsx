const SkeletonBar = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`bg-muted animate-pulse rounded ${className}`} style={style} />
);

export const DNASkeleton = () => (
  <div className="space-y-2">
    <SkeletonBar className="w-20 h-3" />
    <div className="flex items-end gap-[3px] h-[32px]">
      {Array.from({ length: 28 }).map((_, i) => (
        <SkeletonBar
          key={i}
          className="w-[8px] rounded-t-sm"
          style={{ height: `${10 + Math.random() * 18}px`, animationDelay: `${i * 50}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  </div>
);

export const FramesSkeleton = () => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonBar key={i} className="flex-shrink-0 w-[120px] h-[80px] rounded-btn" />
    ))}
  </div>
);

export const ChatSkeleton = () => (
  <div className="space-y-3 p-4">
    <SkeletonBar className="w-3/4 h-8 rounded-[12px]" />
    <SkeletonBar className="w-1/2 h-8 rounded-[12px] ml-auto" />
    <SkeletonBar className="w-2/3 h-12 rounded-[12px]" />
  </div>
);
