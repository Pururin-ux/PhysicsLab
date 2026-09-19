"use client";

import { useState } from "react";
import styles from "./LightShadowNotebook.module.css";

type SourceKind = "point" | "extended";

const SOURCE_X = 86;
const OBJECT_X = 382;
const SCREEN_X = 728;
const OBJECT_TOP = 146;
const OBJECT_BOTTOM = 274;
const AXIS_Y = 210;
const SOURCE_TOP = 160;
const SOURCE_BOTTOM = 260;

function project(sourceY: number, objectY: number) {
  return sourceY + (objectY - sourceY) * ((SCREEN_X - SOURCE_X) / (OBJECT_X - SOURCE_X));
}

function LightShadowDiagram({ sourceKind }: { sourceKind: SourceKind }) {
  const extended = sourceKind === "extended";
  const pointTop = project(AXIS_Y, OBJECT_TOP);
  const pointBottom = project(AXIS_Y, OBJECT_BOTTOM);
  const outerTop = project(SOURCE_BOTTOM, OBJECT_TOP);
  const umbraTop = project(SOURCE_TOP, OBJECT_TOP);
  const umbraBottom = project(SOURCE_BOTTOM, OBJECT_BOTTOM);
  const outerBottom = project(SOURCE_TOP, OBJECT_BOTTOM);

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 820 420"
      role="img"
      aria-label={extended
        ? "Протяжённый источник освещает непрозрачный шар. На экране видны центральная тень и полутень по краям."
        : "Точечный источник освещает непрозрачный шар. На экране получается тень с резкой границей."}
    >
      <defs>
        <linearGradient id="screenLight" x1="0" x2="1">
          <stop offset="0" stopColor="var(--feedback-warning)" stopOpacity=".18" />
          <stop offset="1" stopColor="var(--feedback-warning)" stopOpacity=".08" />
        </linearGradient>
        <radialGradient id="sourceGlow">
          <stop offset="0" stopColor="var(--feedback-warning)" stopOpacity=".75" />
          <stop offset="1" stopColor="var(--feedback-warning)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <line x1="32" y1="338" x2="780" y2="338" className={styles.tableLine} />
      <rect x={SCREEN_X} y="38" width="34" height="300" rx="4" fill="url(#screenLight)" className={styles.screen} />
      <text x={SCREEN_X + 17} y="367" textAnchor="middle" className={styles.label}>экран</text>

      {extended ? (
        <g className={styles.source}>
          <ellipse cx={SOURCE_X} cy={AXIS_Y} rx="58" ry="92" fill="url(#sourceGlow)" />
          <rect x={SOURCE_X - 9} y={SOURCE_TOP} width="18" height={SOURCE_BOTTOM - SOURCE_TOP} rx="9" />
          <text x={SOURCE_X} y="328" textAnchor="middle">протяжённый</text>
          <text x={SOURCE_X} y="346" textAnchor="middle">источник</text>
        </g>
      ) : (
        <g className={styles.source}>
          <circle cx={SOURCE_X} cy={AXIS_Y} r="70" fill="url(#sourceGlow)" />
          <circle cx={SOURCE_X} cy={AXIS_Y} r="8" />
          <text x={SOURCE_X} y="328" textAnchor="middle">точечный</text>
          <text x={SOURCE_X} y="346" textAnchor="middle">источник</text>
        </g>
      )}

      <g className={styles.object}>
        <circle cx={OBJECT_X} cy={AXIS_Y} r="64" />
        <path d={`M${OBJECT_X - 42} 322Q${OBJECT_X} 294 ${OBJECT_X + 42} 322`} />
        <text x={OBJECT_X} y="369" textAnchor="middle" className={styles.label}>непрозрачное тело</text>
      </g>

      {extended ? (
        <>
          <path d={`M${SOURCE_X} ${SOURCE_TOP}L${OBJECT_X} ${OBJECT_TOP}L${SCREEN_X} ${umbraTop}`} className={styles.boundaryRay} />
          <path d={`M${SOURCE_X} ${SOURCE_BOTTOM}L${OBJECT_X} ${OBJECT_TOP}L${SCREEN_X} ${outerTop}`} className={styles.boundaryRayMuted} />
          <path d={`M${SOURCE_X} ${SOURCE_BOTTOM}L${OBJECT_X} ${OBJECT_BOTTOM}L${SCREEN_X} ${umbraBottom}`} className={styles.boundaryRay} />
          <path d={`M${SOURCE_X} ${SOURCE_TOP}L${OBJECT_X} ${OBJECT_BOTTOM}L${SCREEN_X} ${outerBottom}`} className={styles.boundaryRayMuted} />
          <rect x={SCREEN_X + 1} y={outerTop} width="32" height={umbraTop - outerTop} className={styles.penumbra} />
          <rect x={SCREEN_X + 1} y={umbraTop} width="32" height={umbraBottom - umbraTop} className={styles.umbra} />
          <rect x={SCREEN_X + 1} y={umbraBottom} width="32" height={outerBottom - umbraBottom} className={styles.penumbra} />
          <path d={`M${SCREEN_X - 8} ${umbraTop}h-24M${SCREEN_X - 8} ${umbraBottom}h-24`} className={styles.measureTick} />
          <text x={SCREEN_X - 38} y={(umbraTop + umbraBottom) / 2} textAnchor="end" className={styles.umbraText}>тень</text>
          <text x={SCREEN_X - 38} y={(outerTop + umbraTop) / 2 + 5} textAnchor="end" className={styles.penumbraText}>полутень</text>
          <text x={SCREEN_X - 38} y={(umbraBottom + outerBottom) / 2 + 5} textAnchor="end" className={styles.penumbraText}>полутень</text>
        </>
      ) : (
        <>
          <path d={`M${SOURCE_X} ${AXIS_Y}L${OBJECT_X} ${OBJECT_TOP}L${SCREEN_X} ${pointTop}`} className={styles.boundaryRay} />
          <path d={`M${SOURCE_X} ${AXIS_Y}L${OBJECT_X} ${OBJECT_BOTTOM}L${SCREEN_X} ${pointBottom}`} className={styles.boundaryRay} />
          <rect x={SCREEN_X + 1} y={pointTop} width="32" height={pointBottom - pointTop} className={styles.umbra} />
          <path d={`M${SCREEN_X - 8} ${pointTop}h-24M${SCREEN_X - 8} ${pointBottom}h-24`} className={styles.measureTick} />
          <text x={SCREEN_X - 38} y={(pointTop + pointBottom) / 2 + 5} textAnchor="end" className={styles.umbraText}>резкая тень</text>
        </>
      )}

      <text x="44" y="55" className={styles.sceneNote}>Свет идёт по прямым линиям в однородном воздухе</text>
    </svg>
  );
}

