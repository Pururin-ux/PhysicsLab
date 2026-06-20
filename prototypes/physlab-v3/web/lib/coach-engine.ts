export type CoachState =
  | "calm"
  | "thinking"
  | "warning"
  | "encouraging"
  | "surprised";

export type CoachEvent =
  | { type: "session_start" }
  | { type: "correct_answer"; streak: number; taskId: string }
  | { type: "wrong_answer"; attempt: number; taskId: string }
  | { type: "pause"; seconds: number }
  | { type: "session_end"; score: number; total: number };

export type CoachResponse = {
  state: CoachState;
  text: string;
  duration: number;
  priority: number;
};

export function getCoachResponse(
  event: CoachEvent,
  coachLines: Record<string, string>,
): CoachResponse {
  switch (event.type) {
    case "session_start":
      return {
        state: "calm",
        text: "Разберём 10 задач в формате ЦТ. Начнём.",
        duration: 3500,
        priority: 1,
      };
    case "correct_answer":
      if (event.streak >= 3) {
        return {
          state: "surprised",
          text: "Три подряд — отличный темп!",
          duration: 3000,
          priority: 3,
        };
      }
      return {
        state: "encouraging",
        text: coachLines.correct,
        duration: 3500,
        priority: 2,
      };
    case "wrong_answer":
      if (event.attempt === 1) {
        return {
          state: "warning",
          text: coachLines.wrong,
          duration: 0,
          priority: 2,
        };
      }
      return {
        state: "warning",
        text: coachLines.hint,
        duration: 0,
        priority: 2,
      };
    case "pause":
      if (event.seconds >= 20) {
        return {
          state: "thinking",
          text: "Какой закон здесь главный?",
          duration: 4000,
          priority: 1,
        };
      }
      return { state: "calm", text: "", duration: 0, priority: 0 };
    case "session_end": {
      const pct = event.score / event.total;
      return {
        state:
          pct >= 0.8 ? "surprised" : pct >= 0.5 ? "encouraging" : "warning",
        text:
          pct >= 0.8
            ? `${event.score} из ${event.total}! Отличная подготовка.`
            : `${event.score} из ${event.total}. Повтори слабые темы — они выделены.`,
        duration: 0,
        priority: 3,
      };
    }
  }
}
