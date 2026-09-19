import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./UniformMotionNotebook.module.css";

export function UniformCoordinateNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Координата как закон движения · § 6</p>
        <h2>Скорость постоянна. Почему координата всё равно меняется?</h2>
        <span>Знак скорости хранит направление, начальная координата — точку старта, а время переносит тело вдоль выбранной оси.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 520" role="img" aria-labelledby="uniform-coordinate-title uniform-coordinate-desc">
            <title id="uniform-coordinate-title">Координатный закон равномерного прямолинейного движения</title>
            <desc id="uniform-coordinate-desc">Тележка начинает в координате 12 метров и движется влево со скоростью минус 3 метра в секунду. Через 4 секунды она оказывается в начале координат.</desc>
            <defs>
              <marker id="uniform-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="uniform-gold-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.goldHead} d="M0 0 10 5 0 10Z" /></marker>
            </defs>

            <text className={styles.panelTitle} x="490" y="52" textAnchor="middle">Одна ось · три момента времени</text>
            <path className={styles.axis} d="M88 290H906" markerEnd="url(#uniform-cyan-arrow)" />
            {[0, 3, 6, 9, 12].map((value, index) => {
              const x = 155 + index * 165;
              return <g key={value}><path className={styles.tick} d={`M${x} 277V303`} /><text className={styles.axisLabel} x={x} y="329" textAnchor="middle">{value} м</text></g>;
            })}

            <g aria-label="Положение тележки в начальный момент">
              <rect className={styles.cartStart} x="777" y="210" width="80" height="46" rx="10" />
              <circle className={styles.wheel} cx="797" cy="265" r="11" /><circle className={styles.wheel} cx="838" cy="265" r="11" />
              <text className={styles.timeLabel} x="817" y="186" textAnchor="middle">t = 0 с</text>
              <text className={styles.cyanLabel} x="817" y="356" textAnchor="middle">x₀ = 12 м</text>
            </g>
            <g aria-label="Положение тележки через две секунды">
              <rect className={styles.cartMiddle} x="447" y="210" width="80" height="46" rx="10" />
              <circle className={styles.wheelMuted} cx="467" cy="265" r="11" /><circle className={styles.wheelMuted} cx="508" cy="265" r="11" />
              <text className={styles.timeLabelMuted} x="487" y="186" textAnchor="middle">t = 2 с</text>
              <text className={styles.mutedLabel} x="487" y="356" textAnchor="middle">x = 6 м</text>
            </g>
            <g aria-label="Положение тележки через четыре секунды">
              <rect className={styles.cartEnd} x="117" y="210" width="80" height="46" rx="10" />
              <circle className={styles.wheelGold} cx="137" cy="265" r="11" /><circle className={styles.wheelGold} cx="178" cy="265" r="11" />
              <text className={styles.timeLabel} x="157" y="186" textAnchor="middle">t = 4 с</text>
              <text className={styles.goldLabel} x="157" y="356" textAnchor="middle">x = 0 м</text>
            </g>

            <path className={styles.velocity} d="M790 126H590" markerEnd="url(#uniform-gold-arrow)" />
            <text className={styles.goldLabel} x="690" y="108" textAnchor="middle">vₓ = −3 м/с</text>
            <path className={styles.displacement} d="M817 402H157" markerEnd="url(#uniform-gold-arrow)" />
            <text className={styles.goldLabel} x="487" y="438" textAnchor="middle">Δx = vₓt = −12 м</text>
            <text className={styles.verdict} x="490" y="488" textAnchor="middle">x = x₀ + vₓt = 12 + (−3) · 4 = 0 м</text>
          </svg>
          <figcaption>Минус у <MathText text={String.raw`$v_x$`} /> не означает «медленную» или «плохую» скорость. Он показывает движение против положительного направления оси. Путь за 4 с равен 12 м, а проекция перемещения — −12 м.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза координатного закона">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-thinking-v1.png" alt="Мио отмечает знак проекции скорости перед подстановкой" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио сначала проводит ось и отмечает её направление.</strong><p>Только после этого число скорости получает знак.</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Старт</span><strong>x₀ — координата при t = 0</strong></p>
            <p><span>Изменение</span><strong>Δx = vₓt</strong></p>
            <p className={styles.result}><span>Положение</span><strong>x = x₀ + vₓt</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function UniformMotionGraphsNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Одна встреча в двух записях · § 7</p>
        <h2>Где встретились тела — и какой график это доказывает?</h2>
        <span>Координата показывает положение, проекция перемещения — изменение положения, а площадь под скоростью возвращает то же перемещение.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 1080 560" role="img" aria-labelledby="uniform-graphs-title uniform-graphs-desc">
            <title id="uniform-graphs-title">Связь графиков координаты, перемещения и проекции скорости</title>
            <desc id="uniform-graphs-desc">Слева два графика координаты пересекаются при времени 2 секунды и координате 5 метров. Справа показаны постоянные проекции скоростей плюс 2 и минус 1 метр в секунду и знаковые площади за те же 2 секунды.</desc>

            <g transform="translate(54 45)" aria-label="Графики координат двух тел">
              <text className={styles.panelTitle} x="246" y="20" textAnchor="middle">x(t): пересечение означает встречу</text>
              <path className={styles.graphAxis} d="M48 420V64M48 420H482" />
              <text className={styles.axisLabel} x="18" y="73">x, м</text><text className={styles.axisLabel} x="450" y="453">t, с</text>
              {[0,1,2,3,4].map((value) => <g key={`tx-${value}`}><path className={styles.gridLine} d={`M${48+100*value} 74V420`} /><text className={styles.tickLabel} x={48+100*value} y="446" textAnchor="middle">{value}</text></g>)}
              {[0,2,4,5,6,8].map((value) => {const y=420-value*40; return <g key={`xx-${value}`}><path className={styles.gridLine} d={`M48 ${y}H448`} /><text className={styles.tickLabel} x="34" y={y+5} textAnchor="end">{value}</text></g>})}
              <path className={styles.lineA} d="M48 380L448 60" />
              <path className={styles.lineB} d="M48 140L448 300" />
              <circle className={styles.meeting} cx="248" cy="220" r="10" />
              <path className={styles.guide} d="M248 220V420M48 220H248" />
              <text className={styles.cyanLabel} x="399" y="89">A: x = 1 + 2t</text>
              <text className={styles.goldLabel} x="342" y="290">B: x = 7 − t</text>
              <text className={styles.verdictSmall} x="270" y="206">встреча: 2 с · 5 м</text>
            </g>

            <path className={styles.divider} d="M550 34V530" />

            <g transform="translate(590 45)" aria-label="Графики проекций скоростей двух тел">
              <text className={styles.panelTitle} x="220" y="20" textAnchor="middle">vₓ(t): площадь означает Δx</text>
              <path className={styles.graphAxis} d="M48 250V64M48 250V420M48 250H438" />
              <text className={styles.axisLabel} x="10" y="73">vₓ, м/с</text><text className={styles.axisLabel} x="406" y="283">t, с</text>
              {[0,1,2,3].map((value) => <g key={`tv-${value}`}><path className={styles.gridLine} d={`M${48+110*value} 70V420`} /><text className={styles.tickLabel} x={48+110*value} y="278" textAnchor="middle">{value}</text></g>)}
              <path className={styles.gridLine} d="M48 90H378M48 330H378" />
              <text className={styles.tickLabel} x="34" y="95" textAnchor="end">+2</text><text className={styles.tickLabel} x="34" y="335" textAnchor="end">−1</text>
              <path className={styles.areaPositive} d="M48 250V90H268V250Z" />
              <path className={styles.areaNegative} d="M48 250V330H268V250Z" />
              <path className={styles.lineA} d="M48 90H378" />
              <path className={styles.lineB} d="M48 330H378" />
              <text className={styles.cyanLabel} x="292" y="79">A: vₓ = +2</text>
              <text className={styles.goldLabel} x="292" y="356">B: vₓ = −1</text>
              <text className={styles.verdictSmall} x="158" y="158" textAnchor="middle">Δxₐ = +4 м</text>
              <text className={styles.verdictSmall} x="158" y="308" textAnchor="middle">Δxᵦ = −2 м</text>
              <text className={styles.verdict} x="220" y="478" textAnchor="middle">xₐ: 1 → 5 м · xᵦ: 7 → 5 м</text>
            </g>
          </svg>
          <figcaption>Точка пересечения принадлежит обоим графикам координаты: в один момент тела имеют одну координату. На графике <MathText text={String.raw`$v_x(t)$`} /> знаковая площадь за те же 2 с даёт их перемещения, поэтому оба расчёта приводят к 5 м.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза для чтения графиков движения">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-skeptical-v1.png" alt="Мио сравнивает подписи осей и единицы измерения на графиках" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио не угадывает смысл линии по её форме.</strong><p>Она читает подписи осей и проверяет единицу результата.</p></div>
          </div>
          <div className={styles.lensLedger}>
            <p><span>Наклон x(t)</span><strong>проекция скорости vₓ</strong></p>
            <p><span>Пересечение x(t)</span><strong>одинаковые t и x</strong></p>
            <p className={styles.result}><span>Площадь под vₓ(t)</span><strong>проекция перемещения Δx</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}
