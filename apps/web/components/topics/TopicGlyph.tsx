import type { ReactNode } from "react";

export type TopicGlyphId =
  | "kinematics"
  | "dynamics"
  | "electrodynamics"
  | "thermodynamics";

const glyphs: Record<TopicGlyphId, ReactNode> = {
  // Растущий график v(t) с точкой — чтение движения по графику.
  kinematics: (
    <>
      <path d="M11 9 V37 H39" />
      <path d="M15 31 L24 23 L33 12" />
      <circle cx="33" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </>
  ),
  // Брусок и силы: втекающая слева, результирующая справа.
  dynamics: (
    <>
      <rect x="18" y="18" width="12" height="12" rx="2.5" />
      <path d="M6 24 H16" />
      <path d="M12 20 L16 24 L12 28" />
      <path d="M32 24 H42" />
      <path d="M38 20 L42 24 L38 28" />
    </>
  ),
  // Молния — электричество: мгновенно узнаётся.
  electrodynamics: (
    <path
      d="M26 7 L14 27 H23 L21 41 L34 20 H25 Z"
      fill="currentColor"
      fillOpacity="0.14"
    />
  ),
  // Сосуд с частицами газа и волны тепла снизу.
  thermodynamics: (
    <>
      <rect x="13" y="11" width="22" height="24" rx="4.5" />
      <circle cx="20" cy="19" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="28" cy="23" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="22" cy="28" r="1.7" fill="currentColor" stroke="none" />
      <path d="M17 41 q2.5 -3.5 5 0 t5 0" />
    </>
  ),
};

interface TopicGlyphProps {
  topic: TopicGlyphId;
  className?: string;
}

export function TopicGlyph({ topic, className }: TopicGlyphProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {glyphs[topic]}
    </svg>
  );
}
