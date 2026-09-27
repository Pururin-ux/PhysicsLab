import Link from "next/link";
import styles from "./CurrentCarriersComparison.module.css";

const media = [
  {
    name: "Металл",
    href: "/learn/electric-current-in-metals",
    carriers: "Свободные электроны",
    condition: "Подвижные электроны уже есть; нагрев обычного металла увеличивает R.",
  },
  {
    name: "Раствор соли",
    href: "/learn/electric-current-in-electrolytes",
    carriers: "Положительные и отрицательные ионы",
    condition: "Соль даёт подвижные ионы в воде; сахарный раствор — не тот же случай.",
  },
  {
    name: "Ионизированный газ",
    href: "/learn/electric-current-in-gases",
    carriers: "Свободные электроны и ионы",
    condition: "Ионизация создаёт носители; в слабом поле без неё заметного тока может не быть.",
  },
  {
    name: "Чистый германий",
    carriers: "Свободные электроны и дырки",
    condition: "Нагрев или свет могут освободить электрон из связи и оставить дырку.",
  },
] as const;

export function CurrentCarriersComparison() {
  return <section className={styles.comparison} aria-labelledby="carriers-comparison-title">
    <p className={styles.eyebrow}>Сравни четыре среды</p>
    <h2 id="carriers-comparison-title" className="type-h2">Кто переносит заряд?</h2>
    <ul className={styles.rows}>
      {media.map(item => <li key={item.name} className={styles.row}>
        <div className={styles.medium}>
          {"href" in item ? <Link href={item.href}>{item.name} →</Link> : <strong>{item.name}</strong>}
        </div>
        <div className={styles.answer}>
          <strong>{item.carriers}</strong>
          <span>{item.condition}</span>
        </div>
      </li>)}
    </ul>
    <p className={styles.footnote}>Примесь не заряжает весь кристалл: n- и p-тип называют по тому, какие носители преобладают.</p>
  </section>;
}