export function LightShadowNotebook() {
  const [sourceKind, setSourceKind] = useState<SourceKind>("point");
  const extended = sourceKind === "extended";

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Источник · препятствие · экран</p>
        <h2>Почему край тени бывает резким или мягким?</h2>
        <span>Мио проводит только граничные лучи: они показывают, какая часть экрана не видит источник целиком или видит лишь его часть.</span>
      </header>

      <div className={styles.controls} aria-label="Размер источника света">
        <button type="button" aria-pressed={!extended} onClick={() => setSourceKind("point")}>Точечный источник</button>
        <button type="button" aria-pressed={extended} onClick={() => setSourceKind("extended")}>Протяжённый источник</button>
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>Наблюдение на экране</span>
            <strong>{extended ? "Тень окружена полутенью" : "У тени резкая граница"}</strong>
          </div>
          <LightShadowDiagram sourceKind={sourceKind} />
        </section>
        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div className={styles.resultNote}>
            <span>Что изменилось</span>
            <strong>{extended ? "Источник имеет заметный размер" : "Размером источника можно пренебречь"}</strong>
            <p>{extended ? "Края источника освещают экран по-разному: рядом с полной тенью появляется область частичного освещения." : "Все граничные лучи выходят из одной точки, поэтому переход от света к тени получается резким."}</p>
          </div>
          <div className={styles.mioNote}>
            <span>Действие Мио</span>
            <p>Мио не закрашивает тень наугад: соединяет края источника с краями препятствия и продолжает лучи до экрана.</p>
          </div>
          <div>
            <span>Условие модели</span>
            <p>Прямая лучевая модель работает в однородной прозрачной среде. На границе двух сред направление может измениться.</p>
          </div>
        </aside>
      </div>
      <p className={styles.conclusion}>{extended ? "Полутень — место, куда приходит свет только от части протяжённого источника." : "Тень — место, куда свет от источника не попадает из-за непрозрачного тела."}</p>
    </div>
  );
}
