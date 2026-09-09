import { ForceModel } from "web";

export const Resultant = () => (
  <div style={{ width: 460 }}>
    <ForceModel
      variant="resultant"
      title="Равнодействующая сил"
      caption="Силы вдоль одной прямой складываются с учётом знака: противоположные направления вычитаются."
    />
  </div>
);

export const LiftWeight = () => (
  <div style={{ width: 460 }}>
    <ForceModel
      variant="lift"
      title="Вес тела в лифте"
      caption="При ускорении вверх вес больше mg, при ускорении вниз — меньше. Важно направление ускорения, а не скорости."
    />
  </div>
);
