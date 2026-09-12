import { GasVesselVisual, TextConceptReveal } from "web";

export const IdealGas = () => (
  <div style={{ width: 720 }}>
    <TextConceptReveal
      accentClass="border-l-nova-ember/55"
      visual={
        <GasVesselVisual
          title="Молекулы газа в закрытом сосуде"
          caption="Молекулы бьются о стенки сосуда. Чем ==выше температура==, тем быстрее они и тем сильнее давление."
        />
      }
      meaningText="Давление, объём и температура связаны одним уравнением — но только с температурой в **кельвинах**, не в °C."
      trap="Ошибка: подставить °C, не переведя в кельвины."
      formula={"pV=\\nu RT"}
      formulaCaption="уравнение состояния идеального газа"
      symbols={[
        { latex: "p", description: "давление газа, кПа (при V в литрах)" },
        { latex: "V", description: "объём газа, л" },
        { latex: "\\nu", description: "количество вещества, моль" },
        { latex: "R", description: "универсальная газовая постоянная, 8,31 Дж/(моль·К)" },
        { latex: "T", description: "абсолютная температура, К" },
      ]}
      limitation="Температура обязательно в кельвинах: T = t°C + 273."
    />
  </div>
);
