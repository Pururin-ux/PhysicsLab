// Чистая геометрия оптических сцен: переводит углы/расстояния спецификации
// в координаты SVG. Никакой физики задач здесь нет — только тригонометрия
// размещения лучей. Покрыто unit-тестами (optics-diagram-geometry.test.ts).

export type Point = { x: number; y: number };

const DEG = Math.PI / 180;

export function toRadians(angleDeg: number): number {
  return angleDeg * DEG;
}

// Точка на расстоянии length от origin под углом angleDeg от вертикальной
// нормали (ось «вверх» экрана), в сторону side: -1 — влево, +1 — вправо.
// Используется для лучей у зеркала/границы сред: нормаль вертикальна,
// поверхность горизонтальна.
export function pointFromNormal(
  origin: Point,
  angleDeg: number,
  length: number,
  side: -1 | 1,
  vertical: -1 | 1,
): Point {
  const angle = toRadians(angleDeg);

  return {
    x: origin.x + side * Math.sin(angle) * length,
    y: origin.y + vertical * Math.cos(angle) * length,
  };
}

// Падающий луч приходит слева сверху к точке падения на горизонтальной
// поверхности; отражённый уходит вправо вверх под тем же углом к нормали.
export function reflectionRays(origin: Point, incidenceAngleDeg: number, reflectionAngleDeg: number, length: number) {
  return {
    incidentStart: pointFromNormal(origin, incidenceAngleDeg, length, -1, -1),
    reflectedEnd: pointFromNormal(origin, reflectionAngleDeg, length, 1, -1),
  };
}

// Преломлённый луч уходит вниз через границу, по ту же сторону от нормали,
// что и продолжение падающего луча (вправо, если падающий пришёл слева).
export function refractionRays(origin: Point, incidenceAngleDeg: number, refractionAngleDeg: number, length: number) {
  return {
    incidentStart: pointFromNormal(origin, incidenceAngleDeg, length, -1, -1),
    refractedEnd: pointFromNormal(origin, refractionAngleDeg, length, 1, 1),
  };
}

export type ThinLensLayout = {
  // Масштаб: px на единицу расстояния спецификации.
  scale: number;
  axisY: number;
  lensX: number;
  objectX: number;
  objectTopY: number;
  focusLeftX: number;
  focusRightX: number;
  doubleFocusLeftX: number;
  doubleFocusRightX: number;
  image: { x: number; tipY: number } | null;
};

// Раскладка тонкой линзы: линза в центре, предмет слева, изображение справа
// (если решение задано). Масштаб подбирается так, чтобы всё поместилось в
// заданную ширину с полями.
export function thinLensLayout(input: {
  focalLength: number;
  objectDistance: number;
  objectHeight?: number;
  imageDistance?: number;
  imageHeight?: number;
  width: number;
  height: number;
  margin: number;
}): ThinLensLayout {
  const { focalLength, objectDistance, imageDistance, width, height, margin } = input;

  const leftSpan = Math.max(objectDistance, 2 * focalLength);
  const rightSpan = Math.max(imageDistance ?? 0, 2 * focalLength);
  const scale = (width - margin * 2) / (leftSpan + rightSpan);

  const axisY = height / 2;
  const lensX = margin + leftSpan * scale;

  const objectHeight = input.objectHeight ?? focalLength * 0.55;
  const imageHeight = input.imageHeight ?? (imageDistance ? (objectHeight * imageDistance) / objectDistance : 0);
  // Высоты растягиваются отдельным масштабом, чтобы стрелки были читаемыми,
  // но сохраняли отношение h_i/h_o.
  const tallest = Math.max(objectHeight, imageHeight);
  const heightScale = tallest > 0 ? (height * 0.30) / tallest : 1;

  return {
    scale,
    axisY,
    lensX,
    objectX: lensX - objectDistance * scale,
    objectTopY: axisY - objectHeight * heightScale,
    focusLeftX: lensX - focalLength * scale,
    focusRightX: lensX + focalLength * scale,
    doubleFocusLeftX: lensX - 2 * focalLength * scale,
    doubleFocusRightX: lensX + 2 * focalLength * scale,
    image:
      imageDistance !== undefined
        ? {
            x: lensX + imageDistance * scale,
            // Действительное изображение собирающей линзы перевёрнуто —
            // стрелка вниз от оси.
            tipY: axisY + imageHeight * heightScale,
          }
        : null,
  };
}
