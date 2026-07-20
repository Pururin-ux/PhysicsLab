import { Atom, Sparkle, StarFour } from "@phosphor-icons/react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export type FormulaSignalFilmProps = {
  activeIndex: number;
  correctCount: number;
  completed: boolean;
  reducedMotion: boolean;
};

const FORMULAS = ["v = s/t", "a = Δv/t", "I = q/t", "F = kΔx"] as const;

const NODE_PLACEMENT = [
  { gridColumn: 1, gridRow: 1 },
  { gridColumn: 3, gridRow: 1 },
  { gridColumn: 1, gridRow: 3 },
  { gridColumn: 3, gridRow: 3 },
] as const;

const CONNECTOR_ANGLES = [-148, -32, 148, 32] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function FormulaSignalFilm({
  activeIndex,
  correctCount,
  completed,
  reducedMotion,
}: FormulaSignalFilmProps) {
  const currentFrame = useCurrentFrame();
  const frame = reducedMotion ? 0 : currentFrame;
  const safeActiveIndex = clamp(Math.round(activeIndex), 0, FORMULAS.length - 1);
  const safeCorrectCount = clamp(Math.round(correctCount), 0, FORMULAS.length);

  const pulseFrame = frame % 64;
  const pulse = reducedMotion
    ? 0.44
    : interpolate(pulseFrame, [0, 32, 64], [0.18, 1, 0.18], {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const entrance = interpolate(frame, [0, 28], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const orbitAngle = reducedMotion
    ? safeActiveIndex * 90 - 45
    : (frame * 0.72 + safeActiveIndex * 90 - 45) % 360;

  const accent = completed ? "#f6bf67" : "#76e7f5";
  const accentSoft = completed
    ? "rgba(246, 191, 103, 0.28)"
    : "rgba(118, 231, 245, 0.24)";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        color: "#f5fbff",
        fontFamily: 'var(--font-sans), "Manrope", system-ui, sans-serif',
        overflow: "hidden",
        opacity: entrance,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "15% 18%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentSoft} 0%, rgba(15, 28, 49, 0.08) 46%, transparent 72%)`,
          filter: "blur(24px)",
          transform: `scale(${0.94 + pulse * 0.08})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 238,
          height: 238,
          border: `1px solid ${completed ? "rgba(246, 191, 103, 0.32)" : "rgba(118, 231, 245, 0.24)"}`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: `inset 0 0 34px ${accentSoft}`,
        }}
      />

      {CONNECTOR_ANGLES.map((angle, index) => {
        const reached = completed || index <= safeActiveIndex;
        return (
          <div
            key={angle}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 205,
              height: 1,
              transformOrigin: "0 50%",
              transform: `rotate(${angle}deg) scaleX(${reached ? 1 : 0.72})`,
              opacity: reached ? 0.62 : 0.18,
              background: reached
                ? `linear-gradient(90deg, ${accent}, rgba(118, 231, 245, 0.08))`
                : "linear-gradient(90deg, rgba(155, 181, 207, 0.42), rgba(155, 181, 207, 0.04))",
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 ${12 + pulse * 16}px ${accent}`,
          transform: `translate(-50%, -50%) rotate(${orbitAngle}deg) translateX(119px)`,
        }}
      />

      <div
        style={{
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "1fr 154px 1fr",
          gridTemplateRows: "1fr 132px 1fr",
          gap: "18px 26px",
          width: "100%",
          height: "100%",
          padding: "42px 54px",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {FORMULAS.map((formula, index) => {
          const isActive = !completed && index === safeActiveIndex;
          const isReached = completed || index < safeActiveIndex;
          const nodeColor = completed
            ? "#f6bf67"
            : isActive
              ? "#76e7f5"
              : isReached
                ? "#9ddce5"
                : "#8ca1b7";
          const activeScale = isActive && !reducedMotion ? 1 + pulse * 0.035 : 1;

          return (
            <div
              key={formula}
              style={{
                ...NODE_PLACEMENT[index],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                minWidth: 172,
                minHeight: 72,
                padding: "14px 18px",
                borderRadius: 22,
                border: `1px solid ${isActive || completed ? nodeColor : "rgba(151, 184, 210, 0.2)"}`,
                background: isActive || completed
                  ? `linear-gradient(145deg, ${completed ? "rgba(246, 191, 103, 0.13)" : "rgba(52, 126, 145, 0.22)"}, rgba(9, 18, 34, 0.84))`
                  : "rgba(9, 18, 34, 0.7)",
                boxShadow: isActive
                  ? `0 0 ${18 + pulse * 18}px rgba(118, 231, 245, ${0.13 + pulse * 0.11})`
                  : completed
                    ? "0 0 24px rgba(246, 191, 103, 0.13)"
                    : "0 14px 34px rgba(2, 7, 18, 0.2)",
                opacity: isActive || isReached ? 1 : 0.58,
                transform: `scale(${activeScale})`,
              }}
            >
              <span
                style={{
                  color: nodeColor,
                  fontFamily:
                    'var(--font-display), "Unbounded", "Manrope", system-ui, sans-serif',
                  fontSize: 24,
                  fontWeight: 650,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  textShadow: isActive ? "0 0 18px rgba(118, 231, 245, 0.36)" : "none",
                }}
              >
                {formula}
              </span>
            </div>
          );
        })}

        <div
          style={{
            gridColumn: 2,
            gridRow: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: 132,
            height: 132,
            borderRadius: "50%",
            border: `1px solid ${completed ? "rgba(246, 191, 103, 0.75)" : "rgba(118, 231, 245, 0.66)"}`,
            background: completed
              ? "radial-gradient(circle at 40% 35%, rgba(246, 191, 103, 0.34), rgba(12, 21, 36, 0.96) 68%)"
              : "radial-gradient(circle at 40% 35%, rgba(118, 231, 245, 0.25), rgba(12, 21, 36, 0.96) 68%)",
            boxShadow: `0 0 ${28 + pulse * 18}px ${accentSoft}, inset 0 0 26px rgba(255, 255, 255, 0.035)`,
            transform: `scale(${completed ? 1.02 + pulse * 0.025 : 1})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 54,
              color: accent,
            }}
          >
            {completed ? (
              <StarFour size={52} weight="fill" />
            ) : (
              <Atom size={52} weight="duotone" />
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {FORMULAS.map((_, index) => {
              const earned = completed || index < safeCorrectCount;
              return (
                <Sparkle
                  key={index}
                  size={12}
                  weight={earned ? "fill" : "regular"}
                  color={earned ? "#f6bf67" : "#64778b"}
                  opacity={earned ? 1 : 0.48}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
