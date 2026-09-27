"use client";

import { useState } from "react";
import styles from "./ChargeConservationNotebook.module.css";

function chargeLabel(value: number): string {
  if (value === 0) return "0";
  return (value > 0 ? "+" : "−") + Math.abs(value) + "e";
}

export function ChargeConservationNotebook() {
  const [transferred, setTransferred] = useState(3);
  const woolCharge = transferred;
  const rodCharge = -transferred;

  return (
    <div className={styles.notebook}>
      <div className={styles.before}>
        <div>
          <span>До трения</span>
          <strong>Шерсть и эбонитовая палочка нейтральны</strong>
        </div>
        <span>Суммарный заряд пары: 0</span>
      </div>

      <div className={styles.control}>
        <label htmlFor="charge-transfer-count">Сколько электронов условно перешло из шерсти в палочку?</label>
        <output htmlFor="charge-transfer-count">{transferred}</output>
        <input
          id="charge-transfer-count"
          type="range"
          min="0"
          max="6"
          step="1"
          value={transferred}
          onChange={event => setTransferred(Number(event.currentTarget.value))}
          aria-describedby="charge-transfer-note"
        />
        <small id="charge-transfer-note">Несколько электронов здесь показывают принцип. Заметный заряд макроскопического тела соответствует передаче очень многих электронов.</small>
      </div>

      <div className={styles.transfer} aria-live="polite">
        <div className={styles.body}>
          <span>{transferred === 0 ? "Электронов не отдала" : "Отдала электроны"}</span>
          <strong>Шерсть</strong>
          <output>{chargeLabel(woolCharge)}</output>
          <small>{transferred === 0 ? "нейтральна" : "недостаток электронов"}</small>
        </div>
        <div className={styles.pass} aria-hidden="true">
          <span>{transferred === 0 ? "нет переноса" : "электроны"}</span>
          {transferred > 0 && <b className={styles.desktopArrow}>→</b>}
          {transferred > 0 && <b className={styles.mobileArrow}>↓</b>}
        </div>
        <div className={styles.body}>
          <span>{transferred === 0 ? "Электронов не получила" : "Получила электроны"}</span>
          <strong>Палочка</strong>
          <output>{chargeLabel(rodCharge)}</output>
          <small>{transferred === 0 ? "нейтральна" : "избыток электронов"}</small>
        </div>
      </div>

      <div className={styles.total}>
        <span>После трения · оба тела вместе</span>
        <strong>
          {chargeLabel(woolCharge)} + ({chargeLabel(rodCharge)}) = 0
        </strong>
        <p>{transferred === 0
          ? "Переноса нет: оба тела остаются нейтральными."
          : "Палочка зарядилась, но заряд не возник из ничего: шерсть получила такой же по модулю заряд другого знака."}</p>
      </div>
      <p className={styles.rule}>Сумма зарядов сохраняется, пока заряженные частицы не уходят за границу выбранной пары.</p>
    </div>
  );
}
