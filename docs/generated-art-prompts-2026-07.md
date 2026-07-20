# Generated art provenance

Mode for every production image: built-in ImageGen. PNG generation masters are preserved in `apps/web/public/art/production/`; optimized WebP derivatives are used by the interface.

| Asset | Saved path | Prompt brief |
|---|---|---|
| Character reference | `apps/web/public/art/production/character-reference.png` | Original science-club guide; normal human proportions; asymmetrical aubergine bob with copper streak; rectangular safety glasses; repaired overshirt; stopwatch and notebook; editorial ink/gouache/pencil; no text. |
| Desktop hero | `apps/web/public/art/production/hero-desktop.webp` | Same character at a physically coherent photogate trolley experiment; right-weighted scene; 46% dark text-safe area on the left; Minsk apartment night; no baked UI. |
| Mobile hero | `apps/web/public/art/production/hero-mobile.webp` | Separately composed portrait scene, face fully visible, trolley and notebook below, no desktop crop. |
| Tutor states | `apps/web/public/art/production/tutor-{calm,thinking,warning,encouraging,surprised}.webp` | Five separate square busts using one character reference; restrained, readable reactions; consistent glasses, hair, clothing and light. |
| Kinematics | `apps/web/public/art/production/topic-kinematics.webp` | Ball on an incline, fixed photogates and increasing stroboscopic spacing. |
| Dynamics | `apps/web/public/art/production/topic-dynamics.webp` | Wooden block, inline spring scale, pulley and hanging mass with one continuous cord. |
| Electricity | `apps/web/public/art/production/topic-electricity.webp` | Safe low-voltage circuit with battery, switch, lamp and coil; continuous wiring. |
| Optics | `apps/web/public/art/production/topic-optics.webp` | One beam, one prism, direct spectrum on matte card; no extra lens. |
| Thermodynamics | `apps/web/public/art/production/topic-thermodynamics.webp` | Round flask on a covered plate, thermometer and coherent convection loop. |
| Formula quest background | `apps/web/public/art/production/formula-quest.webp` | Quiet dark desk still life with notebook, ruler, stopwatch, prism and Newton cradle; detail kept away from quiz copy. |
| Mistakes empty state | `apps/web/public/art/production/mistakes-empty.webp` | Same character sorting blank review cards into a tray; calm, direct empty-state scene. |
| Light paper texture | `apps/web/public/art/production/paper-texture.webp` | Low-contrast warm recycled paper fiber, tile-friendly, no grid or marks. |

All prompts explicitly excluded text, logos, UI, extra limbs, fused fingers, duplicated objects, broken equipment, generic anime/gacha rendering and impossible physical setups. Kinematics v1 and optics v1 were rejected after visual review and remain only in `artifacts/art-production/rejected/`.

## Cozy cats variant

Mode: built-in ImageGen edits using the accepted production images as composition references.

| Asset | Saved path | Prompt brief |
|---|---|---|
| Desktop hero | `apps/web/public/art/production/hero-desktop-cozy.webp` | Preserve the wide text-safe composition; warm the character's expression; add one black observing cat and one sleeping cream cat; keep the photogate beam unobstructed. |
| Mobile hero | `apps/web/public/art/production/hero-mobile-cozy.webp` | Separate vertical composition with the same character and two cats; full face and glasses visible; coherent trolley experiment. |
| Kinematics | `apps/web/public/art/production/topic-kinematics-cozy.webp` | Black cat times a ball sequence beside the track; cat stays outside the path. |
| Dynamics | `apps/web/public/art/production/topic-dynamics-cozy.webp` | Cream cat holds one inline spring scale connected to one block on a horizontal friction plank. |
| Electricity | `apps/web/public/art/production/topic-electricity-cozy.webp` | Black cat observes a simple open-switch circuit; bulb is visibly off and every wire terminates at a binding post. |
| Optics | `apps/web/public/art/production/topic-optics-cozy.webp` | Cream cat reaches toward the projected spectrum; exactly one source, prism and screen. |
| Thermodynamics | `apps/web/public/art/production/topic-thermodynamics-cozy.webp` | Scarfed black cat watches a clamped flask with coherent convection currents from a safe distance. |

Every cozy asset was checked at source size and in its real browser crop. Intermediate electricity variants with a loose lead or a lit bulb behind an open switch were rejected and never copied into `public/`.

## Formula section curators

Mode: built-in ImageGen, one separate square generation per curator. The accepted topic scenes were supplied as style references. PNG masters remain beside the WebP production files.

| Asset | Saved path | Final prompt brief |
|---|---|---|
| Mechanics curator | `apps/web/public/art/production/curator-mechanics.webp` | Black cat in an indigo dotted bandana beside a brass stopwatch and simple ramp; centered portrait crop; handmade gouache, colored pencil and etched line; no text or equations. |
| Electricity curator | `apps/web/public/art/production/curator-electricity.webp` | Fluffy black cat with an antique-gold lightning charm beside one closed battery-switch-lamp circuit; warm lamp and restrained cyan-violet rim light; no sparks or impossible wiring. |
| Optics curator | `apps/web/public/art/production/curator-optics.webp` | Cream-and-charcoal cat with a violet star collar beside one prism and a clean spectrum on a matte card; correct paws and one coherent tail; no text. |
| Thermodynamics curator | `apps/web/public/art/production/curator-thermodynamics.webp` | Black cat in an oversized violet scarf beside a mounted thermometer, warm-water flask and mug; cat stays clear of the apparatus; no open flame or spills. |

All four prompts required exactly one anatomically correct cat, one coherent tail, complete paws and eyes, generous crop margins, no logos, no watermark, no pseudo-text and no equations. The first electricity portrait was rejected because the lamp glowed while the knife switch was open. A targeted edit closed the switch without changing the cat or the rest of the circuit.
