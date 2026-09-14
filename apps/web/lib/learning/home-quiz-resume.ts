import type { ActiveQuizSnapshot } from "../quiz/active-session-snapshot.ts";
import { getLearningDestinationForFamily } from "./learning-links.ts";
import { getSchoolCheckByTemplate } from "./school-checks.ts";
import { mixedPracticeHrefByTopic } from "./topic-practice-routes.ts";

export function getQuizResumeHref(snapshot: ActiveQuizSnapshot) {
  if (snapshot.sessionKind === "diagnostic" && snapshot.template === "exam") {
    return "/practice/diagnostic";
  }

  if (snapshot.sessionKind === "exam" && snapshot.template === "exam") {
    return "/practice/exam-demo";
  }

  const schoolCheck = getSchoolCheckByTemplate(snapshot.template);
  if (snapshot.sessionKind === "diagnostic" && schoolCheck) {
    return schoolCheck.href;
  }

  const focusedDestination = getLearningDestinationForFamily(snapshot.template);
  if (focusedDestination) {
    return focusedDestination.practiceHref;
  }

  return snapshot.topicId && snapshot.topicId in mixedPracticeHrefByTopic
    ? mixedPracticeHrefByTopic[
        snapshot.topicId as keyof typeof mixedPracticeHrefByTopic
      ]
    : null;
}

export function getQuizResumeStep(snapshot: ActiveQuizSnapshot, durable = false) {
  const href = getQuizResumeHref(snapshot);
  if (!href) return null;

  const currentTaskNumber = snapshot.session.currentIndex + 1;
  const isExam = snapshot.sessionKind === "exam";
  const isDiagnostic = snapshot.sessionKind === "diagnostic";
  const schoolCheck = isDiagnostic
    ? getSchoolCheckByTemplate(snapshot.template)
    : null;
  const resumeTitle = schoolCheck
    ? `Проверка ${schoolCheck.grade} класса`
    : isExam || isDiagnostic
      ? "Диагностика"
      : snapshot.title;

  return {
    label: "Продолжить",
    title: `${resumeTitle}: задание\u00a0${currentTaskNumber}\u00a0из\u00a0${snapshot.session.total}`,
    body:
      snapshot.session.phase === "answered"
        ? "Ответ уже сохранён — можно вернуться прямо к разбору."
        : durable
          ? "Задание и введённый ответ сохранены в этом браузере."
          : "Незавершённая попытка сохранена в этой вкладке.",
    reason:
      "Сначала возвращаем точное место остановки, чтобы не терять уже сделанную работу.",
    href,
    cta: schoolCheck
      ? "Продолжить проверку"
      : isExam || isDiagnostic
        ? "Продолжить диагностику"
        : "Продолжить тренировку",
    tone: (isExam ? "gold" : "cyan") as "gold" | "cyan",
    mode: (isExam ? "exam" : "learn") as "exam" | "learn",
  };
}
