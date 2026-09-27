# Web learning model

Status: `CANON`.

Scope: current behaviour implemented in `apps/web`.

## Learning surfaces

- Topic entries can lead to a lesson and to focused practice.
- Lessons use the shared `LessonStageEngine` for stage navigation, progress,
  motion preference, and focus recovery. Lesson authors retain topic-specific
  explanations and interactions.
- Practice gives task-specific feedback, optional help, retry, and a next
  action.
- Selected focused families offer an optional authored next question after
  practice, alongside retry and the exact-family explanation. The provisional
  scope is recorded in [decision 0005](../decisions/0005-optional-focused-practice-handoffs.md);
  the link is neither a score gate nor evidence of mastery.
- A mixed practice result without an authored next action returns to topic
  choice. In the catalog, “next” means an optional forward question; prerequisite
  recaps are separate resources. Chapter footers use that same authored link
  rather than assuming adjacent chapters form a learning sequence
  ([decision 0011](../decisions/0011-learning-continuation-without-false-sequence.md)).
- The Grade XI sound chapter can optionally lead to the first ideal LC-circuit
  investigation and exact-family period practice. This is partial coverage of
  electromagnetic oscillations, not a claim about the entire unit
  ([decision 0012](../decisions/0012-ideal-lc-first-electromagnetic-oscillations.md)).
- The ideal LC investigation can optionally lead to the externally driven
  alternating-current question and focused practice with two stated peak
  times. The lesson contains an oscillogram; the task gives those times in
  text. The
  comparison distinguishes a disconnected free oscillator from a powered
  rotating-frame model; the new Grade X induction explanation is an optional
  foundation, not a completion gate or mastery evidence
  ([decision 0013](../decisions/0013-driven-ac-after-free-lc.md)).
- The Grade X magnetic-force chapter starts from the Grade VIII observation of
  a field and distinguishes the prescribed external induction B from the force
  on a straight current-carrying segment. Its angle graph shows the magnitude
  of the Ampere force, not the motion or direction of a real apparatus; focused
  practice includes milli-tesla and centimetre conversions. It offers an
  optional transition to induction, not a required course gate.
- The partial Grade X induction chapter compares a steady field with a changing
  flux through a fixed coil, distinguishes EMF from current in an open circuit,
  and links optionally to the following self-induction question. Its average-EMF model
  does not claim self-induction, a current magnitude, or completion of the
  whole magnetism unit.
- The separate Grade X self-induction chapter treats a prescribed uniform
  current change in a fixed-inductance coil. Its graph compares current slope,
  the opposing average EMF, and endpoint magnetic energies; it does not claim
  to simulate a real RL transient. It optionally connects to the Grade XI ideal
  LC circuit, which still provides its own explanation.
- Incorrect attempts can enter the review queue. A checked incorrect textbook
  self-check links back to that exact question; an unfinished or outdated
  self-check is not classified as a mistake. An unfinished valid practice
  session has priority when the learner returns.
- Home and profile can return to a valid textbook self-check with a selected
  answer. A checked incorrect answer is a question to revisit, an unchecked
  answer is unfinished work, and a checked correct answer is observed work but
  not chapter mastery. Merely opening a chapter does not count
  ([decision 0008](../decisions/0008-textbook-check-return.md)).
- The profile reports observed practice evidence; it does not claim a global
  mastery percentage.
- When only measurement practice has started, the profile offers the Grade VII
  question catalogue instead of the next unstarted product topic. This is a
  choice, not an inferred school grade or a mastery claim
  ([decision 0006](../decisions/0006-measurement-only-profile-next-step.md)).
- The end of the Grade VII mechanical-energy chapter offers an optional question
  leading to the Grade VIII explanation of internal energy. Crossing the grade
  boundary remains a learner choice, not automatic progression
  ([decision 0007](../decisions/0007-mechanical-to-internal-energy-bridge.md)).
- Authored lessons with an итог explanation preserve their position, answers,
  and explanation in browser drafts. Saving a lesson is not mastery evidence.
  Drafts are included in progress backups and the confirmed full data reset
  (decision 0004).
- In the shared `TopicPrimer` lessons, the final link to related practice does
  not require saving a personal note. Notebook access and saved confirmation
  still require a successful write ([decision 0010](../decisions/0010-primer-practice-without-note.md)).
- The states, expansion, and temperature investigation preserves its selected
  stage and answers after the learner changes them. Merely opening the chapter
  creates no learning-work claim and is not completion evidence.

## Boundaries

- No single lesson sequence or interaction is mandatory for every topic.
- A diagnostic result identifies available practice and review actions; it is
  not evidence of complete exam readiness.
- Changes to task physics, answer validation, persistence migrations, or
  learning progression require a separate product decision.
