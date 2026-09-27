import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import styles from "./SemiconductorLightNotebook.module.css";

export function SemiconductorLightNotebook() {
  return <section className={styles.notebook} aria-labelledby="semiconductor-note-title">
    <figure className={styles.scene}>
      <Image
        src={MIO_SCENES.semiconductorLight}
        width={1280}
        height={853}
        sizes="(max-width: 800px) 100vw, 470px"
        alt="Мио приподнимает тёмную заслонку над фоторезистором под лампой и смотрит на прибор; рядом открыт её блокнот."
      />
    </figure>
    <div className={styles.content}>
      <p className={styles.eyebrow}>Опыт с фоторезистором</p>
      <h2 id="semiconductor-note-title">Мио убрала заслонку</h2>
      <p className={styles.prompt}>Напряжение прежнее. Как изменятся сопротивление и ток?</p>
      <details className={styles.evidence}>
        <summary>Проверить прогноз</summary>
        <dl className={styles.states}>
          <div>
            <dt>Датчик в тени</dt>
            <dd>Сопротивление больше.<br />Ток меньше.</dd>
          </div>
          <div>
            <dt>Свет попал на датчик</dt>
            <dd>Сопротивление меньше.<br />Ток больше.</dd>
          </div>
        </dl>
        <p>Сравнение качественное: чисел для сопротивления и тока здесь нет.</p>
      </details>
      <p className={styles.question}>Почему свет меняет сопротивление твёрдого тела? Ищи ответ в связях между его атомами ниже.</p>
    </div>
  </section>;
}
