import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Динамическая OG-картинка для превью ссылок в соцсетях/мессенджерах.
// Повторяет цветовую схему фирменной иконки (app/icon.svg): тёмный фон
// space-950, три орбитальных кольца (cyan/blue/gold) вокруг «ядра».
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F17",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: "50%",
            border: "3px solid rgba(0,224,255,0.55)",
            left: 90,
            top: 85,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 200,
            borderRadius: "50%",
            border: "3px solid rgba(45,156,255,0.55)",
            left: 90,
            top: 215,
            transform: "rotate(18deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 200,
            borderRadius: "50%",
            border: "3px solid rgba(212,175,55,0.5)",
            left: 90,
            top: 215,
            transform: "rotate(-18deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#00E0FF",
            left: 303,
            top: 298,
            boxShadow: "0 0 40px rgba(0,224,255,0.8)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginLeft: 560,
            maxWidth: 560,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "#D4AF37",
              textTransform: "uppercase",
            }}
          >
            ЦЭ / ЦТ · физика
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.08,
            }}
          >
            PhysicsLab
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.4,
            }}
          >
            Тренажёр по физике: короткие тренировки, разбор ошибок и честный
            прогресс
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
