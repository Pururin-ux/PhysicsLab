import { useId } from "react";
import type { OpticsDiagramSpec } from "../../lib/physics/optics-diagram-spec";
import { cn } from "../../lib/utils";
import {
  reflectionRays,
  refractionRays,
  thinLensLayout,
} from "./optics-diagram-geometry";

// Рендерер оптических сцен. Только геометрия SVG: физические величины приходят
// готовыми из spec. Solution-элементы (отражённый/преломлённый луч, мнимое
// изображение, изображение линзы с главными лучами) рендерятся ТОЛЬКО при
// showSolution — до ответа их нет ни в DOM, ни в accessibility tree.

type OpticsDiagramProps = {
  spec: OpticsDiagramSpec;
  showSolution?: boolean;
  className?: string;
};

const WIDTH = 340;
const HEIGHT = 220;

const SURFACE = "rgba(8, 13, 22, 0.62)";
const RAY_GIVEN = "#00E0FF";
const RAY_SOLUTION = "#D4AF37";
const STRUCTURE = "rgba(226, 232, 240, 0.5)";
const NORMAL_DASH = "5 5";
const VIRTUAL_DASH = "6 5";
const TEXT = "rgba(248, 250, 252, 0.78)";
const TEXT_DIM = "rgba(248, 250, 252, 0.55)";

function describeSpec(spec: OpticsDiagramSpec, showSolution: boolean): { title: string; desc: string } {
  switch (spec.scene) {
    case "reflection":
      return {
        title: "Отражение луча от плоского зеркала",
        desc: showSolution
          ? `Падающий луч под углом ${spec.incidenceAngleDeg}° к нормали и отражённый луч под углом ${spec.reflectionAngleDeg}° к нормали.`
          : `Падающий луч под углом ${spec.incidenceAngleDeg}° к нормали; нормаль показана штриховой линией.`,
      };
    case "plane_mirror":
      return {
        title: "Предмет перед плоским зеркалом",
        desc: showSolution
          ? `Предмет на расстоянии ${spec.objectDistance} ${spec.unit} перед зеркалом и его мнимое изображение на расстоянии ${spec.imageDistance} ${spec.unit} за зеркалом.`
          : `Предмет на расстоянии ${spec.objectDistance} ${spec.unit} перед плоским зеркалом.`,
      };
    case "refraction":
      return {
        title: "Преломление луча на границе двух сред",
        desc:
          showSolution || spec.refractedGiven
            ? `Луч переходит из среды «${spec.medium1Label}» в среду «${spec.medium2Label}»: угол падения ${spec.incidenceAngleDeg}°, угол преломления ${spec.refractionAngleDeg}°, оба от нормали.`
            : `Луч падает из среды «${spec.medium1Label}» на границу со средой «${spec.medium2Label}» под углом ${spec.incidenceAngleDeg}° к нормали.`,
      };
    case "thin_lens":
      return {
        title: "Собирающая тонкая линза",
        desc: showSolution
          ? `Предмет на расстоянии ${spec.objectDistance} ${spec.unit} от линзы с фокусным расстоянием ${spec.focalLength} ${spec.unit}; показано построенное изображение.`
          : `Предмет на расстоянии ${spec.objectDistance} ${spec.unit} от собирающей линзы с фокусным расстоянием ${spec.focalLength} ${spec.unit}; отмечены F и 2F.`,
      };
  }
}

function ArrowDefs({ markerId }: { markerId: string }) {
  return (
    <defs>
      <marker
        id={`${markerId}-given`}
        viewBox="0 0 10 10"
        refX="8.6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={RAY_GIVEN} />
      </marker>
      <marker
        id={`${markerId}-solution`}
        viewBox="0 0 10 10"
        refX="8.6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={RAY_SOLUTION} />
      </marker>
    </defs>
  );
}

// Стрелка направления посередине луча (лучи различимы не только цветом:
// данный — сплошной с одинарной стрелкой, решение — с двойной насечкой).
function RayLine({
  from,
  to,
  tone,
  markerId,
  solution = false,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  tone: string;
  markerId: string;
  solution?: boolean;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={tone}
      strokeWidth={solution ? 2.5 : 2.25}
      strokeLinecap="round"
      markerEnd={`url(#${markerId})`}
    />
  );
}

