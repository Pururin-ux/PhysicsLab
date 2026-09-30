import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import { MathText } from "../ui/MathText";
import styles from "./EnergyTransmissionNotebook.module.css";

export function EnergyTransmissionNotebook() {
  return <section className={styles.notebook} aria-labelledby="transmission-question">
    <div className={styles.intro}>
      <figure className={styles.scene}>
        <Image
          src={MIO_SCENES.energyTransmission}
          width={1280}
          height={853}
          sizes="(max-width: 700px) 130px, 600px"
          alt="Мио рассматривает изолированный учебный провод в защитном коробе; числовых показаний на рисунке нет."
        />
      </figure>
      <div className={styles.introCopy}>
        <p className={styles.eyebrow}>Из блокнота Мио</p>
        <h2 id="transmission-question">Ток ниже. А нагрев?</h2>
        <p>У входа — 120 Вт; сопротивление проводов линии — 0,4 Ом.</p>
      </div>
    </div>
    <div className={styles.sheet}>
      <div className={styles.comparison} aria-label="Два режима передачи одинаковой мощности">
        <div className={styles.case}>
          <p>Без повышения напряжения</p>
          <strong>24 В</strong>
          <span>Ток в линии <b>5 А</b></span>
        </div>
        <div className={styles.case}>
          <p>После повышения напряжения</p>
          <strong>120 В</strong>
          <span>Ток в линии <b>1 А</b></span>
        </div>
      </div>
      <p className={styles.guess}>Мио записала: «Ток меньше в 5 раз — нагрев тоже?»</p>
      <details className={styles.result}>
        <summary>Проверить, сколько мощности нагревает провод</summary>
        <div className={styles.outcomes}>
          <p><span>При 24 В</span><strong>10 Вт</strong><small>5² А² · 0,4 Ом</small></p>
          <p><span>При 120 В</span><strong>0,4 Вт</strong><small>1² А² · 0,4 Ом</small></p>
        </div>
        <p className={styles.conclusion}><MathText text="Ток уменьшился в 5 раз, а мощность нагрева $P_\text{наг}=I^2R$ — в $5^2=25$ раз. До потребителя в этой упрощённой модели доходят соответственно 110 Вт и 119,6 Вт." /></p>
      </details>
      <p className={styles.limit}>Это расчёт для линии с активным сопротивлением. В реальной сети учитывают и другие потери; высокое напряжение опасно и не подходит для самостоятельного опыта.</p>
    </div>
  </section>;
}
