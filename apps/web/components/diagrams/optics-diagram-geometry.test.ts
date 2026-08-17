import assert from "node:assert/strict";
import test from "node:test";
import {
  pointFromNormal,
  reflectionRays,
  refractionRays,
  thinLensLayout,
} from "./optics-diagram-geometry.ts";

const origin = { x: 160, y: 130 };

test("pointFromNormal даёт конечные координаты для всех углов 0–90°", () => {
  for (let angle = 0; angle <= 90; angle += 5) {
    const point = pointFromNormal(origin, angle, 100, 1, -1);
    assert.equal(Number.isFinite(point.x), true);
    assert.equal(Number.isFinite(point.y), true);
  }
});

test("отражённый луч симметричен падающему относительно нормали", () => {
  const { incidentStart, reflectedEnd } = reflectionRays(origin, 35, 35, 100);

  // Одинаковое отклонение от нормали по горизонтали, в разные стороны.
  assert.ok(Math.abs((origin.x - incidentStart.x) - (reflectedEnd.x - origin.x)) < 1e-9);
  // Оба конца выше поверхности (луч не уходит под зеркало).
  assert.ok(incidentStart.y < origin.y);
  assert.ok(reflectedEnd.y < origin.y);
});

test("преломлённый луч уходит под границу по ту же сторону от нормали", () => {
  const { incidentStart, refractedEnd } = refractionRays(origin, 45, 28, 100);

  assert.ok(incidentStart.y < origin.y, "падающий луч приходит сверху");
  assert.ok(refractedEnd.y > origin.y, "преломлённый луч идёт вниз, во вторую среду");
  assert.ok(incidentStart.x < origin.x, "падающий — слева от нормали");
  assert.ok(refractedEnd.x > origin.x, "преломлённый — справа от нормали (продолжение хода)");
});

test("преломление к нормали: меньший угол даёт меньшее горизонтальное отклонение", () => {
  const dense = refractionRays(origin, 45, 28, 100);
  const denser = refractionRays(origin, 45, 15, 100);

  assert.ok(
    denser.refractedEnd.x - origin.x < dense.refractedEnd.x - origin.x,
    "чем плотнее среда, тем ближе луч к нормали",
  );
});

test("thin lens layout: изображение согласовано с переданными величинами", () => {
  const layout = thinLensLayout({
    focalLength: 10,
    objectDistance: 15,
    objectHeight: 4,
    imageDistance: 30,
    imageHeight: 8,
    width: 340,
    height: 220,
    margin: 24,
  });

  assert.ok(layout.image, "решение содержит изображение");
  // Изображение справа от линзы на imageDistance по масштабу.
  assert.ok(Math.abs(layout.image!.x - (layout.lensX + 30 * layout.scale)) < 1e-9);
  // Предмет слева от линзы на objectDistance.
  assert.ok(Math.abs(layout.objectX - (layout.lensX - 15 * layout.scale)) < 1e-9);
  // F и 2F симметричны вокруг линзы.
  assert.ok(Math.abs((layout.lensX - layout.focusLeftX) - (layout.focusRightX - layout.lensX)) < 1e-9);
  assert.ok(Math.abs((layout.lensX - layout.doubleFocusLeftX) - 2 * (layout.lensX - layout.focusLeftX)) < 1e-9);
  // Перевёрнутое изображение — ниже оси, предмет — выше.
  assert.ok(layout.objectTopY < layout.axisY);
  assert.ok(layout.image!.tipY > layout.axisY);
  // Отношение высот в пикселях равно h_i/h_o.
  const objectPx = layout.axisY - layout.objectTopY;
  const imagePx = layout.image!.tipY - layout.axisY;
  assert.ok(Math.abs(imagePx / objectPx - 8 / 4) < 1e-9);
  // Всё в пределах кадра.
  for (const x of [layout.objectX, layout.image!.x, layout.doubleFocusLeftX, layout.doubleFocusRightX]) {
    assert.ok(x >= 0 && x <= 340, `координата ${x} внутри кадра`);
    assert.equal(Number.isFinite(x), true);
  }
});

test("thin lens layout без решения не создаёт изображение", () => {
  const layout = thinLensLayout({
    focalLength: 10,
    objectDistance: 25,
    width: 340,
    height: 220,
    margin: 24,
  });

  assert.equal(layout.image, null);
  assert.equal(Number.isFinite(layout.scale), true);
  assert.ok(layout.scale > 0);
});
