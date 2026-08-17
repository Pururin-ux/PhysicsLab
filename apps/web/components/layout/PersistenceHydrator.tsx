"use client";

import { useEffect } from "react";
import { hydrateExamLogFromStorage } from "../../lib/stores/exam-log-store";
import { hydratePracticeLogFromStorage } from "../../lib/stores/practice-log-store";
import { hydrateProgressFromStorage } from "../../lib/stores/progress-store";
import { hydrateXPFromStorage } from "../../lib/stores/session-store";

export function PersistenceHydrator() {
  useEffect(() => {
    hydrateXPFromStorage();
    hydrateProgressFromStorage();
    hydratePracticeLogFromStorage();
    hydrateExamLogFromStorage();
  }, []);

  return null;
}
