# Art manifest — «Осенний Предел»

Last updated: 2026-08-22

This file tracks visual evidence and production readiness. A concept image is not a runtime asset. Functional rays, normals, forecasts, colliders, labels, and interaction state remain code-rendered and solver-driven.

## Active visual contract

- Mood: enchanted late-autumn dark fantasy; melancholic and mysterious, but inviting rather than depressive.
- World: a living forest grown through a ruined open-air observatory; no cave/crystal biome and no lifeless black void.
- Palette: warm soot `#15130F`, aubergine `#241A20`, deep olive `#37402F`, fog cream `#E7D2B2`, dead-leaf copper `#8B4B2D`, ember rust `#B36A32`, restrained amber `#D89952`, weathered iron `#4A443F`.
- Stable Reality: painterly fog-cream sky, olive forest depth, weathered stone/iron, roots, moss, copper foliage, selective amber apparatus light, and enough midtones for phone readability.
- Echo Sight: future frost, pale leaf veins, compressed wet leaves, fog-bone afterimages, and broken dried-rowan divergence marks on identical geometry.
- Motion: independently swaying canopy layers, drifting mist, windblown leaves, suspended details, cloth, and parallax; reduced-motion behavior is required.
- Forbidden: cheerful cyan/orange fantasy, neon, blue glowing forest, gemstone magic, cave framing, anime/chibi faces, plush mascot proportions, paper puppets, primitive cut-outs, gold gothic filigree, ornate steampunk, and generated full-screen levels used as the only runtime layer.

## Validated concept evidence

| ID | Project file | Dimensions | Purpose | Status and caveat |
|---|---|---:|---|---|
| `late-boundary-gameplay-v1` | `apps/game/art/concepts/late-boundary-gameplay-v1.png` | 390×844 | portrait Stable Reality target and value hierarchy | Approved as art-direction evidence. The horizontal incident ray, `/` mirror at 45°, and vertical reflected ray are physically coherent. The baked ray is reference only. |
| `late-boundary-forecast-v1` | `apps/game/art/concepts/late-boundary-forecast-v1.png` | 853×1844 | same-room Echo Sight material/effect target | Approved as state-direction evidence. Geometry and mirror relation remain coherent. Several rime footings and tail trails are illustrative; runtime count and placement come from data. |
| `late-boundary-cast-v2` | `apps/game/art/concepts/late-boundary-cast-v2.png` | 1707×921 | Neri/Шорох age, silhouette, proportion, material, and relationship target | Approved as cast direction, not a rig sheet. Neri's gauntlet still reads too circular; the production part family must expose an unmistakable crescent. |
| `late-boundary-modular-kit-v1` | `apps/game/art/concepts/late-boundary-modular-kit-v1.png` | 1672×941 | forest-observatory material families and prop language | Approved as assembly/mood evidence, not for direct extraction. Lower water/reeds use slight perspective; playable geometry must stay strict side view. |

Sources are preserved on Creative Production board `7f5689ba-3f78-46a7-9c23-b6098b8ab395` under stable IDs `late-boundary-*`. Earlier `production-proof-*` and `luminous-fantasy-*` items are rejected explorations and stay out of the project concept folder.

The `late-boundary-*` set remains decomposition and material reference. Its crushed-black/depressive grading is superseded by the accepted living autumn runtime below.

## Accepted runtime production assets

