# Nova mascot integration

Nova is not a standalone product showcase. The Claude prototype is treated as a
sandbox for assets and motion ideas only.

## Components

| File | Role |
| --- | --- |
| `CoachBubble.tsx` | Floating coach message during the **active** (solving) phase only — ambient hints. In the answered phase the bubble is hidden and Nova's line moves into `AnswerFeedback` (single voice, single focal point). |
| `CoachAvatar.tsx` | Compact emotional avatar for tight UI surfaces. Uses `public/mascot/nova-{state}.png`. |
| `NovaStage.tsx` | Lightweight presentation character for the landing hero or dev previews. It must not introduce its own product section. |
| `useCoach.ts` | Emits `session_start`, `correct_answer`, `wrong_answer`, `pause`, and `session_end` messages. |
| `useTypewriter.ts` | Optional typewriter effect that keeps inline formula fragments intact. |

## Pedagogical rule

Nova should ask a useful learning question, not fill empty space. After a wrong
answer, prefer the selected option's misconception label and a diagnostic prompt
over generic encouragement or a duplicate solution.

The post-answer surface (`AnswerFeedback.tsx`) uses progressive disclosure to
avoid cognitive overload: Nova's reaction (the misconception) is the anchor, one
reflective question stays visible, and the full step-by-step разбор + formula +
method live behind a collapsed toggle. Nova's line must NOT also repeat the
diagnostic — that reflective prompt is rendered once, separately.

## Asset rule

- `public/mascot/nova-{state}.png`: compact bust avatars for coach bubbles and small UI.
- `public/mascot-anime/{state}.png`: larger transparent character art for presentation-only surfaces.

Do not copy the whole Claude demo scene into the product. Use its states,
poses, and lines where the student is already receiving feedback.
