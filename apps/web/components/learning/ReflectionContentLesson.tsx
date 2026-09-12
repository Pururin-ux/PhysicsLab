"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import styles from "./ReflectionContentLesson.module.css";

type DiagramPhase = "incident" | "reflection" | "normal" | "law" | "worked" | "analogue";
type TaskRay = "a" | "b" | "c";

const TASK_RAYS: readonly TaskRay[] = ["a", "b", "c"];
const GEOMETRY_PRECISION = 3;

function roundGeometry(value: number) {
  return Math.round(value * 10 ** GEOMETRY_PRECISION) / 10 ** GEOMETRY_PRECISION;
}

function pointFromNormal(
  angle: number,
  length: number,
  side: "left" | "right",
  origin = { x: 250, y: 230 },
) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: roundGeometry(origin.x + (side === "left" ? -1 : 1) * Math.sin(radians) * length),
    y: roundGeometry(origin.y - Math.cos(radians) * length),
  };
}

function arcPath(angle: number, side: "left" | "right", radius = 42, origin = { x: 250, y: 230 }) {
  const end = pointFromNormal(angle, radius, side, origin);
  return `M ${origin.x} ${origin.y - radius} A ${radius} ${radius} 0 0 ${side === "left" ? 0 : 1} ${end.x} ${end.y}`;
}

function ReflectionDiagram({
  phase,
  angle = 35,
  className,
  interactive = false,
}: {
  phase: DiagramPhase;
  angle?: number;
  className?: string;
  interactive?: boolean;
}) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const origin = { x: 250, y: 230 };
  const incident = pointFromNormal(angle, 168, "left", origin);
  const reflected = pointFromNormal(angle, 168, "right", origin);
  const showReflection = phase !== "incident";
  const showNormal = phase === "normal" || phase === "law" || phase === "worked" || phase === "analogue" || interactive;
  const showAngles = phase === "normal" || phase === "law" || phase === "worked" || phase === "analogue" || interactive;
  const worked = phase === "worked";
  const analogue = phase === "analogue";
  const diagramLabel = interactive
    ? `Интерактивная схема: угол падения альфа ${angle} градусов к нормали, угол отражения бета ${angle} градусов к нормали.`
    : showAngles
      ? `Схема отражения: падающий и отражённый лучи, нормаль и равные углы альфа и бета.`
      : showReflection
        ? "Схема: световой луч отражается от гладкой поверхности."
        : "Схема: световой луч падает на гладкую поверхность.";

  return (
    <svg viewBox="0 0 500 300" className={className} role="img" aria-label={diagramLabel}>
      <defs>
        <marker id={`${id}-cyan`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" className={styles.cyanFill} />
        </marker>
        <marker id={`${id}-warm`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" className={styles.warmFill} />
        </marker>
      </defs>
      <line x1="56" y1={origin.y} x2="444" y2={origin.y} className={styles.mirror} />
      <g aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <line key={index} x1={74 + index * 23} y1={origin.y + 2} x2={62 + index * 23} y2={origin.y + 18} className={styles.hatch} />
        ))}
      </g>
      <text x="60" y="272" className={styles.diagramText}>отражающая поверхность</text>

      {showNormal ? <line x1={origin.x} y1="42" x2={origin.x} y2="254" className={styles.normal} /> : null}
      {showNormal ? <path d={`M ${origin.x} ${origin.y - 20} H ${origin.x + 20} V ${origin.y}`} className={styles.rightAngle} /> : null}
      {showNormal ? <text x={origin.x + 11} y="59" className={styles.diagramText}>нормаль</text> : null}
      {showNormal ? <text x={origin.x + 28} y={origin.y - 7} className={styles.smallText}>90°</text> : null}

      <line x1={incident.x} y1={incident.y} x2={origin.x} y2={origin.y} className={styles.incidentRay} markerEnd={`url(#${id}-cyan)`} />
      {showReflection ? <line x1={origin.x} y1={origin.y} x2={reflected.x} y2={reflected.y} className={styles.reflectedRay} markerEnd={`url(#${id}-warm)`} /> : null}
      {phase === "normal" || phase === "law" || worked || analogue ? <circle cx={origin.x} cy={origin.y} r="4" className={styles.hitPoint} /> : null}
      {phase === "normal" || phase === "law" || worked || analogue ? <text x={origin.x - 95} y={origin.y + 28} className={styles.smallText}>точка падения</text> : null}

      {showAngles ? <path d={arcPath(angle, "left", 44, origin)} className={styles.alphaArc} /> : null}
      {showAngles ? <path d={arcPath(angle, "right", 44, origin)} className={styles.betaArc} /> : null}
      {showAngles ? <text x={pointFromNormal(angle / 2, 64, "left", origin).x - 8} y={pointFromNormal(angle / 2, 64, "left", origin).y} className={styles.alphaLabel}>α</text> : null}
      {showAngles ? <text x={pointFromNormal(angle / 2, 64, "right", origin).x + 2} y={pointFromNormal(angle / 2, 64, "right", origin).y} className={styles.betaLabel}>β</text> : null}

      {worked || analogue ? <>
        <path d={`M 204 ${origin.y} A 46 46 0 0 0 ${pointFromNormal(angle, 46, "left", origin).x} ${pointFromNormal(angle, 46, "left", origin).y}`} className={styles.surfaceArc} />
        <text x="169" y="215" className={styles.surfaceLabel}>{analogue ? "18°" : "35°"}</text>
        <text x="130" y="252" className={styles.smallText}>к поверхности</text>
        <text x="203" y="154" className={styles.alphaLabel}>{analogue ? "72°" : "55°"}</text>
        <text x="286" y="154" className={styles.betaLabel}>{analogue ? "72°" : "55°"}</text>
      </> : null}
    </svg>
  );
}