| ID | Runtime files | Dimensions | Role | Status / production evidence |
|---|---|---:|---|---|
| `autumn-far-bg-v1` | `apps/game/art/environment/autumn-observatory-far-bg-v1.png` | 941×1672 RGB | far forest and observatory parallax | `ACCEPTED`; slow independent drift; SHA-256 `457791d5…a0ce` |
| `autumn-stable-foreground-v2` | `apps/game/art/environment/autumn-observatory-foreground-v2.png` | 941×1672 RGBA | stable painted cliffs, ledges, roots | `ACCEPTED`; replaces contaminated v1; SHA-256 `df14ac0b…e40f8` |
| `autumn-canopies-v1` | `autumn-canopy-left-v1.png`, `autumn-canopy-right-v1.png` | each 941×1672 RGBA | independently pivoted wind layers | `ACCEPTED`; separate phases/scales; hashes `ac3a380e…9af3a`, `c1b7c759…25ab` |
| `autumn-mist-v2` | `apps/game/art/environment/mist-ribbons-v2.png` | 941×1672 RGBA | slow lateral atmospheric layer | `ACCEPTED`; v1 rejected for colour contamination; SHA-256 `5362e804…045d` |
| `autumn-leaf-particle-v2` | `apps/game/art/environment/autumn-leaf-particle-game-v2.png` | 575×649 RGBA | real texture for wind particles | `ACCEPTED`; randomized velocity/rotation/scale; SHA-256 `f0fdfd5c…04db` |
| `neri-anchor-v6` | `neri-anchor-v6.png`, `neri-idle-v1.png` | 927×1697, 538×1481 RGBA | canonical Neri source and current idle runtime | `ACCEPTED` for idle identity only; motion states remain `WIP`; hashes `390a4116…5114`, `6aa7c857…3148` |
| `shorok-anchor-v1` | `shorok-anchor-v1.png`, `shorok-idle-v1.png` | 1536×1024, 1304×809 RGBA | canonical Shorok identity and grounded idle | `ACCEPTED`; amber eyes, bronze ring, soot/russet coat; hashes `1705abd9…6139`, `2e3fc61f…da55` |
| `shorok-app-icon-v1` | `apps/game/art/branding/source/shorok-app-icon-source-v1.png`, `apps/game/art/branding/shorok-app-icon-v1.png` | 1254×1254 source; 1024×1024 RGB runtime | Android launcher icon based on the canonical Shorok anchor | `ACCEPTED`; generated from the canonical local reference, normalized with the Krita-bundled FFmpeg, inspected at 48×48; source SHA-256 `1fe6f1e5…fff36`, runtime `ee26b026…a66e2` |
| `optics-props-v1` | `light-emitter-game-v1.png`, `mirror-pedestal-game-v1.png`, `mirror-rotor-game-v1.png`, `light-receiver-off-game-v1.png`, `light-receiver-on-game-v1.png` | isolated RGBA, see source files | solver-independent decorative apparatus shells/states | `ACCEPTED` for this slice; pivot and receiver centre remain code-owned |
| `bridge-extended-v1` | `apps/game/art/props/bridge-extended-game-v1.png` | 1603×225 RGBA | physical consequence / traversal surface | `ACCEPTED` for slice; ground route follows painted surface; SHA-256 `dd92aa8a…b4e2d` |
| `ftue-causal-captures-v1` | `autumn-ftue-explore-v1.png`, `autumn-ftue-hint-v1.png`, `autumn-ftue-forecast-v1.png`, `autumn-ftue-success-v1.png` | each 390×844 RGBA | four verified first-time-player states | `QA EVIDENCE`; opening ray misses the receiver, forecast hides the reflected segment, success requires accurate prediction plus receiver hit; hashes `71fdbc45…ad2`, `8bf174e8…e7c4`, `0d1de550…e7cbc`, `7cb21386…f6830` |
| `living-runtime-demo-v1` | `apps/game/art/reviews/living-autumn-runtime-demo-v1.mp4` | 390×844, 15 FPS, 8.8 s | full Godot runtime evidence | `QA EVIDENCE`; H.264; SHA-256 `399913fe…be842` |
| `shorok-crossing-runtime-v2` | `apps/game/art/reviews/shorok-crossing-runtime-v2.mp4`, `shorok-crossing-contact-v3.jpg` | 870×672, 15 FPS, 2.47 s; 3045×336 contact sheet | enlarged gait/ground-contact evidence | `QA EVIDENCE`; planted path ends safely on the bridge before apparatus overlap; hashes `fac9ffc2…0e86f`, `21294cfb…73fff` |

## WIP production assets

| ID | Source / runtime files | Dimensions | Role | Status / open gate |
|---|---|---:|---|---|
| `shorok-anchor-v2-source` | `apps/game/art/characters/source/shorok-anchor-v2-source.png` | 1628×966 RGBA | current identity reference for the mesh-backed animation pass | `CANONICAL SOURCE / WIP`; production frames must preserve muzzle, ears, amber eye, ring, long torso and feathered tail mass |
| `shorok-triposr-mesh-v1` | `apps/game/art/characters/shorok-blender/triposr-v1/0/mesh.obj` | 25,936 vertices; 51,868 faces | watertight vertex-colour reconstruction used as a riggable side-view source | `WIP`; side silhouette is useful, rear/front anatomy and fused tail volume are reconstruction limitations |
| `shorok-rig-fit-v1` | `shorok-blender/shorok-mesh-rig-fit-v1.blend`, `shorok-rigged-wip-v1.blend`, `shorok-deformation-qa-wip-v1.blend` | Blender source scenes | fitted metarig, generated Rigify controls, skin and deformation gate | `WIP`; four L/R leg chains target four measured paw volumes, low paw pads have rigid toe weights, and root/object scale animation is forbidden |
| `shorok-walk-blender-v1` | `shorok-walk-blender-v1/frames/shorok-walk-0001.png` … `0024.png`, `shorok-walk-runtime-v1/shorok-walk-00.png` … `23.png`, `shorok-walk-anchors.json` | 24× 512×512 RGBA | cautious four-beat walk rendered from the hidden-bone rig and normalized without rescaling | `WIP_RUNTIME_AND_DEVICE_QA_REQUIRED`; all frames share baseline 444, width spread is 3 px, no scale curves exist, and 146 automated asset checks pass |
| `shorok-walk-runtime-evidence-v2` | `apps/game/art/reviews/shorok-walk-blender-v2.mp4`, `shorok-walk-blender-contact-v2.png`, `living-autumn-runtime-demo-v2.mp4`, `shorok-crossing-contact-v4.jpg` | source close-up plus 390×844 Godot capture | deformation, gait and in-room integration evidence | `QA EVIDENCE / WIP`; still needs enlarged runtime playback inspection and a real Android device pass before acceptance |

