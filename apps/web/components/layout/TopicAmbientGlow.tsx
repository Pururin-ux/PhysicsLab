const lineByAccent = {
  cyan: "bg-nova-cyan/45 shadow-[0_0_18px_rgba(121,217,238,.22)]",
  gold: "bg-nova-pink/45 shadow-[0_0_18px_rgba(224,121,199,.18)]",
  blue: "bg-nova-blue/45 shadow-[0_0_18px_rgba(45,156,255,.2)]",
  ember: "bg-nova-ember/45 shadow-[0_0_18px_rgba(255,122,69,.18)]",
} as const;

interface TopicAmbientGlowProps {
  accent: keyof typeof lineByAccent;
}

export function TopicAmbientGlow({ accent }: TopicAmbientGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -top-3 left-0 hidden h-px w-24 sm:block ${lineByAccent[accent]}`}
    />
  );
}
