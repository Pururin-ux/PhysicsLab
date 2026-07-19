import { SolutionDisclosure } from "web";

const noop = () => {};

export const Collapsed = () => (
  <div style={{ width: 560 }}>
    <SolutionDisclosure
      explanation={
        "Тело падает из покоя, поэтому $h = \\frac{gt^2}{2} = \\frac{10 \\cdot 5^2}{2} = 125$ м. Частая ошибка: забыть квадрат времени или деление на 2."
      }
    />
  </div>
);

export const WithHelpLink = () => (
  <div style={{ width: 560 }}>
    <SolutionDisclosure
      explanation={
        "Из формулы тонкой линзы $\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}$ выражаем расстояние до изображения: $f=\\frac{F d}{d-F}=\\frac{10\\cdot30}{30-10}=15$ см."
      }
      helpTarget={{
        topicId: "optics",
        sectionId: "thin-lens",
        reason: "mistake",
        label: "Тонкая линза",
        shortHint: "Формула линзы связывает фокусное расстояние с расстояниями до предмета и до изображения.",
      }}
      onOpenHelp={noop}
    />
  </div>
);
