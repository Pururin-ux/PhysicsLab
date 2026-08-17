import type { MathLabelSpec } from "./physics-graph-spec";

export type VectorTone = "cyan" | "gold" | "blue" | "ember" | "muted";

export type PlanarVector = {
  id: string;
  dx: number;
  dy: number;
  label?: MathLabelSpec;
  tone?: VectorTone;
  dashed?: boolean;
};

// Угол отмечается между направлениями двух векторов в точке их общего
// конца (не важно, начало это или конец стрелки — геометрия сама найдёт
// точку стыка).
export type AngleMarkSpec = {
  between: [string, string];
  label?: MathLabelSpec;
  radius?: number;
};

export type VectorDiagramSpec = {
  id?: string;
  // Сетка симметрична: по обеим осям от -gridRange до +gridRange.
  gridRange: number;
  // concurrent — все векторы выходят из одной точки (силы, приложенные к телу);
  // chain — векторы пристыкованы «конец к началу» (сложение скоростей/перемещений).
  layout: "concurrent" | "chain";
  vectors: PlanarVector[];
  showResultant?: boolean;
  resultantLabel?: MathLabelSpec;
  resultantTone?: VectorTone;
  angleMarks?: AngleMarkSpec[];
  showGrid?: boolean;
};
