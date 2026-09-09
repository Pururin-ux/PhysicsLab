"use client";

import type { TaskTypeCatalogEntry } from "../../lib/learning/task-catalog";
import { topicHelpSections } from "../../lib/learning/topic-help";
import { CompactHelpCard } from "../theory/CompactHelpCard";
import { PracticeWithHelp } from "../quiz/PracticeWithHelp";

const accentByTopic = {
  kinematics: "cyan",
  dynamics: "gold",
  electrodynamics: "blue",
  thermodynamics: "ember",
  optics: "cyan",
} as const;

export function FocusedFamilyPractice({ entry }: { entry: TaskTypeCatalogEntry }) {
  const sections = topicHelpSections[entry.topicId];

  return (
    <PracticeWithHelp
      topicId={entry.topicId}
      generatedTemplate={entry.id}
      generatedTopic={entry.topicLabel}
      generatedTitle={entry.title}
      generatedCount={5}
      restartLabel="Ещё 5 задач"
      nextHref={entry.id === "contact-pressure" ? "/learn/pressure" : entry.id === "density-volume-ratio" ? "/learn/density" : `/tasks/${entry.id}`}
      nextLabel={entry.id === "contact-pressure" ? "Повторить силу и площадь опоры" : entry.id === "density-volume-ratio" ? "Повторить массу, объём и плотность" : "Вернуться к разбору этого типа"}
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
  );
}
