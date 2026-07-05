"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCoachResponse,
  type CoachEvent,
  type CoachState,
} from "../../lib/coach-engine";

type CoachBubbleState = {
  state: CoachState;
  text: string;
  visible: boolean;
};

const emptyCoach: CoachBubbleState = {
  state: "calm",
  text: "",
  visible: false,
};

export function useCoach() {
  const [bubble, setBubble] = useState<CoachBubbleState>(emptyCoach);
  const activePriorityRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const hideCoach = useCallback(() => {
    clearHideTimer();
    activePriorityRef.current = 0;
    setBubble((current) => ({ ...current, visible: false }));
  }, [clearHideTimer]);

  const emitCoachEvent = useCallback(
    (event: CoachEvent, coachLines: Record<string, string> = {}) => {
      const response = getCoachResponse(event, coachLines);
      if (!response.text) return false;

      if (
        activePriorityRef.current > 0 &&
        response.priority < activePriorityRef.current
      ) {
        return false;
      }

      clearHideTimer();
      activePriorityRef.current = response.priority;
      setBubble({
        state: response.state,
        text: response.text,
        visible: true,
      });

      if (response.duration > 0) {
        hideTimerRef.current = setTimeout(() => {
          activePriorityRef.current = 0;
          setBubble((current) => ({ ...current, visible: false }));
        }, response.duration);
      }

      return true;
    },
    [clearHideTimer],
  );

  const startPauseTimer = useCallback(
    (coachLines: Record<string, string>) => {
      clearPauseTimer();
      pauseTimerRef.current = setTimeout(() => {
        emitCoachEvent({ type: "pause", seconds: 20 }, coachLines);
      }, 20000);
    },
    [clearPauseTimer, emitCoachEvent],
  );

  useEffect(() => {
    return () => {
      clearHideTimer();
      clearPauseTimer();
    };
  }, [clearHideTimer, clearPauseTimer]);

  return {
    bubble,
    emitCoachEvent,
    startPauseTimer,
    clearPauseTimer,
    hideCoach,
  };
}
