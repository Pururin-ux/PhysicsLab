# Game pre-production context

Last updated: 2026-08-23

Status: active vertical-slice production. The first accepted production art, living scene, exact optics loop, app icon, and signed Android debug build exist under `apps/game`; the Shorok walk was reopened after stricter anatomical review and remains WIP until the corrected Blender cycle passes runtime and device gates.

Read this file before every game-design, art-production, animation, or implementation session. Then read [CURRENT_STATUS.md](CURRENT_STATUS.md), [PRODUCTION_PIPELINE.md](PRODUCTION_PIPELINE.md), and the linked document relevant to the task. If a later decision changes this context, update this file in the same change.

## Product decision

- This is a **game-first mobile adventure**, not the existing PhysicsLab trainer with a fantasy skin.
- The existing `apps/web` product remains intact. A game runtime, if approved after the vertical slice, must live as a separate package or product surface.
- Target audience: Russian-speaking players roughly 12–17 years old. The experience should also remain legible to curious adults.
- Initial platform: Android native. iOS is a later export and operational track. The game must work offline.
- Orientation: portrait mobile, logical design viewport `390 x 844`, one-thumb-friendly tap/drag controls.
- Working release scope: a polished vertical slice first; final room count is not frozen before playtesting.

## Creative north star

Working title: **«Лис, которого не было»**. This is provisional and requires a later name/trademark check.

Player fantasy: **I can see one possible physical future, bind its echo into reality for a few seconds, and use it to pull off an impossible escape with a living discarded future as my companion.**

Two-sentence pitch:

> A ruined open-air observatory called **Предел** has been swallowed by a forest caught in the last weeks of autumn. Neri and a fox that survived an unrealized future escape by predicting real physical cascades through wet roots, fog, water, weathered lenses, blackened timber, and old iron; a correct forecast briefly becomes a pale spectral bridge, shield, route, or trap inside the playable world.

The design must not use the rejected premise “the laws of physics are broken; restore them.” Current games already occupy nearby territory, and that premise turns the experience back into a sequence of lessons.

## Core mechanic

The signature verb is **bind a future echo** (`закрепить эхо будущего`; the shorter internal verb remains `pin`).

1. Explore a side-view room and manipulate a small physical apparatus.
2. Enter Echo Sight: the same dark scene becomes a mineral X-ray, with pale afterimages beneath the world's surface and code-rendered causal traces.
3. Commit one prediction about a real outcome: position, path, order, timing, or distribution.
4. Assign the fox one physical intervention.
5. Release the room into a short deterministic cascade.
6. A sufficiently accurate forecast becomes temporary spectral traversal geometry or another concrete advantage while the cascade runs.
7. The settled outcome and the visual discrepancy teach the causal rule without a red cross or lecture screen.

Physics is therefore simultaneously the simulation, the puzzle grammar, the action resource, and the source of spectacle.

## Visual decision

The active art direction is **«Осенний Предел»**: painterly enchanted-autumn dark fantasy—mysterious and wistful, but not depressive, black, or hostile. It supersedes the paper-theatre exploration, the cheerful blue/orange luminous-fantasy exploration, the over-dark «Поздний Предел» pass, and the short-lived cave/crystal proposal. Sasha explicitly rejected paper/Pinocchio construction, primitive cut-out-looking assets, cute cartoon proportions, bright anime-fantasy colour, the cyan-versus-orange game palette, plush mascots, lifeless black voids, and a cave full of glowing crystals.

- **Stable Reality:** stylized painterly realism in a living late-autumn forest grown through a ruined open-air observatory. Warm fog-cream and muted peach-grey sky keep enough midtones for mobile readability; deep olive conifers, aubergine shadow, weathered umber stone, rust and copper foliage, old iron, roots, moss, and selective amber mechanisms create depth. The world visibly breathes through independently swaying branches, drifting mist, windblown leaves, suspended objects, cloth, and distant parallax. No neon, gemstone glow, gold filigree, ornate steampunk, cheerful saturation, generic blue enchanted forest, or crushed-black depressive grading.
- **Echo Sight:** identical geometry as if a future frost briefly passed over it. Possible positions appear as translucent fog-bone afterimages; paths grow like pale leaf veins, mycelium, or rime along surfaces; committed steps compress wet leaves and grass before the body arrives. Uncertainty and dangerous divergence use muted dried-blood fissures plus broken contours. It must feel quiet, uncanny, and inevitable—not like bright magic or a separate illustration.

