const COMPLETED_SESSION_KEY = "physicslab-v3-completed-sessions-v1";
const MAX_MARKERS = 20;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function readMarkers(): string[] {
  const store = storage();
  if (!store) return [];
  try {
    const parsed: unknown = JSON.parse(store.getItem(COMPLETED_SESSION_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string").slice(-MAX_MARKERS)
      : [];
  } catch {
    return [];
  }
}

export function isSessionCompleted(sessionId: string): boolean {
  return readMarkers().includes(sessionId);
}

export function markSessionCompleted(sessionId: string): void {
  const store = storage();
  if (!store || !sessionId) return;
  try {
    const markers = [...new Set([...readMarkers(), sessionId])].slice(-MAX_MARKERS);
    store.setItem(COMPLETED_SESSION_KEY, JSON.stringify(markers));
  } catch {
    // In-memory ref in useSessionRecording remains the best-effort fallback.
  }
}
