# 0006 — Next step after a measurement-only start

Status: `PROVISIONAL`. Scope: the recommendation on `/profile`.

## Problem

After a learner solves only measurement problems, the generic recommendation
selects the next unstarted topic in the product list. That topic is acceleration
in Grade IX, even though the learner's only observed work is in Grade VII
measurements. The topic list is not a curriculum sequence.

## Decision

- Keep resumable work and due review ahead of this suggestion.
- If measurements are the only started topic and there is no completed exam
  attempt, offer the Grade VII question catalogue (`/topics?grade=7`). Let the
  learner choose a question there. Do not infer their actual school grade from
  one practice session.
- Do not treat completed problems as mastery of measurements or claim that the
  learner visited a particular lesson. For other progress states, keep the
  existing recommendation behaviour.
- This is a bounded repair for a misleading jump, not a general grade-aware
  progression algorithm. The value of the profile recommendation remains a
  hypothesis until observed with learners.

The Grade VII catalogue already offers authored links among available
measurement and subsequent concepts. This decision changes neither task
physics nor saved progress.
