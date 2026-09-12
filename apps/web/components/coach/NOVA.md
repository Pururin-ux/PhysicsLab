> **Legacy component-local notes.** The approved web companion is Mio; use
> `docs/current/MIO_CHARACTER.md` and current decisions for new work. These
> historical component names do not establish a second approved character.
> Check consumers before proposing removal; this document authorizes no cleanup.

# Nova legacy component notes

Nova is not a standalone product showcase. The Claude prototype is treated as a
sandbox for assets and motion ideas only.

## Components

| File | Role |
| --- | --- |
| `CoachBubble.tsx` | Optional coach surface outside the core practice hierarchy. Practice sessions do not render it before or after an answer. |
| `CoachAvatar.tsx` | Legacy compact emotional avatar; current paths are `/art/production/tutor-*.webp`. |
| `NovaStage.tsx` | Lightweight presentation character for the landing hero or dev previews. It must not introduce its own product section. |
| `useCoach.ts` | Keeps `session_start`, `correct_answer`, `wrong_answer`, `pause`, and `session_end` events available without making them a required visual surface. |
| `useTypewriter.ts` | Optional typewriter effect that keeps inline formula fragments intact. |

## Pedagogical rule

In the historical coach design, the character asked a learning question rather
than filling empty space. For current feedback, after a wrong
answer, prefer the selected option's misconception label and a diagnostic prompt
over generic encouragement or a duplicate solution.

The post-answer surface (`AnswerFeedback.tsx`) is static and compact: status and
one task-specific line are announced once. The primary next action follows it;
the explanation and contextual help remain collapsed secondary actions. Coach
events must not reintroduce an avatar, typewriter, or duplicate diagnostic there.

## Asset rule

- `public/mascot/nova-{state}.png` and `public/mascot-anime/{state}.png` are historical asset locations, not current requirements.
- `CoachAvatar`, `NovaReaction` and `NovaStage` currently name `/art/production/tutor-*.webp`; file names and mappings alone do not prove an active route consumer.

Do not copy the old demo scene or introduce new Nova states, poses or copy.
New companion work follows Mio's current contract.
