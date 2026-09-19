"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./OpticsNotebook.module.css";

const MIRROR_DISTANCES = [20, 35, 50] as const;
const INCIDENCE_ANGLES = [0, 20, 35] as const;

type RefractionDirection = "air-to-water" | "water-to-air";

function pointFromAngle(cx: number, cy: number, radius: number, angleDeg: number) {
  const angle = angleDeg * Math.PI / 180;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function arcPath(cx: number, cy: number, radius: number, fromDeg: number, toDeg: number) {
  const start = pointFromAngle(cx, cy, radius, fromDeg);
  const end = pointFromAngle(cx, cy, radius, toDeg);
  const largeArc = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  const sweep = toDeg >= fromDeg ? 1 : 0;
  return `M${start.x} ${start.y}A${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function MirrorDiagram({ distance }: { distance: number }) {
  const mirrorX = 380;
  const distancePx = 80 + distance * 2.8;
  const objectX = mirrorX - distancePx;
  const imageX = mirrorX + distancePx;

  return (
    <svg className={styles.diagram} viewBox="0 0 760 360" role="img" aria-label={`Предмет находится в ${distance} сантиметрах перед плоским зеркалом. Его прямое мнимое изображение находится в ${distance} сантиметрах за зеркалом. Между предметом и изображением ${distance * 2} сантиметров.`}>
      <defs>
        <pattern id="mirror-hatching" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="12" className={styles.mirrorHatch} />
        </pattern>
        <marker id="object-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 10L5 0L10 10Z" className={styles.objectArrowHead} />
        </marker>
      </defs>
      <line x1="68" y1="290" x2="692" y2="290" className={styles.tableLine} />
      <rect x={mirrorX - 9} y="48" width="18" height="242" fill="url(#mirror-hatching)" className={styles.mirror} />
      <line x1={objectX} y1="286" x2={objectX} y2="142" className={styles.objectArrow} markerEnd="url(#object-arrow)" />
      <line x1={imageX} y1="286" x2={imageX} y2="142" className={styles.imageArrow} markerEnd="url(#object-arrow)" />
      <text x={objectX} y="326" textAnchor="middle" className={styles.diagramLabel}>предмет</text>
      <text x={imageX} y="326" textAnchor="middle" className={styles.diagramLabel}>мнимое изображение</text>
      <text x={mirrorX} y="30" textAnchor="middle" className={styles.diagramLabel}>зеркало</text>
      <g className={styles.measureLine}>
        <line x1={objectX} y1="110" x2={mirrorX} y2="110" />
        <line x1={objectX} y1="101" x2={objectX} y2="119" />
        <line x1={mirrorX} y1="101" x2={mirrorX} y2="119" />
        <text x={(objectX + mirrorX) / 2} y="98" textAnchor="middle">d = {distance} см</text>
      </g>
      <g className={styles.measureLine}>
        <line x1={mirrorX} y1="110" x2={imageX} y2="110" />
        <line x1={imageX} y1="101" x2={imageX} y2="119" />
        <text x={(imageX + mirrorX) / 2} y="98" textAnchor="middle">d = {distance} см</text>
      </g>
    </svg>
  );
}

export function PlaneMirrorNotebook() {
  const [distance, setDistance] = useState<(typeof MIRROR_DISTANCES)[number]>(35);

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Симметрия относительно зеркала</p>
        <h2>Изображение видно за зеркалом. Есть ли оно там?</h2>
        <span>Передвигай предмет. Зеркало остаётся на месте, а схема показывает, где глаз видит мнимое изображение.</span>
      </header>

      <div className={styles.choiceRow} aria-label="Расстояние от предмета до зеркала">
        {MIRROR_DISTANCES.map(value => (
          <button key={value} type="button" aria-pressed={distance === value} onClick={() => setDistance(value)}>{value} см</button>
        ))}
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Положение предмета</span>
            <strong>{distance} см перед зеркалом</strong>
          </div>
          <MirrorDiagram distance={distance} />
        </section>

        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div>
            <span>Что сохраняется</span>
            <p>Изображение прямое, равное предмету по размеру и находится на таком же расстоянии за зеркалом.</p>
          </div>
          <div className={styles.resultNote}>
            <span>Расстояние предмет — изображение</span>
            <strong>{distance} см + {distance} см = {distance * 2} см</strong>
            <p>Зеркало делит этот отрезок пополам: <b>L = 2d</b>.</p>
          </div>
          <div className={styles.mioNote}>
            <Image src="/images/mio/mio-skeptical-v1.png" alt="" width={220} height={220} sizes="(max-width: 760px) 104px, 142px" />
            <p><b>Проверка Мио</b>«Отодвину предмет на 10 см — изображение тоже отойдёт на 10 см. Между ними прибавится 20 см».</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>За зеркалом нет светящегося предмета и туда не проходят отражённые лучи. Глаз продолжает их назад и видит точку, из которой они как будто выходят.</p>
    </div>
  );
}

function RefractionDiagram({ direction, incidence, measuring }: {
  direction: RefractionDirection;
  incidence: number;
  measuring: boolean;
}) {
  const airToWater = direction === "air-to-water";
  const n1 = airToWater ? 1 : 1.33;
  const n2 = airToWater ? 1.33 : 1;
  const refracted = incidence === 0 ? 0 : Math.asin((n1 / n2) * Math.sin(incidence * Math.PI / 180)) * 180 / Math.PI;
  const rounded = Math.round(refracted);
  const cx = 380;
  const cy = 210;
  const incidentStart = airToWater
    ? pointFromAngle(cx, cy, 170, -90 - incidence)
    : pointFromAngle(cx, cy, 150, 90 + incidence);
  const refractedEnd = airToWater
    ? pointFromAngle(cx, cy, 150, 90 - refracted)
    : pointFromAngle(cx, cy, 170, -90 + refracted);
  const incidentArc = airToWater ? arcPath(cx, cy, 62, -90 - incidence, -90) : arcPath(cx, cy, 62, 90, 90 + incidence);
  const refractedArc = airToWater ? arcPath(cx, cy, 54, 90 - refracted, 90) : arcPath(cx, cy, 54, -90, -90 + refracted);
  const relation = incidence === 0 ? "луч идёт по нормали и не меняет направление" : airToWater ? "луч отклоняется к нормали" : "луч отклоняется от нормали";

  return (
    <svg className={styles.diagram} viewBox="0 0 760 420" role="img" aria-label={`Луч переходит ${airToWater ? "из воздуха в воду" : "из воды в воздух"}. Угол падения ${incidence} градусов, угол преломления примерно ${rounded} градусов; ${relation}.`}>
      <defs>
        <marker id="ray-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10Z" className={styles.rayArrowHead} />
        </marker>
      </defs>
      <rect x="32" y="32" width="696" height="178" className={airToWater ? styles.airMedium : styles.waterMedium} />
      <rect x="32" y="210" width="696" height="178" className={airToWater ? styles.waterMedium : styles.airMedium} />
      <line x1="32" y1={cy} x2="728" y2={cy} className={styles.boundary} />
      <line x1={cx} y1="34" x2={cx} y2="388" className={styles.normal} />
      <text x="54" y="64" className={styles.mediumLabel}>{airToWater ? "воздух" : "вода"}</text>
      <text x="54" y="246" className={styles.mediumLabel}>{airToWater ? "вода" : "воздух"}</text>
      <text x={cx + 10} y="54" className={styles.normalLabel}>нормаль</text>
      <path d={`M${incidentStart.x} ${incidentStart.y}L${cx} ${cy}`} className={styles.incidentRay} markerEnd="url(#ray-arrow)" />
      <path d={`M${cx} ${cy}L${refractedEnd.x} ${refractedEnd.y}`} className={styles.refractedRay} markerEnd="url(#ray-arrow)" />
      <circle cx={cx} cy={cy} r="5" className={styles.impactPoint} />
      {measuring && (
        <g className={styles.measurementLens}>
          <circle cx={cx} cy={cy} r="82" />
          {incidence > 0 && <path d={incidentArc} />}
          {refracted > 0 && <path d={refractedArc} />}
          <text x={airToWater ? cx - 78 : cx - 82} y={airToWater ? cy - 48 : cy + 62}>α = {incidence}°</text>
          <text x={cx + 45} y={airToWater ? cy + 62 : cy - 48}>γ ≈ {rounded}°</text>
        </g>
      )}
    </svg>
  );
}

export function RefractionMeasurementLens() {
  const [direction, setDirection] = useState<RefractionDirection>("air-to-water");
  const [incidence, setIncidence] = useState<(typeof INCIDENCE_ANGLES)[number]>(35);
  const [measuring, setMeasuring] = useState(true);
  const denserSecond = direction === "air-to-water";

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Луч на границе двух сред</p>
        <h2>Почему луч поворачивает у поверхности воды?</h2>
        <span>Меняй направление перехода и угол падения. Измерительная линза показывает углы только у точки, где луч встречает границу.</span>
      </header>

      <div className={styles.controlDeck}>
        <div className={styles.choiceRow} aria-label="Направление перехода света">
          <button type="button" aria-pressed={direction === "air-to-water"} onClick={() => setDirection("air-to-water")}>Воздух → вода</button>
          <button type="button" aria-pressed={direction === "water-to-air"} onClick={() => setDirection("water-to-air")}>Вода → воздух</button>
        </div>
        <div className={styles.choiceRow} aria-label="Угол падения">
          {INCIDENCE_ANGLES.map(value => <button key={value} type="button" aria-pressed={incidence === value} onClick={() => setIncidence(value)}>{value}°</button>)}
        </div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Наблюдение</span>
            <strong>{incidence === 0 ? "Падение по нормали" : denserSecond ? "Переход в оптически более плотную среду" : "Переход в оптически менее плотную среду"}</strong>
          </div>
          <RefractionDiagram direction={direction} incidence={incidence} measuring={measuring} />
          <button className={styles.measureButton} type="button" aria-pressed={measuring} onClick={() => setMeasuring(value => !value)}>{measuring ? "Убрать измерения" : "Измерить углы"}</button>
        </section>

        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div>
            <span>Что сравниваем</span>
            <p>Оба угла отсчитываются от нормали, проведённой перпендикулярно границе сред.</p>
          </div>
          <div className={styles.resultNote}>
            <span>Результат</span>
            <strong>{incidence === 0 ? "Направление не меняется" : denserSecond ? "Угол преломления меньше" : "Угол преломления больше"}</strong>
            <p>{incidence === 0 ? "Особый случай: α = 0°, поэтому луч продолжает идти по той же прямой." : denserSecond ? "В воде свет распространяется медленнее, и луч отклоняется к нормали." : "При выходе в воздух луч отклоняется от нормали. Ход лучей обратим."}</p>
          </div>
          <div className={styles.fieldNote}>
            <span>Действие Мио</span>
            <p>Мио не двигает линзу по всей странице: она прикладывает её к точке падения и сравнивает только α и γ.</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>На границе часть света может отразиться, а часть — перейти во вторую среду. Эта модель показывает путь прошедшего луча; яркость пучков здесь не сравнивается.</p>
    </div>
  );
}