function ReflectionScene({
  spec,
  showSolution,
  markerBase,
}: {
  spec: Extract<OpticsDiagramSpec, { scene: "reflection" }>;
  showSolution: boolean;
  markerBase: string;
}) {
  const origin = { x: WIDTH / 2, y: 158 };
  const rayLength = 118;
  const { incidentStart, reflectedEnd } = reflectionRays(
    origin,
    spec.incidenceAngleDeg,
    spec.reflectionAngleDeg,
    rayLength,
  );
  const labels = spec.showLabels ?? true;

  return (
    <g>
      {/* Зеркало: линия со штриховкой снизу */}
      <line x1={40} y1={origin.y} x2={WIDTH - 40} y2={origin.y} stroke={STRUCTURE} strokeWidth={2.5} />
      <g aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => {
          const x = 52 + index * 20;
          return <line key={index} x1={x} y1={origin.y} x2={x - 8} y2={origin.y + 10} stroke={STRUCTURE} strokeWidth={1} />;
        })}
      </g>
      {/* Нормаль — штриховая */}
      <line
        x1={origin.x}
        y1={origin.y}
        x2={origin.x}
        y2={origin.y - 128}
        stroke={STRUCTURE}
        strokeWidth={1.5}
        strokeDasharray={NORMAL_DASH}
      />
      {labels ? (
        <text x={origin.x + 6} y={origin.y - 116} fill={TEXT_DIM} fontSize={11}>
          нормаль
        </text>
      ) : null}

      {/* Падающий луч (дано) */}
      <RayLine from={incidentStart} to={origin} tone={RAY_GIVEN} markerId={`${markerBase}-given`} />
      {labels ? (
        <text x={(incidentStart.x + origin.x) / 2 - 10} y={(incidentStart.y + origin.y) / 2 - 12} fill={RAY_GIVEN} fontSize={12} textAnchor="end">
          {spec.incidenceAngleDeg}°
        </text>
      ) : null}

      {showSolution ? (
        <g data-testid="optics-solution">
          <RayLine from={origin} to={reflectedEnd} tone={RAY_SOLUTION} markerId={`${markerBase}-solution`} solution />
          <text x={(origin.x + reflectedEnd.x) / 2 + 12} y={(origin.y + reflectedEnd.y) / 2 - 12} fill={RAY_SOLUTION} fontSize={12}>
            {spec.reflectionAngleDeg}°
          </text>
        </g>
      ) : null}
    </g>
  );
}

