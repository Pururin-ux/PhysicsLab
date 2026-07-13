# Bidirectional Learning Links & Honest Coverage v1

**Date:** 2026-07-13
**Baseline:** PhysicsLab V3, 35 generated task families, five active training topics.

## Scope

This layer connects existing learning data. It does not add physics content, task
families, reference solutions, formulas, answer formats, or storage changes.

The canonical path is:

`mistake -> skill metadata -> task family -> reference solution when available -> focused practice`

Formula entries use the same skill IDs in the reverse direction. A formula can
therefore link to one or more task families without importing the server-only task
registry into client UI.

## Coverage shown in the catalog

`/tasks#coverage` states the current product boundary rather than calculating a
misleading completion percentage:

| Section | Current state |
| --- | --- |
| Mechanics | Partial: 17 task families across kinematics and dynamics |
| Molecular physics and thermodynamics | Partial: 5 task families |
| Electrodynamics | Partial: 6 task families |
| Optics | Partial: 7 task families; optics v1 remains limited |
| Quantum physics | No generated task family yet |
| Atomic and nuclear physics | No generated task family yet |

Counts describe the complete generated catalog, not a filtered catalog result and
not official exam coverage. The mixed training mode is a 10-task learning set from
the five available topics, not a full CT/CE exam mode.

## Source and limitations

The official CT/CE 2026 physics specification is the comparison baseline. It
contains broader coverage than this product, including quantum and atomic/nuclear
physics. The source was checked on 2026-07-13:

- RIKZ, *Specifications of CT/CE examination papers for 2026*: [overview](https://rikc.by/cctesting/49-specifikacii-jekzamenacionnyh-testovyh-rabot-po-uchebnym-predmetam-dlja-provedenija-centralizovannogo-jekzamena-i-centralizirovannogo-testirovanija-v-2026-godu.html) and [physics PDF](https://rikc.by/ru/specification/2026/03.pdf).

This document does not copy official tasks, exam pages, answer keys, or diagrams.
It records product coverage at a high level and links to the official source.
