"use client";

export type FormulaSignalPlayerProps = {
  activeIndex: number;
  correctCount: number;
  completed: boolean;
  reducedMotion: boolean;
  className?: string;
};

export function FormulaSignalPlayer({
  activeIndex,
  completed,
  reducedMotion,
  className,
}: FormulaSignalPlayerProps) {
  const safeStep = Math.min(3, Math.max(0, Math.round(activeIndex)));
  const clipKey = completed ? "complete" : `step-${safeStep}`;

  return (
    <div
      aria-hidden="true"
      className={className}
      data-formula-signal="remotion-render"
      role="presentation"
      style={{
        width: "100%",
        aspectRatio: "12 / 7",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <video
        key={clipKey}
        autoPlay={!reducedMotion}
        loop
        muted
        playsInline
        preload="metadata"
        poster={`/art/formula-signal-${clipKey}.png`}
        className="h-full w-full object-cover"
        tabIndex={-1}
      >
        <source src={`/art/formula-signal-${clipKey}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
