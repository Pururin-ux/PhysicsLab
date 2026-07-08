// Координаты для четырёх фиксированных семейств схем. viewBox общий —
// 0 0 320 180, чтобы все топологии выглядели соразмерно друг другу.

export type ResistorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
};

export type CircuitLayout = {
  // Замкнутый контур для расчёта offset-path у анимации.
  loopPath: string;
  // Видимый провод с разрывом под пластинами источника (см. CircuitVisual.tsx).
  wireDrawPath: string;
  // Дополнительные провода (внутренние ветви параллельной схемы).
  extraWires?: string[];
  sourcePlates: { long: [number, number, number, number]; short: [number, number, number, number] };
  sourceLabelPos: { x: number; y: number };
  resistors: ResistorRect[];
  internalResistor?: ResistorRect & { isHorizontal: true };
};

const SOURCE_PLATES = {
  long: [48, 74, 72, 74] as [number, number, number, number],
  short: [54, 90, 66, 90] as [number, number, number, number],
};
const SOURCE_LABEL_POS = { x: 34, y: 86 };

export const CIRCUIT_LAYOUTS: Record<"single" | "series" | "parallel" | "source-internal", CircuitLayout> = {
  single: {
    loopPath: "M 60 40 H 250 V 140 H 60 Z",
    wireDrawPath: "M 60 66 V 40 H 250 V 140 H 60 V 98",
    sourcePlates: SOURCE_PLATES,
    sourceLabelPos: SOURCE_LABEL_POS,
    resistors: [
      { x: 238, y: 70, width: 24, height: 44, labelX: 284, labelY: 96 },
    ],
  },
  series: {
    loopPath: "M 60 40 H 250 V 140 H 60 Z",
    wireDrawPath: "M 60 66 V 40 H 250 V 140 H 60 V 98",
    sourcePlates: SOURCE_PLATES,
    sourceLabelPos: SOURCE_LABEL_POS,
    resistors: [
      { x: 228, y: 52, width: 24, height: 32, labelX: 284, labelY: 72 },
      { x: 228, y: 96, width: 24, height: 32, labelX: 284, labelY: 116 },
    ],
  },
  parallel: {
    loopPath: "M 60 40 H 250 V 140 H 60 Z",
    wireDrawPath: "M 60 66 V 40 H 250 V 140 H 60 V 98",
    extraWires: ["M 152 40 V 140"],
    sourcePlates: SOURCE_PLATES,
    sourceLabelPos: SOURCE_LABEL_POS,
    resistors: [
      { x: 140, y: 70, width: 24, height: 44, labelX: 118, labelY: 96 },
      { x: 238, y: 70, width: 24, height: 44, labelX: 284, labelY: 96 },
    ],
  },
  "source-internal": {
    loopPath: "M 60 40 H 250 V 140 H 60 Z",
    // Резистор r непрозрачный и рисуется поверх провода — отдельный разрыв
    // в проводе, в отличие от разрыва под пластинами источника, не нужен.
    wireDrawPath: "M 60 66 V 40 H 250 V 140 H 60 V 98",
    sourcePlates: SOURCE_PLATES,
    sourceLabelPos: SOURCE_LABEL_POS,
    resistors: [{ x: 238, y: 70, width: 24, height: 44, labelX: 284, labelY: 96 }],
    internalResistor: { x: 96, y: 32, width: 20, height: 16, labelX: 106, labelY: 24, isHorizontal: true },
  },
};

// Слот для ключа/переключателя — всегда на нижнем проводе, левее прибора.
export const SWITCH_SLOT = { xLeft: 118, xRight: 148, y: 140, labelX: 133, labelY: 156 };
// Слот для амперметра — на нижнем проводе, правее ключа.
export const AMMETER_SLOT = { x: 195, y: 140, r: 10 };
// Слот для вольтметра — над резистором R (первым в списке), с отводами вниз.
export const VOLTMETER_SLOT = { x: 262, y: 46, r: 11 };
