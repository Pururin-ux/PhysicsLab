#!/usr/bin/env node
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";

const kitRequire = createRequire("file:///C:/Users/lalad/OneDrive/Desktop/PhysicsChannelKit/package.json");
const sharp = kitRequire("sharp");

const ROOT = "C:/Users/lalad/OneDrive/Desktop/PhysicsChannelOutput/mini-pack-20260605";
const W = 1080;
const H = 1350;

const backgrounds = {
  manga: "C:/Users/lalad/.codex/generated_images/019e93e1-7f9c-7590-94a7-a28eea180e80/ig_0ff745c7e908bd6a016a21f739b8308193aed0fda983280403.png",
  light: "C:/Users/lalad/.codex/generated_images/019e93e1-7f9c-7590-94a7-a28eea180e80/ig_0ff745c7e908bd6a016a21f7c01a0481939f879a745e26dbde.png",
  dark: "C:/Users/lalad/.codex/generated_images/019e93e1-7f9c-7590-94a7-a28eea180e80/ig_0ff745c7e908bd6a016a21fabd7f0c8193a050021322b7c20d.png",
  warm: "C:/Users/lalad/.codex/generated_images/019e93e1-7f9c-7590-94a7-a28eea180e80/ig_0ff745c7e908bd6a016a21f8eef2448193b12f6bc83dee1d87.png",
  units: "C:/Users/lalad/.codex/generated_images/019e93e1-7f9c-7590-94a7-a28eea180e80/ig_0ff745c7e908bd6a016a21f97c18b4819391f3db7eb9f7d7b7.png",
};

