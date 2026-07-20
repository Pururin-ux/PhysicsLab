// Линтер учебного текста PhysicsLab.
//
// Ловит две беды разом:
//   1) язык отчёта вместо разговора с ребёнком («шаг 3 из 7», «ситуация»,
//      «сделай прогноз», «разберём») — словарь STOP ниже;
//   2) термины, которые в тексте появились раньше, чем их объяснили
//      («проекция», «Δ», индексы) — словарь UNEXPLAINED;
//   3) слишком тяжёлые предложения — метрики readability-cyr.
//
// Запуск:  node .lang-tools/lesson-lint.mjs <файл.tsx> [ещё файлы]
// Выход 1, если есть находки уровня error.

import { readFileSync } from "node:fs";
import * as rc from "readability-cyr";

// Слова из лексикона аудита и методички. Ребёнок так не разговаривает, и
// с ним так разговаривать не нужно.
//
// \b в JS не знает кириллицы (\w — только латиница), поэтому границы слова
// задаём просмотрами (?<![а-яё]) / (?![а-яё]).
const L = "[а-яё]";
const w = (stem, tail = `${L}*`) => new RegExp(`(?<!${L})${stem}${tail}`, "gi");

const STOP = [
  { re: w("прогноз"), why: "«прогноз» — из отчёта. Спроси прямо: «как думаешь?»" },
  { re: w("предскаж"), why: "«предскажи» — команда из методички. Лучше «что будет дальше?»" },
  { re: w("ситуаци"), why: "«ситуация» — канцелярит. Назови, что происходит: «троллейбус трогается»" },
  { re: /(?<![а-яё])шаг\s*\d+\s*(из|\/)\s*\d+/gi, why: "«шаг 3 из 7» — отчётность. Назови экран по смыслу" },
  { re: w("разбер[её]м", ""), why: "«разберём» — учительский приказ. Скажи, что делаем: «посчитаем», «посмотрим»" },
  { re: w("разобраться", ""), why: "«разобраться» — из методички. Скажи, что именно делаем" },
  { re: w("разбор"), why: "«разбор» — слово учителя. Для ученика это «как это решают»" },
  { re: /(?<![а-яё])спокойно\s+раз[а-яё]+/gi, why: "«спокойно разобраться» — успокаивающий канцелярит" },
  { re: w("проверим", ""), why: "«проверим» — оценивание. Ребёнку важнее «посмотрим, что вышло»" },
  { re: w("осуществл"), why: "канцелярит: замени на глагол действия" },
  { re: w("являетс"), why: "«является» — калька. Достаточно «это»" },
  { re: /(?<![а-яё])представляет собой/gi, why: "«представляет собой» — калька. Достаточно «это»" },
  { re: w("необходимо", ""), why: "«необходимо» — приказ. Скажи «нужно»" },
  { re: /(?<![а-яё])таким образом|(?<![а-яё])следовательно/gi, why: "связка из реферата. Достаточно «значит» или ничего" },
  { re: w("корректн"), why: "лексика аудита в учебном тексте" },
  { re: w("фиксиру"), why: "«фиксирует» — из протокола. Скажи «показывает», «отмечает»" },
  { re: w("усво"), why: "«усвоить» — язык отчёта об успеваемости" },
  { re: w("понятие"), why: "«понятие» — из учебника для учителей. Просто назови вещь" },
  { re: w("наблюдени"), why: "«наблюдение» звучит как лабораторный протокол" },
  { re: w("художествен"), why: "«художественная сцена» — слово из ТЗ, не из урока" },
];

