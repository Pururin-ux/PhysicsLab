"use client";

import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "../ui/Button";
import { parseNumericAnswer, type AnswerSign } from "../../lib/answer/numeric-answer";
import { cn } from "../../lib/utils";

interface NumericAnswerInputProps {
  unit: string;
  decimals: number;
  sign: AnswerSign;
  disabled: boolean;
  // Задано после ответа: поле блокируется и показывает введённое значение
  // с явным статусом (не только цветом).
  submitted?: { raw: string; isCorrect: boolean };
  onSubmit: (raw: string) => void;
}

function roundingHint(decimals: number): string | null {
  if (decimals <= 0) {
    // Формат ЦТ/ЦЭ: в бланк записывается целое число.
    return "Ответ — целое число, как в бланке ЦТ/ЦЭ.";
  }

  if (decimals === 1) {
    return "Если ответ дробный — округли до одного знака после запятой.";
  }

  return `Если ответ дробный — округли до ${decimals} знаков после запятой.`;
}

export function NumericAnswerInput({
  unit,
  decimals,
  sign,
  disabled,
  submitted,
  onSubmit,
}: NumericAnswerInputProps) {
  const [raw, setRaw] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);
  const hintId = useId();
  const errorId = useId();
  const hint = roundingHint(decimals);

  const parsed = parseNumericAnswer(raw);
  const canSubmit = parsed.ok && !disabled;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (disabled) {
      return;
    }
    if (!parsed.ok) {
      setShowInvalid(true);
      return;
    }
    onSubmit(raw);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || disabled || parsed.ok) {
      return;
    }

    event.preventDefault();
    setShowInvalid(true);
  }

  if (submitted) {
    const isCorrect = submitted.isCorrect;

    return (
      <div
        data-testid="numeric-answer"
        data-state={isCorrect ? "correct" : "wrong"}
        className={cn(
          "flex items-center justify-between gap-3 rounded-option border px-4 py-3",
          isCorrect
            ? "border-nova-cyan/55 bg-nova-cyan-10 shadow-[inset_3px_0_0_#79D9EE]"
            : "border-nova-pink/45 bg-nova-pink/[.07] shadow-[inset_3px_0_0_#E079C7]",
        )}
      >
        <span className="min-w-0 text-[15px] font-semibold text-white">
          <span className="text-white/55">Твой ответ: </span>
          <span className="physics-number">{submitted.raw || "—"}</span>
          {unit ? <span className="text-white/55"> {unit}</span> : null}
        </span>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-badge border px-2.5 py-1 text-[12px] font-bold leading-none",
            isCorrect
              ? "border-nova-cyan/30 bg-nova-cyan/[.08] text-nova-cyan"
              : "border-nova-pink/30 bg-nova-pink/[.08] text-nova-pink",
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            {isCorrect ? <path d="M5 13l4 4L19 7" /> : <path d="M6 6l12 12M18 6 6 18" />}
          </svg>
          {isCorrect ? "Верно" : "Не совсем"}
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-option border bg-white/[.03] px-3.5 transition-colors",
            "focus-within:ring-2 focus-within:ring-nova-cyan/55",
            showInvalid && !parsed.ok ? "border-nova-pink/55" : "border-white/[.12]",
          )}
        >
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="send"
            data-testid="numeric-answer-input"
            // Безразмерный ответ (unit === "") не анонсирует пустую единицу.
            aria-label={unit ? `Ответ в единицах: ${unit}` : "Ответ (число без единиц)"}
            aria-describedby={cn(hint ? hintId : "", showInvalid && !parsed.ok ? errorId : "") || undefined}
            aria-invalid={showInvalid && !parsed.ok}
            value={raw}
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              setRaw(event.target.value);
              setShowInvalid(false);
            }}
            placeholder={sign === "signed" ? "например, -120" : "например, 24"}
            className="h-12 min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white placeholder:text-white/35 focus:outline-none"
          />
          {unit ? (
            <span
              aria-hidden="true"
              data-testid="numeric-answer-unit"
              className="shrink-0 text-[14px] font-medium text-white/55"
            >
              {unit}
            </span>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          data-testid="numeric-submit"
          className="w-full sm:w-auto sm:min-w-[120px] sm:shrink-0"
        >
          Ответить
        </Button>
      </div>

      {hint ? (
        <p id={hintId} className="text-[12px] leading-[1.5] text-white/58">
          {hint}
        </p>
      ) : null}

      {showInvalid && !parsed.ok ? (
        <p id={errorId} role="alert" className="text-[12px] leading-[1.5] text-nova-pink/90">
          Введи число — можно с десятичной запятой и со знаком минус.
        </p>
      ) : null}
    </form>
  );
}
