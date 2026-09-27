import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import { MathText } from "../ui/MathText";
import styles from "./TransformerNotebook.module.css";

export function TransformerNotebook() {
  return <section className={styles.notebook} aria-labelledby="transformer-note-title">
    <figure className={styles.scene}>
      <Image
        src={MIO_SCENES.transformer}
        width={1280}
        height={853}
        sizes="(max-width: 700px) 100vw, 390px"
        alt="Мио сравнивает две отдельные медные обмотки на общем замкнутом сердечнике учебного трансформатора."
      />
      <figcaption>Учебная установка: рисунок не задаёт число витков и показание прибора.</figcaption>
    </figure>
    <div className={styles.content}>
      <p className={styles.eyebrow}>Опыт с переменным током</p>
      <h2 id="transformer-note-title">Провода между катушками нет. Откуда напряжение?</h2>
      <p>Мио подаёт на первую обмотку низкое переменное напряжение и сравнивает обе стороны общего сердечника.</p>
      <dl className={styles.readings}>
        <div><dt>Первая обмотка</dt><dd><strong>200</strong> витков<span><strong>12 В</strong> на входе</span></dd></div>
        <div><dt>Вторая обмотка</dt><dd><strong>50</strong> витков<span><strong>?</strong> на выходе</span></dd></div>
      </dl>
      <details className={styles.result}>
        <summary>Предсказать и открыть результат</summary>
        <p className={styles.value}>На второй обмотке: <strong>3 В</strong></p>
        <p><MathText text="В идеальной модели $U_2/U_1=N_2/N_1=50/200=1/4$. Витков в четыре раза меньше — напряжение в четыре раза ниже." /></p>
        <p>Переменное поле общего сердечника связывает обмотки; их провода не соприкасаются. Частота при этом не меняется.</p>
      </details>
    </div>
  </section>;
}
