import { FormulaDisplay } from "web";

export const OhmFullCircuit = () => (
  <div style={{ width: 520 }}>
    <FormulaDisplay
      formula={"I=\\frac{\\mathcal{E}}{R+r}"}
      caption="ток ограничивают внешнее и внутреннее сопротивления"
      symbols={[
        { latex: "I", description: "сила тока в цепи, А" },
        { latex: "\\mathcal{E}", description: "ЭДС источника, В" },
        { latex: "R", description: "внешнее сопротивление, Ом" },
        { latex: "r", description: "внутреннее сопротивление источника, Ом" },
      ]}
      limitation="В знаменателе стоит сумма сопротивлений: внутреннее сопротивление нельзя отбрасывать."
    />
  </div>
);

export const FreeFallFormula = () => (
  <div style={{ width: 520 }}>
    <FormulaDisplay
      formula={"h=\\frac{gt^2}{2}"}
      caption="путь при падении без начальной скорости"
      symbols={[
        { latex: "h", description: "путь падения, м" },
        { latex: "g", description: "ускорение свободного падения, ≈ 10 м/с²" },
        { latex: "t", description: "время падения, с" },
      ]}
      limitation="Без сопротивления воздуха и с нулевой начальной скоростью."
    />
  </div>
);