const colors = {
  ink: "#161412",
  paper: "#fff8eb",
  muted: "#6d6259",
  blue: "#174bb2",
  red: "#d33128",
  pink: "#d64d88",
  violet: "#7160b5",
  yellow: "#f0cf4f",
  dark: "#111827",
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text({ x, y, lines, size, fill = colors.ink, weight = 800, family = "Arial, sans-serif", lh = 1.1, stroke = "#fff7e8", sw, rotate = 0, spacing = 0, opacity = 1 }) {
  const arr = Array.isArray(lines) ? lines : [lines];
  const strokeWidth = sw ?? Math.max(0, size * 0.035);
  const tspans = arr.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : size * lh}">${esc(line)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="${fill}" opacity="${opacity}" paint-order="stroke fill" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round">${tspans}</text>`;
}

function rect(x, y, w, h, fill, opacity = 0.82, rx = 16, rotate = 0, stroke = "none", sw = 0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})" fill="${fill}" opacity="${opacity}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function line(x1, y1, x2, y2, color, sw = 7) {
  return `<path d="M ${x1} ${y1} C ${(x1 + x2) / 2 - 25} ${y1 + 8}, ${(x1 + x2) / 2 + 25} ${y2 - 8}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

function checkboxList({ x, y, items, size = 34, gap = 58, color = colors.ink, checked = false }) {
  return items
    .map((item, i) => {
      const yy = y + i * gap;
      const mark = checked ? `<path d="M ${x + 5} ${yy - 7} L ${x + 15} ${yy + 5} L ${x + 34} ${yy - 20}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` : "";
      return `<g>${rect(x, yy - 28, 28, 28, "none", 1, 2, 0, color, 3)}${mark}${text({ x: x + 48, y: yy, lines: item, size, fill: color, weight: 750, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fffaf2", sw: 2 })}</g>`;
    })
    .join("");
}

function post01() {
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${text({ x: 64, y: 130, lines: ["ФИЗМАТ", "ЛЕТОМ?"], size: 96, weight: 950, family: "Arial Black, Impact, sans-serif", stroke: "#f5f2ec", sw: 5 })}
    ${text({ x: 640, y: 240, lines: "ДА", size: 128, fill: colors.red, weight: 950, family: "Arial Black, Impact, sans-serif", stroke: "#f7f3ed", sw: 4, rotate: -3 })}
    ${line(70, 286, 575, 286, colors.blue, 7)}
    ${rect(78, 318, 604, 54, colors.paper, 0.9, 8, -1)}
    ${text({ x: 100, y: 356, lines: "без фанатизма: 15 минут лучше, чем ноль", size: 28, weight: 700, family: "Segoe Print, Comic Sans MS, cursive", sw: 1.5 })}
    ${text({ x: 98, y: 475, lines: "мини-план", size: 52, weight: 900, family: "Arial Black, sans-serif", stroke: "#f5f2ec", sw: 3 })}
    ${checkboxList({ x: 94, y: 550, items: ["одна тема", "3 задачи", "ошибку — в заметки", "и отдых без вины"], size: 33, gap: 66 })}
    ${text({ x: 95, y: 960, lines: ["не надо", "становиться", "машиной"], size: 33, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff7e8", sw: 2, lh: 1.06 })}
    ${text({ x: 590, y: 1016, lines: ["сохрани,", "когда мозг", "торгуется"], size: 34, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", fill: colors.blue, stroke: "#fff7e8", sw: 2 })}
  </svg>`;
}

function post02() {
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${text({ x: 125, y: 122, lines: ["ЛЕТНИЙ", "ЧЕКПОИНТ"], size: 72, weight: 950, family: "Arial Black, sans-serif", stroke: "#fff8ee", sw: 4 })}
    ${text({ x: 135, y: 278, lines: "физматника", size: 56, fill: colors.blue, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff8ee", sw: 2 })}
    ${line(130, 304, 625, 304, colors.pink, 6)}
    ${text({ x: 95, y: 455, lines: "математика", size: 42, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff8ee", sw: 2 })}
    ${checkboxList({ x: 84, y: 525, items: ["квадратные", "графики", "тригонометрия", "степени и корни"], size: 29, gap: 58 })}
    ${text({ x: 95, y: 823, lines: "физика", size: 42, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff8ee", sw: 2 })}
    ${checkboxList({ x: 84, y: 895, items: ["кинематика", "силы", "энергия", "электричество"], size: 29, gap: 58 })}
    ${rect(420, 458, 315, 260, colors.paper, 0.72, 12)}
    ${text({ x: 442, y: 512, lines: ["D = b² − 4ac", "v = v₀ + at", "F = ma"], size: 29, weight: 800, family: "Consolas, JetBrains Mono, monospace", sw: 2 })}
    ${text({ x: 450, y: 760, lines: ["15 минут", "в день >", "паника", "31 августа"], size: 36, fill: colors.red, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff8ee", sw: 2, lh: 1.08 })}
    ${text({ x: 540, y: 1210, lines: "главное — регулярность", size: 30, fill: colors.blue, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff8ee", sw: 2, rotate: -3 })}
  </svg>`;
}

function post03() {
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${text({ x: 100, y: 155, lines: ["МИНУС В", "УСКОРЕНИИ"], size: 66, fill: "#e9dff9", weight: 950, family: "Consolas, JetBrains Mono, monospace", stroke: "#101522", sw: 5, spacing: 2 })}
    ${rect(112, 325, 690, 70, "#f0e6d8", 0.94, 10, -1)}
    ${text({ x: 136, y: 373, lines: "это направление, а не «плохая физика»", size: 28, weight: 800, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#f0e6d8", sw: 1 })}
    ${text({ x: 178, y: 600, lines: "сначала выбери ось", size: 37, fill: colors.violet, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#efe4d4", sw: 2 })}
    ${text({ x: 188, y: 710, lines: ["a = (v − v₀) / t", "v₀ = 20 м/с", "v = 5 м/с,  t = 3 с", "a = −5 м/с²"], size: 34, fill: colors.ink, weight: 850, family: "Consolas, JetBrains Mono, monospace", stroke: "#efe4d4", sw: 2.4, lh: 1.33 })}
    ${text({ x: 220, y: 1045, lines: ["минус значит:", "ускорение против оси"], size: 36, fill: "#f6e8ff", weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#231b2d", sw: 4, lh: 1.15 })}
    ${text({ x: 245, y: 1260, lines: "знак = смысл, не декор", size: 30, fill: "#ffd7e8", weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#171827", sw: 3, rotate: -3 })}
  </svg>`;
}

function post04() {
  const formula = (x, y, title, body, color) => `${rect(x - 14, y - 52, 368, 106, colors.paper, 0.72, 14)}${text({ x, y: y - 8, lines: title, size: 25, fill: color, weight: 950, family: "Segoe Print, Comic Sans MS, cursive", stroke: colors.paper, sw: 1.5 })}${text({ x, y: y + 35, lines: body, size: 30, weight: 850, family: "Consolas, JetBrains Mono, monospace", stroke: colors.paper, sw: 2 })}`;
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${text({ x: 118, y: 135, lines: ["5 ФОРМУЛ", "КИНЕМАТИКИ"], size: 61, weight: 950, family: "Arial Black, sans-serif", stroke: "#f6ead8", sw: 4 })}
    ${rect(150, 275, 472, 52, "#d8d3e9", 0.78, 12, -1)}
    ${text({ x: 170, y: 312, lines: "равноускоренное движение", size: 29, fill: colors.blue, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#f6ead8", sw: 1.5 })}
    ${formula(148, 450, "скорость", "v = v₀ + at", colors.red)}
    ${formula(565, 450, "путь", "s = v₀t + at²/2", colors.blue)}
    ${formula(148, 625, "без времени", "v² − v₀² = 2as", colors.violet)}
    ${formula(565, 625, "средняя v", "s = (v + v₀)t/2", colors.red)}
    ${formula(148, 800, "ускорение", "a = (v − v₀)/t", colors.green)}
    ${rect(128, 1034, 520, 146, colors.paper, 0.76, 16, -1)}
    ${text({ x: 150, y: 1088, lines: ["ловушка:", "v₀ — начальная скорость,", "а не первая v из условия"], size: 31, fill: colors.ink, weight: 850, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#f6ead8", sw: 2, lh: 1.18 })}
    ${text({ x: 660, y: 1220, lines: "сначала ось", size: 34, fill: colors.blue, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#f6ead8", sw: 2, rotate: -5 })}
  </svg>`;
}

function post05() {
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${text({ x: 82, y: 135, lines: ["ЕДИНИЦЫ", "КРАДУТ БАЛЛЫ"], size: 64, weight: 950, family: "Arial Black, sans-serif", stroke: "#fff7ea", sw: 4 })}
    ${line(88, 284, 700, 284, colors.red, 7)}
    ${text({ x: 118, y: 390, lines: ["ответ может быть верный,", "а баллы всё равно ушли"], size: 36, fill: colors.muted, weight: 850, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff7ea", sw: 2, lh: 1.12 })}
    ${text({ x: 160, y: 560, lines: "перед формулой переведи:", size: 34, fill: colors.red, weight: 900, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff7ea", sw: 2 })}
    ${text({ x: 162, y: 650, lines: ["72 км/ч = 20 м/с", "5 мин = 300 с", "40 см = 0,40 м"], size: 40, weight: 900, family: "Consolas, JetBrains Mono, monospace", stroke: "#fff7ea", sw: 2.5, lh: 1.35 })}
    ${text({ x: 124, y: 1030, lines: ["чек:", "скорость — м/с", "время — с", "длина — м"], size: 32, weight: 850, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff7ea", sw: 2, lh: 1.25 })}
    ${text({ x: 485, y: 1160, lines: ["СИ —", "это броня"], size: 36, fill: colors.red, weight: 950, family: "Segoe Print, Comic Sans MS, cursive", stroke: "#fff7ea", sw: 3, rotate: -5 })}
  </svg>`;
}

const posts = [
  { id: "01-fizmat-letom-da", title: "Физмат летом? Да", bg: "manga", overlay: post01, checks: ["strategy, not curriculum claim", "no formulas"] },
  { id: "02-letniy-checkpoint", title: "Летний чекпоинт физматника", bg: "light", overlay: post02, checks: ["D formula checked", "v=v0+at checked", "F=ma checked"] },
  { id: "03-minus-v-uskorenii", title: "Минус в ускорении", bg: "dark", overlay: post03, checks: ["negative acceleration meaning checked", "example a=-5 m/s^2 checked"] },
  { id: "04-kinematika-5-formul", title: "5 формул кинематики", bg: "warm", overlay: post04, checks: ["uniform acceleration formulas checked"] },
  { id: "05-edinitsy-kradut-bally", title: "Единицы крадут баллы", bg: "units", overlay: post05, checks: ["72 km/h = 20 m/s", "5 min = 300 s", "40 cm = 0.40 m"] },
];

async function main() {
  const dirs = {
    finals: path.join(ROOT, "finals"),
    overlays: path.join(ROOT, "overlays"),
    backgrounds: path.join(ROOT, "backgrounds"),
  };
  await Promise.all(Object.values(dirs).map((dir) => fs.mkdir(dir, { recursive: true })));

  const manifest = [];
  for (const post of posts) {
    const bgPath = backgrounds[post.bg];
    const bgOut = path.join(dirs.backgrounds, `${post.id}-background.png`);
    const overlayOut = path.join(dirs.overlays, `${post.id}-overlay.svg`);
    const finalOut = path.join(dirs.finals, `${post.id}.png`);
    const overlay = post.overlay();

    await fs.copyFile(bgPath, bgOut);
    await fs.writeFile(overlayOut, overlay, "utf8");

    const base = await sharp(bgPath).resize(W, H, { fit: "cover", position: "center" }).png().toBuffer();
    await sharp(base)
      .composite([{ input: Buffer.from(overlay, "utf8"), top: 0, left: 0 }])
      .png()
      .toFile(finalOut);

    const meta = await sharp(finalOut).metadata();
    manifest.push({
      id: post.id,
      title: post.title,
      final: finalOut,
      background: bgOut,
      overlay: overlayOut,
      width: meta.width,
      height: meta.height,
      checks: post.checks,
    });
  }

  await fs.writeFile(path.join(ROOT, "manifest.json"), JSON.stringify({ date: "2026-06-05", format: `${W}x${H}`, posts: manifest }, null, 2), "utf8");
  console.log(JSON.stringify(manifest.map(({ id, width, height, final }) => ({ id, width, height, final })), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
