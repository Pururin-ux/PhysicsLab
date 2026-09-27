import Image from "next/image";
import { MIO_SCENES } from "../../lib/learning/mio-assets";
import styles from "./ElectrolyteEvidenceNotebook.module.css";

const samples = [
  {
    name: "Дистиллированная вода",
    observation: "Лампа не светится в условиях этого опыта. Почти нет свободных ионов, способных переносить заряд между электродами.",
  },
  {
    name: "Вода с сахаром",
    observation: "Сахар растворился, но лампа снова не светится: растворение само по себе не означает появления свободных ионов. Мио вычёркивает свою первую догадку.",
  },
  {
    name: "Вода с хлоридом меди(II)",
    observation: "Лампа светится. В растворе CuCl₂ есть подвижные ионы Cu²⁺ и Cl⁻; при прохождении тока на электродах происходят химические изменения.",
  },
] as const;

export function ElectrolyteEvidenceNotebook() {
  return <section className={styles.notebook} aria-labelledby="electrolyte-question">
    <figure className={styles.scene}>
      <Image src={MIO_SCENES.electrolytes} width={1280} height={853} sizes="(max-width: 800px) 100vw, 800px" alt="Мио записывает наблюдение у прозрачной ванны с двумя погружёнными графитовыми электродами. Провода идут к источнику за кадром; результат опыта на рисунке ещё не показан." />
      <figcaption>Ванна и электроды не меняются. Источник и лампа находятся за кадром.</figcaption>
    </figure>
    <header className={styles.heading}>
      <span>Один источник · три образца</span>
      <h2 id="electrolyte-question">Растворилось — значит, проводит?</h2>
      <p>Мио меняет только содержимое ванны. Предскажи, когда лампа загорится, а затем открой наблюдения.</p>
    </header>
    <div className={styles.records}>
      <h3>Записи опыта</h3>
      <ol className={styles.samples}>
        {samples.map((sample, index) => <li key={sample.name}>
          <details>
            <summary><span className={styles.sampleNumber}>0{index + 1}</span><span>{sample.name}</span></summary>
            <p>{sample.observation}</p>
          </details>
        </li>)}
      </ol>
      <p className={styles.boundary}>Это разбор школьного опыта, а не инструкция для домашнего повторения. Соли меди и продукты электролиза требуют работы под руководством учителя. Несветящаяся лампа не доказывает строго нулевую проводимость.</p>
    </div>
  </section>;
}
