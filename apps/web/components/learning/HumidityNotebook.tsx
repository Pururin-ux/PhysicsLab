import Image from "next/image";
import styles from "./HumidityNotebook.module.css";

function Thermometer({ label, value, wet = false }: { label: string; value: number; wet?: boolean }) {
  const level = 20 + (value / 40) * 70;
  return (
    <div className={styles.thermometer}>
      <span>{label}</span>
      <svg viewBox="0 0 90 260" role="img" aria-label={`${label} термометр показывает ${value} градусов Цельсия`}>
        <rect className={styles.glass} x="32" y="18" width="26" height="190" rx="13" />
        <rect className={styles.column} x="40" y={208 - level * 1.7} width="10" height={level * 1.7} rx="5" />
        <circle className={styles.bulb} cx="45" cy="218" r="24" />
        {[0, 10, 20, 30, 40].map((tick) => <g key={tick}><path className={styles.tick} d={`M60 ${196 - tick * 4}h10`} /><text className={styles.tickLabel} x="74" y={200 - tick * 4}>{tick}</text></g>)}
        {wet && <path className={styles.wick} d="M18 236Q45 248 72 236L64 205Q45 215 26 205Z" />}
      </svg>
      <strong>{value} °C</strong>
      {wet && <small>резервуар обёрнут влажной тканью</small>}
    </div>
  );
}

export function HumidityNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Измерительный блокнот · § 10 · 10 класс</p>
        <h2>Влажность показывает не только сколько пара есть, но и насколько он близок к насыщению</h2>
        <span>Одинаковая абсолютная влажность при разных температурах даёт разную относительную. Поэтому сначала фиксируем температуру, затем сравниваем пар с пределом насыщения при ней.</span>
      </header>

      <section className={styles.measurementLens} aria-labelledby="humidity-lens-title">
        <header><span>Измерительная линза</span><h3 id="humidity-lens-title">Те же 8,0 г/м³ водяного пара — две разные влажности</h3><p>Закрытый жёсткий объём, влагу не добавляем и не удаляем.</p></header>
        <article><div><b>10 °C</b><small>ρн = 9,4 г/м³</small></div><div className={styles.capacity}><i style={{ width: "85%" }} /><span>8,0 из 9,4</span></div><strong>φ ≈ 85 %</strong></article>
        <article><div><b>24 °C</b><small>ρн = 21,8 г/м³</small></div><div className={styles.capacity}><i style={{ width: "37%" }} /><span>8,0 из 21,8</span></div><strong>φ ≈ 37 %</strong></article>
      </section>

      <section className={styles.psychrometer} aria-labelledby="psychrometer-title">
        <div className={styles.mioAction}>
          <Image src="/images/mio/mio-thinking-v1.png" alt="Мио сравнивает показания сухого и влажного термометров и находит влажность по таблице" width={1254} height={1254} sizes="(max-width:760px) 92px, 138px" />
          <div><span>Лабораторная установка</span><h3 id="psychrometer-title">Мио читает психрометр: строка, разность, ячейка</h3><p>Чем суше воздух, тем быстрее вода испаряется с ткани и тем сильнее охлаждается влажный термометр.</p></div>
        </div>
        <div className={styles.instrument}>
          <Thermometer label="Сухой" value={24} />
          <Thermometer label="Влажный" value={18} wet />
          <div className={styles.reading}>
            <span>1 · Сухой</span><strong>24 °C</strong>
            <span>2 · Разность</span><strong>24 − 18 = 6 °C</strong>
            <span>3 · Таблица</span><strong>строка 24 · столбец 6</strong>
            <em>φ = 56 %</em>
          </div>
        </div>
      </section>

      <section className={styles.formulaLedger} aria-labelledby="humidity-formula-title">
        <header><span>Две записи одной меры</span><h3 id="humidity-formula-title">Сравниваем с насыщенным паром при той же температуре</h3></header>
        <p><strong>По плотности</strong><span>φ = ρп / ρн · 100 %</span><small>ρп — абсолютная влажность, ρн — плотность насыщенного пара</small></p>
        <p><strong>По давлению</strong><span>φ = pп / pн · 100 %</span><small>pп — парциальное давление пара, pн — давление насыщенного пара</small></p>
      </section>

      <section className={styles.dewPath} aria-labelledby="dew-path-title">
        <header><span>Путь к точке росы</span><h3 id="dew-path-title">Охлаждаем воздух без удаления пара</h3></header>
        <ol>
          <li><b>Температура падает</b><span>предел насыщения ρн уменьшается</span></li>
          <li><b>φ растёт до 100 %</b><span>достигнута точка росы</span></li>
          <li><b>Охлаждаем дальше</b><span>избыток пара конденсируется: роса, туман или иней</span></li>
        </ol>
      </section>

      <p className={styles.boundary}><strong>Граница измерения.</strong> Психрометрическую таблицу читают по температуре сухого термометра и разности показаний. Равные показания означают φ = 100 %, а не отсутствие водяного пара.</p>
    </div>
  );
}
