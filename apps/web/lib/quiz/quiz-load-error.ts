// Типизированная модель ошибок загрузки задач. Классификация не зависит от
// текста сообщения; пользователю никогда не показывается сырой exception.

export type GeneratedQuizErrorKind =
  | "offline"
  | "timeout"
  | "network"
  | "http"
  | "invalid_payload"
  | "empty_payload"
  | "integrity";

export type GeneratedQuizError = {
  kind: GeneratedQuizErrorKind;
  retryable: boolean;
  // Спокойный конкретный текст для пользователя, без internals.
  userMessage: string;
  status?: number;
};

const MESSAGES = {
  offline: "Нет соединения с интернетом. Проверь сеть и повтори попытку.",
  timeout: "Сервер долго не отвечает. Повтори попытку.",
  network: "Сеть недоступна. Проверь соединение и повтори попытку.",
  serverUnavailable: "Сервер временно недоступен. Повтори попытку через минуту.",
  badRequest: "Набор задач не загрузился. Попробуй ещё раз или вернись к темам.",
  invalidPayload: "Ответ приложения повреждён. Повтори попытку.",
  emptyPayload: "Набор задач пришёл пустым. Повтори попытку.",
  integrity: "Набор задач не прошёл проверку. Повтори попытку.",
} as const;

function isNavigatorOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

export function classifyHttpError(status: number): GeneratedQuizError {
  // 429 и 5xx — временные проблемы сервера; 4xx — запрос не будет успешен
  // повторно сам по себе, но retry той же кнопкой не вреден.
  if (status === 429 || status >= 500) {
    return {
      kind: "http",
      retryable: true,
      userMessage: MESSAGES.serverUnavailable,
      status,
    };
  }

  return {
    kind: "http",
    retryable: false,
    userMessage: MESSAGES.badRequest,
    status,
  };
}

// Классификация исключения fetch. timedOut передаётся снаружи: hook знает,
// что abort вызван его собственным таймером, а не unmount.
export function classifyFetchFailure(timedOut: boolean): GeneratedQuizError {
  if (timedOut) {
    return { kind: "timeout", retryable: true, userMessage: MESSAGES.timeout };
  }

  // navigator.onLine — только hint: offline даёт более точное сообщение,
  // но восстановление сети не требует спец-обработки.
  if (isNavigatorOffline()) {
    return { kind: "offline", retryable: true, userMessage: MESSAGES.offline };
  }

  return { kind: "network", retryable: true, userMessage: MESSAGES.network };
}

export function invalidPayloadError(): GeneratedQuizError {
  return { kind: "invalid_payload", retryable: true, userMessage: MESSAGES.invalidPayload };
}

export function emptyPayloadError(): GeneratedQuizError {
  return { kind: "empty_payload", retryable: true, userMessage: MESSAGES.emptyPayload };
}

export function integrityError(): GeneratedQuizError {
  return { kind: "integrity", retryable: true, userMessage: MESSAGES.integrity };
}
