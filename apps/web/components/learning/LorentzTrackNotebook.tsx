"use client";

import { useId, useState } from "react";
import { calculateLorentzTrack, type FieldPageDirection } from "../../lib/physics/lorentz-track-model";
import styles from "./LorentzTrackNotebook.module.css";

const ELECTRON_CHARGE = -1.6e-19;
const ELECTRON_MASS = 9.1e-31;
const PIXELS_PER_CENTIMETRE = 62;
const ORIGIN_X = 150;
const ORIGIN_Y = 165;
const format = (value: number, digits = 2) => value.toLocaleString("ru-RU", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});

function trackPath(radiusMetres: number | null, bend: "up" | "down" | "straight") {
  if (radiusMetres === null || bend === "straight") return `M${ORIGIN_X} ${ORIGIN_Y}H340`;
  const radius = radiusMetres * 100 * PIXELS_PER_CENTIMETRE;
  const direction = bend === "down" ? 1 : -1;
  return Array.from({ length: 33 }, (_, index) => {
    const angle = index / 32 * Math.PI / 2;
    const x = ORIGIN_X + radius * Math.sin(angle);
    const y = ORIGIN_Y + direction * radius * (1 - Math.cos(angle));
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

export function LorentzTrackNotebook() {
  const headingId = useId();
  const [fieldMilliTeslas, setFieldMilliTeslas] = useState<0 | 1 | 2>(1);
  const [speedMillions, setSpeedMillions] = useState<2 | 4>(2);
  const [fieldDirection, setFieldDirection] = useState<FieldPageDirection>("into-page");
  const reading = calculateLorentzTrack({
    magneticInductionTeslas: fieldMilliTeslas / 1000,
    speedMetresPerSecond: speedMillions * 1e6,
    chargeCoulombs: ELECTRON_CHARGE,
    massKilograms: ELECTRON_MASS,
    fieldDirection,
  });
  const radiusCentimetres = reading.radiusMetres === null ? null : reading.radiusMetres * 100;
  const observation = fieldMilliTeslas === 0
    ? "Поля нет: магнитная сила равна нулю, электрон движется прямо."
    : `Поле направлено ${fieldDirection === "into-page" ? "от тебя, за плоскость страницы" : "к тебе, из плоскости страницы"}. Электрон отклоняется ${reading.bend === "down" ? "вниз" : "вверх"}.`;

  return <section className={styles.notebook} aria-labelledby={headingId}>
    <header className={styles.heading}>
      <span>Траектория в блокноте</span>
      <h2 id={headingId}>Поле поворачивает, но не разгоняет.</h2>
      <p>Электрон влетает вправо, поперёк однородного магнитного поля. Измени одно условие и проследи первый поворот.</p>
    </header>
    <div className={styles.experiment}>
      <div className={styles.controls} aria-label="Условия модели">
        <fieldset>
          <legend>Индукция B</legend>
          <div className={styles.choices}>{([0, 1, 2] as const).map(value =>
            <button key={value} type="button" aria-pressed={fieldMilliTeslas === value} onClick={() => setFieldMilliTeslas(value)}>{value} мТл</button>
          )}</div>
        </fieldset>
        <fieldset>
          <legend>Начальная скорость v</legend>
          <div className={styles.choices}>{([2, 4] as const).map(value =>
            <button key={value} type="button" aria-pressed={speedMillions === value} onClick={() => setSpeedMillions(value)}>{value} · 10⁶ м/с</button>
          )}</div>
        </fieldset>
        <fieldset>
          <legend>Направление поля</legend>
          <div className={styles.choices}>
            <button type="button" aria-pressed={fieldDirection === "into-page"} onClick={() => setFieldDirection("into-page")} disabled={fieldMilliTeslas === 0}>× от тебя</button>
            <button type="button" aria-pressed={fieldDirection === "out-of-page"} onClick={() => setFieldDirection("out-of-page")} disabled={fieldMilliTeslas === 0}>• к тебе</button>
          </div>
        </fieldset>
      </div>
      <figure className={styles.scene}>
        <div className={styles.sceneHeading}><strong>След электрона</strong><span>Масштаб не меняется</span></div>
        <svg viewBox="0 0 440 330" role="img" aria-label={radiusCentimetres === null
          ? "Электрон движется вправо по прямой. Один сантиметр соответствует делению масштабной линии."
          : `Электрон движется вправо и отклоняется ${reading.bend === "down" ? "вниз" : "вверх"} по окружности радиуса ${format(radiusCentimetres)} сантиметра. Масштаб один сантиметр.`}>
          <path d="M150 165H350" className={styles.reference} />
          <path d={trackPath(reading.radiusMetres, reading.bend)} className={styles.track} />
          <circle cx={ORIGIN_X} cy={ORIGIN_Y} r="6" className={styles.electron} />
          <path d="M152 145H197m-9-7 9 7-9 7" className={styles.velocity} />
          {reading.bend !== "straight" && <path d={reading.bend === "down"
            ? "M131 174V218m-7-9 7 9 7-9"
            : "M131 156V112m-7 9 7-9 7 9"} className={styles.force} />}
          <path d="M302 292h62m-62-5v10m62-10v10" className={styles.scale} />
        </svg>
        <div className={styles.diagramKey}><span>v → вход</span><span>{fieldMilliTeslas === 0 ? "F = 0" : `F ${reading.bend === "down" ? "↓" : "↑"} поворот`}</span><span>{fieldMilliTeslas === 0 ? "B = 0" : fieldDirection === "into-page" ? "× B за страницу" : "• B из страницы"}</span><span>1 см на шкале</span></div>
        <figcaption>{fieldMilliTeslas === 0
          ? "Без поля след прямой. Пунктир совпадает с направлением движения."
          : "Начальный участок круговой траектории при v ⟂ B. Пунктир — направление без поля."}</figcaption>
      </figure>
      <div className={styles.finding}>
        <p className={styles.status} role="status">{observation} {radiusCentimetres === null ? "Радиуса и периода обращения нет." : `Радиус ${format(radiusCentimetres)} сантиметра.`}</p>
        <div className={styles.mainReading}><span>Радиус поворота</span><output>{radiusCentimetres === null ? "—" : format(radiusCentimetres)} <small>{radiusCentimetres === null ? "" : "см"}</small></output></div>
        <dl className={styles.otherReadings}>
          <div><dt>Сила Лоренца</dt><dd>{format(reading.forceMagnitudeNewtons * 1e15)} фН</dd></div>
          <div><dt>Период полного оборота</dt><dd>{reading.periodSeconds === null ? "—" : `${format(reading.periodSeconds * 1e9, 1)} нс`}</dd></div>
          <div><dt>Модуль скорости</dt><dd>{speedMillions} · 10⁶ м/с</dd></div>
        </dl>
        <p className={styles.takeaway}>{fieldMilliTeslas === 0 ? "Без поля траектория прямая." : "Сила направлена поперёк скорости: направление меняется, а модуль скорости — нет."}</p>
      </div>
    </div>
    <p className={styles.boundary}>Модель: свободный электрон, однородное поле строго поперёк начальной скорости, без электрического поля и столкновений. Это расчётный след, а не изображение реальной электронной трубки. Движение при входе под другим углом здесь не показано.</p>
  </section>;
}
