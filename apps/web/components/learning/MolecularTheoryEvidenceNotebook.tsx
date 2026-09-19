import Image from "next/image";
import styles from "./MolecularTheoryEvidenceNotebook.module.css";

export function MolecularTheoryEvidenceNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Три положения · § 1 · 10 класс</p>
        <h2>Мы не видим молекулы в капле. Почему всё же считаем их реальными?</h2>
        <span>Одно красивое наблюдение не доказывает всю теорию. Сопоставим разные факты и проверим, какое положение МКТ каждый из них поддерживает.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.traceSheet}>
          <div className={styles.figureLabel}><span>Запись под микроскопом</span><strong>Положения частицы через равные промежутки времени</strong></div>
          <Image src="/images/evidence/perrin-brownian-traces.gif" alt="Три ломаные записи положений броуновских частиц на квадратной сетке" width={324} height={256} />
          <figcaption>Жан Перрен отмечал положения взвешенных частиц через 30 с. Ломаная соединяет измеренные точки и не является видимой дорожкой внутри жидкости.</figcaption>
        </figure>

        <figure className={styles.diffusionSheet}>
          <Image src="/images/evidence/diffusion-ink-1280.jpg" alt="Чёрные чернила образуют неоднородные ветвящиеся потоки в воде" fill sizes="(max-width:700px) 100vw, 42vw" />
          <figcaption><span>Макроскопический кадр</span><strong>Чернила распределяются по воде.</strong><small>На снимке не различимы молекулы; видимые потоки могут переносить краситель вместе с водой.</small></figcaption>
        </figure>

        <aside className={styles.measurementLens} aria-label="Измерительная линза броуновского движения">
          <Image src="/images/mio/mio-skeptical-v1.png" alt="Мио сверяет запись наблюдения и объяснение в блокноте" width={1254} height={1254} sizes="(max-width:700px) 104px, 148px" />
          <div><span>Измерительная линза</span><s>Под микроскопом видна молекула</s><strong>Мио проверяет, что именно отслеживал Перрен.</strong><p>Наблюдаемая частица намного крупнее молекул среды. Её путь — косвенное свидетельство их беспорядочных ударов.</p></div>
        </aside>
      </div>

      <section className={styles.theses} aria-labelledby="mkt-theses-title">
        <header><p>Модель должна объяснить все три группы фактов</p><h3 id="mkt-theses-title">Три положения МКТ</h3></header>
        <article><span>01</span><h4>Вещество дискретно</h4><p>Оно состоит из молекул, атомов или ионов. Растворение, сжатие и атомные структуры дают согласующиеся свидетельства.</p></article>
        <article><span>02</span><h4>Частицы движутся</h4><p>Тепловое движение непрерывно и беспорядочно. Его интенсивность зависит от температуры.</p></article>
        <article><span>03</span><h4>Частицы взаимодействуют</h4><p>Притяжение удерживает твёрдые тела и жидкости, а малая сжимаемость указывает на отталкивание при сближении.</p></article>
      </section>

      <div className={styles.comparison}>
        <section><span>Броуновское движение</span><h3>Движется взвешенная частица</h3><p>Её направление меняют нескомпенсированные удары частиц среды. Это движение отдельного наблюдаемого объекта.</p></section>
        <section><span>Диффузия</span><h3>Выравнивается концентрация</h3><p>Частицы соприкасающихся веществ взаимно проникают друг в друга вследствие теплового движения.</p></section>
        <section className={styles.boundary}><span>Граница доказательства</span><h3>Факт поддерживает модель, но не равен ей</h3><p>Пылинка в солнечном луче может двигаться из-за потоков воздуха. Для вывода важны масштаб, условия и воспроизводимая запись, а не одна похожая траектория.</p></section>
      </div>

      <p className={styles.credit}>Источники изображений: Perrin, 1909 · public domain; Zvonimir Lončarić · CC BY-SA 4.0. Полные ссылки сохранены в реестре ассетов PhysicsLab.</p>
    </div>
  );
}
