import { TopicPageHeader } from "web";

export const Kinematics = () => (
  <div style={{ width: 640 }}>
    <TopicPageHeader
      eyebrow="Тренировка"
      title="Кинематика"
      description="10 задач: движение, графики и формулы. Если застрянешь — открой разбор темы."
      accent="cyan"
    />
  </div>
);

export const Optics = () => (
  <div style={{ width: 640 }}>
    <TopicPageHeader
      eyebrow="Тренировка"
      title="Оптика"
      description="10 задач с диаграммами: отражение, плоское зеркало, преломление и собирающая линза."
      accent="gold"
    />
  </div>
);
