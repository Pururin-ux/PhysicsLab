import type { TopicId } from "../../lib/learning/taxonomy.ts";

// Единственный источник акцентов темы: карточки тем, страница урока и
// дашборд обязаны выглядеть согласованно, поэтому палитры лежат здесь, а не
// копируются по компонентам.
export type TopicAccent = {
  // Ключ палитры для Badge.
  badge: "cyan" | "gold" | "blue" | "ember" | "neutral";
  // Рамка карточки: слева оставляем цветной кант, остальное — нейтральное.
  border: string;
  // Плитка глифа темы.
  tile: string;
  // Заголовок/акцентный текст внутри карточки.
  text: string;
  // Заливка прогресс-бара темы.
  bar: string;
};

export const topicAccents: Record<TopicId, TopicAccent> = {
  kinematics: {
    badge: "cyan",
    border: "border-l-nova-cyan/60",
    tile: "border-nova-cyan/25 bg-nova-cyan/[.08] text-nova-cyan",
    text: "text-nova-cyan",
    bar: "bg-nova-cyan",
  },
  dynamics: {
    badge: "gold",
    border: "border-l-nova-gold/60",
    tile: "border-nova-gold/25 bg-nova-gold/[.08] text-nova-gold",
    text: "text-nova-gold",
    bar: "bg-nova-gold",
  },
  electrodynamics: {
    badge: "blue",
    border: "border-l-nova-blue/60",
    tile: "border-nova-blue/25 bg-nova-blue/[.08] text-nova-blue",
    text: "text-nova-blue",
    bar: "bg-nova-blue",
  },
  // Колебания и волны переиспользуют blue (ритм и волны, как в схемах).
  oscillations: {
    badge: "blue",
    border: "border-l-nova-blue/60",
    tile: "border-nova-blue/25 bg-nova-blue/[.08] text-nova-blue",
    text: "text-nova-blue",
    bar: "bg-nova-blue",
  },
  // Квантовая и атомная физика переиспользуют gold (излучение и ядро).
  quantum: {
    badge: "gold",
    border: "border-l-nova-gold/60",
    tile: "border-nova-gold/25 bg-nova-gold/[.08] text-nova-gold",
    text: "text-nova-gold",
    bar: "bg-nova-gold",
  },
  thermodynamics: {
    badge: "ember",
    border: "border-l-nova-ember/60",
    tile: "border-nova-ember/25 bg-nova-ember/[.08] text-nova-ember",
    text: "text-nova-ember",
    bar: "bg-nova-ember",
  },
  // Оптика переиспользует cyan (лучи света) — новых токенов не заводим.
  optics: {
    badge: "cyan",
    border: "border-l-nova-cyan/60",
    tile: "border-nova-cyan/25 bg-nova-cyan/[.08] text-nova-cyan",
    text: "text-nova-cyan",
    bar: "bg-nova-cyan",
  },
};

export function getTopicAccent(topicId: TopicId): TopicAccent {
  return topicAccents[topicId];
}
