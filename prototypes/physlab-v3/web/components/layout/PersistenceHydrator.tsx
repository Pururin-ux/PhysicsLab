"use client";

import { useEffect } from "react";
import { hydrateProgressFromStorage } from "../../lib/stores/progress-store";
import { hydrateXPFromStorage } from "../../lib/stores/session-store";

export function PersistenceHydrator() {
  useEffect(() => {
    hydrateXPFromStorage();
    hydrateProgressFromStorage();
  }, []);

  return null;
}
