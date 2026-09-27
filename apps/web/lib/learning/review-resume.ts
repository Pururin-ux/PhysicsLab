import {
  ACTIVE_QUIZ_SNAPSHOT_KEY,
  ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS,
  decodeQuizSnapshot,
  type ActiveQuizSnapshot,
} from "../quiz/active-session-snapshot.ts";
import {
  isMotionPractice,
  preferNewerTabSnapshotOverSaved,
  readSavedMotionPractice,
} from "../quiz/saved-motion-practice.ts";

export type ReviewResumeCandidate = {
  sessionId: string;
  taskId: string;
  blueprint: string;
};

function candidateFor(snapshot: ActiveQuizSnapshot | null): ReviewResumeCandidate | null {
  // QuizSession rejects old drafts without a fingerprint. The generator checks
  // the fingerprint again when the learner opens the actual practice route.
  if (!snapshot?.taskFingerprint) return null;

  const taskId = snapshot.taskIds[snapshot.session.currentIndex];
  const answer = snapshot.session.answers.find((item) => item.taskId === taskId);
  if (!taskId || !answer?.blueprint) return null;

  return {
    sessionId: `${snapshot.template}:${snapshot.batch}:${snapshot.attemptId}`,
    taskId,
    blueprint: answer.blueprint,
  };
}

export function reviewResumeCandidatesFromSnapshots(
  tab: ActiveQuizSnapshot | null,
  savedMotion: ActiveQuizSnapshot | null,
): ReviewResumeCandidate[] {
  const candidates: ReviewResumeCandidate[] = [];
  const add = (snapshot: ActiveQuizSnapshot | null) => {
    const candidate = candidateFor(snapshot);
    if (candidate) candidates.push(candidate);
  };

  if (!savedMotion || !isMotionPractice(savedMotion.template, savedMotion.sessionKind)) {
    add(tab);
    return candidates;
  }

  if (!tab || !isMotionPractice(tab.template, tab.sessionKind)) {
    add(tab);
    add(savedMotion);
    return candidates;
  }

  // For this one family QuizSession chooses the durable draft unless a newer
  // matching tab draft wins. Only the draft it would actually open can resume.
  add(preferNewerTabSnapshotOverSaved(
    tab, savedMotion, savedMotion.template, savedMotion.sessionKind,
  ) ? tab : savedMotion);
  return candidates;
}

export function readReviewResumeCandidates(): ReviewResumeCandidate[] {
  if (typeof window === "undefined") return [];

  let tab: ActiveQuizSnapshot | null = null;
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_QUIZ_SNAPSHOT_KEY);
    if (raw) {
      const decoded = decodeQuizSnapshot(raw, Date.now(), ACTIVE_QUIZ_SNAPSHOT_MAX_AGE_MS);
      if (decoded.ok) tab = decoded.snapshot;
    }
  } catch {
    // Read-only review must not alter or discard an unavailable tab draft.
  }

  const saved = readSavedMotionPractice().result;
  return reviewResumeCandidatesFromSnapshots(tab, saved.ok ? saved.snapshot : null);
}
