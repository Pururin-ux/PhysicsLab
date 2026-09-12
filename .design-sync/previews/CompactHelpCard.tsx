import { CompactHelpCard } from "web";

export const WithFormulaAndTrap = () => (
  <div style={{ width: 460 }}>
    <CompactHelpCard
      accent="cyan"
      title="Отражение"
      body="Угол отражения равен углу падения. Оба угла отсчитываются от нормали — перпендикуляра к зеркалу в точке падения."
      formula={"\\beta=\\alpha"}
      trap="Если в условии угол дан от поверхности зеркала, сначала переведи его: угол от нормали равен 90° минус угол от поверхности."
    />
  </div>
);

export const GoldAccent = () => (
  <div style={{ width: 460 }}>
    <CompactHelpCard
      accent="gold"
      title="Количество теплоты"
      body="При нагревании теплота пропорциональна массе, удельной теплоёмкости и изменению температуры."
      formula={"Q=cm\\Delta T"}
      trap="Если масса дана в граммах, переведи её в килограммы перед подстановкой."
    />
  </div>
);

export const BodyOnly = () => (
  <div style={{ width: 460 }}>
    <CompactHelpCard
      accent="blue"
      title="Средняя скорость"
      body="Средняя скорость — это весь путь, делённый на всё время. Нельзя просто усреднять скорости, если участки занимали разное время."
    />
  </div>
);