function PlaneMirrorScene({
  spec,
  showSolution,
}: {
  spec: Extract<OpticsDiagramSpec, { scene: "plane_mirror" }>;
  showSolution: boolean;
}) {
  const mirrorX = WIDTH / 2;
  const axisY = 118;
  // Масштаб по большему из расстояний, чтобы обе половины поместились.
  const span = Math.max(spec.objectDistance, spec.imageDistance);
  const scale = (WIDTH / 2 - 56) / span;
  const objectX = mirrorX - spec.objectDistance * scale;
  const imageX = mirrorX + spec.imageDistance * scale;

  return (
    <g>
      {/* Зеркало вертикальное со штриховкой с тыльной стороны */}
      <line x1={mirrorX} y1={30} x2={mirrorX} y2={190} stroke={STRUCTURE} strokeWidth={2.5} />
      <g aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => {
          const y = 42 + index * 20;
          return <line key={index} x1={mirrorX} y1={y} x2={mirrorX + 9} y2={y + 8} stroke={STRUCTURE} strokeWidth={1} />;
        })}
      </g>

      {/* Предмет — стрелка вверх */}
      <line x1={objectX} y1={axisY + 34} x2={objectX} y2={axisY - 34} stroke={RAY_GIVEN} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M ${objectX - 6} ${axisY - 24} L ${objectX} ${axisY - 34} L ${objectX + 6} ${axisY - 24}`} stroke={RAY_GIVEN} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <text x={objectX} y={axisY + 52} fill={TEXT} fontSize={12} textAnchor="middle">
        предмет
      </text>

      {/* Отрезок расстояния до зеркала (дано) */}
      <line x1={objectX} y1={172} x2={mirrorX} y2={172} stroke={TEXT_DIM} strokeWidth={1} />
      <text x={(objectX + mirrorX) / 2} y={186} fill={TEXT_DIM} fontSize={11} textAnchor="middle">
        {spec.objectDistance} {spec.unit}
      </text>

      {showSolution ? (
        <g data-testid="optics-solution">
          {/* Мнимое изображение — пунктирная стрелка за зеркалом */}
          <line x1={imageX} y1={axisY + 34} x2={imageX} y2={axisY - 34} stroke={RAY_SOLUTION} strokeWidth={2.5} strokeDasharray={VIRTUAL_DASH} strokeLinecap="round" />
          <path d={`M ${imageX - 6} ${axisY - 24} L ${imageX} ${axisY - 34} L ${imageX + 6} ${axisY - 24}`} stroke={RAY_SOLUTION} strokeWidth={2.5} strokeDasharray={VIRTUAL_DASH} fill="none" strokeLinecap="round" />
          <text x={imageX} y={axisY + 52} fill={RAY_SOLUTION} fontSize={12} textAnchor="middle">
            изображение
          </text>
          <line x1={mirrorX} y1={172} x2={imageX} y2={172} stroke={RAY_SOLUTION} strokeWidth={1} strokeDasharray={VIRTUAL_DASH} />
          <text x={(mirrorX + imageX) / 2} y={186} fill={RAY_SOLUTION} fontSize={11} textAnchor="middle">
            {spec.imageDistance} {spec.unit}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function RefractionScene({
  spec,
  showSolution,
  markerBase,
}: {
  spec: Extract<OpticsDiagramSpec, { scene: "refraction" }>;
  showSolution: boolean;
  markerBase: string;
}) {
  const origin = { x: WIDTH / 2, y: HEIGHT / 2 };
  const rayLength = 92;
  const { incidentStart, refractedEnd } = refractionRays(
    origin,
    spec.incidenceAngleDeg,
    spec.refractionAngleDeg,
    rayLength,
  );
  const showRefracted = showSolution || spec.refractedGiven === true;

  return (
    <g>
      {/* Нижняя среда затонирована — среды различаются не только подписью */}
      <rect x={24} y={origin.y} width={WIDTH - 48} height={HEIGHT / 2 - 30} fill="rgba(45, 156, 255, 0.08)" rx={4} />
      {/* Граница сред */}
      <line x1={24} y1={origin.y} x2={WIDTH - 24} y2={origin.y} stroke={STRUCTURE} strokeWidth={2} />
      {/* Нормаль — штриховая вертикаль */}
      <line x1={origin.x} y1={origin.y - 92} x2={origin.x} y2={origin.y + 88} stroke={STRUCTURE} strokeWidth={1.5} strokeDasharray={NORMAL_DASH} />

      <text x={30} y={origin.y - 12} fill={TEXT_DIM} fontSize={11}>
        {spec.medium1Label}
      </text>
      <text x={30} y={origin.y + 18} fill={TEXT_DIM} fontSize={11}>
        {spec.medium2Label}
      </text>

      <RayLine from={incidentStart} to={origin} tone={RAY_GIVEN} markerId={`${markerBase}-given`} />
      <text x={(incidentStart.x + origin.x) / 2 - 12} y={(incidentStart.y + origin.y) / 2 - 10} fill={RAY_GIVEN} fontSize={12} textAnchor="end">
        {spec.incidenceAngleDeg}°
      </text>

      {showRefracted ? (
        <g data-testid={spec.refractedGiven ? undefined : "optics-solution"}>
          <RayLine
            from={origin}
            to={refractedEnd}
            tone={spec.refractedGiven ? RAY_GIVEN : RAY_SOLUTION}
            markerId={spec.refractedGiven ? `${markerBase}-given` : `${markerBase}-solution`}
            solution={!spec.refractedGiven}
          />
          <text
            x={(origin.x + refractedEnd.x) / 2 + 12}
            y={(origin.y + refractedEnd.y) / 2 + 4}
            fill={spec.refractedGiven ? RAY_GIVEN : RAY_SOLUTION}
            fontSize={12}
          >
            {spec.refractionAngleDeg}°
          </text>
        </g>
      ) : null}
    </g>
  );
}

function ThinLensScene({
  spec,
  showSolution,
  markerBase,
}: {
  spec: Extract<OpticsDiagramSpec, { scene: "thin_lens" }>;
  showSolution: boolean;
  markerBase: string;
}) {
  const layout = thinLensLayout({
    focalLength: spec.focalLength,
    objectDistance: spec.objectDistance,
    objectHeight: spec.objectHeight,
    imageDistance: spec.imageDistance,
    imageHeight: spec.imageHeight,
    width: WIDTH,
    height: HEIGHT,
    margin: 30,
  });
  const lensHalf = 74;
  const solutionVisible = showSolution && layout.image !== null;

  return (
    <g>
      {/* Главная оптическая ось */}
      <line x1={16} y1={layout.axisY} x2={WIDTH - 16} y2={layout.axisY} stroke={STRUCTURE} strokeWidth={1.25} />
      {/* Линза: вертикаль с двунаправленными стрелками (собирающая) */}
      <line x1={layout.lensX} y1={layout.axisY - lensHalf} x2={layout.lensX} y2={layout.axisY + lensHalf} stroke={TEXT} strokeWidth={2} />
      <path d={`M ${layout.lensX - 6} ${layout.axisY - lensHalf + 10} L ${layout.lensX} ${layout.axisY - lensHalf} L ${layout.lensX + 6} ${layout.axisY - lensHalf + 10}`} stroke={TEXT} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d={`M ${layout.lensX - 6} ${layout.axisY + lensHalf - 10} L ${layout.lensX} ${layout.axisY + lensHalf} L ${layout.lensX + 6} ${layout.axisY + lensHalf - 10}`} stroke={TEXT} strokeWidth={2} fill="none" strokeLinecap="round" />

      {/* Фокусы и двойные фокусы */}
      {[
        { x: layout.focusLeftX, label: "F" },
        { x: layout.focusRightX, label: "F" },
        { x: layout.doubleFocusLeftX, label: "2F" },
        { x: layout.doubleFocusRightX, label: "2F" },
      ].map((mark, index) => (
        <g key={index}>
          <line x1={mark.x} y1={layout.axisY - 4} x2={mark.x} y2={layout.axisY + 4} stroke={TEXT} strokeWidth={1.5} />
          <text x={mark.x} y={layout.axisY + 18} fill={TEXT_DIM} fontSize={11} textAnchor="middle">
            {mark.label}
          </text>
        </g>
      ))}

      {/* Предмет — стрелка вверх (дано) */}
      <line x1={layout.objectX} y1={layout.axisY} x2={layout.objectX} y2={layout.objectTopY} stroke={RAY_GIVEN} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M ${layout.objectX - 5} ${layout.objectTopY + 9} L ${layout.objectX} ${layout.objectTopY} L ${layout.objectX + 5} ${layout.objectTopY + 9}`} stroke={RAY_GIVEN} strokeWidth={2.5} fill="none" strokeLinecap="round" />

      {solutionVisible ? (
        <g data-testid="optics-solution">
          {/* Главные лучи: параллельный оси -> через F; через центр линзы */}
          <polyline
            points={`${layout.objectX},${layout.objectTopY} ${layout.lensX},${layout.objectTopY} ${layout.image!.x},${layout.image!.tipY}`}
            fill="none"
            stroke={RAY_SOLUTION}
            strokeWidth={1.5}
            markerEnd={`url(#${markerBase}-solution)`}
          />
          <line
            x1={layout.objectX}
            y1={layout.objectTopY}
            x2={layout.image!.x}
            y2={layout.image!.tipY}
            stroke={RAY_SOLUTION}
            strokeWidth={1.5}
            markerEnd={`url(#${markerBase}-solution)`}
          />
          {/* Изображение — перевёрнутая стрелка вниз */}
          <line x1={layout.image!.x} y1={layout.axisY} x2={layout.image!.x} y2={layout.image!.tipY} stroke={RAY_SOLUTION} strokeWidth={2.5} strokeLinecap="round" />
          <path
            d={`M ${layout.image!.x - 5} ${layout.image!.tipY - 9} L ${layout.image!.x} ${layout.image!.tipY} L ${layout.image!.x + 5} ${layout.image!.tipY - 9}`}
            stroke={RAY_SOLUTION}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />
          <text x={layout.image!.x} y={layout.image!.tipY + 16} fill={RAY_SOLUTION} fontSize={11} textAnchor="middle">
            изображение
          </text>
        </g>
      ) : null}
    </g>
  );
}

export function OpticsDiagram({ spec, showSolution = false, className }: OpticsDiagramProps) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const markerBase = `optics-${reactId}`;
  const { title, desc } = describeSpec(spec, showSolution);
  const titleId = `${markerBase}-title`;
  const descId = `${markerBase}-desc`;

  return (
    <div
      data-testid="optics-diagram"
      data-scene={spec.scene}
      data-solution={showSolution}
      className={cn("w-full min-w-0 overflow-hidden rounded-option", className)}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="mx-auto h-auto w-full max-w-[380px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{desc}</desc>
        <ArrowDefs markerId={markerBase} />
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} rx="14" fill={SURFACE} />
        {spec.scene === "reflection" ? (
          <ReflectionScene spec={spec} showSolution={showSolution} markerBase={markerBase} />
        ) : spec.scene === "plane_mirror" ? (
          <PlaneMirrorScene spec={spec} showSolution={showSolution} />
        ) : spec.scene === "refraction" ? (
          <RefractionScene spec={spec} showSolution={showSolution} markerBase={markerBase} />
        ) : (
          <ThinLensScene spec={spec} showSolution={showSolution} markerBase={markerBase} />
        )}
      </svg>
    </div>
  );
}
