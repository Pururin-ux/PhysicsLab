"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import type { CoachState } from "../../lib/coach-engine";
import type { TaskFocus } from "../../lib/learning/task-focus";
import { CoachAvatar } from "../coach/CoachAvatar";
import { useTypewriter } from "../coach/useTypewriter";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  // Один голос: реплика Nova становится заголовком карточки, а не
  // отдельным плавающим баблом, конкурирующим за внимание.
  novaState: CoachState;
  novaText: string;
  explanation: string;
  explanationLatex?: string;
  tutorial?: TaskFocus;
  diagnosticPrompt?: string;
}

// После ответа — одна поверхность с жёсткой иерархией:
// 1) якорь: статус + реплика Nova (единственная фокусная точка);
// 2) для ошибки — одна короткая строка «что сбило»;
// 3) всё тяжёлое (полный разбор, формула, метод) — под свёрнутым
//    «Разбором», раскрывается по желанию. Цель — снять перегрузку и
//    конфликт фокусов, но не потерять педагогику: прицельная реплика об
//    ошибке видна сразу, даже если ученик не откроет разбор.
export function AnswerFeedback({
  isCorrect,
  novaState,
  novaText,
  explanation,
  explanationLatex,
  tutorial,
  diagnosticPrompt,
}: AnswerFeedbackProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { output, done } = useTypewriter(novaText);

  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;

  const statusLabel = isCorrect ? "Верно" : "Не совсем";
  const accentText = isCorrect ? "text-nova-cyan" : "text-nova-gold";
  const accentBorder = isCorrect ? "border-l-nova-cyan/60" : "border-l-nova-gold/60";

  const keyObservation =
    tutorial?.keyObservation ??
    "Сначала распознай тип ситуации, а уже потом подставляй числа.";
  const method = tutorial?.check;
  const selfCheck = tutorial?.selfCheck;
  const diagnosticQuestion = diagnosticPrompt ?? tutorial?.diagnosticPrompt;

  // Реплика Nova уже несёт сам ход-ошибку; здесь — один рефлексивный
  // вопрос, который стоит обдумать до открытия полного разбора.
  const reflection = !isCorrect ? diagnosticQuestion : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="elevated" className={cn("flex flex-col gap-3 border-l-2", accentBorder)}>
        {/* Якорь: одна реплика Nova с её лицом */}
        <div className="flex items-start gap-3">
          <CoachAvatar state={novaState} className="h-11 w-11" />
          <div className="min-w-0 flex-1">
            <p className={cn("text-[13px] font-bold leading-none", accentText)}>{statusLabel}</p>
            <p
              role="status"
              aria-live="polite"
              className="mt-1.5 text-[14px] font-medium leading-[1.6] text-white/85"
            >
              <MathText text={output} />
              {!done ? <span className="nova-caret" aria-hidden="true" /> : null}
            </p>
          </div>
        </div>

        {reflection ? (
          <p className="text-[13px] leading-[1.6] text-white/68">
            <span className="font-semibold text-nova-gold/85">Проверь себя: </span>
            <MathText text={reflection} />
          </p>
        ) : null}

        {/* Всё тяжёлое — за одним раскрытием, один столбец, один акцент */}
        <div className="border-t border-white/[.08] pt-0.5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 py-2 text-left transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50"
          >
            <span className="text-[13px] font-semibold text-white/78">
              {open ? "Свернуть разбор" : "Разбор шаг за шагом"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "h-4 w-4 shrink-0 text-white/40 transition-transform",
                open ? "rotate-90" : "",
              )}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {open ? (
            <div id={panelId} className="flex flex-col gap-3 pb-1 pt-1">
              <p className="text-[14px] leading-[1.75] text-white/80">
                <MathText text={explanation} />
              </p>

              {formulaHtml ? (
                <div
                  data-testid="solution-formula"
                  className="formula-white rounded-option border border-white/[.09] bg-white/[.035] px-4 py-3 text-center text-[15px] font-medium leading-[1.7]"
                  dangerouslySetInnerHTML={{ __html: formulaHtml }}
                />
              ) : null}

              {method ? (
                <div className="rounded-option border border-nova-cyan/[.12] bg-nova-cyan/[.035] px-4 py-3 text-[13px] leading-[1.6] text-white/74">
                  <p className="mb-2 text-[12px] font-semibold leading-none text-nova-cyan/85">
                    Как решать похожую
                  </p>
                  <div className="grid gap-2">
                    <p>
                      <span className="font-semibold text-white/82">Заметь: </span>
                      <MathText text={keyObservation} />
                    </p>
                    <p>
                      <span className="font-semibold text-white/82">Делай: </span>
                      <MathText text={method} />
                    </p>
                    {selfCheck ? (
                      <p>
                        <span className="font-semibold text-white/82">Проверь: </span>
                        <MathText text={selfCheck} />
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
