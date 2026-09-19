import Image from "next/image";
import { MathText } from "../ui/MathText";
import styles from "./IsoprocessNotebook.module.css";

function ProcessGraph({ kind }: { kind: "isothermal" | "isobaric" | "isochoric" }) {
  const config = {
    isothermal: {
      title: "Изотерма в координатах p(V)",
      description: "При постоянной температуре давление убывает по гиперболе с увеличением объёма.",
      x: "V",
      y: "p",
      curve: "M54 48C73 73 92 103 117 129C145 158 176 174 229 187",
      guide: "",
    },
    isobaric: {
      title: "Изобара в координатах V(T)",
      description: "При постоянном давлении объём прямо пропорционален абсолютной температуре.",
      x: "T",
      y: "V",
      curve: "M78 181L235 55",
      guide: "M42 210L78 181",
    },
    isochoric: {
      title: "Изохора в координатах p(T)",
      description: "При постоянном объёме давление прямо пропорционально абсолютной температуре.",
      x: "T",
      y: "p",
      curve: "M78 181L235 55",
      guide: "M42 210L78 181",
    },
  }[kind];

  return (
    <svg viewBox="0 0 270 235" role="img" aria-label={`${config.title}. ${config.description}`}>
      <path className={styles.axis} d="M42 25V210H250M36 31l6-6 6 6M244 204l6 6-6 6" />
      <text className={styles.axisLabel} x="24" y="26">{config.y}</text>
      <text className={styles.axisLabel} x="246" y="228">{config.x}</text>
      {config.guide && <path className={styles.extrapolation} d={config.guide} />}
      <path className={styles.curve} d={config.curve} />
      <circle className={styles.point} cx={kind === "isothermal" ? 92 : 118} cy={kind === "isothermal" ? 103 : 149} r="5" />
      <circle className={styles.point} cx={kind === "isothermal" ? 176 : 201} cy={kind === "isothermal" ? 174 : 82} r="5" />
      <text className={styles.pointLabel} x={kind === "isothermal" ? 78 : 104} y={kind === "isothermal" ? 93 : 140}>1</text>
      <text className={styles.pointLabel} x={kind === "isothermal" ? 184 : 211} y={kind === "isothermal" ? 171 : 78}>2</text>
    </svg>
  );
}

const processes = [
  {
    id: "isothermal" as const,
    label: "Изотермический",
    constant: "T = const",
    law: String.raw`$pV=\mathrm{const}$`,
    relation: "V увеличивается → p уменьшается",
    name: "Бойля — Мариотта",
  },
  {
    id: "isobaric" as const,
    label: "Изобарный",
    constant: "p = const",
    law: String.raw`$\frac VT=\mathrm{const}$`,
    relation: "T увеличивается → V увеличивается",
    name: "Гей-Люссака",
  },
  {
    id: "isochoric" as const,
    label: "Изохорный",
    constant: "V = const",
    law: String.raw`$\frac pT=\mathrm{const}$`,
    relation: "T увеличивается → p увеличивается",
    name: "Шарля",
  },
] as const;

export function IsoprocessNotebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.heading}>
        <p>Атлас процессов · § 6</p>
        <h2>Один параметр остаётся на месте</h2>
        <span>Название изопроцесса — это подсказка о постоянной величине. Она определяет и формулу, и форму графика.</span>
      </header>

      <section className={styles.constRule} aria-label="Правило определения изопроцесса">
        <span>p</span><span>V</span><span>T</span>
        <strong>Один параметр = const</strong>
        <p>Масса и химический состав газа также не меняются.</p>
      </section>

      <div className={styles.processGrid}>
        {processes.map((process) => (
          <section key={process.id} aria-labelledby={`${process.id}-title`}>
            <header><span>{process.constant}</span><h3 id={`${process.id}-title`}>{process.label}</h3><small>закон {process.name}</small></header>
            <ProcessGraph kind={process.id} />
            <MathText text={process.law} />
            <p>{process.relation}</p>
          </section>
        ))}
      </div>

      <aside className={styles.mioNote}>
        <Image src="/images/mio/mio-thinking-v1.png" alt="Мио закрывает один параметр пометкой const и сравнивает оставшиеся два" width={1254} height={1254} sizes="(max-width:760px) 105px, 135px" />
        <div><span>Ход Мио</span><h3>Сначала закрой неизменный параметр</h3><p>Останутся две величины. На изотерме они связаны обратно; на изобаре и изохоре — прямо с абсолютной температурой.</p></div>
        <div className={styles.constCards} aria-label="Постоянный параметр для каждого процесса">
          <p><s>p · V · T</s><strong>p · V · <mark>T</mark></strong><small>изотермический</small></p>
          <p><s>p · V · T</s><strong><mark>p</mark> · V · T</strong><small>изобарный</small></p>
          <p><s>p · V · T</s><strong>p · <mark>V</mark> · T</strong><small>изохорный</small></p>
        </div>
      </aside>

      <section className={styles.translationBoard} aria-labelledby="graph-reading-title">
        <div><span>Чтение графика</span><h3 id="graph-reading-title">Оси важнее внешнего вида линии</h3><p>Один процесс выглядит по-разному в разных координатах. Сначала прочитай подписи осей, затем найди постоянный параметр.</p></div>
        <p><strong>Гипербола p(V)</strong><small>T постоянна</small><span>обратная пропорциональность</span></p>
        <p><strong>Прямая V(T)</strong><small>p постоянно</small><span>через начало для идеальной модели</span></p>
        <p><strong>Прямая p(T)</strong><small>V постоянен</small><span>через начало для идеальной модели</span></p>
      </section>

      <p className={styles.boundary}><strong>Граница продолжения.</strong> Пунктир к 0 К — математическое продолжение идеальной модели. Реальный газ при достаточно низкой температуре перестаёт вести себя как идеальный и может перейти в жидкость.</p>
    </div>
  );
}
