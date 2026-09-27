# 0009 — Объём тела неправильной формы после чтения шкалы

Status: `PROVISIONAL`.

Scope: `apps/web`, Grade VII textbook navigation and `/learn/irregular-body-volume`.
This is an authored connection for the current partial content, not a required
course order or evidence of mastery.

## Problem

The scale-reading chapter teaches how to obtain one value from a meniscus. The
existing volume chapter covers a rectangular block, but neither chapter shows
how two meniscus readings determine the volume of an irregular solid. A direct
handoff from scale reading to the particle model leaves that application out.

## Decision

- Place an irregular-body-volume chapter immediately after `reading-scales` in
  the Grade VII contents. Link scale reading to it, then retain the existing
  connection to `particle-model-and-diffusion` from the new chapter.
- Use the Grade VII textbook's laboratory work No. 3 as the source: read the
  water volume $V_1$, fully immerse a suitable solid, read $V_2$, and calculate
  $V=V_2-V_1$. The authored example uses 20 ml and 32 ml, giving 12 cm³.
- Connect the new `irregular-body-volume` practice to the two-reading method.
  Keep `graduated-scale-reading` as an optional review of the meniscus scale;
  it does not assess displacement or the subtraction.
- Treat the two readings as direct instrument readings and the solid's volume
  as calculated from them. Keep the conditions for full immersion and no lost
  water explicit. No score or completion gate controls the connection.

The source is the local official `catalog-980.pdf`, printed pages 160–162
(PDF pages 165–167). The table on page 161 gives $V_1$, $V_2$ and the result in
cm³; page 162 asks learners to distinguish direct and indirect measurements.
The navigation order and example numbers are PhysicsLab's authored choices.

## Open question

The practice offers new readings, but whether learners can transfer the method
to a different physical setup remains unverified. Do not treat a correct answer
as evidence of a completed laboratory skill.