The emotional target is a quiet late-October dusk after the rain: melancholy with wonder and safety, as if the forest is withholding a story rather than mourning the player. Darkness creates hierarchy rather than hiding gameplay. Player, companion, apparatus, forecast, and hazard remain readable through silhouette, local value contrast, motion, texture, and code-rendered shape patterns.

Canonical production palette (starting point, subject to on-device contrast QA): warm soot `#15130F`, aubergine `#241A20`, deep olive `#37402F`, fog cream `#E7D2B2`, dead-leaf copper `#8B4B2D`, ember rust `#B36A32`, restrained amber `#D89952`, weathered iron `#4A443F`.

The switch communicates game state and knowledge state and must be reproducible with shared scene geometry, reusable painted modules, gradient maps, masks, shaders, particles, and code-rendered traces. Never build a level as one generated full-screen illustration.

Functional rays, normals, vectors, graphs, collision shapes, circuit paths, timing markers, and labels are rendered in code. Generated art is limited to reusable character layers, environment modules, parallax layers, props, textures, effects, and reaction states.

Characters use a documented per-state choice of normalized authored frame atlases, hidden `Skeleton2D`/mesh deformation, or a hybrid. Every method shares explicit ground/hand sockets and must avoid visible joint discs, marionette construction, skating, or static-sprite bobbing:

- **Neri** — charismatic explorer aged about 16–17 with an angular, alert face; cropped uneven dark hair; a long, narrow silhouette; a weather-darkened asymmetric coat in soot/plum with a restrained dead-leaf lining; and a cloudy-lens/oxidized-iron crescent gauntlet used to bind echoes. No heroic scarf, anime eyes, chibi proportions, sword, staff, robe, or generic fantasy armor.
- **Шорох** — an elongated soot-black fox with long limbs and muzzle, angular ears, amber eyes, restrained russet fur accents, a bronze ring pendant, and a large feathered tail. It is physically expressive, sly, affectionate, opinionated, and slightly uncanny rather than cute. In Echo Sight the tail sheds three faint fog-bone afterimages and one forepaw gains a rime edge. The canonical source anchor controls identity; the corrected mesh rig and 24-frame walk under `apps/game/art/characters/` are WIP production assets, not an accepted animation set yet.

Saved Product Design references:

- `C:\Users\lalad\.codex\state\plugins\product-design\assets\physics-dungeon-paper-theatre-mobile-concept.png`
- `C:\Users\lalad\.codex\state\plugins\product-design\assets\physics-dungeon-shadow-mechanics-mobile-concept.png`

Superseded Creative Production proofs (board `7f5689ba-3f78-46a7-9c23-b6098b8ab395`):

- `C:\Users\lalad\.codex\visualizations\2026\08\16\01a00b43-fc67-7053-8fad-41bfe5883068\production-proof-stable-reality.png` — composition/state mood only; old cast is non-canonical.
- `C:\Users\lalad\.codex\visualizations\2026\08\16\01a00b43-fc67-7053-8fad-41bfe5883068\production-proof-forecast-mode.png` — causal-readability/state mood only; old cast is non-canonical.
- `C:\Users\lalad\.codex\visualizations\2026\08\16\01a00b43-fc67-7053-8fad-41bfe5883068\production-proof-room-kit.png` — environment modularity study, not transparent runtime assets.
- `C:\Users\lalad\.codex\visualizations\2026\08\16\01a00b43-fc67-7053-8fad-41bfe5883068\production-proof-canonical-cast.png` — decomposition lesson only; paper-marionette cast is rejected.

The `luminous-fantasy-*` proofs on that board are preserved as rejected exploration. They demonstrated geometry, rig decomposition, and modular-kit needs, but their cheerful blue/orange palette, anime-like Neri, and cute fox are non-canonical. The unproduced «Минеральная ночь» proposal is also rejected because it shifted the world toward caves and crystals.

The superseded «Поздний Предел» proofs use stable IDs `late-boundary-gameplay`, `late-boundary-forecast`, `late-boundary-cast`, and `late-boundary-modular-kit` on the same board. They remain decomposition evidence only; current production follows the lighter living «Осенний Предел» runtime and only validated, physically coherent assets may enter `apps/game/art/`.

Validated project copies and their caveats are indexed in [ART_MANIFEST.md](ART_MANIFEST.md):