function InteractiveReflection() {
  const [angle, setAngle] = useState(30);
  const id = useId().replace(/:/g, "");
  return (
    <figure className={styles.interactive} aria-labelledby={`${id}-heading`}>
      <div className={styles.interactiveHeading}>
        <div>
          <h3 id={`${id}-heading`}>Посмотри, как работает закон</h3>
          <p>Измени наклон падающего луча. Отражённый луч перестроится вместе с ним.</p>
        </div>
        <output className={styles.angleReadout} htmlFor={`${id}-angle`}>
          <span>α = {angle}°</span><span aria-hidden="true">·</span><span>β = {angle}°</span>
        </output>
      </div>
      <ReflectionDiagram phase="law" angle={angle} interactive className={styles.interactiveDiagram} />
      <div className={styles.sliderWrap}>
        <label htmlFor={`${id}-angle`}>Угол падения от нормали <strong>{angle}°</strong></label>
        <input id={`${id}-angle`} data-testid="reflection-angle-slider" type="range" min="10" max="70" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} aria-describedby={`${id}-reading`} />
        <div className={styles.rangeEnds} aria-hidden="true"><span>10°</span><span>70°</span></div>
      </div>
      <figcaption id={`${id}-reading`} className={styles.liveReading} aria-live="polite">Угол падения α = {angle}°. Угол отражения β = {angle}°. Оба угла отсчитаны от нормали.</figcaption>
    </figure>
  );
}

