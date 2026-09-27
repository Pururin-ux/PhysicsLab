# 0005 — Optional handoffs after selected focused practice

Status: `PROVISIONAL`.

Scope: `apps/web`, the five focused practice families listed below. This is an
agent-authored INTERNAL ALPHA product decision, not a required course sequence.

## Problem

A learner can move from a chapter to five related problems, but the summary
usually offers only another set or a return to the same explanation. Existing
authored relationships between nearby concepts are then lost at the moment the
learner finishes practising.

## Decision

- Keep the explanation and another five problems available. Add one optional
  next question to the summary of these families:

  | Finished practice | Optional next question |
  | --- | --- |
  | `length-unit-conversion` | `/learn/measuring-volume` |
  | `rectangular-block-volume` | `/learn/reading-scales` |
  | `graduated-scale-reading` | `/learn/irregular-body-volume` |
  | `heat-amount` | `/practice/family/heat-balance-simple` |
  | `heat-balance-simple` | `/learn/fuel-combustion` |

- The heat-balance practice retains its direct explanation link. The learner
  chooses whether to read, try the next problem, repeat, or leave.
- Do not gate these links by score or describe five answers as mastery. Do not
  apply this mapping to diagnostics, exam results, or unrelated families.
- The links are authored relationships for the current partial content. They
  are not a universal topic-order algorithm or a claim that the Belarusian
  programme mandates this exact path.

The [official Grade VII–IX programme](https://adu.by/images/2025/08/12/Fizika-7-9.pdf)
includes units, measurements and volume work. The Grade VII textbook's
laboratory work No. 3 connects meniscus readings to volume by displacement
([decision 0009](0009-irregular-body-volume-bridge.md)). The Grade VIII
textbook places heat calculation and simple heat balance in § 6 and fuel
combustion in § 7
([source register](../research/belarus-source-register-2026-09-08.md)). These
sources support the topic relationships, while the exact handoff UI remains a
product hypothesis.

## Acceptance and open question

Check that each selected summary reaches the intended material, while repeat
and the exact-family explanation remain reachable. An unrelated focused family
and diagnostic/exam results must remain unchanged. Check the changed summary
at one relevant desktop and mobile width when rendered inspection is warranted.
Whether learners find the optional link useful remains open to observation; do
not turn these five links into a template for every family without evidence.
