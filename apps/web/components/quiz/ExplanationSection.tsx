"use client";

import { motion } from "framer-motion";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import type { TaskFocus } from "../../lib/learning/task-focus";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

interface ExplanationSectionProps {
  explanation: string;
  explanationLatex?: string;
  trap: string;
  isCorrect: boolean;
  correctionHint?: string;
  tutorial?: TaskFocus;
  selectedMisconception?: string;
  diagnosticPrompt?: string;
}

export function ExplanationSection({
  explanation,
  explanationLatex,
  trap,
  isCorrect,
  correctionHint,
  tutorial,
  selectedMisconception,
  diagnosticPrompt,
}: ExplanationSectionProps) {
  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;
  const statusLabel = isCorrect ? "Верно" : "Не совсем";
  const trapText = trap.trim();
  const methodHint = tutorial?.check ?? correctionHint;
  const keyObservation =
    tutorial?.keyObservation ??
    "Сначала нужно распознать тип ситуации, а уже потом подставлять числа.";
  const mistakeKind =
    tutorial?.mistakeKind ??
    "Проверь, не был ли выбран быстрый расчёт без анализа условия.";
  const selfCheck =
    tutorial?.selfCheck ??
    "Сможешь объяснить, почему первый шаг решения был именно таким?";
  const diagnosticQuestion = diagnosticPrompt ?? tutorial?.diagnosticPrompt;
  const attentionText = isCorrect
    ? trapText
    : [trapText, mistakeKind].filter(Boolean).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        variant="elevated"
        className={`flex flex-col gap-3.5 border-l-2 ${
          isCorrect ? "border-l-nova-cyan/60" : "border-l-nova-gold/60"
        }`}
      >
        <div className="flex items-center gap-3">
          <p
            className={`text-[14px] font-semibold leading-none ${
              isCorrect ? "text-nova-cyan" : "text-nova-gold"
            }`}
          >
            {statusLabel}
          </p>
        </div>

        <p className="text-[14px] font-normal leading-[1.75] text-white/80">
          <MathText text={explanation} />
        </p>

        {formulaHtml ? (
          <div
            data-testid="solution-formula"
            className="formula-white rounded-option border border-white/[.09] bg-white/[.035] px-4 py-3 text-center text-[15px] font-medium leading-[1.7] shadow-[inset_0_1px_0_rgba(255,255,255,.025)]"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
        ) : null}

        {methodHint ? (
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
                <MathText text={methodHint} />
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

        {!isCorrect && (selectedMisconception || diagnosticQuestion) ? (
          <div className="rounded-option border border-nova-gold/[.18] bg-nova-gold/[.045] px-4 py-3 text-[13px] leading-[1.6] text-white/76">
            <p className="mb-2 text-[12px] font-semibold leading-none text-nova-gold/85">
              Диагностический вопрос
            </p>
            <div className="grid gap-2">
              {selectedMisconception ? (
                <p>
                  <span className="font-semibold text-white/85">Выбранный ход: </span>
                  <MathText text={selectedMisconception} />
                </p>
              ) : null}
              {diagnosticQuestion ? (
                <p>
                  <span className="font-semibold text-white/85">Проверь себя: </span>
                  <MathText text={diagnosticQuestion} />
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {attentionText ? (
          <div
            className={`border-t pt-3 text-[13px] font-normal leading-[1.6] ${
              isCorrect
                ? "border-white/[.08] text-white/66"
                : "border-nova-gold/[.18] text-white/72"
            }`}
          >
            <p
              className={`mb-1 text-[12px] font-semibold leading-none ${
                isCorrect ? "text-white/58" : "text-nova-gold/85"
              }`}
            >
              {isCorrect ? "На что обратить внимание" : "Что сбило"}
            </p>
            <p>
              <MathText text={attentionText} />
            </p>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
