# Student interface correction — 2026-09-08

User report: author-facing audit language, obsolete dark home art, navigation buried
under introductions, ambiguous water level, boxed Mio scenes and overloaded pages.

Implemented: compact /topics navigation; /learn search, grade and review filters;
transparent Mio home art with theme-aware surfaces; shared header in normal sticky
flow; shared textbook scene without enclosing card; optional contents/source details;
measurement meniscus reference point and enlarged scale; force-model ancillary
explanations moved to an optional disclosure.

Live browser observations in this correction pass:
- Home, returning learner: desktop and 390 px, light/dark. Found and fixed header
  overlay plus obsolete dark-only header colours; inspected both themes again.
- /topics: desktop light, mobile light/dark. Clear navigation instead of introductory
  cards; experiment links reachable. Desktop dark verified by accessibility test,
  but not separately screenshotted in this pass.
- /learn: desktop class filter; mobile search with class filter, light/dark. Compact
  rows and readable empty/review states covered by interaction tests.
- /learn/reading-scales: mobile light/dark, desktop dark instrument and light article.
  Found clipped 40 label in magnifier; moved ticks/labels inward and visually rechecked.
  Meniscus minimum corresponds to 32 ml in both views; water is unchanged by scale.
- /learn/force-and-dynamometer: desktop/mobile light/dark, changed loads and revealed
  result. Ancillary notes no longer precede the instrument. Source disclosure opened.

Validation after updating tests to the intentional navigation/copy changes:
- topics-theme-contract: 6 passed (desktop/mobile, light/dark axe and navigation).
- textbook-force: 2 passed.
- textbook-density + inertia + measurement: 8 passed.
- textbook-return: 6 passed (including combined search/class filters).
- TypeScript check passed after these edits.

Not a release verdict. Other lesson layouts and student copy still need review.
The outstanding exam/program light CTA contrast failure and author-facing verification
paragraph from the preceding audit remain to be corrected. Production build/smoke
has not been rerun after this visual redesign. Existing visual baselines are preserved;
the old photographic home/layout expectations are intentionally superseded, not proof
of a new baseline. Eight textbook chapters remain partial curriculum coverage.

## Follow-up: exam topic navigation

/exam/program now presents compact theme-aware topic links. Removed audit counters,
coverage badges and repeated absence reports. Missing-topic details remain optional;
the page plainly says available tasks alone are not full exam preparation. Official
verification status remains in source data/project evidence, not the student introduction.
The previous hardcoded CTA ink was replaced by the shared action/ink pair.

Live CUA review: desktop light/dark composition, mobile 390 px expanded details,
light mobile footer and CTA, and actual Kinematics link to the filtered task catalog.
No cropped text or horizontal overflow observed in those states. Four exam coverage
checks passed (desktop/mobile, both themes, axe and navigation). The test now waits
for finite page-entry animations before measuring contrast; intermediate fade colours
had caused false failures. TypeScript passed. Production build remains pending.

This resolves the exam author-facing paragraph and static CTA contrast issue listed
above. Curriculum coverage and the rest of the product remain incomplete.

## Follow-up: task-family student copy

Removed the generic common-mistake block from task-family pages: it directly exposed
blueprint.trap author notes written about the learner in third person. Authored example
explanations remain. Relative-velocity metadata now uses plain student-facing prose;
the proper formula already appears in FormulaBox below it.
Live CUA review: relative-velocity page at mobile 390 and desktop, both themes, and
actual launch into the five-task practice. The resulting light-theme vector diagram
still has a dark panel with low-salience labels; review this separately next.
Also review generic topic.learnHref links: a broad lesson may not explain the exact
family promised by the current link text.
Catalog suite: 15 executed scenarios passed across initial/repeated runs; 3 intentional
mobile skips. Updated old expectations for 36 families / 11 dynamics and the previously
removed unrelated mixed-practice link in family summary. TypeScript passed.

## Follow-up: vector diagrams

Shared VectorDiagram now uses semantic surfaces and a theme-specific vector palette.
Removed fixed translucent dark panel and pale axes; increased vector labels to 17 SVG
units and angle labels to 14. Geometry is unchanged. Boat/drone wording now explicitly
identifies water/air as the reference for the first velocity.
Live CUA screenshots inspected after palette and label edits: relative-velocity diagram,
390 px and desktop, light and dark. No label-arrow collision observed in this example.
The live saved session retained its old problem text; no learner storage was erased.
Fresh-session browser tests verify the clarified text, label bounds and contrast >=4.5
for relative velocity and resultant-force diagrams in both themes and viewports.
Four browser checks and seven geometry checks passed; TypeScript passed. This does
not prove every arbitrary vector configuration or every diagram type is accepted.

## Follow-up: exact lesson destinations

Live reproduced /tasks/relative-velocity-vectors promising explanation but opening
/practice/kinematics-lesson (acceleration). Task-family pages now use an explicit
family-lesson map for seven supported explanations instead of topic.learnHref.
Unmapped families retain formulas, symbol definitions and practice without a misleading
lesson link. This corrects navigation; it does not supply the missing explanations.
Observed desktop dark density link -> density chapter, mobile light pressure link ->
pressure chapter. Two browser tests passed across desktop/mobile: unmapped relative
velocity and gas-ratio families have no broad lesson substitution, mapped density and
pressure links open the expected chapter. TypeScript passed.
The production preview on 3100 predates this latest mapping change; dev 3000 is current.

## Relative motion chapter
- Added /learn/relative-motion, linked from its task family and textbook sequence. Grade 9 §9, printed pp38–40, checked against the previously downloaded official catalog-1227.pdf; p39 was rendered and read. A fresh network open failed, so no new online verification is claimed.
- Authored explanation separates body and reference frame; includes stationary/upstream drift cases, perpendicular velocity addition, the low-speed boundary and the condition for reaching the opposite bank.
- New contextual Mio river illustration; exact model controls current, heading, observation frame and elapsed time. Answer saved through the shared versioned self-check.
- Live screenshots exposed the shared 180px diagram height restriction. Replaced it with chapter-specific responsive SVG sizing and enlarged text; retested after edit.
- Live observations: desktop light stationary-shore and moving-water cases; desktop dark chapter illustration; 390px light and dark model, illustration crop and dark correct-answer feedback. No overlap in observed states. Broader platform completeness remains unproven.
- Targeted Playwright: 6 passed (desktop/mobile390), testing frame invariance, drift, perpendicular sum, persisted answer and relevant family links. TypeScript passed before final documentation edits.

## Exam entry and painted river replacement
- Exam entry no longer puts a coverage audit table before the start action. It offers a topic link and a short check, with one plain scope note. Old cat image replaced by the approved attentive Mio state. Resume/discard mechanics retained.
- Desktop dark and 390px light/dark entry screens inspected live; eight targeted desktop/mobile tests passed, including light-theme accessibility, topic navigation, relative frame behavior and saved answer. TypeScript passed.
- Subsequent explicit art direction supersedes the prior SVG river acceptance. River and boat are now painted imagegen assets with accurate coded placement and reduced-motion support. See docs/design/mio/river-experiment-art.md for prompts/provenance and remaining art limitations.
