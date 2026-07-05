# Nova mascot integration

Nova is not a standalone product showcase. The Claude prototype is treated as a
sandbox for assets and motion ideas only.

## Components

| File | Role |
| --- | --- |
| `CoachBubble.tsx` | Event-driven coach message. It renders the current Nova emotion via `CoachAvatar` and the current response text from `coach-engine`. |
| `CoachAvatar.tsx` | Compact emotional avatar for tight UI surfaces. Uses `public/mascot/nova-{state}.png`. |
| `NovaStage.tsx` | Lightweight presentation character for the landing hero or dev previews. It must not introduce its own product section. |
| `useCoach.ts` | Emits `session_start`, `correct_answer`, `wrong_answer`, `pause`, and `session_end` messages. |
| `useTypewriter.ts` | Optional typewriter effect that keeps inline formula fragments intact. |

## Asset rule

- `public/mascot/nova-{state}.png`: compact bust avatars for coach bubbles and small UI.
- `public/mascot-anime/{state}.png`: larger transparent character art for presentation-only surfaces.

Do not copy the whole Claude demo scene into the product. Use its states,
poses, and lines where the student is already receiving feedback.
