import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./ShipsAndBalloonsNotebook.module.css";

export function ShipsAndBalloonsNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Ватерлиния как отметка · § 30</p>
        <h2>Груз добавили. Почему судно опустилось, но не утонуло?</h2>
        <span>Судно погружается глубже, пока вес новой порции вытесненной воды не уравновесит добавленный груз. Та же идея поднимает аэростат: среда должна вытеснить вверх сильнее, чем вся система тянет вниз.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.diagram}>
          <svg viewBox="0 0 980 570" role="img" aria-labelledby="buoyancy-title buoyancy-desc">
            <title id="buoyancy-title">Осадка судна и подъёмная сила воздушного шара</title>
            <desc id="buoyancy-desc">Слева судно с грузом погружено до ватерлинии. Объём корпуса ниже поверхности равен объёму вытесненной воды. Справа на воздушный шар действуют сила Архимеда вверх и сила тяжести вниз; их разность определяет допустимый груз.</desc>
            <defs>
              <marker id="buoyancy-cyan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.cyanHead} d="M0 0 10 5 0 10Z" /></marker>
              <marker id="buoyancy-red-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path className={styles.redHead} d="M0 0 10 5 0 10Z" /></marker>
              <clipPath id="ship-water-clip"><path d="M91 222H445L409 389Q267 454 126 389Z" /></clipPath>
            </defs>

            <g aria-label="Судно у ватерлинии">
              <text className={styles.panelTitle} x="270" y="48" textAnchor="middle">Судно: груз меняет осадку</text>
              <path className={styles.water} d="M38 317C85 305 128 327 176 317S268 306 316 317S408 327 475 317V494H38Z" />
              <path className={styles.waterSurface} d="M38 317C85 305 128 327 176 317S268 306 316 317S408 327 475 317" />
              <path className={styles.hull} d="M91 222H445L409 389Q267 454 126 389Z" />
              <path className={styles.displacedWater} clipPath="url(#ship-water-clip)" d="M38 317H475V494H38Z" />
              <path className={styles.deck} d="M119 222V190H416V222M190 190V144H353V190" />
              <g className={styles.cargo}><path d="M209 144V101H258V144M263 144V101H312V144M317 144V101H366V144" /><path d="M214 111H253M268 111H307M322 111H361" /></g>
              <path className={styles.waterline} d="M92 317H443" />
              <text className={styles.waterlineLabel} x="109" y="303">ватерлиния</text>
              <path className={styles.forceUp} d="M269 400V260" markerEnd="url(#buoyancy-cyan-arrow)" />
              <path className={styles.forceDown} d="M269 151V286" markerEnd="url(#buoyancy-red-arrow)" />
              <text className={styles.forceUpLabel} x="286" y="386">Fₐ</text>
              <text className={styles.forceDownLabel} x="286" y="178">Fт</text>
              <path className={styles.draftBracket} d="M462 317H486M474 317V407M462 407H486" />
              <text className={styles.draftLabel} x="466" y="438">осадка</text>
              <text className={styles.verdict} x="270" y="488" textAnchor="middle">больше груз → больше вытеснено воды</text>
            </g>

            <path className={styles.divider} d="M512 34V530" />

            <g aria-label="Силы, действующие на воздушный шар">
              <text className={styles.panelTitle} x="748" y="48" textAnchor="middle">Аэростат: разность двух сил</text>
              <path className={styles.balloon} d="M748 103C660 103 622 166 644 239C659 288 706 322 748 340C790 322 837 288 852 239C874 166 836 103 748 103Z" />
              <path className={styles.balloonSeam} d="M748 103C716 144 706 247 748 340M748 103C780 144 790 247 748 340M663 252H833" />
              <path className={styles.ropes} d="M706 314L724 395M790 314L772 395" />
              <path className={styles.basket} d="M716 395H780L771 449H725Z" />
              <path className={styles.forceUp} d="M748 197V76" markerEnd="url(#buoyancy-cyan-arrow)" />
              <path className={styles.forceDown} d="M748 258V379" markerEnd="url(#buoyancy-red-arrow)" />
              <text className={styles.forceUpLabel} x="768" y="91">Fₐ</text>
              <text className={styles.forceDownLabel} x="768" y="371">Fт</text>
              <path className={styles.liftBracket} d="M882 149H905M894 149V348M882 348H905" />
              <text className={styles.liftLabel} x="876" y="389">подъёмная</text>
              <text className={styles.liftLabel} x="889" y="411">сила</text>
              <text className={styles.verdict} x="748" y="488" textAnchor="middle">Fₐ − Fт = вес допустимого груза</text>
            </g>
          </svg>
          <figcaption>В равновесии судно вытесняет воду той же массы, что и судно вместе с грузом. Водоизмещение — масса воды при предельной осадке, а не объём корпуса над водой.</figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза ватерлинии">
          <div className={styles.mioAction}>
            <Image src="/images/mio/mio-attentive-v1.png" alt="Мио добавляет груз и отмечает новую ватерлинию" width={1254} height={1254} sizes="(max-width:760px) 104px, 148px" />
            <div><span>Измерительная линза</span><strong>Мио добавляет один ящик и переносит отметку поверхности на корпус.</strong><p>Глубже осадка — больше объём вытесненной воды.</p></div>
          </div>
          <div className={styles.massLedger}>
            <p><span>Водоизмещение</span><strong>судно + предельный груз</strong></p>
            <p><span>Масса пустого судна</span><strong>само судно</strong></p>
            <p className={styles.result}><span>Грузоподъёмность</span><strong><MathText text={String.raw`$m_{гр}=m_{в}-m$`} /></strong></p>
          </div>
        </aside>
      </div>

      <section className={styles.controlsStrip} aria-labelledby="control-title">
        <header><p>Одна физика · разные способы управления</p><h3 id="control-title">Что меняет среднюю плотность системы?</h3></header>
        <article><span>Судно</span><h4>Добавляет груз</h4><p>Масса растёт, корпус садится глубже и вытесняет больше воды.</p></article>
        <article><span>Подводная лодка</span><h4>Заполняет балласт</h4><p>Вода в цистернах увеличивает среднюю плотность; сжатый воздух вытесняет воду и уменьшает её.</p></article>
        <article><span>Воздушный шар</span><h4>Меняет газ</h4><p>Нагретый воздух или гелий уменьшают среднюю плотность всего аппарата.</p></article>
      </section>

      <div className={styles.distinctions}>
        <section><span>Средняя плотность</span><h3>Считаем всё тело</h3><p>Учитываем оболочку, груз и воздушные полости. Плотность материала корпуса сама по себе не решает, будет ли судно плавать.</p></section>
        <section><span>Предельная осадка</span><h3>Красная линия — предел</h3><p>Ватерлиния отмечает максимально безопасное погружение. Дополнительный груз после этой отметки недопустим.</p></section>
        <section><span>Воздухоплавание</span><h3>Не авиация</h3><p>Аэростат держится силой Архимеда. Самолёт тяжелее воздуха и использует подъёмную силу крыла — это другой механизм.</p></section>
      </div>
    </div>
  );
}
