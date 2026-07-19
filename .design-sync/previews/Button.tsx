import { Button } from "web";

export const Variants = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button variant="primary">Начать тренировку</Button>
    <Button variant="ghost">Открыть разбор</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
    <Button size="sm">Решить 5 похожих</Button>
    <Button size="md">Продолжить: Кинематика</Button>
  </div>
);

export const FullWidth = () => (
  <div style={{ width: 360 }}>
    <Button size="lg">Пройти диагностику</Button>
  </div>
);

export const Disabled = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Button disabled>Проверить прогноз</Button>
    <Button variant="ghost" disabled>
      Дальше
    </Button>
  </div>
);
