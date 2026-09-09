# 0004 — Lesson drafts and independent transfer

Status: `CANON`.

Scope: `apps/web`. Decision made during the 2026-09-08 completion work requested by Sasha.

## Problem

The lesson summary promised saving but lost the explanation and position on reload.
The kinematics transfer reused the independent problem's value and feedback before an attempt.

## Decision

- Persist authored lesson position, answers, and summary in versioned browser drafts.
- Confirm saving only after a successful storage write. Preserve unreadable and future-version personal drafts without overwriting them.
- Include drafts in progress backups and in the explicitly confirmed full data reset.
- Completing a lesson does not award mastery or change practice evidence and scheduling.
- The acceleration transfer uses a different context and values, with its own answer, feedback and attempt count. Feedback must distinguish a corrected answer from a first-attempt success.

## Acceptance

Verify stage/answer/summary restoration in the browser, storage failures and malformed records, backup round trips, and independent transfer before declaring this work complete.
