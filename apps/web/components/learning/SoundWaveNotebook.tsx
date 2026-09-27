"use client";

import { useState } from "react";
import styles from "./SoundWaveNotebook.module.css";

const FREQUENCIES_HZ = [220, 440, 880] as const;
const AMPLITUDES = [0.5, 1] as const;
const WINDOW_SECONDS = 0.01;
const OVERTONE_AMPLITUDES = [1, 0.45, 0.22] as const;
const GRAPH = { left: 48, right: 612, center: 96, waveScale: 44 } as const;

function makeSignal(frequencyHz: number, amplitude: number, hasOvertones: boolean) {
  const components = hasOvertones ? OVERTONE_AMPLITUDES : [1];
  const points = Array.from({ length: 481 }, (_, index) => {
    const progress = index / 480;
    const time = progress * WINDOW_SECONDS;
    const x = GRAPH.left + progress * (GRAPH.right - GRAPH.left);
    const pressureChange = amplitude * components.reduce((sum, relativeAmplitude, componentIndex) => (
      sum + relativeAmplitude * Math.sin(2 * Math.PI * frequencyHz * (componentIndex + 1) * time)
    ), 0);
    const y = GRAPH.center - pressureChange * GRAPH.waveScale;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  return points.join(" ");
}

function formatHz(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function SoundWaveNotebook() {
  const [frequencyHz, setFrequencyHz] = useState<(typeof FREQUENCIES_HZ)[number]>(440);
  const [amplitude, setAmplitude] = useState<(typeof AMPLITUDES)[number]>(0.5);
  const [hasOvertones, setHasOvertones] = useState(false);
  const signal = makeSignal(frequencyHz, amplitude, hasOvertones);
  const amplitudeLabel = amplitude === 1 ? "вдвое больше" : "исходная";
  const spectrumComponents = hasOvertones
    ? OVERTONE_AMPLITUDES.map((relativeAmplitude, index) => ({ order: index + 1, relativeAmplitude }))
    : [{ order: 1, relativeAmplitude: 1 }];
  const spectrumSummary = hasOvertones
    ? `К основному тону ${frequencyHz} Гц добавлены частоты ${formatHz(frequencyHz * 2)} и ${formatHz(frequencyHz * 3)} Гц.`
    : `Один основной тон: ${frequencyHz} Гц.`;

  return (
    <section className={styles.notebook} aria-labelledby="sound-wave-title">
      <header className={styles.heading}>
        <span>Звуковая волна · точка в воздухе</span>
        <h2 id="sound-wave-title">Сравни частоту и амплитуду</h2>
        <p>Сравни давление воздуха во времени. Меняй по одной величине, чтобы увидеть её отдельный эффект.</p>
      </header>

      <figure className={styles.graph}>
        <svg viewBox="0 0 640 216" role="img" aria-labelledby="sound-graph-title sound-graph-description">
          <title id="sound-graph-title">Изменение давления воздуха при звуковых колебаниях</title>
          <desc id="sound-graph-description">
            За 10 миллисекунд показано {frequencyHz} колебаний в секунду. {spectrumSummary} Амплитуда выбрана: {amplitudeLabel}.
          </desc>
          {[48, 330, 612].map((x) => <line key={x} x1={x} x2={x} y1="18" y2="174" className={styles.grid} />)}
          <line x1={GRAPH.left} x2={GRAPH.right} y1={GRAPH.center} y2={GRAPH.center} className={styles.axis} />
          <line x1={GRAPH.left} x2={GRAPH.left} y1="18" y2="174" className={styles.axis} />
          <path d={signal} className={styles.signal} />
          <text x="48" y="199" textAnchor="middle" className={styles.tick}>0</text>
          <text x="330" y="199" textAnchor="middle" className={styles.tick}>5</text>
          <text x="612" y="199" textAnchor="middle" className={styles.tick}>10 мс</text>
          <text x="48" y="13" className={styles.axisLabel}>изменение давления · условные единицы</text>
        </svg>
        <figcaption>Один и тот же интервал времени: число повторений показывает частоту, высота волны — амплитуду давления.</figcaption>
      </figure>

      <figure className={styles.spectrum}>
        <div className={styles.spectrumHeading}>
          <h3>Спектр этого звука</h3>
          <p>Каждая линия — одна частота; высота линии показывает её относительную амплитуду.</p>
        </div>
        <svg viewBox="0 0 640 174" role="img" aria-labelledby="sound-spectrum-title sound-spectrum-description">
          <title id="sound-spectrum-title">Составляющие частоты в спектре звука</title>
          <desc id="sound-spectrum-description">
            {hasOvertones
              ? `Основная частота ${frequencyHz} герц; обертоны ${frequencyHz * 2} и ${frequencyHz * 3} герц с относительными амплитудами 0,45 и 0,22.`
              : `Чистый тон с одной составляющей частотой ${frequencyHz} герц.`}
          </desc>
          {[48, 236, 424, 612].map((x) => <line key={x} x1={x} x2={x} y1="32" y2="132" className={styles.grid} />)}
          <line x1={GRAPH.left} x2={GRAPH.right} y1="132" y2="132" className={styles.axis} />
          <text x="48" y="22" className={styles.axisLabel}>относительная амплитуда</text>
          {spectrumComponents.map(({ order, relativeAmplitude }) => {
            const x = GRAPH.left + (order / 3) * (GRAPH.right - GRAPH.left);
            const height = amplitude * relativeAmplitude * 64;
            const labelAnchor = order === 3 ? "end" : "middle";
            return (
              <g key={order}>
                <line x1={x} x2={x} y1={132 - height} y2="132" className={styles.component} />
                <circle cx={x} cy={132 - height} r="4" className={styles.componentDot} />
                <text x={x} y={132 - height - 8} textAnchor={labelAnchor} className={styles.tick}>
                  {formatHz(frequencyHz * order)} Гц
                </text>
              </g>
            );
          })}
          <text x="48" y="153" textAnchor="middle" className={styles.tick}>0</text>
          <text x="236" y="153" textAnchor="middle" className={styles.tick}>f₀</text>
          <text x="424" y="153" textAnchor="middle" className={styles.tick}>2f₀</text>
          <text x="612" y="153" textAnchor="end" className={styles.tick}>3f₀</text>
          <text x="612" y="170" textAnchor="end" className={styles.axisLabel}>частота →</text>
        </svg>
        <figcaption>
          {hasOvertones
            ? `Основной тон ${frequencyHz} Гц остаётся самым сильным. Более слабые составляющие ${formatHz(frequencyHz * 2)} и ${formatHz(frequencyHz * 3)} Гц меняют форму волны и тембр.`
            : `В чистом тоне есть только основная составляющая ${frequencyHz} Гц; спектр показан одной линией.`}
        </figcaption>
      </figure>

      <div className={styles.controls}>
        <fieldset>
          <legend>Частота колебаний</legend>
          <div className={styles.options}>
            {FREQUENCIES_HZ.map((value) => (
              <button key={value} type="button" aria-pressed={frequencyHz === value} onClick={() => setFrequencyHz(value)}>
                {value} Гц
              </button>
            ))}
          </div>
          <p>Больше герц — выше тон.</p>
        </fieldset>

        <fieldset>
          <legend>Амплитуда при той же частоте</legend>
          <div className={styles.options}>
            {AMPLITUDES.map((value) => (
              <button key={value} type="button" aria-pressed={amplitude === value} onClick={() => setAmplitude(value)}>
                {value === 1 ? "В 2 раза больше" : "Обычная"}
              </button>
            ))}
          </div>
          <p>В одинаковых условиях большая амплитуда связана с большей интенсивностью звука.</p>
        </fieldset>

        <fieldset>
          <legend>Состав звука</legend>
          <div className={styles.options}>
            <button type="button" aria-pressed={!hasOvertones} onClick={() => setHasOvertones(false)}>
              Только основной тон
            </button>
            <button type="button" aria-pressed={hasOvertones} onClick={() => setHasOvertones(true)}>
              Добавить обертоны
            </button>
          </div>
          <p>Обертоны — дополнительные составляющие выше основной частоты.</p>
        </fieldset>
      </div>

      <p className={styles.conclusion} aria-live="polite">
        Основной тон: {frequencyHz} Гц; амплитуда {amplitudeLabel}. {hasOvertones
          ? "Обертоны меняют форму волны, но основная частота сохраняется — меняется тембр."
          : "В спектре только одна частота: чистый тон без обертонов."}
      </p>
      <p className={styles.boundary}>
        Это модель давления воздуха в условных единицах, не запись инструмента и не измеритель громкости в децибелах. Реальный тембр зависит от состава спектра; слух по-разному чувствителен к разным частотам. Звук как механическая волна не распространяется в вакууме.
      </p>
    </section>
  );
}
