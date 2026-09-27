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

function FieldDiagram({ source, leftIsNorth, currentDirection, currentOn, hasCore }: {
  source: FieldSource;
  leftIsNorth: boolean;
  currentDirection: CurrentDirection;
  currentOn: boolean;
  hasCore: boolean;
}) {
  const coilIsOff = source === "coil" && !currentOn;
  const compassDirection = leftIsNorth ? "вправо" : "влево";
  const sourceDescription = source === "magnet"
    ? `Полосовой магнит: слева полюс ${leftIsNorth ? "N" : "S"}, справа ${leftIsNorth ? "S" : "N"}.`
    : coilIsOff
      ? `Катушка ${hasCore ? "с мягким железным сердечником" : "без сердечника"}: цепь разомкнута, магнитного поля катушки нет.`
      : `Катушка с током ${hasCore ? "и мягким железным сердечником" : "без сердечника"}: если смотреть на левый торец, ток идёт ${currentDirection === "counterclockwise" ? "против часовой стрелки" : "по часовой стрелке"}; левый торец является полюсом ${leftIsNorth ? "N" : "S"}.`;
  const compassDescription = coilIsOff
    ? "Стрелка компаса не показана: фоновые магнитные поля в модели не учитываются."
    : `Северный конец компаса над источником направлен ${compassDirection}. Линии поля снаружи идут от N к S.`;
  return (
    <svg className={styles.diagram} viewBox="0 0 720 430" role="img" aria-label={`${sourceDescription} ${compassDescription}`}>
      <defs>
        <marker id="magnetic-field-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path className={styles.arrowHead} d="M0 0L10 5L0 10Z" />
        </marker>
      </defs>

      <g className={styles.fieldLines}>
        {!coilIsOff && FIELD_PATHS.map((paths, index) => source === "coil" && !hasCore && (index === 0 || index === 3)
          ? null
          : <path key={paths[0]} d={paths[leftIsNorth ? 0 : 1]} markerEnd="url(#magnetic-field-arrow)" data-line={index} />)}
      </g>

      <g className={styles.compass}>
        <circle cx="360" cy="86" r="36" />
        <circle cx="360" cy="86" r="4" />
        {!coilIsOff && <g className={styles.needle} style={{ transform: `rotate(${leftIsNorth ? 0 : 180}deg)`, transformOrigin: "360px 86px" }}>
          <path className={styles.needleNorth} d="M360 81L397 86L360 91Z" />
          <path className={styles.needleSouth} d="M360 81L323 86L360 91Z" />
          <text x="404" y="91">N</text>
        </g>}
        <text className={styles.compassLabel} x="360" y="137" textAnchor="middle">{coilIsOff ? "фоновые поля не показаны" : "компас — индикатор поля"}</text>
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
        <g className={styles.coil} data-current={currentOn ? "on" : "off"}>
          {hasCore && <path className={styles.core} d="M218 242H502V258H218Z" />}
          {[250, 294, 338, 382, 426, 470].map(x => <path key={x} d={`M${x} 202C${x - 28} 202 ${x - 28} 298 ${x} 298C${x + 28} 298 ${x + 28} 202 ${x} 202Z`} />)}
          {!coilIsOff && <>
            <text className={styles.poleLabel} x="198" y="256" textAnchor="end">{leftIsNorth ? "N" : "S"}</text>
            <text className={styles.poleLabel} x="522" y="256">{leftIsNorth ? "S" : "N"}</text>
          </>}
          <text className={styles.coreNote} x="360" y="337" textAnchor="middle">{hasCore ? "мягкое железо" : "без сердечника"}</text>
          <g className={styles.currentInset}>
            <circle cx="604" cy="250" r="55" />
            {!coilIsOff && <path d={currentDirection === "counterclockwise" ? "M637 221A42 42 0 1 0 639 276" : "M639 276A42 42 0 1 1 637 221"} markerEnd="url(#magnetic-field-arrow)" />}
            <text x="604" y="246" textAnchor="middle">{coilIsOff ? "ток" : "вид"}</text>
            <text x="604" y="264" textAnchor="middle">{coilIsOff ? "выключен" : "слева"}</text>
          </g>
        </g>
      )}

      <text className={styles.directionNote} x="360" y="404" textAnchor="middle">{coilIsOff ? "Цепь разомкнута: катушка не создаёт поле" : "Снаружи источника направление линии: N → S"}</text>
    </svg>
  );
}

