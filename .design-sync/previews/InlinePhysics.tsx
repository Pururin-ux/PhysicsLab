import { InlinePhysics } from "web";

export const InSentence = () => (
  <p style={{ width: 520 }} className="text-[14px] leading-[1.7] text-white/80">
    Скорость <InlinePhysics>v = 12 м/с</InlinePhysics> и время{" "}
    <InlinePhysics>t = 4 с</InlinePhysics> дают путь{" "}
    <InlinePhysics>s = 48 м</InlinePhysics> — величины не переносятся на новую
    строку.
  </p>
);

export const Constants = () => (
  <p style={{ width: 520 }} className="text-[14px] leading-[1.7] text-white/80">
    Прими <InlinePhysics>g = 10 м/с²</InlinePhysics>, удельную теплоёмкость воды{" "}
    <InlinePhysics>c = 4200 Дж/(кг·°C)</InlinePhysics> и{" "}
    <InlinePhysics>λ = 340 кДж/кг</InlinePhysics>.
  </p>
);
