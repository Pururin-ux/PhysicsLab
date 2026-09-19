import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./GravityMotionNotebook.module.css";

const frames = [
  { time: "0", fall: "0", x: "0" },
  { time: "0,4", fall: "0,8", x: "1,6" },
  { time: "0,8", fall: "3,2", x: "3,2" },
  { time: "1,2", fall: "7,2", x: "4,8" },
] as const;

export function GravityMotionNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Кадровая запись · § 21</p>
        <h2>Вниз тела движутся одинаково — даже если одно летит ещё и вперёд</h2>
        <span>Сравним шарики через равные промежутки времени. Сопротивлением воздуха пренебрегаем, ось y направляем вниз и принимаем g = 10 м/с².</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.motionSheet}>
          <svg viewBox="0 0 820 520" role="img" aria-labelledby="gravity-motion-title gravity-motion-desc">
            <title id="gravity-motion-title">Свободное падение и горизонтальный бросок в одинаковые моменты времени</title>
            <desc id="gravity-motion-desc">Один шарик отпущен без начальной скорости, второй брошен вправо со скоростью 4 метра в секунду. Через 0,4; 0,8 и 1,2 секунды оба опустились на одинаковое расстояние, а второй одновременно прошёл равные горизонтальные участки.</desc>

            <defs>
              <marker id="gravity-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10Z" />
              </marker>
            </defs>

            <g className={styles.axes}>
              <path d="M88 70V458M82 450l6 8 6-8M88 70H748M740 64l8 6-8 6" />
              <text x="55" y="464">y ↓</text>
              <text x="754" y="76">x →</text>
            </g>

            <g className={styles.guides}>
              <path d="M95 114H742M95 150H742M95 258H742M95 438H742" />
              <text x="18" y="119">0 с</text>
              <text x="7" y="155">0,4 с</text>
              <text x="7" y="263">0,8 с</text>
              <text x="7" y="443">1,2 с</text>
            </g>

            <g className={styles.dropTrack}>
              <text x="224" y="92" textAnchor="middle">Отпустили</text>
              <path d="M224 114V438" />
              {[114, 150, 258, 438].map((y, index) => <circle key={y} cx="224" cy={y} r={index === 0 ? 11 : 14} />)}
            </g>

            <g className={styles.throwTrack}>
              <text x="486" y="92" textAnchor="middle">Бросили горизонтально</text>
              <path d="M432 114C486 138 566 217 696 438" />
              {[
                [432, 114],
                [520, 150],
                [608, 258],
                [696, 438],
              ].map(([x, y], index) => <circle key={`${x}-${y}`} cx={x} cy={y} r={index === 0 ? 11 : 14} />)}
              <path className={styles.velocityArrow} d="M432 114H512" markerEnd="url(#gravity-arrow)" />
              <text x="470" y="102" textAnchor="middle">v₀ = 4 м/с</text>
            </g>

            <g className={styles.equalFall}>
              <path d="M236 150H508M238 258H594M238 438H682" />
              <text x="334" y="142">одинаковое падение</text>
            </g>

            <g className={styles.acceleration}>
              <path d="M770 150V232" markerEnd="url(#gravity-arrow)" />
              <text x="770" y="126" textAnchor="middle">g</text>
            </g>
          </svg>
          <figcaption>Равные интервалы по горизонтали показывают постоянную <MathText text="$v_x$" />. Всё большие интервалы вниз показывают ускоренное движение.</figcaption>
        </figure>

        <aside className={styles.observation} aria-label="Проверка гипотезы Мио">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио сверяет временные отметки двух движений" width={1254} height={1254} sizes="(max-width:760px) 120px, 170px" />
            <div><span>Проверка Мио</span><s>Горизонтальный толчок задержит падение</s><strong>Нет: время падения задаёт вертикальное движение.</strong></div>
          </div>
          <div className={styles.equations}>
            <p><span>По горизонтали</span><MathText text={String.raw`$a_x=0,\quad x=v_0t$`} /></p>
            <p><span>По вертикали</span><MathText text={String.raw`$a_y=g,\quad y=\frac{gt^2}{2}$`} /></p>
            <p className={styles.result}><span>С одной высоты</span><MathText text={String.raw`$t_{\text{пад}}=\sqrt{\frac{2h}{g}}$`} /><small>Начальная горизонтальная скорость в эту формулу не входит.</small></p>
          </div>
        </aside>
      </div>

      <section className={styles.frameLedger} aria-labelledby="frame-ledger-title">
        <div className={styles.ledgerIntro}><p>Данные кадра</p><h3 id="frame-ledger-title">Две координаты одного полёта</h3></div>
        {frames.slice(1).map(frame => (
          <article key={frame.time}>
            <span>t = {frame.time} с</span>
            <strong>вниз: {frame.fall} м</strong>
            <b>вправо: {frame.x} м</b>
          </article>
        ))}
      </section>

      <div className={styles.distinctions}>
        <section><span>Свободное падение</span><h3>Масса сокращается</h3><p>Если действует только сила тяжести, <MathText text={String.raw`$a=F_{\text{т}}/m=mg/m=g$`} />. В одном месте и без сопротивления воздуха ускорение не зависит от массы.</p></section>
        <section><span>Горизонтальный бросок</span><h3>Один полёт — два движения</h3><p>По x скорость постоянна, по y растёт из-за тяжести. Их соединение даёт параболическую траекторию.</p></section>
        <section><span>Бросок вверх</span><h3>Скорость меняет знак</h3><p>При оси вверх <MathText text="$v_y=v_0-gt$" />. В верхней точке скорость на мгновение равна нулю, но ускорение остаётся направленным вниз.</p></section>
      </div>

      <p className={styles.conclusion}>Сила тяжести определяет вертикальную часть движения. Начальная скорость определяет, что тело успеет сделать по горизонтали или при подъёме за то же время.</p>
    </div>
  );
}
