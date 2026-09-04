> **HISTORICAL — not a current requirement.** Preserved prior art process; active production asset data is `apps/web/art-manifest.json`.

# PhysicsLab — production art manifest

## Art direction

The visual system keeps the reference's cozy, handmade midnight study mood, but moves away from generic anime and neon-purple sameness.

- Base: midnight indigo, graphite, worn paper, warm desk light.
- Functional color: cyan for controls, graphs, and active measurements.
- Brand accent: mineral coral/pink, used sparingly.
- Achievement/warmth: amber.
- Rendering: uneven ink line, opaque gouache shapes, colored-pencil texture, restrained risograph grain.
- Character: believable human proportions, asymmetrical silhouette, practical science-club clothing, no gacha gloss, chibi anatomy, cat ears, or generic hoodie.
- Generated art never contains UI copy, labels, equations, logos, or buttons. Text remains accessible HTML.

## Production rules

- Every slot is generated separately at its intended aspect ratio.
- Functional controls, mathematical diagrams, graphs, and simulation geometry remain code so they stay accurate, responsive, and accessible.
- Decorative scenes and character reactions are image assets.
- Reject an asset for fused fingers, duplicate objects, broken glasses, impossible apparatus, unreadable pseudo-text, repeated character design, weak crop, or inconsistent light direction.
- Inspect the source at 100% and inspect the final crop in the browser at 1440×1024 and 390×844.

## Human finishing gate (current rule)

Generated imagery is source material, never the finished illustration. The production pass is:

1. Compose the scene at the slot's real aspect ratio with a reference image and a physics-specific brief; keep all labels, equations, arrows and controls out of the raster.
2. Open the result as a layered working file in Photoshop (or an equivalent editor). On separate layers, repair anatomy and object joins, remove pseudo-text and repeated details, paint believable contact shadows and light, and crop independently for desktop and mobile.
3. Put functional meaning back in code: diagrams, vectors, plots and state labels are SVG/HTML/Canvas, not generated pixels. Decorative art must stay decorative.
4. Compare both crops side by side in the live browser. The reviewer must be able to name the subject's action, the physical situation and the intended focal point in one sentence. If not, the asset stays WIP and is not added to `public/` or the manifest.

This gate is intentionally stricter than a prompt-only workflow: human preference research flags composition, anatomy, artifacts and object adherence as separate quality dimensions, and Adobe's nondestructive workflow keeps each generation on its own editable layer for targeted repair.

## Asset matrix

| ID | Slot | Target | Safe composition | Status |
|---|---|---:|---|---|
| `nova-dynamics-transfer-v1` | Rejected home hero candidate | 1701×925 | Longboard braking remains readable, but Nova's canonical identity, human finishing evidence, and the production crop gate are missing | rejected; retained as WIP evidence and unreferenced by production UI |
| character-reference | Internal character reference | 1024×1536 | One full body, both hands visible, neutral background | accepted |
| hero-desktop | Landing hero | 1914×822 | Left 45% quiet/dark; character and desk on right; no UI text | accepted + integrated |
| hero-mobile | Landing mobile art | 1086×1448 | Face fully visible; chest-up; key props below shoulder line | accepted + integrated |
| tutor-calm | Compact assistant state | 1254×1254 | Bust centered for circle/square crops | accepted + integrated |
| tutor-thinking | Compact assistant state | 1254×1254 | Same lens/costume; one hand visible | accepted + integrated |
| tutor-warning | Compact assistant state | 1254×1254 | Concerned, not alarmist | accepted + integrated |
| tutor-encouraging | Compact assistant state | 1254×1254 | Restrained approval, no trophy text | accepted + integrated |
| tutor-surprised | Compact assistant state | 1254×1254 | Clear readable reaction | accepted + integrated |
| topic-kinematics | Topic card | 1254×1254 | Ball, fixed photogates, stroboscopic positions | accepted v2 + integrated |
| topic-dynamics | Topic card | 1254×1254 | Block, spring scale, pulley and hanging mass | accepted + integrated |
| topic-electricity | Topic card | 1254×1254 | Safe low-voltage circuit / coil; coherent wiring | accepted + integrated |
| topic-optics | Topic card | 1254×1254 | Prism and direct spectrum on a matte card | accepted v2 + integrated |
| topic-thermodynamics | Topic card | 1254×1254 | Flask, warming plate and convection currents | accepted + integrated |
| formula-quest | Formula quiz scene | 1914×1076 | Desk still life; left area quiet for controls | accepted + integrated |
| mistakes-empty | Empty mistakes state | 1914×1076 | Character sorting blank cards | accepted + integrated |
| paper-texture | Light content background | 1456×1054 | Warm paper grain, no marks or writing | accepted + integrated |
| curator-mechanics | Formula section curator | 1254×1254 | Black cat, indigo bandana, stopwatch and ramp; face safe at 86–104 px | accepted + integrated |
| curator-electricity | Formula section curator | 1254×1254 | Black cat, lightning charm, closed low-voltage circuit and lit lamp | accepted v2 + integrated |
| curator-optics | Formula section curator | 1254×1254 | Cream-and-charcoal cat, star collar, prism and spectrum | accepted + integrated |
| curator-thermodynamics | Formula section curator | 1254×1254 | Black cat, violet scarf, flask, thermometer and mug | accepted + integrated |

Rejected candidates are kept outside `public/` in `artifacts/art-production/rejected/`. They are not loaded by the site.

## Cozy cats visual variant

The structure and product behavior stay unchanged. The active visual variant adds warmer expressions, two cats in the hero, and one coherent cat-led experiment per topic. These assets use separate `*-cozy` filenames so the earlier serious set can be restored without changing data or functionality.

- Active: `hero-{desktop,mobile}-cozy.webp`, `topic-*-cozy.webp`.
- Previous serious set: original filenames remain in `public/art/production/`.
- Additional rollback copies: `artifacts/art-production/rollback/serious-hero/` and `artifacts/art-production/rollback/serious-topics/`.
- Physics corrections made during review: unobstructed photogate beam, inline spring scale, open-switch/off-bulb circuit, single-prism spectrum, safe convection setup.
- Section curators: mechanics, electricity, optics, and thermodynamics each have a separate square portrait. Kinematics and dynamics intentionally share the mechanics curator but use different practical notes.
- Formula cards use real KaTeX on a paper-texture surface; equations are never baked into the generated art.

## Copy standard

- Lead with the task or result. Do not describe the site's mood, mascot, or intentions.
- Prefer specific verbs: “Выбери ответ”, “Измени массу”, “Сравни графики”.
- Remove atmospheric labels and self-explanatory product copy.
- Buttons name the destination or action; no generic “Подробнее”.
- Keep sentences short, active, and conversational without jokes forced into every block.
- Never claim an interaction that is not implemented.
