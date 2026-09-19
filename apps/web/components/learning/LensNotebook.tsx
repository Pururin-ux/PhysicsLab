"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./LensNotebook.module.css";

const FOCAL_LENGTHS = [0.2, 0.25, 0.5] as const;
type LensType = "converging" | "diverging";
type ImageCase = "far" | "double" | "between" | "inside";
type VisionDefect = "myopia" | "hyperopia";

const IMAGE_CASES: Record<ImageCase, {
  label: string;
  distanceInF: number;
  result: string;
  detail: string;
}> = {
  far: {
    label: "Дальше 2F",
    distanceInF: 3,
    result: "Уменьшенное, перевёрнутое, действительное",
    detail: "Изображение возникает между F и 2F. Его можно получить на экране.",
  },
  double: {
    label: "Ровно 2F",
    distanceInF: 2,
    result: "Равное предмету, перевёрнутое, действительное",
    detail: "Изображение находится в 2F по другую сторону линзы.",
  },
  between: {
    label: "Между F и 2F",
    distanceInF: 1.5,
    result: "Увеличенное, перевёрнутое, действительное",
    detail: "Экран приходится отодвинуть дальше 2F.",
  },
  inside: {
    label: "Ближе F",
    distanceInF: 0.5,
    result: "Увеличенное, прямое, мнимое",
    detail: "Лучи за линзой расходятся. Глаз видит пересечение их продолжений перед линзой.",
  },
};

function signed(value: number) {
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toLocaleString("ru-RU", { maximumFractionDigits: 1 })}`;
}

function LensFocusDiagram({ type, focalLength }: { type: LensType; focalLength: number }) {
  const markerId = useId().replaceAll(":", "");
  const converging = type === "converging";
  const lensX = 380;
  const focusOffset = focalLength === 0.2 ? 96 : focalLength === 0.25 ? 124 : 214;
  const focusX = lensX + (converging ? focusOffset : -focusOffset);
  const outgoingX = 706;
  const rayYs = [137, 195, 253];

  return (
    <svg className={styles.diagram} viewBox="0 0 760 390" role="img" aria-label={`${converging ? "Собирающая" : "Рассеивающая"} линза с фокусным расстоянием ${focalLength} метра. ${converging ? "Параллельные лучи сходятся в действительном фокусе справа от линзы." : "Параллельные лучи расходятся, а их продолжения пересекаются в мнимом фокусе слева от линзы."}`}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10Z" className={styles.rayArrowHead} />
        </marker>
      </defs>
      <line x1="46" y1="195" x2="720" y2="195" className={styles.axis} />
      <g className={styles.rayBox}>
        <rect x="48" y="96" width="54" height="198" rx="8" />
        <path d="M60 112h30v166H60zM102 137h12M102 195h12M102 253h12" />
        <text x="75" y="324" textAnchor="middle">источник</text>
      </g>
      {rayYs.map((y) => {
        const targetY = converging
          ? 195 + (outgoingX - focusX) * (195 - y) / (focusX - lensX)
          : 195 + (outgoingX - lensX) * (y - 195) / (lensX - focusX);
        return (
          <g key={y}>
            <path d={`M114 ${y}H${lensX}`} className={styles.incidentRay} markerEnd={`url(#${markerId})`} />
            <path d={`M${lensX} ${y}L${outgoingX} ${targetY}`} className={styles.refractedRay} markerEnd={`url(#${markerId})`} />
            {!converging && <path d={`M${focusX} 195L${lensX} ${y}`} className={styles.extensionRay} />}
          </g>
        );
      })}
      <path d={converging ? "M367 72Q380 195 367 318M393 72Q380 195 393 318" : "M393 72Q380 195 393 318M367 72Q380 195 367 318"} className={styles.lensShape} />
      <line x1={focusX} y1="177" x2={focusX} y2="213" className={styles.focusTick} />
      <circle cx={focusX} cy="195" r="6" className={styles.focusPoint} />
      <text x={focusX} y="235" textAnchor="middle" className={styles.diagramLabel}>{converging ? "F · действительный" : "F · мнимый"}</text>
      {converging && (
        <g className={styles.screen}>
          <line x1={focusX} y1="105" x2={focusX} y2="286" />
          <path d={`M${focusX - 24} 300h48M${focusX} 286v14`} />
          <text x={focusX} y="330" textAnchor="middle">экран в фокусе</text>
        </g>
      )}
      <g className={styles.measureLine}>
        <line x1={lensX} y1="348" x2={focusX} y2="348" />
        <line x1={lensX} y1="340" x2={lensX} y2="356" />
        <line x1={focusX} y1="340" x2={focusX} y2="356" />
        <text x={(lensX + focusX) / 2} y="376" textAnchor="middle">F = {converging ? "" : "−"}{String(focalLength).replace(".", ",")} м</text>
      </g>
    </svg>
  );
}