// Термины, которые нельзя показывать раньше, чем в тексте есть их
// человеческое объяснение (проверяем: рядом встречается пояснение).
const UNEXPLAINED = [
  {
    re: /проекци\w+/gi,
    needs: /вдоль оси|со знаком|направлени/i,
    why: "«проекция» без объяснения. Для 7–9 класса это «скорость вдоль оси, со знаком»",
  },
  {
    re: /\\Delta(?!\s*—)/g,
    needs: /измен|насколько|прибав/i,
    why: "Δ без расшифровки. Скажи: «Δ значит „насколько изменилось“»",
  },
  {
    re: /v_\{?0/g,
    needs: /в самом начале|в начале|сначала|нулик|значок/i,
    why: "индекс 0 без объяснения. Скажи: «нолик внизу — это „в самом начале“»",
  },
];

function sentences(text) {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Из .tsx достаём только то, что видит ученик: строки в кавычках и текст
// между тегами. Классы Tailwind и код пропускаем.
function extractProse(source) {
  const chunks = [];
  const stringRe = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  for (const m of source.matchAll(stringRe)) {
    const value = m[1] ?? m[2] ?? "";
    if (!/[а-яё]/i.test(value)) continue;
    if (/^[\w\s./#-]+$/.test(value) && !/\s[а-яё]/i.test(value)) continue;
    // Отбрасываем строки классов вида "mt-4 text-white/70 …"
    if (/(^|\s)(text|bg|border|mt|mb|px|py|flex|grid|rounded|absolute|relative)-/.test(value)) continue;
    chunks.push(value);
  }
  const jsxTextRe = />([^<>{}]+)</g;
  for (const m of source.matchAll(jsxTextRe)) {
    const value = m[1].trim();
    if (value.length > 2 && /[а-яё]/i.test(value)) chunks.push(value);
  }
  return chunks;
}

function lintFile(path) {
  const source = readFileSync(path, "utf8");
  const chunks = extractProse(source);
  const prose = chunks.join(" ");
  const findings = [];

  for (const chunk of chunks) {
    for (const rule of STOP) {
      for (const hit of chunk.matchAll(rule.re)) {
        findings.push({ level: "error", word: hit[0], why: rule.why, where: chunk.slice(0, 70) });
      }
    }
  }

  for (const rule of UNEXPLAINED) {
    const hits = [...prose.matchAll(rule.re)];
    if (hits.length > 0 && !rule.needs.test(prose)) {
      findings.push({ level: "error", word: hits[0][0], why: rule.why, where: "по всему файлу" });
    }
  }

  // Читаемость: считаем по связному тексту без формул.
  const plain = prose.replace(/\$[^$]*\$/g, " ").replace(/\\[a-z]+/gi, " ");
  const stats = {
    fk: rc.scoreFleschKincaidGrade(plain),
    fog: rc.scoreGunningFog(plain),
    words: rc.wordCount(plain),
  };

  // Длину меряем внутри каждой строки отдельно: соседние подписи и заголовки
  // в JSX не связаны между собой, склеивать их в одно «предложение» нельзя.
  for (const chunk of chunks) {
    const plainChunk = chunk.replace(/\$[^$]*\$/g, " ").replace(/\\[a-z]+/gi, " ");
    for (const s of sentences(plainChunk)) {
      const words = s.split(/\s+/).filter(Boolean).length;
      if (words > 16) {
        findings.push({
          level: "warn",
          word: `${words} слов`,
          why: "длинное предложение: школьник теряет мысль после ~16 слов",
          where: s.slice(0, 70),
        });
      }
    }
  }

  return { path, findings, stats };
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Укажи файлы: node .lang-tools/lesson-lint.mjs apps/web/components/learning/*.tsx");
  process.exit(2);
}

let errors = 0;
for (const file of files) {
  const { findings, stats } = lintFile(file);
  const errs = findings.filter((f) => f.level === "error");
  const warns = findings.filter((f) => f.level === "warn");
  errors += errs.length;

  console.log(`\n${file}`);
  console.log(`  читаемость: FK ${stats.fk.toFixed(1)} · Fog ${stats.fog.toFixed(1)} · слов ${stats.words}`);
  for (const f of errs) console.log(`  ✗ «${f.word}» — ${f.why}\n      ${f.where}…`);
  for (const f of warns) console.log(`  · ${f.word} — ${f.why}\n      ${f.where}…`);
  if (findings.length === 0) console.log("  чисто");
}

console.log(`\nитого ошибок: ${errors}`);
process.exit(errors > 0 ? 1 : 0);