export function MagneticFieldNotebook() {
  const [source, setSource] = useState<FieldSource>("magnet");
  const [magnetReversed, setMagnetReversed] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<CurrentDirection>("counterclockwise");
  const [currentOn, setCurrentOn] = useState(true);
  const [hasCore, setHasCore] = useState(true);
  const leftIsNorth = source === "magnet" ? !magnetReversed : currentDirection === "counterclockwise";

  function reverseSource() {
    if (source === "magnet") setMagnetReversed(value => !value);
    else setCurrentDirection(value => value === "counterclockwise" ? "clockwise" : "counterclockwise");
  }

  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Поле по его действию</p>
        <h2>Что покажет компас и когда действует электромагнит?</h2>
        <span>Северный конец стрелки показывает направление поля. У катушки можно включить ток и проверить, как мягкий железный сердечник меняет магнитное действие.</span>
      </header>

      <div className={styles.sourceTabs} aria-label="Магнит или катушка">
        <button type="button" aria-pressed={source === "magnet"} onClick={() => setSource("magnet")}>Постоянный магнит</button>
        <button type="button" aria-pressed={source === "coil"} onClick={() => setSource("coil")}>Катушка</button>
      </div>

      {source === "coil" && <div className={styles.coilControls} aria-label="Условия опыта с электромагнитом">
        <fieldset>
          <legend>Ток в катушке</legend>
          <div className={styles.settingButtons}>
            <button type="button" aria-pressed={currentOn} onClick={() => setCurrentOn(true)}>Включён</button>
            <button type="button" aria-pressed={!currentOn} onClick={() => setCurrentOn(false)}>Выключен</button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Мягкий железный сердечник</legend>
          <div className={styles.settingButtons}>
            <button type="button" aria-pressed={hasCore} onClick={() => setHasCore(true)}>Внутри</button>
            <button type="button" aria-pressed={!hasCore} onClick={() => setHasCore(false)}>Вынут</button>
          </div>
        </fieldset>
      </div>}

      <div className={styles.workspace}>
        <section className={styles.experiment} aria-live="polite">
          <div className={styles.experimentHeading}>
            <span>{source === "magnet" ? "Полюсы магнита" : currentOn ? "Направление тока, вид слева" : "Состояние цепи"}</span>
            <strong>{source === "magnet"
              ? `Слева ${leftIsNorth ? "N" : "S"}, справа ${leftIsNorth ? "S" : "N"}`
              : !currentOn ? "Цепь разомкнута — тока нет"
                : currentDirection === "counterclockwise" ? "Против часовой стрелки" : "По часовой стрелке"}</strong>
          </div>
          <FieldDiagram source={source} leftIsNorth={leftIsNorth} currentDirection={currentDirection} currentOn={currentOn} hasCore={hasCore} />
          {source === "coil" && <p className={styles.modelNote}>Железный предмет остаётся на том же расстоянии от катушки. Число линий на схеме условное.</p>}
          {(source === "magnet" || currentOn) && <button className={styles.reverseButton} type="button" onClick={reverseSource}>
            {source === "magnet" ? "Развернуть магнит" : "Развернуть ток"}
          </button>}
        </section>

        <aside className={styles.notes} aria-label="Наблюдение и вывод">
          <div>
            <span>Наблюдение</span>
            <p>{source === "magnet" || currentOn
              ? `Северный конец стрелки направлен ${leftIsNorth ? "вправо" : "влево"}. После разворота источника он повернётся на 180°.`
              : "Цепь разомкнута: поле катушки исчезло. Стрелка здесь не показывает направление, поскольку фоновые поля не моделируются."}</p>
          </div>
          <div>
            <span>{source === "coil" ? "Магнитное действие" : "Что можно утверждать"}</span>
            {source === "coil" && <strong className={styles.effectVerdict}>{!currentOn
              ? "Нет притяжения катушкой"
              : hasCore ? "Притяжение сильнее" : "Притяжение слабее"}</strong>}
            <p>{source === "magnet"
              ? "Компас обнаруживает ориентирующее действие поля. Линии снаружи магнита направлены от N к S и продолжаются внутри, образуя замкнутые линии."
              : !currentOn
                ? "Без тока катушка не создаёт собственного поля и не притягивает железный предмет за счёт этого поля. В модели мягкое железо не сохраняет намагниченность."
                : hasCore
                  ? "При том же токе мягкий железный сердечник усиливает поле катушки и её притяжение того же железного предмета."
                  : "Катушка с током создаёт поле и действует на железный предмет. При том же токе без сердечника её действие слабее."}</p>
          </div>
          <div className={styles.mioNote}>
            <Image src="/images/mio/mio-thinking-v1.png" alt="" width={220} height={220} sizes="(max-width: 760px) 110px, 150px" />
            <p><b>Догадка Мио</b>{source === "magnet"
              ? "«Если развернуть магнит, стрелка должна повернуться тоже: направление поля изменится»."
              : "«При том же токе сердечник усилит действие катушки. А если разомкнуть цепь, её поле исчезнет»."}</p>
          </div>
        </aside>
      </div>

      <p className={styles.conclusion}>Линии поля — условный рисунок. Стрелка помогает проверить направление; более густые линии у катушки с сердечником здесь означают более сильное действие, а не точную величину поля.</p>
    </div>
  );
}