function TaskDiagram({
  focused,
  selected,
  onPick,
  onKeyDown,
}: {
  focused: TaskRay;
  selected: TaskRay | null;
  onPick: (ray: TaskRay) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}) {
  const id = useId().replace(/:/g, "");
  const origin = { x: 250, y: 230 };
  const incident = pointFromNormal(62, 172, "right", origin);
  // RAY A — GEOMETRY: other side, 28° to normal — ERROR IT REPRESENTS: takes the given surface angle as a normal angle.
  const rayA = pointFromNormal(28, 172, "left", origin);
  // RAY B — GEOMETRY: same side of the normal, 62° to normal — ERROR IT REPRESENTS: does not reverse to the other side after reflection.
  const rayB = pointFromNormal(62, 172, "right", origin);
  // RAY C — GEOMETRY: other side, 62° to normal / 28° to surface — ERROR IT REPRESENTS: none; physical reflection.
  const rayC = pointFromNormal(62, 172, "left", origin);
  const rays: Record<TaskRay, { point: { x: number; y: number }; label: string }> = {
    a: { point: rayA, label: "Вариант A" },
    b: { point: rayB, label: "Вариант B" },
    c: { point: rayC, label: "Вариант C" },
  };
  return (
    <div
      className={styles.taskDiagramWrap}
      role="radiogroup"
      aria-label="Выбор направления отражённого луча"
      aria-activedescendant={`${id}-ray-${focused}`}
      aria-describedby={`${id}-hint`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-focused-ray={focused}
      data-testid="reflection-task-radiogroup"
    >
      <svg viewBox="0 0 500 306" className={styles.taskDiagram}>
        <defs>
          <marker id={`${id}-given`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" className={styles.cyanFill} /></marker>
          <marker id={`${id}-choice`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" className={styles.choiceFill} /></marker>
        </defs>
        <line x1="52" y1={origin.y} x2="448" y2={origin.y} className={styles.mirror} />
        {Array.from({ length: 16 }, (_, index) => <line key={index} x1={74 + index * 23} y1="232" x2={62 + index * 23} y2="248" className={styles.hatch} />)}
        <line x1={origin.x} y1="42" x2={origin.x} y2="250" className={styles.normal} />
        <text x={origin.x + 10} y="58" className={styles.diagramText}>нормаль</text>
        <path d={`M ${origin.x + 46} ${origin.y} A 46 46 0 0 1 ${pointFromNormal(62, 46, "right", origin).x} ${pointFromNormal(62, 46, "right", origin).y}`} className={styles.surfaceArc} />
        <text x="315" y="216" className={styles.surfaceLabel}>28°</text>
        <line x1={incident.x} y1={incident.y} x2={origin.x} y2={origin.y} className={styles.incidentRay} markerEnd={`url(#${id}-given)`} />
        <circle cx={origin.x} cy={origin.y} r="4" className={styles.hitPoint} />
        {(Object.entries(rays) as [TaskRay, (typeof rays)[TaskRay]][]).map(([ray, value]) => <g id={`${id}-ray-${ray}`} key={ray} role="radio" aria-checked={selected === ray} aria-label={value.label} className={`${styles.taskRay} ${focused === ray ? styles.taskRayFocused : ""} ${selected === ray ? styles.taskRaySelected : ""}`} onClick={() => onPick(ray)}>
          <line x1={origin.x} y1={origin.y} x2={value.point.x} y2={value.point.y} markerEnd={`url(#${id}-choice)`} />
          <circle cx={value.point.x} cy={value.point.y} r="17" className={styles.rayTarget} />
          <text x={value.point.x + (ray === "b" ? -11 : 7)} y={value.point.y - 12} className={styles.rayLetter}>{ray.toUpperCase()}</text>
        </g>)}
      </svg>
      <p id={`${id}-hint`} className={styles.taskHint}>Выбери луч на схеме. Используй стрелки, Home или End, затем Enter или пробел.</p>
    </div>
  );
}

function IndependentTask() {
  const [focused, setFocused] = useState<TaskRay>("a");
  const [selected, setSelected] = useState<TaskRay | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showAnalogue, setShowAnalogue] = useState(false);
  const correct = selected === "c";
  const pick = (ray: TaskRay) => {
    setFocused(ray);
    setSelected(ray);
    if (ray !== "c") {
      const next = wrongAttempts + 1;
      setWrongAttempts(next);
      if (next >= 2) setShowAnalogue(true);
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TASK_RAYS.indexOf(focused);
    if (["ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); setFocused(TASK_RAYS[(index + 1) % TASK_RAYS.length]); return; }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); setFocused(TASK_RAYS[(index + TASK_RAYS.length - 1) % TASK_RAYS.length]); return; }
    if (event.key === "Home") { event.preventDefault(); setFocused("a"); return; }
    if (event.key === "End") { event.preventDefault(); setFocused("c"); return; }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); pick(focused); }
  };
  return (
    <section className={`${styles.section} ${styles.taskSection}`} aria-labelledby="independent-task-heading" data-testid="reflection-independent-task">
      <div className={styles.sectionCopy}>
        <p className={styles.sectionMark}>Задача</p>
        <h2 id="independent-task-heading">Самостоятельная задача</h2>
        <p className={styles.taskPrompt}>Луч образует с поверхностью зеркала угол 28°. Выбери, как пойдёт отражённый луч.</p>
      </div>
      <TaskDiagram focused={focused} selected={selected} onPick={pick} onKeyDown={onKeyDown} />
      {!correct && wrongAttempts > 0 ? <div className={styles.feedback} role="status" data-testid="reflection-task-wrong">Угол в условии отмечен к поверхности зеркала. Закон отражения сравнивает углы от нормали.<p>Попробуй ещё раз.</p></div> : null}
      {!correct && !showAnalogue ? <button type="button" className={styles.helpButton} onClick={() => setShowAnalogue(true)}>Помощь</button> : null}
      {!correct && showAnalogue ? <aside className={styles.analogue} aria-labelledby="analogue-heading" data-testid="reflection-analogue-help"><div><h3 id="analogue-heading">Похожий пример</h3><p>Луч образует с поверхностью угол 18°. Нормаль перпендикулярна поверхности: она образует с ней угол 90°. Поэтому угол к нормали равен 72°. Отражённый луч идёт по другую сторону нормали под таким же углом.</p><p>Теперь вернись к исходным 28° и выбери луч.</p></div><ReflectionDiagram phase="analogue" angle={72} className={styles.analogueDiagram} /></aside> : null}
      {correct ? <div className={styles.success} role="status" data-testid="reflection-task-success"><h3>Верно</h3><p>Угол к нормали равен 62°, поэтому отражённый луч идёт по другую сторону нормали под углом 62° к ней — это 28° к поверхности.</p><div className={styles.handoffActions}><Link className={styles.primaryLink} href="/practice/family/reflection-angle">Тренироваться на задачах</Link><Link className={styles.secondaryLink} href="/topics">К темам</Link></div></div> : null}
    </section>
  );
}

function SurfaceComparison() {
  const smoothNormals = [70, 120, 170, 220];
  const roughSegments = [
    { x: 70, y: 149, normalX2: 70, normalY2: 112, outgoingX: 104, outgoingY: 54 },
    { x: 120, y: 158, normalX2: 106, normalY2: 121, outgoingX: 149, outgoingY: 54 },
    { x: 170, y: 154, normalX2: 184, normalY2: 117, outgoingX: 142, outgoingY: 54 },
    { x: 220, y: 148, normalX2: 240, normalY2: 115, outgoingX: 272, outgoingY: 54 },
  ];

  return (
    <figure className={styles.comparison} aria-labelledby="surface-comparison-caption">
      <svg
        viewBox="0 0 700 235"
        role="img"
        aria-label="Сравнение зеркального и рассеянного отражения: гладкая поверхность направляет лучи упорядоченно, неровная отражает их в разные стороны."
      >
        <g transform="translate(12 8)">
          <text x="150" y="20" textAnchor="middle" className={styles.comparisonTitle}>
            гладкая поверхность
          </text>
          <line x1="26" y1="155" x2="274" y2="155" className={styles.mirror} />
          {smoothNormals.map((x) => (
            <g key={x}>
              <line x1={x - 36} y1="54" x2={x} y2="155" className={styles.comparisonIncoming} />
              <line x1={x} y1="155" x2={x + 36} y2="54" className={styles.comparisonOutgoing} />
              <line x1={x} y1="132" x2={x} y2="178" className={styles.comparisonNormal} />
            </g>
          ))}
          <text x="150" y="207" textAnchor="middle" className={styles.comparisonText}>
            зеркальное отражение
          </text>
        </g>
        <g transform="translate(365 8)">
          <text x="150" y="20" textAnchor="middle" className={styles.comparisonTitle}>
            неровная поверхность
          </text>
          <polyline
            points="26,155 63,145 98,165 132,147 170,163 210,143 274,156"
            className={styles.mirror}
            fill="none"
          />
          {roughSegments.map(({ x, y, normalX2, normalY2, outgoingX, outgoingY }) => (
            <g key={x}>
              <line x1={x - 36} y1="54" x2={x} y2={y} className={styles.comparisonIncoming} />
              <line x1={x} y1={y} x2={outgoingX} y2={outgoingY} className={styles.comparisonOutgoing} />
              <line x1={x} y1={y} x2={normalX2} y2={normalY2} className={styles.comparisonNormal} />
            </g>
          ))}
          <text x="150" y="207" textAnchor="middle" className={styles.comparisonText}>
            рассеянное отражение
          </text>
        </g>
      </svg>
      <figcaption id="surface-comparison-caption">
        На каждом малом участке действует тот же закон отражения. Различие создают по-разному направленные нормали к участкам поверхности.
      </figcaption>
    </figure>
  );
}

export function ReflectionContentLesson() {
  return <article className={styles.lesson}>
    <header className={styles.intro}>
      <p className={styles.kicker}>Оптика · VIII класс</p>
      <h1>Отражение света</h1>
      <div className={styles.introGrid}><div><h2 className={styles.introHeading}>Когда свет встречает поверхность</h2><p className={styles.lead}>Свет от лампы, окна или экрана встречает поверхность зеркала, воды, стены или бумаги. Часть света может вернуться в ту среду, из которой пришла. Это явление называют отражением света.</p><p>Узкий пучок света на схеме изображают линией со стрелкой — световым лучом.</p></div><figure className={styles.evolvingFigure}><ReflectionDiagram phase="reflection" className={styles.diagram} /><figcaption>Падающий луч встречает гладкую поверхность; отражённый уходит от неё.</figcaption></figure></div>
    </header>

    <section className={styles.section} aria-labelledby="reading-heading"><div className={styles.sectionCopy}><p className={styles.sectionMark}>Схема</p><h2 id="reading-heading">Как читать схему отражения</h2><p>Луч, который идёт к поверхности, называют падающим. Луч, который идёт от поверхности после отражения, называют отражённым.</p><p>Место, где падающий луч встречает поверхность, называют точкой падения. Через эту точку проводят вспомогательную линию. Нормаль перпендикулярна поверхности: она образует с ней угол 90°.</p><p>Нормаль нужна, чтобы одинаково измерять направления обоих лучей. Угол между падающим лучом и нормалью называют углом падения и обозначают <span className={styles.math}>α</span>. Угол между отражённым лучом и нормалью называют углом отражения и обозначают <span className={styles.math}>β</span>.</p><p>Важно: эти углы измеряют от нормали, а не от поверхности зеркала.</p></div><figure className={styles.evolvingFigure}><ReflectionDiagram phase="normal" className={styles.diagram} /><figcaption>Схема постепенно получает нужные для чтения элементы: точку падения, прямой угол, нормаль и углы.</figcaption></figure></section>

    <section className={`${styles.section} ${styles.lawSection}`} aria-labelledby="law-heading"><div className={styles.sectionCopy}><p className={styles.sectionMark}>Закон</p><h2 id="law-heading">Закон отражения света</h2><p>Падающий луч, отражённый луч и нормаль, проведённая в точке падения, лежат в одной плоскости.</p><p>Угол отражения равен углу падения:</p><p className={styles.formula} aria-label="альфа равно бета">α = β</p><p>При наклонном падении лучи идут по разные стороны нормали. Если луч падает точно по нормали, угол падения равен 0°, и отражённый луч возвращается по тому же пути.</p></div><figure className={styles.evolvingFigure}><ReflectionDiagram phase="law" className={styles.diagram} /><figcaption>Нормаль позволяет увидеть симметрию лучей и сравнить α с β.</figcaption></figure></section>

    <aside className={styles.empiricalNote} aria-labelledby="why-equal-heading"><h2 id="why-equal-heading">Почему угол отражения равен углу падения?</h2><p>Это экспериментально установленная закономерность: она точно описывает то, что наблюдают при отражении света. Более глубокое объяснение требует другой модели света, с которой ты познакомишься позже.</p></aside>

    <section className={`${styles.section} ${styles.interactionSection}`} aria-label="Интерактивная модель отражения"><InteractiveReflection /></section>

    <section className={styles.section} aria-labelledby="example-heading"><div className={styles.sectionCopy}><p className={styles.sectionMark}>Пример</p><h2 id="example-heading">Когда угол дан к поверхности зеркала</h2><p>Падающий луч образует с поверхностью зеркала угол 35°. Это ещё не угол падения: его считают от нормали.</p><p>Нормаль образует с поверхностью прямой угол 90°, поэтому 35° и угол падения вместе составляют 90°.</p><div className={styles.workedMath} aria-label="Тридцать пять градусов плюс альфа равно девяносто градусов. Альфа равно пятьдесят пять градусов. Бета равно альфа равно пятьдесят пять градусов."><p>35° + α = 90°</p><p>α = 55°</p><p>β = α = 55°</p></div><p>Значит, отражённый луч нужно провести по другую сторону нормали под углом 55° к ней. К поверхности зеркала он снова образует угол 35°.</p></div><figure className={styles.evolvingFigure}><ReflectionDiagram phase="worked" angle={55} className={styles.diagram} /><figcaption>Сначала дан угол к поверхности, затем находятся и сравниваются углы к нормали.</figcaption></figure></section>

    <IndependentTask />

    <section className={`${styles.section} ${styles.diffuseSection}`} aria-labelledby="diffuse-heading"><div className={styles.sectionCopy}><p className={styles.sectionMark}>Поверхности</p><h2 id="diffuse-heading">Почему зеркало даёт чёткое изображение, а стена — нет</h2><p>Поверхность зеркала очень гладкая. На её малых участках нормали направлены почти одинаково, поэтому отражённые лучи идут упорядоченно. Такое отражение называют зеркальным.</p><p>Поверхность стены, бумаги или ткани неровная. У каждого малого участка своя нормаль, направленная немного иначе. Закон отражения выполняется локально для каждого малого участка поверхности, но отражённые лучи уходят в разные стороны. Такое отражение называют рассеянным.</p><p>Благодаря рассеянному отражению мы видим обычные предметы с разных направлений. Но чёткого изображения, как в зеркале, такая поверхность не создаёт.</p></div><SurfaceComparison /></section>

    <footer className={styles.lessonFooter}><h2>Дальше</h2><p>Теперь можно потренироваться применять закон отражения в задачах. Следующая связанная тема — плоское зеркало и построение изображения в нём.</p><div className={styles.handoffActions}><Link className={styles.primaryLink} href="/practice/family/reflection-angle">Тренировка по отражению</Link><Link className={styles.secondaryLink} href="/topics">Все темы</Link></div></footer>
  </article>;
}
