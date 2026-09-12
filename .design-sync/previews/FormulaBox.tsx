import { FormulaBox } from "web";

export const FreeFall = () => (
  <div style={{ width: 420 }}>
    <FormulaBox
      formula={"h=\\frac{gt^2}{2},\\qquad v=gt"}
      caption="путь и скорость при падении без начальной скорости"
    />
  </div>
);

export const WithLabel = () => (
  <div style={{ width: 420 }}>
    <FormulaBox
      label="формула"
      formula={"v=\\sqrt{2gh}"}
      caption="скорость у земли растёт как корень из высоты"
    />
  </div>
);

export const OhmLaw = () => (
  <div style={{ width: 420 }}>
    <FormulaBox formula={"I=\\frac{U}{R}"} caption="закон Ома для участка цепи" />
  </div>
);
