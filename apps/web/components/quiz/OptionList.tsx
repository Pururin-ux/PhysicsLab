"use client";

import { OptionItem } from "./OptionItem";
import type {
  QuizOption,
  QuizSessionState,
  QuizTask,
} from "./quiz-session-store";
import { getOptionState } from "./quiz-session-store";

interface OptionListProps {
  task: QuizTask;
  options: QuizOption[];
  session: QuizSessionState;
  onSelect: (optionId: string) => void;
}

export function OptionList({
  task,
  options,
  session,
  onSelect,
}: OptionListProps) {
  const disabled = session.phase !== "active";

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Варианты ответа">
      {options.map((option) => (
        <div key={option.id} role="listitem">
          <OptionItem
            id={option.id}
            text={option.text}
            state={getOptionState(task, option.id, session)}
            disabled={disabled}
            onClick={() => onSelect(option.id)}
          />
        </div>
      ))}
    </div>
  );
}