export function LensFocusLab() {
  const [type, setType] = useState<LensType>("converging");
  const [focalLength, setFocalLength] = useState<(typeof FOCAL_LENGTHS)[number]>(0.25);
  const power = (type === "converging" ? 1 : -1) / focalLength;

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лабораторная установка</p>
        <h2>Где параллельные лучи встретятся после линзы?</h2>
        <span>Мио меняет линзу, передвигает экран и измеряет расстояние от оптического центра до фокуса.</span>
      </header>

      <div className={styles.controlDeck}>
        <div className={styles.choiceRow} aria-label="Тип линзы">
          <button type="button" aria-pressed={type === "converging"} onClick={() => setType("converging")}>Собирающая</button>
          <button type="button" aria-pressed={type === "diverging"} onClick={() => setType("diverging")}>Рассеивающая</button>
        </div>
        <div className={styles.choiceRow} aria-label="Фокусное расстояние">
          {FOCAL_LENGTHS.map(value => (
            <button key={value} type="button" aria-pressed={focalLength === value} onClick={() => setFocalLength(value)}>F = {type === "converging" ? "" : "−"}{String(value).replace(".", ",")} м</button>
          ))}
        </div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Ход параллельного пучка</span>
            <strong>{type === "converging" ? "Лучи сходятся в действительном фокусе" : "Расходятся так, будто вышли из мнимого фокуса"}</strong>
          </div>
          <LensFocusDiagram type={type} focalLength={focalLength} />
        </section>

        <aside className={styles.notes} aria-label="Измерение и вывод">
          <div className={styles.resultNote}>
            <span>Измерение</span>
            <strong>D = 1 / F = {signed(power)} дптр</strong>
            <p>Фокусное расстояние подставляем в метрах. У рассеивающей линзы F и D отрицательны.</p>
          </div>
          <div>
            <span>Что меняется</span>
            <p>Чем меньше модуль F, тем сильнее линза поворачивает лучи и тем больше модуль её оптической силы.</p>
          </div>
          <div className={styles.mioNote}>
            <Image src="/images/mio/mio-skeptical-v1.png" alt="" width={220} height={220} sizes="(max-width: 760px) 108px, 142px" />
            <p><b>Действие Мио</b>У собирающей линзы она ловит резкую световую точку экраном. У рассеивающей — продолжает лучи назад на чертеже.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function lineYAt(x1: number, y1: number, x2: number, y2: number, x: number) {
  return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
}

function ThinLensDiagram({ imageCase }: { imageCase: ImageCase }) {
  const markerId = useId().replaceAll(":", "");
  const axisY = 205;
  const lensX = 400;
  const focalPx = 104;
  const distanceInF = IMAGE_CASES[imageCase].distanceInF;
  const isVirtual = imageCase === "inside";
  const objectX = lensX - distanceInF * focalPx;
  const objectTopY = isVirtual ? 131 : 105;
  const imageDistanceInF = distanceInF / (distanceInF - 1);
  const imageX = lensX + imageDistanceInF * focalPx;
  const magnification = -imageDistanceInF / distanceInF;
  const imageTopY = axisY - (axisY - objectTopY) * magnification;
  const rightX = 774;
  const focusRightX = lensX + focalPx;
  const rayOneRightY = lineYAt(lensX, objectTopY, focusRightX, axisY, rightX);
  const rayTwoRightY = lineYAt(objectX, objectTopY, lensX, axisY, rightX);

  return (
    <svg className={styles.diagram} viewBox="0 0 800 430" role="img" aria-label={`Предмет находится ${IMAGE_CASES[imageCase].label.toLowerCase()} собирающей линзы. Получается ${IMAGE_CASES[imageCase].result.toLowerCase()} изображение.`}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10Z" className={styles.rayArrowHead} />
        </marker>
        <marker id={`${markerId}-object`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 10L5 0L10 10Z" className={styles.objectArrowHead} />
        </marker>
      </defs>
      <line x1="24" y1={axisY} x2="780" y2={axisY} className={styles.axis} />
      {[-2, -1, 1, 2].map(mark => {
        const x = lensX + mark * focalPx;
        return <g key={mark} className={styles.axisMark}><line x1={x} y1={axisY - 10} x2={x} y2={axisY + 10} /><text x={x} y={axisY + 32} textAnchor="middle">{Math.abs(mark) === 1 ? "F" : "2F"}</text></g>;
      })}
      <path d="M387 55Q400 205 387 355M413 55Q400 205 413 355" className={styles.lensShape} />
      <line x1={objectX} y1={axisY} x2={objectX} y2={objectTopY} className={styles.objectArrow} markerEnd={`url(#${markerId}-object)`} />
      <text x={objectX} y={axisY + 55} textAnchor="middle" className={styles.diagramLabel}>предмет</text>

      <path d={`M${objectX} ${objectTopY}H${lensX}`} className={styles.incidentRay} markerEnd={`url(#${markerId})`} />
      <path d={`M${lensX} ${objectTopY}L${rightX} ${rayOneRightY}`} className={styles.refractedRay} markerEnd={`url(#${markerId})`} />
      <path d={`M${objectX} ${objectTopY}L${rightX} ${rayTwoRightY}`} className={styles.centralRay} markerEnd={`url(#${markerId})`} />

      {isVirtual ? (
        <>
          <path d={`M${imageX} ${imageTopY}L${lensX} ${objectTopY}M${imageX} ${imageTopY}L${lensX} ${axisY}`} className={styles.extensionRay} />
          <line x1={imageX} y1={axisY} x2={imageX} y2={imageTopY} className={styles.virtualImageArrow} markerEnd={`url(#${markerId}-object)`} />
          <text x={imageX} y={imageTopY - 20} textAnchor="middle" className={styles.virtualLabel}>мнимое изображение</text>
        </>
      ) : (
        <>
          <line x1={imageX} y1={axisY} x2={imageX} y2={imageTopY} className={styles.imageArrow} markerEnd={`url(#${markerId}-object)`} />
          <g className={styles.screen}>
            <line x1={imageX + 22} y1={Math.min(axisY, imageTopY) - 18} x2={imageX + 22} y2={Math.max(axisY, imageTopY) + 18} />
            <text x={imageX + 28} y="405">экран</text>
          </g>
        </>
      )}
    </svg>
  );
}

export function ThinLensImageNotebook() {
  const [imageCase, setImageCase] = useState<ImageCase>("double");
  const selected = IMAGE_CASES[imageCase];

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Пространственный чертёж</p>
        <h2>Что изменится, если передвинуть предмет?</h2>
        <span>Два опорных луча строят изображение: один после линзы идёт через фокус, второй проходит через оптический центр без поворота.</span>
      </header>

      <div className={`${styles.choiceRow} ${styles.fourChoices}`} aria-label="Положение предмета относительно фокуса">
        {(Object.keys(IMAGE_CASES) as ImageCase[]).map(key => (
          <button key={key} type="button" aria-pressed={imageCase === key} onClick={() => setImageCase(key)}>{IMAGE_CASES[key].label}</button>
        ))}
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Построение</span>
            <strong>{selected.label} от собирающей линзы</strong>
          </div>
          <ThinLensDiagram imageCase={imageCase} />
        </section>
        <aside className={styles.notes} aria-label="Свойства изображения">
          <div className={styles.resultNote}>
            <span>Получится</span>
            <strong>{selected.result}</strong>
            <p>{selected.detail}</p>
          </div>
          <div>
            <span>Как проверить</span>
            <p>{imageCase === "inside" ? "Экран за линзой останется без резкого изображения: там не пересекаются реальные лучи." : "В точке пересечения реальных лучей экран покажет резкое изображение."}</p>
          </div>
          <div className={styles.fieldNote}>
            <span>Не перепутай</span>
            <p>Сплошные линии — реальные лучи. Штриховые появляются только для мнимого изображения и показывают продолжения назад.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EyeDiagram({ near }: { near: boolean }) {
  const markerId = useId().replaceAll(":", "");
  const lensRx = near ? 23 : 16;
  const objectX = near ? 92 : 34;
  const objectHeight = near ? 96 : 58;
  const objectTopY = 205 - objectHeight;
  const retinaX = 676;
  const focusY = 205;

  return (
    <svg className={styles.eyeDiagram} viewBox="0 0 760 410" role="img" aria-label={`${near ? "Близкий" : "Далёкий"} предмет. Хрусталик ${near ? "становится более выпуклым" : "становится менее выпуклым"}, и лучи фокусируются на сетчатке.`}>
      <defs>
        <linearGradient id={`${markerId}-eye`} x1="0" x2="1">
          <stop offset="0" stopColor="var(--surface-primary)" />
          <stop offset="1" stopColor="color-mix(in srgb,var(--action-primary) 10%,var(--surface-primary))" />
        </linearGradient>
        <marker id={`${markerId}-arrow`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 10L5 0L10 10Z" className={styles.objectArrowHead} />
        </marker>
      </defs>
      <line x1="24" y1="205" x2="716" y2="205" className={styles.axis} />
      <line x1={objectX} y1="205" x2={objectX} y2={objectTopY} className={styles.objectArrow} markerEnd={`url(#${markerId}-arrow)`} />
      <text x={objectX} y="238" textAnchor="middle" className={styles.diagramLabel}>{near ? "близкий предмет" : "далёкий предмет"}</text>
      <path d="M292 205C292 85 395 48 510 58C625 68 708 126 708 205C708 284 625 342 510 352C395 362 292 325 292 205Z" fill={`url(#${markerId}-eye)`} className={styles.eyeShell} />
      <path d="M307 118Q266 205 307 292" className={styles.cornea} />
      <path d="M330 124Q356 158 337 186M330 286Q356 252 337 224" className={styles.iris} />
      <line x1="337" y1="186" x2="337" y2="224" className={styles.pupil} />
      <ellipse cx="388" cy="205" rx={lensRx} ry={near ? 70 : 61} className={styles.eyeLens} />
      <path d="M676 116Q635 205 676 294" className={styles.retina} />
      <path d={`M${objectX} ${objectTopY}L337 186L388 157L${retinaX} ${focusY}`} className={styles.eyeRay} />
      <path d={`M${objectX} ${objectTopY}L337 224L388 253L${retinaX} ${focusY}`} className={styles.eyeRay} />
      <circle cx={retinaX} cy={focusY} r="7" className={styles.focusPoint} />
      <line x1={retinaX - 9} y1={focusY} x2={retinaX - 9} y2={focusY + 48} className={styles.imageArrow} markerEnd={`url(#${markerId}-arrow)`} />
      <text x="627" y="328" textAnchor="middle" className={styles.diagramLabel}>сетчатка</text>
      <text x="388" y="304" textAnchor="middle" className={styles.diagramLabel}>хрусталик</text>
    </svg>
  );
}

export function EyeAccommodationNotebook() {
  const [near, setNear] = useState(true);

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Оптическая система глаза</p>
        <h2>Как глаз удерживает резкость на сетчатке?</h2>
        <span>Переведи взгляд с близкого предмета на далёкий. Размер глаза почти не меняется, поэтому хрусталик меняет свою кривизну и оптическую силу.</span>
      </header>
      <div className={styles.choiceRow} aria-label="Расстояние до предмета">
        <button type="button" aria-pressed={near} onClick={() => setNear(true)}>Близкий предмет</button>
        <button type="button" aria-pressed={!near} onClick={() => setNear(false)}>Далёкий предмет</button>
      </div>
      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Аккомодация</span>
            <strong>{near ? "Хрусталик более выпуклый: оптическая сила больше" : "Хрусталик менее выпуклый: оптическая сила меньше"}</strong>
          </div>
          <EyeDiagram near={near} />
        </section>
        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div className={styles.resultNote}>
            <span>Главное условие</span>
            <strong>Фокус остаётся на сетчатке</strong>
            <p>Чёткое зрение требует, чтобы лучи от рассматриваемой точки сходились именно на светочувствительной оболочке глаза.</p>
          </div>
          <div>
            <span>Что делает глаз</span>
            <p>{near ? "Для близкого предмета хрусталик увеличивает кривизну: фокусное расстояние уменьшается." : "Для далёкого предмета хрусталик становится менее выпуклым: фокусное расстояние увеличивается."}</p>
          </div>
          <div className={styles.fieldNote}>
            <span>Граница модели</span>
            <p>Схема показывает ход лучей и аккомодацию. Она не воспроизводит размеры и строение глаза в анатомическом масштабе.</p>
          </div>
        </aside>
      </div>
      <p className={styles.conclusion}>Для нормального зрения расстоянием наилучшего видения считают 25 см. На меньшем расстоянии глаз сильнее напрягается и быстрее утомляется.</p>
    </div>
  );
}

function VisionCorrectionDiagram({ defect, corrected }: { defect: VisionDefect; corrected: boolean }) {
  const markerId = useId().replaceAll(":", "");
  const myopia = defect === "myopia";
  const axisY = 205;
  const glassesX = 270;
  const eyeLensX = 450;
  const retinaX = 688;
  const focusX = corrected ? retinaX : myopia ? 620 : 752;
  const topAtLens = corrected ? (myopia ? 138 : 181) : myopia ? 155 : 169;
  const bottomAtLens = corrected ? (myopia ? 272 : 229) : myopia ? 255 : 241;
  const yAt = (startY: number, x: number) => startY + (x - eyeLensX) * (axisY - startY) / (focusX - eyeLensX);
  const topAtRetina = yAt(topAtLens, retinaX);
  const bottomAtRetina = yAt(bottomAtLens, retinaX);
  const startTop = myopia ? { x: 42, y: 155 } : { x: 52, y: axisY };
  const startBottom = myopia ? { x: 42, y: 255 } : { x: 52, y: axisY };
  const glassTop = myopia ? 155 : 148;
  const glassBottom = myopia ? 255 : 262;
  const rayPath = (top: boolean) => {
    const start = top ? startTop : startBottom;
    const glassY = top ? glassTop : glassBottom;
    const lensY = top ? topAtLens : bottomAtLens;
    const retinaY = top ? topAtRetina : bottomAtRetina;
    const beforeGlasses = corrected ? `L${glassesX} ${glassY}` : "";
    if (focusX <= retinaX) {
      return `M${start.x} ${start.y}${beforeGlasses}L${eyeLensX} ${lensY}L${focusX} ${axisY}L${retinaX} ${retinaY}`;
    }
    return `M${start.x} ${start.y}${beforeGlasses}L${eyeLensX} ${lensY}L${retinaX} ${retinaY}L${focusX} ${axisY}`;
  };

  return (
    <svg className={styles.eyeDiagram} viewBox="0 0 800 420" role="img" aria-label={`${myopia ? "Близорукость: без коррекции фокус перед сетчаткой" : "Дальнозоркость: без коррекции фокус за сетчаткой"}. ${corrected ? `${myopia ? "Рассеивающая" : "Собирающая"} линза очков переносит фокус на сетчатку.` : "Корректирующая линза пока не установлена."}`}>
      <defs>
        <marker id={`${markerId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L10 5L0 10Z" className={styles.rayArrowHead} />
        </marker>
      </defs>
      <line x1="24" y1={axisY} x2="776" y2={axisY} className={styles.axis} />
      {!myopia && (
        <g className={styles.nearObject}>
          <line x1="52" y1={axisY} x2="52" y2="114" />
          <path d="M42 128L52 108L62 128Z" />
          <text x="52" y="244" textAnchor="middle">близкий предмет</text>
        </g>
      )}
      {myopia && <text x="54" y="126" className={styles.diagramLabel}>далёкий предмет · параллельные лучи</text>}

      {corrected && (
        <g className={styles.glassesLens}>
          <path d={myopia ? `M${glassesX - 12} 94Q${glassesX} ${axisY} ${glassesX - 12} 316M${glassesX + 12} 94Q${glassesX} ${axisY} ${glassesX + 12} 316` : `M${glassesX} 94Q${glassesX - 30} ${axisY} ${glassesX} 316M${glassesX} 94Q${glassesX + 30} ${axisY} ${glassesX} 316`} />
          <text x={glassesX} y="348" textAnchor="middle">{myopia ? "рассеивающая · D < 0" : "собирающая · D > 0"}</text>
        </g>
      )}

      <path d="M346 205C346 92 438 55 548 63C650 70 724 132 724 205C724 278 650 340 548 347C438 355 346 318 346 205Z" className={styles.eyeShellPlain} />
      <path d="M362 121Q326 205 362 289" className={styles.cornea} />
      <ellipse cx={eyeLensX} cy={axisY} rx="18" ry="68" className={styles.eyeLens} />
      <path d={`M${retinaX} 116Q650 205 ${retinaX} 294`} className={styles.retina} />
      <path d={rayPath(true)} className={styles.eyeRay} markerEnd={`url(#${markerId}-arrow)`} />
      <path d={rayPath(false)} className={styles.eyeRay} markerEnd={`url(#${markerId}-arrow)`} />
      <circle cx={focusX} cy={axisY} r="7" className={corrected ? styles.correctedFocus : styles.blurFocus} />
      {!corrected && <line x1={retinaX} y1={topAtRetina} x2={retinaX} y2={bottomAtRetina} className={styles.blurSpan} />}
      <text x={focusX} y={myopia && !corrected ? 236 : 190} textAnchor="middle" className={corrected ? styles.correctedLabel : styles.blurLabel}>{corrected ? "фокус на сетчатке" : myopia ? "фокус перед сетчаткой" : "фокус за сетчаткой"}</text>
      <text x={retinaX - 4} y="326" textAnchor="middle" className={styles.diagramLabel}>сетчатка</text>
    </svg>
  );
}

export function VisionCorrectionNotebook() {
  const [defect, setDefect] = useState<VisionDefect>("myopia");
  const [corrected, setCorrected] = useState(false);
  const myopia = defect === "myopia";

  function selectDefect(next: VisionDefect) {
    setDefect(next);
    setCorrected(false);
  }

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Фокус и коррекция</p>
        <h2>Как вернуть изображение точно на сетчатку?</h2>
        <span>Сначала найди, где оптическая система глаза собирает лучи без очков. Затем подбери линзу, которая сдвинет фокус в нужную сторону.</span>
      </header>
      <div className={styles.controlDeck}>
        <div className={styles.choiceRow} aria-label="Дефект зрения">
          <button type="button" aria-pressed={myopia} onClick={() => selectDefect("myopia")}>Близорукость</button>
          <button type="button" aria-pressed={!myopia} onClick={() => selectDefect("hyperopia")}>Дальнозоркость</button>
        </div>
        <div className={styles.choiceRow} aria-label="Коррекция">
          <button type="button" aria-pressed={!corrected} onClick={() => setCorrected(false)}>Без очков</button>
          <button type="button" aria-pressed={corrected} onClick={() => setCorrected(true)}>С коррекцией</button>
        </div>
      </div>
      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>{myopia ? "Удалённый предмет" : "Близкий предмет"}</span>
            <strong>{corrected ? `Фокус на сетчатке: ${myopia ? "рассеивающая" : "собирающая"} линза` : `Фокус ${myopia ? "перед" : "за"} сетчаткой`}</strong>
          </div>
          <VisionCorrectionDiagram defect={defect} corrected={corrected} />
        </section>
        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div className={styles.resultNote}>
            <span>Нужна коррекция</span>
            <strong>{myopia ? "Рассеивающая линза · D < 0" : "Собирающая линза · D > 0"}</strong>
            <p>{myopia ? "Она уменьшает сходимость лучей до глаза и переносит фокус назад, на сетчатку." : "Она добавляет сходимость лучам до глаза и переносит фокус вперёд, на сетчатку."}</p>
          </div>
          <div className={styles.fieldNote}>
            <span>Действие Мио</span>
            <p>Мио не угадывает линзу по названию дефекта: сначала отмечает фокус относительно сетчатки, затем проверяет, в какую сторону его нужно сдвинуть.</p>
          </div>
          <div>
            <span>Граница модели</span>
            <p>Схема объясняет знак корректирующей линзы из школьного курса. Подбор очков и оценка зрения требуют обследования специалистом.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
