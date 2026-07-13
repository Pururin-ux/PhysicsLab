"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  getDefaultHelpTarget,
  type HelpTarget,
  type TopicHelpSection,
} from "../../lib/learning/topic-help";
import type { TopicId } from "../../lib/learning/taxonomy";
import { cn } from "../../lib/utils";
import { TopicTheoryDrawer } from "../theory/TopicTheoryDrawer";
import type { TopicTheorySubtopic } from "../theory/TopicTheoryDrawer";
import { QuizSession } from "./QuizSession";
import type { GeneratedQuizCount } from "../../lib/quiz/generated-quiz-count";

interface PracticeWithHelpProps {
  topicId: TopicId;
  generatedTemplate: string;
  generatedTopic: string;
  generatedTitle: string;
  accent?: "cyan" | "gold" | "blue" | "ember";
  drawerTitle: string;
  drawerDescription: string;
  drawerLayout?: "grid" | "stack";
  subtopics?: TopicTheorySubtopic[] | TopicHelpSection[];
  children: ReactNode;
  generatedCount?: GeneratedQuizCount;
  restartLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

function sameTarget(left: HelpTarget, right: HelpTarget) {
  return (
    left.topicId === right.topicId &&
    left.sectionId === right.sectionId &&
    left.reason === right.reason
  );
}

export function PracticeWithHelp({
  topicId,
  generatedTemplate,
  generatedTopic,
  generatedTitle,
  accent = "cyan",
  drawerTitle,
  drawerDescription,
  drawerLayout = "grid",
  subtopics = [],
  children,
  generatedCount = 10,
  restartLabel,
  nextHref,
  nextLabel,
}: PracticeWithHelpProps) {
  const defaultTarget = useMemo(() => getDefaultHelpTarget(topicId), [topicId]);
  const [currentTarget, setCurrentTarget] = useState(defaultTarget);
  const [helpOpen, setHelpOpen] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  const updateTarget = useCallback((target: HelpTarget) => {
    setCurrentTarget((previous) => (sameTarget(previous, target) ? previous : target));
  }, []);

  const openHelp = useCallback((target?: HelpTarget) => {
    if (target) {
      updateTarget(target);
    }
    setHelpOpen(true);
    window.requestAnimationFrame(() => {
      if (!window.matchMedia("(min-width: 1180px)").matches) {
        document
          .getElementById("theory")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [updateTarget]);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    window.requestAnimationFrame(() => helpButtonRef.current?.focus());
  }, []);

  return (
    <div
      data-testid="practice-with-help"
      data-help-layout={helpOpen ? "open" : "closed"}
      className={cn(
        "grid min-w-0 grid-cols-1 gap-5",
        helpOpen
          ? "min-[1180px]:grid-cols-[minmax(0,640px)_minmax(300px,380px)] min-[1180px]:items-start min-[1180px]:justify-center"
          : null,
      )}
    >
      <QuizSession
        generatedTemplate={generatedTemplate}
        generatedTopic={generatedTopic}
        generatedTitle={generatedTitle}
        topicId={topicId}
        onHelpTargetChange={updateTarget}
        onOpenHelpTarget={openHelp}
        helpOpen={helpOpen}
        helpButtonRef={helpButtonRef}
        generatedCount={generatedCount}
        restartLabel={restartLabel}
        nextHref={nextHref}
        nextLabel={nextLabel}
      />

      <TopicTheoryDrawer
        title={drawerTitle}
        description={drawerDescription}
        layout={drawerLayout}
        accent={accent}
        subtopics={subtopics}
        open={helpOpen}
        onOpenChange={(nextOpen) => (nextOpen ? setHelpOpen(true) : closeHelp())}
        activeSectionId={currentTarget.sectionId}
        highlightReason={currentTarget.reason}
        presentation="responsive"
      >
        {children}
      </TopicTheoryDrawer>
    </div>
  );
}
