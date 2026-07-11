// Единый контракт хранения для всех localStorage-сторов: конверт
// { version, data } под историческими ключами (ключи не меняются —
// у беты живые данные). До-конвертные формы (голый массив журнала,
// число XP, inline-версия прогресса) распознаются сниффером кодека
// и мигрируются при первом чтении.
//
// Политика ошибок:
// - мусор / битый JSON / невалидная известная версия -> null + удаление ключа;
// - версия БОЛЬШЕ текущей (открыли после отката приложения) -> null,
//   ключ сохраняется: данные из будущего не уничтожаем.

export type StoredEnvelope = {
  version: number;
  data: unknown;
};

export type StoreCodec<T> = {
  key: string;
  currentVersion: number;
  // Распознать до-конвертную форму. raw — исходная строка (XP хранился
  // как "140" без JSON-обёртки), parsed — результат JSON.parse или
  // undefined, если строка не была валидным JSON.
  sniffLegacy: (raw: string, parsed: unknown) => { version: number; data: unknown } | null;
  // Привести payload заявленной версии к текущему типу; null = невалидно.
  migrate: (data: unknown, version: number) => T | null;
};

export type ReadResult<T> =
  | { ok: true; value: T; migrated: boolean }
  | { ok: false; reason: "empty" | "future-version" | "corrupt" | "no-storage" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEnvelope(value: unknown): value is StoredEnvelope {
  return (
    isRecord(value) &&
    typeof value.version === "number" &&
    Number.isInteger(value.version) &&
    "data" in value
  );
}

export function canUseStorage(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function decodeStoredValue<T>(
  codec: StoreCodec<T>,
  raw: string,
): ReadResult<T> {
  const parsed = tryParseJson(raw);

  let version: number;
  let data: unknown;

  if (isEnvelope(parsed)) {
    version = parsed.version;
    data = parsed.data;
  } else {
    const legacy = codec.sniffLegacy(raw, parsed);
    if (!legacy) {
      return { ok: false, reason: "corrupt" };
    }
    version = legacy.version;
    data = legacy.data;
  }

  if (version > codec.currentVersion) {
    return { ok: false, reason: "future-version" };
  }

  const value = codec.migrate(data, version);
  if (value === null) {
    return { ok: false, reason: "corrupt" };
  }

  return {
    ok: true,
    value,
    migrated: version < codec.currentVersion || !isEnvelope(parsed),
  };
}

export function readStore<T>(codec: StoreCodec<T>): ReadResult<T> {
  if (!canUseStorage()) {
    return { ok: false, reason: "no-storage" };
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(codec.key);
  } catch {
    return { ok: false, reason: "no-storage" };
  }

  if (raw === null) {
    return { ok: false, reason: "empty" };
  }

  const result = decodeStoredValue(codec, raw);

  if (!result.ok && result.reason === "corrupt") {
    try {
      window.localStorage.removeItem(codec.key);
    } catch {
      // приватный режим — молча пропускаем
    }
  }

  if (!result.ok && result.reason === "future-version") {
    console.warn(
      `[storage] "${codec.key}" записан более новой версией приложения — данные не тронуты, но не прочитаны.`,
    );
  }

  return result;
}

export type WriteResult = "success" | "no-storage" | "quota" | "error";

// Квоту определяем по DOMException name/code, а не по тексту сообщения:
// Safari/Firefox исторически используют разные имена и код 22/1014.
function isQuotaError(error: unknown): boolean {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22 ||
      error.code === 1014
    );
  }
  return false;
}

// Возвращает typed result; существующие вызовы могут игнорировать его —
// сигнатура обратно совместима.
export function writeStore<T>(codec: StoreCodec<T>, value: T): WriteResult {
  if (!canUseStorage()) {
    return "no-storage";
  }

  const envelope: StoredEnvelope = { version: codec.currentVersion, data: value };

  try {
    window.localStorage.setItem(codec.key, JSON.stringify(envelope));
    return "success";
  } catch (error) {
    // localStorage может быть недоступен (приватный режим) или переполнен.
    return isQuotaError(error) ? "quota" : "error";
  }
}

export function clearStore(codec: StoreCodec<unknown>): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(codec.key);
  } catch {
    // приватный режим
  }
}
