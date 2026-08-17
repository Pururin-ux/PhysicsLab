"use client";

import type { CoachState } from "../../lib/coach-engine";
import { NovaReaction } from "./NovaReaction";

interface CoachBubbleProps {
  state: CoachState;
  text: string;
  visible: boolean;
}

// Внутри тренировки Nova появляется компактной репликой рядом с вариантами
// ответа (NovaReaction), а не полноростовым блоком NovaStage — так она сразу
// в поле зрения и не требует прокрутки. Полноростовая версия осталась только
// в hero лендинга, где для неё есть место.
export function CoachBubble({ state, text, visible }: CoachBubbleProps) {
  return <NovaReaction state={state} text={text} visible={visible} />;
}
