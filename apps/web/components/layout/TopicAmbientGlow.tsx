// Мягкое цветное пятно за теорией главы: у каждой темы свой акцент
// (cyan/gold/blue/ember), чтобы главы не сливались друг с другом.
const glowByAccent = {
  cyan: "bg-nova-cyan/[.07]",
  gold: "bg-nova-gold/[.07]",
  blue: "bg-nova-blue/[.08]",
  ember: "bg-nova-ember/[.08]",
} as const;

interface TopicAmbientGlowProps {
  accent: keyof typeof glowByAccent;
}

export function TopicAmbientGlow({ accent }: TopicAmbientGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -top-16 right-0 hidden h-[300px] w-[300px] rounded-full blur-[100px] sm:block ${glowByAccent[accent]}`}
    />
  );
}
