"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  getDefaultHelpTarget,
  type HelpTarget,
  type TopicHelpSection,
} from "../../lib/learning/topic-help";
import type { TopicId } from "../../lib/learning/taxonomy";
import { TopicTheoryDrawer } from "../theory/TopicTheoryDrawer";
import type { TopicTheorySubtopic } from "../theory/TopicTheoryDrawer";
import { PracticeQuickBar } from "./PracticeQuickBar";
import { QuizSession } from "./QuizSession";
import type { QuizData } from "./quiz-session-store";

interface PracticeWithHelpProps {
  topicId: TopicId;
  mode?: "static" | "generated";
  data?: QuizData;
  generatedTemplate?: string;
  generatedTopic?: string;
  generatedTitle?: string;
  accent?: "cyan" | "gold" | "blue" | "ember";
  drawerTitle: string;
  drawerDescription: string;
  drawerLayout?: "grid" | "stack";
  subtopics?: TopicTheorySubtopic[] | TopicHelpSection[];
  children: ReactNode;
}

function sameTarget(left: HelpTarget, right: HelpTarget) {
  return (
    left.topicId === right.topicId &&
    left.sectionId === right.sectionId &&
    left.reason === right.reason
  );
}

function scrollTheoryIntoView() {
  window.requestAnimationFrame(() => {
    document
      .getElementById("theory")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function PracticeWithHelp({
  topicId,
  mode = "static",
  data,
  generatedTemplate,
  generatedTopic,
  generatedTitle,
  accent = "cyan",
  drawerTitle,
  drawerDescription,
  drawerLayout = "grid",
  subtopics = [],
  children,
}: PracticeWithHelpProps) {
  const defaultTarget = useMemo(() => getDefaultHelpTarget(topicId), [topicId]);
  const [currentTarget, setCurrentTarget] = useState(defaultTarget);
  const [helpOpen, setHelpOpen] = useState(false);

  const updateTarget = useCallback((target: HelpTarget) => {
    setCurrentTarget((previous) => (sameTarget(previous, target) ? previous : target));
  }, []);

  const openHelp = useCallback((target?: HelpTarget) => {
    if (target) {
      updateTarget(target);
    }
    setHelpOpen(true);
    scrollTheoryIntoView();
  }, [updateTarget]);

  return (
    <div className="flex flex-col gap-5">
      <PracticeQuickBar onOpenHelp={() => openHelp(currentTarget)} helpOpen={helpOpen} />

      <QuizSession
        data={data}
        mode={mode}
        generatedTemplate={generatedTemplate}
        generatedTopic={generatedTopic}
        generatedTitle={generatedTitle}
        topicId={topicId}
        onHelpTargetChange={updateTarget}
        onOpenHelpTarget={openHelp}
        suppressCoachBubble={helpOpen}
      />

      <TopicTheoryDrawer
        title={drawerTitle}
        description={drawerDescription}
        layout={drawerLayout}
        accent={accent}
        subtopics={subtopics}
        open={helpOpen}
        onOpenChange={setHelpOpen}
        activeSectionId={currentTarget.sectionId}
        highlightReason={currentTarget.reason}
      >
        {children}
      </TopicTheoryDrawer>
    </div>
  );
}
