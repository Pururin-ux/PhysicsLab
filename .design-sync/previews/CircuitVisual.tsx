import { CircuitVisual } from "web";

export const SimpleCircuit = () => (
  <div style={{ width: 460 }}>
    <CircuitVisual
      title="Простая цепь с резистором"
      caption="Ток в цепи растёт с напряжением источника и падает с сопротивлением нагрузки: I = U/R."
    />
  </div>
);
