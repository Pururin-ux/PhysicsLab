// «Школьные» деления осей: шаг всегда из ряда 1–2–5·10ⁿ, как на графиках в
// учебниках, а не (max − min)/n с хвостами вида 5.6/11.2/16.8. Подписи — с
// десятичной запятой (белорусская/русская типографика).

export type NiceTick = { value: number };

const NICE_STEPS = [1, 2, 2.5, 5, 10] as const;

// Ближайший «красивый» шаг не меньше rawStep. 2.5 оставляем только когда без
// него делений слишком мало (шаг 25 при диапазоне 0–100 — норма для школы).
export function niceStep(rawStep: number): number {
  if (!Number.isFinite(rawStep) || rawStep <= 0) {
    return 1;
  }

  const power = Math.floor(Math.log10(rawStep));
  const magnitude = 10 ** power;
  const normalized = rawStep / magnitude;

  for (const candidate of NICE_STEPS) {
    if (candidate >= normalized - 1e-9) {
      return candidate * magnitude;
    }
  }

  return 10 * magnitude;
}

// Деления по «красивому» шагу внутри диапазона. Начало диапазона (обычно 0)
// всегда получает деление; конец — только если попадает на шаг.
export function niceTicks(
  range: [number, number],
  targetCount = 5,
): NiceTick[] {
  const [rawMin, rawMax] = range;
  const min = Math.min(rawMin, rawMax);
  const max = Math.max(rawMin, rawMax);

  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) {
    return [{ value: min }, { value: max }];
  }

  const step = niceStep((max - min) / Math.max(1, targetCount));
  const first = Math.ceil((min - 1e-9) / step) * step;
  const ticks: NiceTick[] = [];

  for (let value = first; value <= max + 1e-9; value += step) {
    // Гасим накопление плавающей точки (0.30000000000000004 → 0.3).
    ticks.push({ value: Math.round(value / step) * step });
  }

  if (ticks.length === 0 || Math.abs(ticks[0].value - min) > 1e-9) {
    ticks.unshift({ value: min });
  }

  return ticks;
}

// Число для подписи оси: без хвостовых нулей, с запятой («2,5», а не «2.5»).
export function formatTickValue(value: number): string {
  if (!Number.isFinite(value)) {
    return "";
  }

  const normalized = Object.is(value, -0) ? 0 : value;
  const text = Math.abs(normalized - Math.round(normalized)) < 1e-9
    ? String(Math.round(normalized))
    : String(Number(normalized.toFixed(2)));

  return text.replace(".", ",");
}
