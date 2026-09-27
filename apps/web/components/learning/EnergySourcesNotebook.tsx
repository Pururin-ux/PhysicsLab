import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import styles from "./EnergySourcesNotebook.module.css";

const routes = [
  {
    name: "Тепловая станция",
    path: "Топливо → нагрев → турбина → генератор.",
    consequence: "При сжигании топлива появляются продукты сгорания; часть тепла отводится в среду.",
  },
  {
    name: "Гидростанция",
    path: "Вода на высоте → движение воды → турбина → генератор.",
    consequence: "Плотина меняет режим реки и условия жизни в ней и у берегов.",
  },
  {
    name: "Атомная станция",
    path: "Деление ядер → нагрев → турбина → генератор.",
    consequence: "Нужны надёжная безопасность и обращение с отработавшим топливом.",
  },
  {
    name: "Ветрогенератор",
    path: "Движение воздуха → вращение ротора → генератор.",
    consequence: "Выработка зависит от ветра; размещение и производство оборудования тоже имеют последствия.",
  },
] as const;

export function EnergySourcesNotebook() {
  return <section className={styles.notebook} aria-labelledby="energy-sources-question">
    <header className={styles.header}>
      <p className={styles.eyebrow}>Мио проверяет вывод</p>
      <h2 id="energy-sources-question">Меньше потерь в проводе — и больше никаких последствий?</h2>
      <p>Нет одного ответа для всех станций. Сначала проследи, какая энергия пришла к генератору и что изменилось вокруг него.</p>
    </header>
    <ol className={styles.routes} aria-label="Четыре пути получения электричества">
      {routes.map(route => <li key={route.name}>
        <h3>{route.name}</h3>
        <p className={styles.path}>{route.path}</p>
        <p className={styles.consequence}>{route.consequence}</p>
      </li>)}
    </ol>
    <div className={styles.reflection}>
      <figure className={styles.scene}>
        <Image
          src={MIO_SCENES.energySources}
          width={1280}
          height={853}
          sizes="(max-width: 700px) 100vw, 360px"
          alt="Мио сравнивает фотографии тепловой станции, плотины и ветрогенераторов и записывает вывод в блокнот."
        />
      </figure>
      <details className={styles.result}>
        <summary>Что Мио вычеркнула из своей догадки?</summary>
        <p><del>Меньше тепла в проводе — значит, электричество совсем без следа.</del></p>
        <p>Нагрев линии — лишь один участок пути энергии. Снижение потерь полезно, но по нему одному нельзя вычислить выбросы, влияние на реку или отходы станции.</p>
        <p className={styles.limit}>Чтобы сравнивать источники, нужны данные о месте, технологии и полном пути получения электричества. Этот список показывает разные вопросы, а не рейтинг станций.</p>
      </details>
    </div>
  </section>;
}
