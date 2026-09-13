"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLessonDraft } from "../../lib/learning/use-lesson-draft";
import { averageSpeedInitial as initial, averageSpeedHeadings as headings } from "../../lib/learning/average-speed-draft";
import { speedTapes } from "../../lib/learning/average-speed-view";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";
import styles from "./AverageSpeedLab.module.css";

export function AverageSpeedLab() {
  const [state, setState] = useState(initial);
  const draft = useLessonDraft("average-speed", state, setState, headings.length);
  const title = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(state.stage);
  const patch = (next: Partial<typeof initial>) => setState((current) => ({ ...current, ...next }));
  const slowTime = Math.min(9, Math.max(1, Math.round(state.slowTime)));
  const fastTime = 10 - slowTime;
  const distance = 2 * slowTime + 8 * fastTime;
  const average = (distance / 10).toLocaleString("ru-RU");
  const tapes = speedTapes(slowTime);
  const normalizedAnswer = state.answer.trim().replace(",", ".");
  const correct = /^\+?\d+(?:\.\d+)?$/.test(normalizedAnswer) && Number(normalizedAnswer) === 4;
  const mood = state.stage === 4 || (state.stage === 3 && state.checked && correct)
    ? "celebrate"
    : state.stage === 1 && state.observed && slowTime !== 5 ? "attentive"
    : state.stage === 2 || state.stage === 3 ? "attentive" : "skeptical";
  const mioAlt = { skeptical: "Мио сомневается в своей гипотезе", attentive: "Мио внимательно сверяет условия", surprised: "Мио удивлена результатом опыта", celebrate: "Мио радуется результату" }[mood];
  useEffect(() => {
    if (previousStage.current !== state.stage && draft.ready) title.current?.focus();
    previousStage.current = state.stage;
  }, [state.stage, draft.ready]);
  const next = () => patch({ stage: Math.min(4, state.stage + 1) });
  const replies = [
    "Получается слишком удобно: (2 + 8) : 2 = 5. Пока это только моя гипотеза. Попробуем найти случай, где она не сработает?",
    state.observed && slowTime !== 5 ? "Так. Красивую догадку вычёркиваем: скорости те же, а средняя другая. Посмотрим, что изменило время." : "При одинаковом времени моя догадка работает. Подозрительно удобно. А если медленный участок длится дольше?",
    "Одного контрпримера хватило для слова «всегда». Теперь нужно правило, которое выдержит другое время.",
    state.checked && correct ? (state.attempts > 1 ? "Теперь сходится. Ты нашёл, что нужно учесть в расчёте." : "Сходится. Ты проверил новую поездку через весь путь и всё время.") : state.checked ? "Вернёмся к условиям: сколько времени робот ехал с каждой скоростью?" : "Здесь другие числа. Оставлю расчёт тебе — посмотрим, работает ли правило.",
    "Моя запись: весь путь делим на всё время. А как ты объяснишь, почему полусумма скоростей подходит не всегда?",
  ];

  if (!draft.ready) return <p role="status">Открываю лабораторию…</p>;
  return <article className={styles.lab}>
    <div className={styles.topline}>
      <Link href="/learn/average-speed">К объяснению средней скорости</Link>
      <span>Шаг {state.stage + 1} из 5</span>
    </div>
    <h1 ref={title} tabIndex={-1}>{headings[state.stage]}</h1>
    <div className={styles.layout} data-experiment={state.stage === 1 || undefined}>
      {state.stage !== 1 && <aside className={styles.companion} aria-label="Напарница Мио">
        <button className={styles.toggle} onClick={() => patch({ hideMio: !state.hideMio })}>{state.hideMio ? "Показать Мио" : "Скрыть Мио"}</button>
        {!state.hideMio && <><Image key={mood} data-mood={mood} className={styles.portrait} src={`/images/mio/mio-${mood}-${mood === "skeptical" ? "v2" : "v1"}.png`} alt={mioAlt} width={1254} height={1254} sizes="(max-width: 700px) 96px, 260px" priority /><div className={styles.speech}><strong>Мио · напарница по опытам</strong><p>{replies[state.stage]}</p>{state.stage===1&&state.observed&&slowTime!==5&&<div className={styles.revision} aria-label="Исправление гипотезы Мио"><span className={styles.crossed}>Всегда 5 м/с<svg viewBox="0 0 160 24" preserveAspectRatio="none" aria-hidden="true"><path d="M3 17 Q70 6 157 8" pathLength="1"/></svg></span><p>В этом опыте: <strong>{average} м/с</strong></p><small>Исправляю свою догадку.</small></div>}</div></>}
      </aside>}
      <section className={styles.workspace} aria-label="Опыт со средней скоростью">
        {state.stage === 0 && <>
          <p className={styles.eyebrow}>Гипотеза, которую предстоит проверить</p>
          <p className={styles.claim}>«Средняя скорость всегда равна (2 + 8) : 2 = 5 м/с».</p>
          <p>Велосипедист едет по прямой, сначала со скоростью 2 м/с, затем — 8 м/с. Обе скорости постоянны на своих участках. Остановок нет.</p>
          <fieldset><legend>Как думаешь, время на каждом участке имеет значение?</legend>
            {["Нет, достаточно знать две скорости", "Да, важно, сколько времени ехать с каждой скоростью", "Пока не знаю — хочу проверить"].map((value) => <label key={value} className={styles.choice}><input type="radio" name="prediction" checked={state.prediction === value} onChange={() => patch({ prediction: value })} />{value}</label>)}
          </fieldset>
          <Button size="lg" disabled={!state.prediction} onClick={next}>Проверить в опыте</Button>
        </>}
        {state.stage === 1 && <div className={styles.experiment}>
          <div className={styles.observation}>
            <p className={styles.tripHeading}>Одна поездка · <strong>10 секунд</strong></p>
            <div className={styles.timeControl}>
              <label htmlFor="slow-time">При 2 м/с: <strong>{slowTime} с</strong></label>
              <span>При 8 м/с: <strong>{fastTime} с</strong></span>
              <input id="slow-time" aria-label="Время движения со скоростью 2 м/с" type="range" min={1} max={9} step={1} value={slowTime} onChange={(event) => patch({ slowTime: Number(event.target.value), observed: false })} />
            </div>
            <figure className={styles.distanceModel} aria-label="Путь на двух участках в одном масштабе">
              <figcaption><strong>Сколько проехали</strong><span>Один отрезок — путь за 1 секунду.</span></figcaption>
              {tapes.map((tape, index) => <div className={styles.tapeRow} data-speed={tape.speed} key={tape.speed}>
                <div className={styles.tapeCaption}><strong>{tape.speed} м/с</strong><span>{tape.seconds} с · по {tape.speed} м за секунду</span></div>
                <div className={styles.tapeReading}>
                  <div className={styles.tapeTrack} aria-label={`Скорость ${tape.speed} м/с, время ${tape.seconds} с, путь ${tape.distance} м`}>
                    <div className={styles.tape} data-distance={tape.distance} style={{ width: `${tape.widthPercent}%` }}>
                      {Array.from({ length: tape.seconds }, (_, second) => <span key={second} aria-hidden="true" />)}
                    </div>
                  </div>
                  <strong>{tape.distance} м</strong>
                </div>
                {index === 1 && <div className={styles.ruler} aria-hidden="true"><span>0</span><span>40</span><span>80 м</span></div>}
              </div>)}
            </figure>
          </div>
          <div className={styles.interpretation}>
            <Button size="lg" variant={state.observed ? "ghost" : "primary"} disabled={state.observed} onClick={() => patch({ observed: true })}>{state.observed ? "Средняя скорость рассчитана" : "Найти среднюю скорость"}</Button>
            <div className={styles.reading} role="status">
              {state.observed ? <><span>Весь путь ÷ всё время</span><strong>{average} <small>м/с</small></strong>
                <p>Путь: <MathText text={`$${2 * slowTime}\\,\\text{м} + ${8 * fastTime}\\,\\text{м} = ${distance}\\,\\text{м}$`} /></p>
                <p>Скорость: <MathText text={`$\\dfrac{${distance}\\,\\text{м}}{10\\,\\text{с}} = ${average.replace(",", "{,}")}\\,\\text{м/с}$`} /></p>
              </> : <p>Средняя скорость за всю поездку?<br />Сравни её с догадкой Мио: 5 м/с.</p>}
            </div>
            <aside className={styles.labPartner} aria-label="Мио сверяет результат">
              {!state.hideMio && <><Image src={`/images/mio/mio-${state.observed ? "attentive-v1" : "skeptical-v2"}.png`} alt={state.observed ? "Мио внимательно сверяет результат с блокнотом" : "Мио сомневается в своей гипотезе"} width={1254} height={1254} sizes="(max-width:700px) 76px, 112px" />
                <div><strong>Мио</strong>{state.observed ? slowTime === 5 ? <p>Пока 5 м/с. А если ехать медленно дольше?</p> : <p><s>Всегда 5 м/с</s><br />{slowTime === 8 ? "Одинаковый путь — за разное время. Моя догадка не выдержала проверки." : "Скорости те же. Средняя — другая."}</p> : <p>Скорости не меняем. Проверим разное время.</p>}</div></>}
              <button className={styles.toggle} onClick={() => patch({ hideMio: !state.hideMio })}>{state.hideMio ? "Показать Мио" : "Скрыть Мио"}</button>
            </aside>
            <Button size="lg" variant={state.observed && slowTime !== 5 ? "primary" : "ghost"} disabled={!state.observed || slowTime === 5} onClick={next}>Объяснить результат</Button>
          </div>
        </div>}
        {state.stage === 2 && <>
          <p>При тех же скоростях 2 и 8 м/с мы изменили время движения — и средняя скорость изменилась.</p>
          <fieldset><legend>Как теперь найти среднюю путевую скорость?</legend>
            {["Сложить скорости и разделить на два при любых временах", "Весь пройденный путь разделить на всё затраченное время", "Выбрать скорость, с которой ехали дольше"].map((value, index) => <label key={value} className={styles.choice}><input type="radio" name="reason" checked={state.reason === String(index)} onChange={() => patch({ reason: String(index) })} />{value}</label>)}
          </fieldset>
          {state.reason && <p role="status" className={styles.result}>{state.reason === "1" ? "Да. Путь каждого участка равен скорости, умноженной на время. Складываем пути и делим на сумму времён." : "Сравни с опытом. Мы считали общий путь за 10 секунд. Какая операция показывает путь за одну секунду в среднем?"}</p>}
          <Button size="lg" disabled={state.reason !== "1"} onClick={next}>Решить самостоятельно</Button>
        </>}
        {state.stage === 3 && <>
          <p>Робот едет 6 с со скоростью 3 м/с, затем ещё 3 с со скоростью 6 м/с. Найди его среднюю путевую скорость за всю поездку. Остановок нет.</p>
          <form onSubmit={(event) => { event.preventDefault(); patch({ checked: true, attempts: state.attempts + 1 }); }}>
            <label htmlFor="average-answer">Средняя путевая скорость, м/с</label>
            <input id="average-answer" className={styles.answer} inputMode="decimal" autoComplete="off" maxLength={40} value={state.answer} onChange={(event) => patch({ answer: event.target.value, checked: false })} />
            <Button size="lg" variant={state.checked && correct ? "ghost" : "primary"} disabled={!state.answer.trim() || (state.checked && correct)} type="submit">{state.checked && correct ? "Ответ проверен" : "Проверить ответ"}</Button>
          </form>
          {state.checked && <p className={styles.result} role="status">{correct ? `${state.attempts === 1 ? "Верно." : "Получилось после повторной попытки."} Робот проехал 18 + 18 = 36 м за 9 с: 36 : 9 = 4 м/с.` : "Посчитай путь отдельно за первые 6 с и следующие 3 с. Раздели сумму путей на полное время поездки. Полусумма скоростей здесь не подходит."}</p>}
          {state.checked && correct && <Button size="lg" onClick={next}>Подвести итог</Button>}
        </>}
        {state.stage === 4 && <>
          <p className={styles.claim}>Средняя путевая скорость = весь путь : всё время.</p>
          <p>Для двух участков с постоянными скоростями полусумма скоростей подходит при равных временах. При неравных временах используй общее правило.</p>
          <details className={styles.writing}>
            <summary>{state.summaryText.trim() ? "Открыть моё объяснение" : "Объяснить своими словами"}</summary>
            <label htmlFor="speed-summary">Скорости остались 2 и 8 м/с. Почему средняя скорость изменилась, когда медленный участок стал длиться дольше?</label>
            <textarea id="speed-summary" rows={3} maxLength={10000} value={state.summaryText} onChange={(event) => patch({ summaryText: event.target.value, summarySaved: true })} />
            <p className={styles.note}>Можно набросать мысль и дополнить позже. Текст сохраняется автоматически в этом браузере; сайт не оценивает его.</p>
          </details>
          <Button asChild size="lg"><Link href="/practice/family/average-speed-segments">Закрепить на новых задачах</Link></Button>
        </>}
        <details className={styles.writing}>
          <summary>{state.personalNote.trim() ? "Открыть личную заметку" : "Личная заметка · необязательно"}</summary>
          <label htmlFor="speed-personal-note">Что хочешь оставить себе на потом?</label>
          <textarea id="speed-personal-note" rows={3} maxLength={10000} placeholder="Например, вопрос учителю или место, к которому хочется вернуться." value={state.personalNote} onChange={(event) => patch({ personalNote: event.target.value })} />
          <p className={styles.note}>Это не ответ на задание. Заметка сохраняется автоматически в этом браузере.</p>
        </details>
        {(state.summaryText.trim() || state.personalNote.trim()) && <Link className="text-[var(--action-primary)] underline underline-offset-4" href="/profile/notebook">Открыть мой блокнот</Link>}
      </section>
    </div>
    {draft.error && <p role="alert">{draft.error}</p>}
    {state.stage > 0 && <Button variant="ghost" onClick={() => patch({ stage: state.stage - 1 })}>Назад</Button>}
  </article>;
}
