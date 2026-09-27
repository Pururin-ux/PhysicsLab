import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import styles from "./GasDischargeNotebook.module.css";

const observations = [
  {
    condition: "Пламени нет",
    result: "При небольшой разности потенциалов показание электрометра почти не меняется: в воздухе мало свободных носителей заряда.",
  },
  {
    condition: "Воздух нагревают",
    result: "Электрометр разряжается. Нагревание ионизирует воздух в промежутке: возникают свободные электроны и ионы.",
  },
  {
    condition: "Пламя убрали",
    result: "В том же слабом поле разряд прекращается. Часть заряженных частиц рекомбинирует, а новых без ионизатора уже недостаточно.",
  },
] as const;

export function GasDischargeNotebook() {
  return <section className={styles.notebook} aria-labelledby="gas-note-title">
    <figure className={styles.scene}>
      <Image
        src={MIO_SCENES.gasDischarge}
        width={1280}
        height={853}
        sizes="(max-width: 800px) 100vw, 800px"
        alt="За защитным экраном пламя нагревает промежуток между двумя металлическими пластинами; Мио записывает показание электрометра. Искры между пластинами нет."
      />
      <figcaption>Один момент школьной демонстрации: воздух между пластинами нагревают, но искры в промежутке нет.</figcaption>
    </figure>
    <div className={styles.notes}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>Из блокнота Мио</span>
        <h2 id="gas-note-title">Откуда взялся ток в воздухе?</h2>
        <p>Пластины и слабое поле остаются прежними. Учитель меняет только нагрев воздуха. Предскажи показание электрометра.</p>
      </div>
      <details className={styles.evidence}>
        <summary>Открыть три наблюдения</summary>
        <ol>
          {observations.map(({ condition, result }) => <li key={condition}>
            <strong>{condition}</strong>
            <p>{result}</p>
          </li>)}
        </ol>
        <p className={styles.conclusion}>Здесь разряд зависит от внешнего ионизатора. Случай, когда сильное поле поддерживает разряд и после его удаления, разберём отдельно.</p>
      </details>
      <p className={styles.boundary}>Это объяснение демонстрации под руководством учителя, а не инструкция для домашнего опыта с пламенем и электричеством. Рисунок не показывает отдельные ионы и не задаёт численное значение тока.</p>
    </div>
  </section>;
}
