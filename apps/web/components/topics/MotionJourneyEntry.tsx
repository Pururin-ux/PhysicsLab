import Image from "next/image";
import Link from "next/link";
import styles from "./MotionJourneyEntry.module.css";

export function MotionJourneyEntry() {
  return <section className={styles.journey} aria-labelledby="motion-journey-title">
    <div className={styles.art}>
      <Image src="/images/mio/textbook-path-v1.png" alt="Мио вернулась в кабинет за забытым блокнотом" width={1536} height={1024} sizes="(max-width:700px) 100vw, 420px" />
    </div>
    <div className={styles.content}>
      <p className={styles.eyebrow}>Движение · 9 класс</p>
      <h2 id="motion-journey-title">Вернулась на старт.<br />А сколько прошла?</h2>
      <p className={styles.lead}>Мио забыла блокнот. Проследи её путь туда и обратно, а затем добавь время к той же прогулке.</p>
      <Link className={styles.start} href="/learn/path-and-displacement">Начать с прогулки <span aria-hidden="true">→</span></Link>
      <nav className={styles.parts} aria-label="Открыть часть темы о движении">
        <span>Можно сразу перейти к нужному:</span>
        <Link href="/learn/average-speed">Средняя скорость <span aria-hidden="true">→</span></Link>
        <Link href="/practice/average-speed-lesson">Опыт с двумя скоростями <span aria-hidden="true">→</span></Link>
        <Link href="/practice/family/average-speed-segments">Самостоятельные задачи <span aria-hidden="true">→</span></Link>
      </nav>
    </div>
  </section>;
}
