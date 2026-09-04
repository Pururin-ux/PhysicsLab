# 0003 — Design-sync boundary

Status: `CANON`.

## Decision

Design-sync and `.ds-*` remain optional development tooling. They package
selected components for previews and do not define web product behaviour or
design direction.

## Consequence

Do not delete or treat the tooling as production runtime in this migration.
When component APIs or styles change, update it only if the preview workflow is
being actively used.
