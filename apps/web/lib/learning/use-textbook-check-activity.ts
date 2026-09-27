"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { lessonDraftExportCodecs, readLessonDraft, type LessonDraft } from "./lesson-draft.ts";
import type { TextbookCheckState } from "./textbook-check-state.ts";
import {
  classifyTextbookCheckActivity,
  type TextbookCheckActivityDefinition,
} from "./textbook-check-activity.ts";
import { textbookChapterIds, type TextbookChapterId } from "./textbook-index.ts";

const DRAFT_KEY_PREFIX = "physicslab-lesson-draft-textbook-check-";
const knownIds = new Set<string>(textbookChapterIds);
const chapterOrder = new Map<string, number>(textbookChapterIds.map((id, index) => [id, index]));
const codecsByKey = new Map(lessonDraftExportCodecs.map((codec) => [codec.key, codec]));
const definitionCache = new Map<TextbookChapterId, TextbookCheckActivityDefinition>();

type StoredCheck = {
  id: TextbookChapterId;
  draft: LessonDraft | null;
  initialStatus: "untouched" | "unavailable" | null;
};

export type TextbookCheckActivityItem = {
  id: TextbookChapterId;
  title: string | null;
  grade: number | null;
  status: TextbookCheckState;
  href: string;
};

export type TextbookCheckActivity = {
  ready: boolean;
  loading: boolean;
  storageAvailable: boolean;
  definitionsAvailable: boolean;
  items: TextbookCheckActivityItem[];
  /** Refresh explicitly after a same-tab progress import or reset. */
  refresh: () => void;
};

function scanStoredChecks(): { storageAvailable: boolean; checks: StoredCheck[] } {
  let storage: Storage;
  try {
    storage = window.localStorage;
  } catch {
    return { storageAvailable: false, checks: [] };
  }

  const checks: StoredCheck[] = [];
  try {
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (!key?.startsWith(DRAFT_KEY_PREFIX)) continue;
      const id = key.slice(DRAFT_KEY_PREFIX.length);
      if (!knownIds.has(id)) continue;
      const codec = codecsByKey.get(key);
      if (!codec) continue;

      const result = readLessonDraft(codec);
      if (!result.ok) {
        if (result.reason === "empty") continue;
        if (result.reason === "no-storage") return { storageAvailable: false, checks: [] };
        checks.push({ id: id as TextbookChapterId, draft: null, initialStatus: "unavailable" });
      } else {
        checks.push({
          id: id as TextbookChapterId,
          draft: result.value,
          initialStatus: result.value.answer === "" ? "untouched" : null,
        });
      }
    }
  } catch {
    return { storageAvailable: false, checks: [] };
  }

  checks.sort((left, right) => (chapterOrder.get(left.id) ?? 0) - (chapterOrder.get(right.id) ?? 0));
  return { storageAvailable: true, checks };
}

function isDefinition(value: unknown): value is TextbookCheckActivityDefinition {
  if (!value || typeof value !== "object") return false;
  const definition = value as Record<string, unknown>;
  return typeof definition.id === "string" &&
    knownIds.has(definition.id) &&
    typeof definition.title === "string" &&
    typeof definition.grade === "number" &&
    Number.isInteger(definition.grade) &&
    typeof definition.questionKey === "string" &&
    typeof definition.correct === "number" &&
    Number.isInteger(definition.correct);
}

function buildItems(checks: StoredCheck[]): TextbookCheckActivityItem[] {
  return checks.map(({ id, draft, initialStatus }) => {
    const definition = definitionCache.get(id);
    return {
      id,
      title: definition?.title ?? null,
      grade: definition?.grade ?? null,
      status: initialStatus ?? (definition ? classifyTextbookCheckActivity(definition, draft) : "unavailable"),
      href: `/learn/${id}#self-check`,
    };
  });
}

export function useTextbookCheckActivity(): TextbookCheckActivity {
  const [snapshot, setSnapshot] = useState<Omit<TextbookCheckActivity, "refresh">>({
    ready: false,
    loading: true,
    storageAvailable: true,
    definitionsAvailable: true,
    items: [],
  });
  const generation = useRef(0);
  const requestController = useRef<AbortController | null>(null);

  const refresh = useCallback(() => {
    const currentGeneration = ++generation.current;
    requestController.current?.abort();
    requestController.current = null;
    const { storageAvailable, checks } = scanStoredChecks();

    if (!storageAvailable) {
      setSnapshot({ ready: true, loading: false, storageAvailable: false, definitionsAvailable: false, items: [] });
      return;
    }

    const requested = checks
      .filter((check) => check.initialStatus === null && !definitionCache.has(check.id))
      .map((check) => check.id);
    if (requested.length === 0) {
      setSnapshot({ ready: true, loading: false, storageAvailable: true, definitionsAvailable: true, items: buildItems(checks) });
      return;
    }

    setSnapshot((previous) => ({ ...previous, loading: true }));
    const controller = new AbortController();
    requestController.current = controller;
    const query = new URLSearchParams();
    for (const id of requested) query.append("id", id);

    void (async () => {
      let definitionsAvailable = true;
      try {
        const response = await fetch(`/api/textbook-checks?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Textbook check lookup failed: ${response.status}`);
        const payload: unknown = await response.json();
        if (!payload || typeof payload !== "object" || !Array.isArray((payload as { definitions?: unknown }).definitions)) {
          throw new Error("Invalid textbook check lookup response");
        }
        const requestedIds = new Set<string>(requested);
        for (const value of (payload as { definitions: unknown[] }).definitions) {
          if (isDefinition(value) && requestedIds.has(value.id)) {
            definitionCache.set(value.id as TextbookChapterId, value);
          }
        }
        definitionsAvailable = requested.every((id) => definitionCache.has(id));
      } catch {
        if (controller.signal.aborted) return;
        definitionsAvailable = false;
      }

      if (currentGeneration !== generation.current || controller.signal.aborted) return;
      requestController.current = null;
      setSnapshot({
        ready: true,
        loading: false,
        storageAvailable: true,
        definitionsAvailable,
        items: buildItems(checks),
      });
    })();
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea) {
        try {
          if (event.storageArea !== window.localStorage) return;
        } catch {
          // A storage restriction is reflected by the next scan.
        }
      }
      if (event.key === null || event.key.startsWith(DRAFT_KEY_PREFIX)) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      generation.current++;
      requestController.current?.abort();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [refresh]);

  return { ...snapshot, refresh };
}
