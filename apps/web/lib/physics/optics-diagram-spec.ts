// Спецификация оптических диаграмм. Контракт намеренно типобезопасный
// discriminated union: renderer (OpticsDiagram) знает только геометрию сцены,
// не blueprint-ids и не решение задачи — все физические величины приходят
// из генератора готовыми числами.
//
// Разделение prompt/solution: поля, помеченные «решение», рендерятся только
// когда QuestionCard передаёт showSolutionContent=true. До ответа эти элементы
// не существуют в DOM и в accessibility tree (не прячем ответ через opacity).

export type OpticsDiagramSpec =
  | {
      scene: "reflection";
      // Угол падения от нормали, 0–90°.
      incidenceAngleDeg: number;
      // Решение: угол отражения от нормали. Рисуется только после ответа.
      reflectionAngleDeg: number;
      showLabels?: boolean;
    }
  | {
      scene: "plane_mirror";
      // Расстояние предмета до зеркала.
      objectDistance: number;
      // Решение: расстояние мнимого изображения за зеркалом.
      imageDistance: number;
      unit: string;
    }
  | {
      scene: "refraction";
      incidenceAngleDeg: number;
      refractionAngleDeg: number;
      medium1Label: string;
      medium2Label: string;
      // true — преломлённый луч дан по условию и виден до ответа
      // (например, когда спрашивают отношение показателей, а оба угла даны).
      refractedGiven?: boolean;
    }
  | {
      scene: "thin_lens";
      lensType: "converging";
      focalLength: number;
      objectDistance: number;
      objectHeight?: number;
      // Решение: положение/размер изображения. Без них solution-состояние
      // не рисует изображение и главные лучи.
      imageDistance?: number;
      imageHeight?: number;
      unit: string;
    };
