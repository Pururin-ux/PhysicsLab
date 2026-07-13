# Navigation and Practice Hierarchy Simplification v1

Date: 2026-07-13
Baseline: `305a1179e74a5cc4927585d69f2cfae12ca905dc`

## Problem

Persistent topic links, disabled future content, global XP, task metadata,
streak, and animated coach surfaces competed with the question and answer flow.
Post-answer status, solution, help, and next actions also had equal visual weight.

## Removed or hidden

- Topic duplication and disabled quantum content in the desktop sidebar.
- Global XP display while retaining XP data and calculations.
- The artificial Tasks/Help segmented control.
- Answer-format and difficulty badges plus the visible in-session streak.
- Decorative Nova surfaces from the core practice flow.

## New hierarchy

Before an answer: progress, optional help, task, answer control.

After an answer: compact result, primary next action, optional solution and
mistake-specific help. The solution is closed by default and does not repeat a
separate formula card.

## Help behavior

The existing targeted-help mapping and content are unchanged. At wide desktop
sizes the shared help surface sits beside the task; on tablet and mobile it is
rendered inline. Closing it returns focus to the help trigger.

## Preserved contracts

Generator physics, API payloads, task counts, progress storage v3, active
snapshot v2, attempt identity, recovery, reference solutions, routes, and XP and
coach engines are unchanged.

## Residual work

- Validate the reduced hierarchy with students rather than treating it as final.
- Revisit long session summaries separately if usability evidence supports it.
- Audit remaining non-practice Nova surfaces before any broader mascot policy.
- Consider a dedicated `/progress` route only with a migration and routing plan.
- Keep measuring help usage before removing or expanding its section selector.
