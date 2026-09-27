"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MIO_PORTRAITS } from "../../lib/learning/mio-assets";
import { getLightPressureState, type LightPressureSurface } from "../../lib/physics/light-pressure-model";
import styles from "./LightPressureNotebook.module.css";

export function LightPressureNotebook() {
  const [surface, setSurface] = useState<LightPressureSurface>("absorbed");
  const groupId = useId();
  const state = getLightPressureState(surface);
  const isReflected = state.surface === "reflected";
  const mioNote = isReflected
    ? "Я ошиблась: отражённый свет уносит импульс в обратном направлении, поэтому зеркало получает 2p."
    : "При поглощении свет отдаёт пластинке импульс p. Теперь сравни с отражением.";

  return (
    <div className={styles.notebook}>
      <div className={styles.experiment}>
        <figure className={styles.figure}>
          <div className={styles.art}>
            <Image
              src="/images/experiments/light-pressure-lebedev-v1.webp"
              alt="Воссозданная установка опыта Лебедева: в стеклянном сосуде на тонком подвесе находится коромысло с чёрной и зеркальной пластинками; измерительный луч попадает на шкалу."
              width={1280}
              height={853}
              sizes="(max-width: 760px) 100vw, 28rem"
              loading="eager"
            />
          </div>
          <figcaption>
            Реконструкция установки Лебедева: коромысло с чёрной и зеркальной пластинками находилось в
            откачанном сосуде; о слабом действии света судили по его повороту.
          </figcaption>
        </figure>

        <div className={styles.record}>
          <div className={styles.mioNote}>
            <Image
              src={MIO_PORTRAITS.skeptical.src}
              alt=""
              width={1254}
              height={1254}
              sizes="56px"
              className={styles.mio}
            />
            <p>
              <strong>Гипотеза Мио</strong>
              <br />
              «Если свет отразился и улетел, зеркало не получило толчка?»
            </p>
          </div>

          <fieldset className={styles.surfaceControl}>
            <legend>Что стало с падающим светом?</legend>
            <div className={styles.surfaceOptions}>
              <label htmlFor={groupId + "-absorbed"}>
                <input
                  id={groupId + "-absorbed"}
                  type="radio"
                  name={groupId}
                  value="absorbed"
                  checked={surface === "absorbed"}
                  onChange={() => setSurface("absorbed")}
                />
                <span><strong>Поглощён</strong><small>чёрная пластинка</small></span>
              </label>
              <label htmlFor={groupId + "-reflected"}>
                <input
                  id={groupId + "-reflected"}
                  type="radio"
                  name={groupId}
                  value="reflected"
                  checked={surface === "reflected"}
                  onChange={() => setSurface("reflected")}
                />
                <span><strong>Отражён</strong><small>зеркальная пластинка</small></span>
              </label>
            </div>
          </fieldset>

          <div className={styles.observation} aria-live="polite">
            <p className={styles.observationTitle}>Запись импульса, в единицах p</p>
            <dl className={styles.momentumLedger}>
              <div>
                <dt>До встречи</dt>
                <dd>+p</dd>
              </div>
              <div>
                <dt>После встречи</dt>
                <dd>{isReflected ? "−p" : "поглощён"}</dd>
              </div>
              <div>
                <dt>Получила пластинка</dt>
                <dd>{state.plateImpulseUnits === 2 ? "2p" : "p"}</dd>
              </div>
            </dl>
            <p className={styles.pressureResult}>
              <span>Давление при том же потоке и площади</span>
              <strong>{state.relativePressure}×</strong>
              <small>от поглощающей поверхности</small>
            </p>
            <p className={styles.mioConclusion} aria-live="polite">{mioNote}</p>
          </div>
        </div>
      </div>

      <p className={styles.boundary}>
        Сравнение идеализировано: свет падает перпендикулярно; одна поверхность полностью поглощает его,
        другая идеально отражает. У реальных пластинок эти условия выполняются не точно.
      </p>
    </div>
  );
}