- `apps/game/art/concepts/late-boundary-gameplay-v1.png`
- `apps/game/art/concepts/late-boundary-forecast-v1.png`
- `apps/game/art/concepts/late-boundary-cast-v2.png`
- `apps/game/art/concepts/late-boundary-modular-kit-v1.png`

## Companion decision

The fox is not a hint avatar or an omniscient tutor. It is a living rejected future:

- physically present in every room;
- can hold, trigger, block, carry, or test one object;
- proposes explicitly marked hypotheses, sometimes wrong;
- changes its deterministic belief model after the player demonstrates a causal link;
- earns new preview abilities from explanations, not from XP;
- never states an unmarked factual claim that may be false.

No LLM or network dependency is required for the companion in the first release.

## Engagement ethics

Optimize for voluntary absorption and return, not compulsion. Use curiosity, autonomy, competence, relatedness, fast feedback, multiple solutions, dramatic cascades, secrets, and character attachment.

Do not use:

- punitive streaks;
- energy timers;
- timed chests or fake scarcity;
- loot boxes or gacha;
- variable-ratio monetized rewards;
- guilt notifications;
- deceptive purchases or ads disguised as play;
- pay-to-win progression.

The preferred commercial shape is a free demo chapter plus a transparent one-time purchase, subject to later validation.

## Stack direction

Provisional recommendation: **Godot 4.7.2 stable, GDScript, Compatibility renderer, native Android first**.

Reasons:

- the product is now predominantly a 2D game, not a text-heavy application;
- Godot has native mobile export, 2D scenes, mesh/skeletal animation, `Skeleton2D`, `AnimationPlayer`, shaders, audio, and input mapping;
- GDScript avoids the experimental mobile limitations documented for Godot C# export;
- the selected style can be built from overlapping painterly sprite layers, authored normalized frame cycles, mesh deformation, particles, shaders, and procedural secondary motion through a reproducible agent-owned production pipeline.

Godot 4.7.2, Java 17, the required Android command-line packages, and matching Android export templates are installed. The tested gray-box slice under `apps/game` exports as a signed arm64 debug APK; do not expand content before visual and player-validation gates.

## Production ownership

Sasha does not draw or animate. Codex owns a reproducible pipeline for:

- canonical character references;
- transparent modular asset generation;
- pivot and anchor normalization;
- hidden-bone mesh/sprite rig construction with no visible puppet joints where appropriate;
- authored frame animation, procedural secondary motion, and keyed animation chosen per asset;
- professional-tool cleanup, animation inspection, export, and runtime motion capture;
- room assembly from typed data/resources;
- physics golden tests;
- visual/mobile QA.

One-off full-screen levels, generated video used as gameplay, static sprites translated as a substitute for animation, and manual repainting of every room are rejected as non-scalable. Reusable authored frame cycles are allowed and required when they produce better character motion than a rig. Painterly quality must come from production-ready modular layers, reusable texture and animation families, lighting, shaders, particles, and composition rules.

## Validation gates

Before expanding production:

1. One room must prove the signature forecast-to-traversal mechanic is fun in gray-box form.
2. A second room must combine phenomena and reuse the same architecture.
3. A third room from another physics family must stress the abstraction.
4. Stable Reality and Echo Sight must run from the same modular scene rather than separate illustrations.
5. The hero and fox must animate from reusable rigs or normalized strips.
6. At least five target-age players must be observed without coaching.
7. No critical physical error may remain in the shipped fixtures or visible explanation path.

## Linked documents

- [GDD.md](GDD.md) — game fantasy, core loop, systems, progression, engagement, and macro structure.
- [STACK_AND_PRODUCTION.md](STACK_AND_PRODUCTION.md) — engine decision, architecture, art and animation pipeline, budgets, and QA.
- [VERTICAL_SLICE.md](VERTICAL_SLICE.md) — concrete playable slice and first chapter level grammar.
- [RESEARCH_DECISIONS.md](RESEARCH_DECISIONS.md) — evidence, adjacent products, rejected directions, uncertainties, and plugin audit.
- [ART_MANIFEST.md](ART_MANIFEST.md) — active visual contract, validated concepts, caveats, production queue, and asset acceptance gate.
- [PRODUCTION_PIPELINE.md](PRODUCTION_PIPELINE.md) — mandatory no-neuroslop asset, animation, integration, and QA gates.
