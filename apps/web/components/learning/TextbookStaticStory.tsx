import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import styles from "./TextbookScene.module.css";

export function TextbookStaticStory() {
  return <section className={styles.scene} aria-label="Мио наблюдает за колебаниями груза">
    <figure className={styles.illustration}>
      <Image
        className={styles.art}
        src={MIO_SCENES.oscillations}
        alt="Мио сосредоточенно записывает наблюдение за грузом, подвешенным к пружине на лабораторном штативе"
        width={1536}
        height={1024}
        sizes="(max-width:640px) 100vw, 450px"
        priority
      />
      <figcaption className={styles.caption}>
        <h2>Мио следит за грузом на пружине</h2>
        <p>Она записывает, как меняется положение груза. Чтобы считать полный цикл, важно дождаться возвращения того же состояния, включая направление движения.</p>
      </figcaption>
    </figure>
  </section>;
}
