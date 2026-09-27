# 0008 — Return to textbook self-checks across the platform

Status: `PROVISIONAL`. Scope: home and profile return actions for textbook
self-check drafts.

## Problem

A learner can answer a textbook question and see the checked mistake under
`/mistakes`, while home and profile still behave as if no work happened. The
same saved answer should be recognizable across these surfaces.

## Decision

- Recognize a selected answer only when its saved question matches the current
  chapter. An empty initial draft is not activity. An incompatible, corrupt or
  future-version record is preserved and is not presented as an error.
- Keep a practice answer that still has a matching saved attempt, and due
  review, ahead of textbook self-checks. A pending error without that attempt
  remains ordinary review; it is never described as resumable. A
  checked incorrect answer leads to the exact `#self-check`; an unchecked
  selected answer is unfinished work, not a mistake. Once corrected, the error
  return disappears. A checked correct answer records an attempt, not mastery;
  a learner with no other work may choose another question in that chapter's
  grade catalogue.
- No visit chronology is inferred: textbook drafts have no timestamp. The
  first eligible question in chapter order is a stable choice, not “the latest.”
- Only when a saved nonempty answer exists, the browser requests current
  definitions for the corresponding chapter IDs from the same-origin app.
  Answers and saved drafts remain in the browser; the full textbook is not
  loaded into the client bundle. The request is for validation and a return
  link, not remote progress storage. If it stalls, the rest of the profile
  remains usable while the self-check return is still being resolved.

This does not change answer validation, saved draft format, practice counters,
or the meaning of completion. Whether this return priority helps learners is
open to observation during INTERNAL ALPHA.
