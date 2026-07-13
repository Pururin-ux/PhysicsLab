# Nova mascot integration

Nova is not a standalone product showcase. The Claude prototype is treated as a
sandbox for assets and motion ideas only.

## Components

| File | Role |
| --- | --- |
| `CoachBubble.tsx` | Optional coach surface outside the core practice hierarchy. Practice sessions do not render it before or after an answer. |
| `CoachAvatar.tsx` | Compact emotional avatar for tight UI surfaces. Uses `public/mascot/nova-{state}.png`. |
| `NovaStage.tsx` | Lightweight presentation character for the landing hero or dev previews. It must not introduce its own product section. |
| `useCoach.ts` | Keeps `session_start`, `correct_answer`, `wrong_answer`, `pause`, and `session_end` events available without making them a required visual surface. |
| `useTypewriter.ts` | Optional typewriter effect that keeps inline formula fragments intact. |

## Pedagogical rule

Nova should ask a useful learning question, not fill empty space. After a wrong
answer, prefer the selected option's misconception label and a diagnostic prompt
over generic encouragement or a duplicate solution.

The post-answer surface (`AnswerFeedback.tsx`) is static and compact: status and
one task-specific line are announced once. The primary next action follows it;
the explanation and contextual help remain collapsed secondary actions. Coach
events must not reintroduce an avatar, typewriter, or duplicate diagnostic there.

## Asset rule

- `public/mascot/nova-{state}.png`: compact bust avatars for coach bubbles and small UI.
- `public/mascot-anime/{state}.png`: larger transparent character art for presentation-only surfaces.

Do not copy the whole Claude demo scene into the product. Use its states,
poses, and lines where the student is already receiving feedback.
