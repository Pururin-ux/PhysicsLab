import Image from "next/image";
import styles from "./SolidStructureNotebook.module.css";

function HeatingGraph({ kind }: { kind: "crystal" | "amorphous" }) {
  const crystal = kind === "crystal";
  const title = crystal
    ? "Температура кристаллического тела при нагревании и плавлении"
    : "Температура аморфного тела при нагревании и размягчении";

  return (
    <svg viewBox="0 0 390 215" role="img" aria-label={title}>
      <path className={styles.axis} d="M42 18V181H370M36 24l6-6 6 6M364 175l6 6-6 6" />
      <text className={styles.axisLabel} x="20" y="20">T</text>
      <text className={styles.axisLabel} x="365" y="203">Q</text>
      {crystal ? (
        <>
          <path className={styles.crystalLine} d="M55 165L150 92H272L354 33" />
          <path className={styles.guide} d="M42 92H360" />
          <text className={styles.graphNote} x="174" y="77">Tₚₗ = const</text>
          <text className={styles.phaseLabel} x="174" y="113">плавление</text>
        </>
      ) : (
        <>
          <path className={styles.amorphousBand} d="M55 165C132 135 175 108 226 82C278 56 317 43 354 33" />
          <path className={styles.bandTop} d="M140 125C183 97 224 76 278 54" />
          <path className={styles.bandBottom} d="M151 146C196 119 241 91 292 70" />
          <text className={styles.graphNote} x="184" y="104">интервал размягчения</text>
        </>
      )}
    </svg>
  );
}

export function SolidStructureNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Стол материалов · § 7 · 10 класс</p>
        <h2>Одинаково твёрдые снаружи — по-разному устроены внутри</h2>
        <span>Внешний вид даёт гипотезу. Строение проверяют по устойчивым признакам: порядку частиц, зависимости свойств от направления и характеру плавления.</span>
      </header>

      <div className={styles.specimenDesk}>
        <figure className={styles.specimen}>
          <Image src="/images/solids/quartz-crystal-usgs.jpg" alt="Группа прозрачных кристаллов кварца с выраженными плоскими гранями" width={360} height={241} sizes="(max-width:720px) 100vw, 38vw" />
          <figcaption><span>Образец A · кварц</span><h3>Кристаллическое тело</h3><p>Частицы колеблются около упорядоченных положений. Порядок повторяется во всём объёме.</p><strong>дальний порядок</strong></figcaption>
        </figure>
        <figure className={styles.specimen}>
          <Image src="/images/solids/obsidian-usfs.jpg" alt="Несколько образцов обсидиана с гладкими стекловидными поверхностями" width={480} height={350} sizes="(max-width:720px) 100vw, 38vw" />
          <figcaption><span>Образец B · обсидиан</span><h3>Аморфное тело</h3><p>Строгого дальнего порядка нет. Сохраняется только расположение ближайших соседей.</p><strong>ближний порядок</strong></figcaption>
        </figure>

        <aside className={styles.mioAction}>
          <Image src="/images/mio/mio-attentive-v1.png" alt="Мио прикрепляет к образцам подписи с проверяемыми свойствами" width={1254} height={1254} sizes="(max-width:720px) 104px, 138px" />
          <div><span>Ход Мио</span><h3>Не называй тело по блеску</h3><p>Плоские грани кварца заметны, но решающий вывод дают свойства. Мио оставляет рядом только признаки, которые можно проверить.</p></div>
        </aside>
      </div>

      <section className={styles.directionLedger} aria-labelledby="direction-title">
        <header><span>Проверка направлением</span><h3 id="direction-title">Один кристалл или множество зёрен?</h3></header>
        <article><b>Монокристалл</b><strong>Единая решётка</strong><p>Плотность расположения частиц различается по направлениям, поэтому механические, тепловые, электрические или оптические свойства могут различаться.</p><mark>анизотропия</mark></article>
        <article><b>Поликристалл</b><strong>Много случайно ориентированных зёрен</strong><p>Каждое зерно анизотропно, но в большом образце направления обычно усредняются.</p><mark>изотропия в целом</mark></article>
      </section>

      <section className={styles.heatingSheet} aria-labelledby="heating-title">
        <header><span>Проверка нагреванием</span><h3 id="heating-title">Температурная кривая различает переходы</h3><p>Оси одинаковы: по вертикали температура T, по горизонтали полученное количество теплоты Q.</p></header>
        <figure><HeatingGraph kind="crystal" /><figcaption><strong>Кристаллическое тело</strong><span>При постоянном давлении плавится при определённой температуре.</span></figcaption></figure>
        <figure><HeatingGraph kind="amorphous" /><figcaption><strong>Аморфное тело</strong><span>Постепенно размягчается; одной температуры плавления нет.</span></figcaption></figure>
      </section>

      <p className={styles.boundary}><strong>Граница вывода.</strong> Форма и блеск отдельного образца сами по себе не доказывают тип строения. В учебной задаче вывод делают по указанным свойствам или наблюдаемому процессу.</p>
      <p className={styles.credit}>Фотографии образцов: USGS и USFS · public domain. Полные ссылки и лицензии сохранены рядом с файлами.</p>
    </div>
  );
}
