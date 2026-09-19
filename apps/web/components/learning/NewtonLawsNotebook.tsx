import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./NewtonLawsNotebook.module.css";

const cartImage = "/images/experiments/inertia-cart-v1.png";

function ArrowDiagram({ direction }: { direction: "left" | "right" }) {
  const points = direction === "left" ? "38,20 58,10 58,17 150,17 150,23 58,23 58,30" : "162,20 142,10 142,17 50,17 50,23 142,23 142,30";
  return (
    <svg className={styles.forceArrow} viewBox="0 0 200 40" aria-hidden="true">
      <polygon points={points} />
    </svg>
  );
}

export function NewtonFirstLawNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Лист наблюдений Мио</p>
        <h2>Сила нужна, чтобы изменить скорость, а не поддерживать её</h2>
        <span>Мио отпускает тележку на ровной дорожке и отмечает её положение через равные промежутки времени. После толчка горизонтальное действие почти исчезает, но движение продолжается.</span>
      </header>

      <div className={styles.firstWorkspace}>
        <figure className={styles.mioScene}>
          <Image src="/images/mio/textbook-inertia-v1.png" alt="Мио отпускает лабораторную тележку на ровной дорожке" fill sizes="(max-width:760px) 100vw, 58vw" priority />
          <div className={styles.trackMarks} aria-hidden="true"><i /><i /><i /><i /></div>
          <figcaption><strong>После короткого толчка</strong><span>равные промежутки пути за равные промежутки времени</span></figcaption>
        </figure>

        <aside className={styles.observationNotes} aria-label="Разбор наблюдения">
          <div>
            <span>Выбранное тело</span>
            <strong>тележка</strong>
            <p>Силы тяжести и опоры действуют на неё вертикально и компенсируют друг друга.</p>
          </div>
          <div className={styles.mainFinding}>
            <span>По горизонтали</span>
            <MathText text="$F_{\text{рез},x}\approx0\Rightarrow a_x\approx0$" />
            <p>Нулевая результирующая означает постоянную скорость, а не обязательный покой.</p>
          </div>
          <div>
            <span>Граница модели</span>
            <p>На реальной дорожке трение постепенно замедляет тележку. В опыте рассматриваем короткий участок, где им можно пренебречь.</p>
          </div>
        </aside>
      </div>

      <section className={styles.massRecord} aria-labelledby="mass-record-title">
        <div className={styles.massCopy}>
          <p>Следующая запись · § 16</p>
          <h3 id="mass-record-title">Одинаковое действие — разное изменение скорости</h3>
          <span>Чем больше масса, тем меньше ускорение при той же результирующей силе. Поэтому масса служит мерой инертности.</span>
        </div>
        <div className={styles.massComparisons}>
          <article>
            <div className={styles.cartStrip}><Image src={cartImage} alt="Лёгкая лабораторная тележка" width={420} height={280} /></div>
            <dl><div><dt>Масса</dt><dd>1 кг</dd></div><div><dt>Сила</dt><dd>4 Н</dd></div><div><dt>Ускорение</dt><dd>4 м/с²</dd></div></dl>
          </article>
          <article>
            <div className={styles.cartStrip}><Image src={cartImage} alt="Та же тележка с дополнительным грузом" width={420} height={280} /><b aria-hidden="true">+ 1 кг</b></div>
            <dl><div><dt>Масса</dt><dd>2 кг</dd></div><div><dt>Сила</dt><dd>4 Н</dd></div><div><dt>Ускорение</dt><dd>2 м/с²</dd></div></dl>
          </article>
        </div>
      </section>

      <p className={styles.conclusion}>Первый закон выполняется в инерциальной системе отсчёта. Если сама система разгоняется, наблюдаемое изменение движения нельзя объяснять только прежними реальными силами.</p>
    </div>
  );
}

export function NewtonThirdLawNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Карта взаимодействия</p>
        <h2>Две равные силы принадлежат двум разным телам</h2>
        <span>Мио разделяет рисунок по телам до сложения сил. Так пара третьего закона не исчезает ошибочно в одной сумме.</span>
      </header>

      <div className={styles.pairStage} role="img" aria-label="Две тележки разъезжаются: сила первой тележки на вторую равна по модулю и противоположна силе второй на первую">
        <section className={styles.bodyZone} aria-label="Тележка А">
          <div className={`${styles.pairCart} ${styles.leftCart}`}><Image src={cartImage} alt="" width={520} height={347} priority /></div>
          <ArrowDiagram direction="left" />
          <div className={styles.bodyLabel}><span>Тело А</span><strong>сила со стороны Б</strong><MathText text="$\vec F_{Б\to А}$" /></div>
        </section>
        <div className={styles.contactPoint} aria-hidden="true"><i /><i /><i /></div>
        <section className={styles.bodyZone} aria-label="Тележка Б">
          <div className={`${styles.pairCart} ${styles.rightCart}`}><Image src={cartImage} alt="" width={520} height={347} priority /></div>
          <ArrowDiagram direction="right" />
          <div className={styles.bodyLabel}><span>Тело Б</span><strong>сила со стороны А</strong><MathText text="$\vec F_{А\to Б}$" /></div>
        </section>
      </div>

      <div className={styles.pairEquation}>
        <MathText text="$\vec F_{А\to Б}=-\vec F_{Б\to А}$" />
        <p>Модули равны, направления противоположны, природа сил одинакова. Они не компенсируются, потому что приложены к разным телам.</p>
      </div>

      <section className={styles.frameNote}>
        <span>Принцип относительности Галилея</span>
        <p>В лаборатории и в вагоне, который движется равномерно и прямолинейно, одинаково поставленный механический опыт идёт одинаково. Внутренним механическим опытом нельзя определить, какая из этих инерциальных систем «на самом деле покоится».</p>
      </section>
    </div>
  );
}
