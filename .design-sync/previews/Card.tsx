import { Badge, Card } from "web";

export const Default = () => (
  <div style={{ width: 460 }}>
    <Card className="flex flex-col gap-3 p-5">
      <Badge tone="blue">План на сегодня</Badge>
      <h3 className="text-[20px] font-[800] leading-tight text-white">
        Начни с диагностики
      </h3>
      <p className="text-[13px] leading-[1.65] text-white/68">
        10 задач по пяти разделам — по две из каждого. После неё тренажёр
        покажет слабые места и соберёт план повторения.
      </p>
    </Card>
  </div>
);

export const Elevated = () => (
  <div style={{ width: 460 }}>
    <Card variant="elevated" className="flex flex-col gap-2 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/58">
        Итог тренировки
      </p>
      <p className="text-[34px] font-[800] leading-none text-white">8 / 10</p>
      <p className="text-[13px] text-white/62">Хороший результат — разбери две ловушки ниже.</p>
    </Card>
  </div>
);

export const FormulaVariant = () => (
  <div style={{ width: 460 }}>
    <Card variant="formula" glow="cyan" className="p-5 text-center">
      <p className="text-[15px] text-white/85">Карточка формулы с циановой рамкой и свечением</p>
    </Card>
  </div>
);
