import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./FrictionResistanceNotebook.module.css";

export function FrictionResistanceNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Протокол опыта · § 20</p>
        <h2>Трение зависит от прижима, а не от видимой площади</h2>
        <span>Мио тянет один и тот же образец равномерно. Показание динамометра тогда равно модулю силы трения скольжения. Меняем только одно условие и сравниваем записи.</span>
      </header>

      <div className={styles.workspace}>
        <figure className={styles.track}>
          <Image className={styles.floor} src="/images/experiments/inertia-floor-v1.png" alt="" fill sizes="(max-width:760px) 100vw, 60vw" />
          <Image className={styles.slider} src="/images/experiments/inertia-puck-v1.png" alt="Латунный образец скользит вправо по деревянной поверхности" width={620} height={413} priority />
          <svg viewBox="0 0 760 380" role="img" aria-label="Образец тянут вправо силой 10 ньютонов, сила трения 10 ньютонов направлена влево, скорость постоянна">
            <g className={styles.pull}><path d="M440 184H650M650 184l-42-24m42 24-42 24" /><text x="470" y="148">Fтяги = 10 Н</text></g>
            <g className={styles.friction}><path d="M330 246H120M120 246l42-24m-42 24 42 24" /><text x="132" y="292">Fтр = 10 Н</text></g>
            <g className={styles.velocity}><path d="M350 96H500M500 96l-34-18m34 18-34 18" /><text x="360" y="68">v = const</text></g>
          </svg>
          <figcaption>Равномерное движение — способ измерить трение: горизонтальные силы скомпенсированы.</figcaption>
        </figure>

        <aside className={styles.ledger} aria-label="Расчёт силы трения">
          <div><span>Масса</span><strong>4 кг</strong></div>
          <div><span>Нормальная реакция</span><MathText text="$N=mg=40\,\text{Н}$" /></div>
          <div><span>Коэффициент</span><strong>μ = 0,25</strong></div>
          <div className={styles.primary}><span>Сила трения</span><MathText text="$F_{\text{тр}}=\mu N=10\,\text{Н}$" /></div>
        </aside>
      </div>

      <section className={styles.records} aria-labelledby="friction-records-title">
        <div className={styles.recordIntro}><p>Три записи одного опыта</p><h3 id="friction-records-title">Что меняет показание?</h3></div>
        <article><span>Исходное</span><strong>N = 40 Н</strong><b>Fтр = 10 Н</b><p>Образец лежит широкой гранью.</p></article>
        <article><span>Добавили груз</span><strong>N = 80 Н</strong><b>Fтр = 20 Н</b><p>Прижим удвоился — трение удвоилось.</p></article>
        <article><span>Повернули образец</span><strong>N = 40 Н</strong><b>Fтр ≈ 10 Н</b><p>Площадь контакта меньше, но прижим прежний.</p></article>
      </section>

      <div className={styles.distinctions}>
        <section><span>Покой</span><h3>Трение подстраивается</h3><p>Пока тело не сдвинулось, сила трения покоя возрастает вместе с внешней силой до предельного значения. Нельзя всегда подставлять <MathText text="$\mu N$" /> как её фактический модуль.</p></section>
        <section><span>Скольжение</span><h3>Работает модель μN</h3><p>Для школьной модели скольжения <MathText text="$F_{\text{тр}}=\mu N$" />. Направление противоположно скорости тела относительно опоры.</p></section>
        <section><span>Жидкость или газ</span><h3>Сопротивление зависит от движения</h3><p>В среде сопротивление зависит от её свойств, размеров и формы тела, а также от относительной скорости. Постоянный коэффициент μ здесь не описывает весь процесс.</p></section>
      </div>

      <p className={styles.conclusion}>Сначала выбери модель контакта, затем найди нормальную реакцию. Равенство <MathText text="$N=mg$" /> справедливо для показанной горизонтальной ситуации без других вертикальных сил, а не для любого движения.</p>
    </div>
  );
}
