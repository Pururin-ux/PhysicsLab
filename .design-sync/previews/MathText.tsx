import { MathText } from "web";

export const MixedMarkup = () => (
  <div style={{ width: 520 }} className="text-[14px] leading-[1.7] text-white/80">
    <MathText
      text={
        "Для падения из покоя используй $h = \\frac{gt^2}{2}$. Считай ==весь путь / всё время==, а не **среднее арифметическое** скоростей."
      }
    />
  </div>
);

export const FormulaOnly = () => (
  <div style={{ width: 520 }} className="text-[15px] text-white/85">
    <MathText text={"Закон Ома для полной цепи: $I=\\frac{\\mathcal{E}}{R+r}$."} />
  </div>
);

export const HighlightAndBold = () => (
  <div style={{ width: 520 }} className="text-[14px] leading-[1.7] text-white/80">
    <MathText
      text={
        "Перпендикулярные скорости складывай ==векторно==: $v = \\sqrt{v_1^2 + v_2^2}$ — модули **нельзя** просто сложить."
      }
    />
  </div>
);
