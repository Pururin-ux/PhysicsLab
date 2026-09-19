"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./MagneticFieldNotebook.module.css";

type FieldSource = "magnet" | "coil";
type CurrentDirection = "counterclockwise" | "clockwise";

const FIELD_PATHS = [
  ["M205 210C260 82 460 82 515 210", "M515 210C460 82 260 82 205 210"],
  ["M205 232C280 142 440 142 515 232", "M515 232C440 142 280 142 205 232"],
  ["M205 268C280 358 440 358 515 268", "M515 268C440 358 280 358 205 268"],
  ["M205 290C260 418 460 418 515 290", "M515 290C460 418 260 418 205 290"],
] as const;

function FieldDiagram({ source, leftIsNorth, currentDirection }: {
  source: FieldSource;
  leftIsNorth: boolean;
  currentDirection: CurrentDirection;
}) {
  const compassDirection = leftIsNorth ? "вправо" : "влево";
  const sourceDescription = source === "magnet"
    ? `Полосовой магнит: слева полюс ${leftIsNorth ? "N" : "S"}, справа ${leftIsNorth ? "S" : "N"}.`
    : `Катушка с током: если смотреть на левый торец, ток идёт ${currentDirection === "counterclockwise" ? "против часовой стрелки" : "по часовой стрелке"}; левый торец является полюсом ${leftIsNorth ? "N" : "S"}.`;

  return (
    <svg className={styles.diagram} viewBox="0 0 720 430" role="img" aria-label={`${sourceDescription} Северный конец компаса над источником направлен ${compassDirection}. Линии поля снаружи идут от N к S.`}>
      <defs>
        <marker id="magnetic-field-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path className={styles.arrowHead} d="M0 0L10 5L0 10Z" />
        </marker>
      </defs>

      <g className={styles.fieldLines}>
        {FIELD_PATHS.map((paths, index) => <path key={paths[0]} d={paths[leftIsNorth ? 0 : 1]} markerEnd="url(#magnetic-field-arrow)" data-line={index} />)}
      </g>

      <g className={styles.compass}>
        <circle cx="360" cy="86" r="36" />
        <circle cx="360" cy="86" r="4" />
        <g className={styles.needle} style={{ transform: `rotate(${leftIsNorth ? 0 : 180}deg)`, transformOrigin: "360px 86px" }}>
          <path className={styles.needleNorth} d="M360 81L397 86L360 91Z" />
          <path className={styles.needleSouth} d="M360 81L323 86L360 91Z" />
          <text x="404" y="91">N</text>
        </g>
        <text className={styles.compassLabel} x="360" y="137" textAnchor="middle">компас — индикатор поля</text>
      </g>

      {source === "magnet" ? (
        <g className={styles.barMagnet}>
          <path className={leftIsNorth ? styles.northPole : styles.southPole} d="M206 216H360V284H206Z" />
          <path className={leftIsNorth ? styles.southPole : styles.northPole} d="M360 216H514V284H360Z" />
          <path className={styles.sourceOutline} d="M206 216H514V284H206Z" />
          <text x="282" y="260" textAnchor="middle">{leftIsNorth ? "N" : "S"}</text>
          <text x="438" y="260" textAnchor="middle">{leftIsNorth ? "S" : "N"}</text>
        </g>
      ) : (
        <g className={styles.coil}>
          <path className={styles.core} d="M218 242H502V258H218Z" />
          {[250, 294, 338, 382, 426, 470].map(x => <path key={x} d={`M${x} 202C${x - 28} 202 ${x - 28} 298 ${x} 298C${x + 28} 298 ${x + 28} 202 ${x} 202Z`} />)}
          <text className={styles.poleLabel} x="198" y="256" textAnchor="end">{leftIsNorth ? "N" : "S"}</text>
          <text className={styles.poleLabel} x="522" y="256">{leftIsNorth ? "S" : "N"}</text>
          <g className={styles.currentInset}>
            <circle cx="604" cy="250" r="55" />
            <path d={currentDirection === "counterclockwise" ? "M639 276A42 42 0 1 1 637 221" : "M637 221A42 42 0 1 1 639 276"} markerEnd="url(#magnetic-field-arrow)" />
            <text x="604" y="246" textAnchor="middle">вид</text>
            <text x="604" y="264" textAnchor="middle">слева</text>
          </g>
        </g>
      )}

      <text className={styles.directionNote} x="360" y="404" textAnchor="middle">Снаружи источника направление линии: N → S</text>
    </svg>
  );
}

export function MagneticFieldNotebook() {
  const [source, setSource] = useState<FieldSource>("magnet");
  const [magnetReversed, setMagnetReversed] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<CurrentDirection>("counterclockwise");
  const leftIsNorth = source === "magnet" ? !magnetReversed : currentDirection === "counterclockwise";

  function reverseSource() {
    if (source === "magnet") setMagnetReversed(value => !value);
    else setCurrentDirection(value => value === "counterclockwise" ? "clockwise" : "counterclockwise");
  }

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Поле по его действию</p>
        <h2>Поле невидимо. Что тогда показывает компас?</h2>
        <span>Северный конец стрелки в каждой точке поворачивается вдоль линии магнитного поля. Меняй источник и проверяй направление.</span>
      </header>

      <div className={styles.sourceTabs} aria-label="Источник магнитного поля">
        <button type="button" aria-pressed={source === "magnet"} onClick={() => setSource("magnet")}>Постоянный магнит</button>
        <button type="button" aria-pressed={source === "coil"} onClick={() => setSource("coil")}>Катушка с током</button>
      </div>

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>{source === "magnet" ? "Полюсы магнита" : "Направление тока, вид слева"}</span>
            <strong>{source === "magnet"
              ? `Слева ${leftIsNorth ? "N" : "S"}, справа ${leftIsNorth ? "S" : "N"}`
              : currentDirection === "counterclockwise" ? "Против часовой стрелки" : "По часовой стрелке"}</strong>
          </div>
          <FieldDiagram source={source} leftIsNorth={leftIsNorth} currentDirection={currentDirection} />
          <button className={styles.reverseButton} type="button" onClick={reverseSource}>
            {source === "magnet" ? "Развернуть магнит" : "Развернуть ток"}
          </button>
        </section>

        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div>
            <span>Наблюдение</span>
            <p>Северный конец стрелки направлен {leftIsNorth ? "вправо" : "влево"}. После разворота источника он повернётся на 180°.</p>
          </div>
          <div>
            <span>Что можно утверждать</span>
            <p>{source === "magnet"
              ? "Компас обнаруживает ориентирующее действие поля. Линии снаружи магнита направлены от N к S и продолжаются внутри, образуя замкнутые линии."
              : "Ток создаёт магнитное поле. Если развернуть ток, направление поля и полюсы катушки поменяются местами."}</p>
          </div>
          <div className={styles.mioNote}>
            <Image src="/images/mio/mio-thinking-v1.png" alt="" width={220} height={220} sizes="(max-width: 760px) 110px, 150px" />
            <p><b>Догадка Мио</b>«Если развернуть ток, стрелка обязана развернуться тоже. Иначе я перепутала причину и картинку».</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>Линии не являются видимыми нитями вокруг магнита. Это модель направления поля, проверяемая магнитной стрелкой или железными опилками.</p>
    </div>
  );
}
