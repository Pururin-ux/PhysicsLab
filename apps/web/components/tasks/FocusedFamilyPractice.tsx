"use client";

import Link from "next/link";
import { getFocusedPracticeNextConcept } from "../../lib/learning/focused-practice-next";
import { getLearningDestinationForFamily } from "../../lib/learning/learning-links";
import type { TaskTypeCatalogEntry } from "../../lib/learning/task-catalog";
import { topicHelpSections } from "../../lib/learning/topic-help";
import { CompactHelpCard } from "../theory/CompactHelpCard";
import { PracticeWithHelp } from "../quiz/PracticeWithHelp";

const accentByTopic = {
  measurements: "cyan",
  kinematics: "cyan",
  dynamics: "gold",
  electrodynamics: "blue",
  thermodynamics: "ember",
  optics: "cyan",
  quantum: "blue",
} as const;

export function FocusedFamilyPractice({ entry }: { entry: TaskTypeCatalogEntry }) {
  const sections = topicHelpSections[entry.topicId];
  const explanation = getLearningDestinationForFamily(entry.id)?.explanation;
  const nextConcept = getFocusedPracticeNextConcept(entry.id);

  return (
    <div className="flex flex-col gap-4">
    {explanation && <Link href={explanation.href} className="inline-flex min-h-11 w-fit items-center text-sm text-[var(--action-primary)] underline underline-offset-4">{explanation.label} →</Link>}
    <PracticeWithHelp
      topicId={entry.topicId}
      generatedTemplate={entry.id}
      generatedTopic={entry.topicLabel}
      generatedTitle={entry.title}
      generatedCount={5}
      restartLabel="Ещё 5 задач"
      nextHref={explanation?.href ?? `/tasks/${entry.id}`}
      nextLabel={explanation?.label ?? "К описанию типа задач"}
      nextConcept={nextConcept}
      accent={accentByTopic[entry.topicId]}
      drawerTitle="Справка"
      subtopics={sections}
    >
      {sections.map((section) => (
        <div key={section.id} data-help-section-id={section.id}>
          <CompactHelpCard
            accent={accentByTopic[entry.topicId]}
            title={section.label}
            body={section.shortHint}
            formula={section.formula}
            trap={section.mistake}
          />
        </div>
      ))}
    </PracticeWithHelp>
    </div>
  );
}
