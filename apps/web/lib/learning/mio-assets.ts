export const MIO_PORTRAITS = {
  thinking: {
    src: "/images/mio/mio-thinking-v1.png",
    role: "Формулирует вопрос или обдумывает следующий шаг.",
  },
  attentive: {
    src: "/images/mio/mio-attentive-v1.png",
    role: "Сверяет условия, наблюдение или полученный результат.",
  },
  skeptical: {
    src: "/images/mio/mio-skeptical-v2.png",
    role: "Проверяет слишком удобную гипотезу, в том числе собственную.",
  },
  surprised: {
    src: "/images/mio/mio-surprised-v1.png",
    role: "Реагирует на неожиданное наблюдение, а не на обычный успех.",
  },
  celebrate: {
    src: "/images/mio/mio-celebrate-v1.png",
    role: "Отмечает уже подтверждённый результат; используется редко.",
  },
} as const;

export type MioPortraitState = keyof typeof MIO_PORTRAITS;

export const MIO_SCENES = {
  relative: "/images/mio/textbook-relative-v1.png",
  force: "/images/mio/textbook-force-v1.png",
  pressure: "/images/mio/textbook-pressure-v1.png",
  inertia: "/images/mio/textbook-inertia-v1.png",
  density: "/images/mio/textbook-density-v1.png",
  measurement: "/images/mio/textbook-measurement-v1.png",
  path: "/images/mio/textbook-path-v1.png",
  average: "/images/mio/textbook-average-v1.png",
  acceleration: "/images/mio/textbook-acceleration-v1.png",
} as const;

export type MioScene = keyof typeof MIO_SCENES;
