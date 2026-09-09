> **LEGACY component-local notes.** Current web product direction is defined by
> `docs/current/`, and the approved companion is **Mio** (`docs/current/MIO_CHARACTER.md`).
> The Nova-named components/assets below are historical technical debt, not a
> second approved character direction. Do not add new Nova behaviour or copy.
> Before removing or migrating them, verify active imports and tests.

# Nova legacy component notes

These components came from an earlier mascot/coach experiment. They may still be
useful as implementation reference or transitional code, but they must not
redefine current PhysicsLab product identity.

## Components

| File | Historical role |
| --- | --- |
| `CoachBubble.tsx` | Optional coach surface outside the core practice hierarchy |
| `CoachAvatar.tsx` | Compact emotional avatar using old `public/mascot/nova-{state}.png` assets |
| `NovaStage.tsx` | Presentation character for an earlier landing/dev-preview direction |
| `useCoach.ts` | Event helper for `session_start`, `correct_answer`, `wrong_answer`, `pause`, `session_end` |
| `useTypewriter.ts` | Optional typewriter helper that keeps inline formula fragments intact |

## Migration rule

- Do not use `public/mascot/nova-*` or `public/mascot-anime/*` for new product work.
- If a current route still imports one of these components, treat that as an
  implementation fact to inspect, not evidence that Nova remains canonical.
- When a scoped task replaces the last active import, remove the obsolete code
  and assets only after relevant browser/tests confirm no regression.
- New companion work belongs to Mio and follows `docs/current/MIO_CHARACTER.md`.
