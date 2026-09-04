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
- Incorrect attempts can enter the review queue. An unfinished valid session
  has priority when the learner returns.
- The profile reports observed practice evidence; it does not claim a global
  mastery percentage.

## Boundaries

- No single lesson sequence or interaction is mandatory for every topic.
- A diagnostic result identifies available practice and review actions; it is
  not evidence of complete exam readiness.
- Changes to task physics, answer validation, persistence migrations, or
  learning progression require a separate product decision.
