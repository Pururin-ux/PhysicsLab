import { TopicAmbientGlow } from "web";

const frame = {
  position: "relative" as const,
  width: 420,
  height: 80,
  padding: "24px 16px 16px",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 12,
};

export const CyanAccent = () => (
  <div style={frame}>
    <TopicAmbientGlow accent="cyan" />
    <p className="text-[13px] text-white/70">Акцентная линия над заголовком темы (cyan)</p>
  </div>
);

export const GoldAccent = () => (
  <div style={frame}>
    <TopicAmbientGlow accent="gold" />
    <p className="text-[13px] text-white/70">Акцентная линия над заголовком темы (gold)</p>
  </div>
);
