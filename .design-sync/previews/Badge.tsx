import { Badge } from "web";

export const Tones = () => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
    <Badge>Один ответ</Badge>
    <Badge tone="cyan">Верно</Badge>
    <Badge tone="gold">Стоит повторить</Badge>
    <Badge tone="blue">Сложность 2</Badge>
    <Badge tone="ember">Кинематика</Badge>
  </div>
);

export const InContext = () => (
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <Badge tone="blue">Диагностика</Badge>
    <Badge tone="cyan">10 задач</Badge>
    <Badge>без таймера</Badge>
  </div>
);
