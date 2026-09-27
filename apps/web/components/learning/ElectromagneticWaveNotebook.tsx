import styles from "./ElectromagneticWaveNotebook.module.css";

const plotWidth = 320;
const markers = [0, 80, 160, 240, 320] as const;

function fieldTrace(wavelengthPixels: number) {
  const points: string[] = [];
  for (let x = 0; x <= plotWidth; x += 4) {
    const y = 40 - 22 * Math.cos((2 * Math.PI * x) / wavelengthPixels);
    points.push(`${x},${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const records = [
  { frequency: "100 МГц", wavelength: "3 м", wavelengthPixels: 160, cycles: 2 },
  { frequency: "200 МГц", wavelength: "1,5 м", wavelengthPixels: 80, cycles: 4 },
] as const;

export function ElectromagneticWaveNotebook() {
  return <section className={styles.notebook} aria-labelledby="electromagnetic-wave-question">
    <header className={styles.header}>
      <p className={styles.eyebrow}>Один участок · вакуум</p>
      <h2 id="electromagnetic-wave-question">Частота вдвое выше. Сколько волн поместится на том же пути?</h2>
      <p>В обоих случаях поле распространяется с одной скоростью. Сравни повторяющиеся участки графика на расстоянии 6 м.</p>
    </header>

    <div className={styles.graphs} aria-label="Сравнение двух частот на одинаковом расстоянии">
      {records.map(record => <div className={styles.record} key={record.frequency}>
        <div className={styles.recordHeading}><strong>{record.frequency}</strong><span>{record.cycles} повторения на 6 м</span></div>
        <svg className={styles.plot} viewBox="0 0 320 80" preserveAspectRatio="none" role="img" aria-label={`График электрического поля: ${record.cycles} полных повторения на участке 6 метров при частоте ${record.frequency}`}>
          {markers.map(x => <line key={x} x1={x} x2={x} y1="5" y2="75" className={styles.grid} />)}
          <line x1="0" x2="320" y1="40" y2="40" className={styles.zero} />
          <polyline points={fieldTrace(record.wavelengthPixels)} className={styles.trace} />
        </svg>
      </div>)}
      <div className={styles.axis} aria-hidden="true"><span>0</span><span>1,5</span><span>3</span><span>4,5</span><span>6 м</span></div>
    </div>

    <details className={styles.answer}>
      <summary>Почему расстояние между повторениями изменилось?</summary>
      <div className={styles.answerBody}>
        <p>В вакууме скорость обеих волн примерно 300 000 000 м/с. При 100 МГц получается длина волны 3 м; при 200 МГц — 1,5 м. Частота выросла вдвое, расстояние между одинаковыми фазами стало вдвое меньше.</p>
        <p><strong>Связь:</strong> c = λν. Это не означает, что вторая волна движется медленнее.</p>
      </div>
    </details>
    <p className={styles.boundary}>Линия показывает одну компоненту электрического поля E(x) в один момент, а не путь частиц в пространстве. Высота линии условная; измеряемое здесь расстояние — вдоль горизонтальной оси.</p>
  </section>;
}