## Mobile build evidence

- Debug APK: `apps/game/builds/android/fox-that-never-was-debug.apk`.
- Target: Android arm64, immersive portrait, offline; QA/review and production-source folders are excluded from the runtime package.
- Clean Godot 4.7.2 export with Android platform/build-tools 36.0.0; no asset-import or missing-icon errors.
- Signature verification: APK Signature Scheme v2 and v3 pass.
- Size: 63,466,016 bytes. SHA-256: `68ebe55754b52b391701fc7dc66218202973c4d76b6a6f1d6d81dd9931abda69`.
- Real-device visual/performance verification remains `WIP` because no Android device or emulator was connected during this pass.

## Explicitly rejected production attempts

| Files | Reason | Rule established |
|---|---|---|
| `neri-anchor-v1.png` … `neri-anchor-v5.png` | invalid alpha and/or identity/production inconsistencies | only v6 is canonical |
| `autumn-observatory-foreground-v1.png` | wrong chroma key / contaminated transparency | inspect real alpha before runtime import |
| `mist-ribbons-v1.png` | green/magenta contamination | atmosphere must be colour-checked over the real scene |
| `autumn-leaf-particle-game-v1.png` | bad crop | normalize from the accepted source; do not stretch or hide crop errors |
| `source/shorok-walk-sheet-source-v1.png`, `source/shorok-walk-sheet-alpha-v1.png`, `shorok-walk-v1/*` | tails/limbs crossed cell boundaries despite attractive poses | preserve as rejection evidence; never repair a clipped strip by slicing harder |
| `source/shorok-walk-sheet-source-v2.png`, `source/shorok-walk-sheet-alpha-v2.png`, `shorok-walk-v2/*` | common canvas and baseline passed, but silhouette/torso/head proportions drifted and read as growth/shrinkage in motion | old 8-frame slice is superseded; do not call it accepted or reuse it as the animation reference |
| `shorok-blender/shorok-rig-workbench-v1.blend` | stock image-only metarig sat below the visible paws, followed the back instead of the body volume, overlapped distinct limbs and misplaced the pelvis/tail root | retained as rejection evidence for the exact fitting error Sasha identified |

## Runtime production queue

1. Produce Neri's walk, manipulate-mirror, react, and settle states with the same anchor/contact gate used for Shorok.
2. Finish runtime/device QA of the corrected Blender walk, then produce Shorok idle, brace/interact, startled, settle, and Echo Sight transition states from the same rig and anchor.
3. Add authored mechanism motion for the bridge and receiver while retaining solver-owned pivots/colliders.
4. Prove Stable Reality ↔ Echo Sight with material, fog, masks, particles, and code traces on the same node hierarchy.
5. Add motion-aware audio/foley and verify that wind animation never masks the beam or target.
6. Capture on-device motion and test legibility at arm's length, in grayscale, reduced motion, and high-contrast trace modes.

## Acceptance gate for any generated asset

- exact declared dimensions or bounded crop;
- transparent background when the manifest requires RGBA;
- stable side-view scale and overcast light direction;
- no baked functional line, label, equation, or collision cue;
- silhouette legible at intended phone size;
- anchor, pivot, depth band, material tags, and source prompt recorded;
- visual result checked against physics fixtures when an apparatus is shown;
- source preserved; revisions use new filenames rather than overwriting the accepted original.
- moving assets include a real runtime capture and contact/pivot validation; a still screenshot is insufficient;
- status is `ACCEPTED`, `WIP`, or `REJECTED`; attractive unverified output defaults to `WIP`.

The complete mandatory workflow is defined in [PRODUCTION_PIPELINE.md](PRODUCTION_PIPELINE.md).
