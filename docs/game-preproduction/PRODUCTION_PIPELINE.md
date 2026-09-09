# Production pipeline — no-neuroslop contract

Last updated: 2026-08-22

Status: mandatory for every visible asset, animation, room, UI element, effect, and gameplay sequence. Read this after `CONTEXT.md` before production work.

## Core rule

Generated output is source material, not a finished game asset. Nothing enters the runtime because it looks plausible in one screenshot. Codex owns the complete route from specification to verified mobile behavior because Sasha is not expected to draw, animate, clean, rig, or integrate assets.

An artifact is `ACCEPTED` only when an experienced game team could ship that exact file and its runtime behavior. Otherwise it is explicitly `WIP` or `REJECTED`.

## Asset contract before creation

Every task must declare:

- stable asset ID, gameplay role, owning scene, and reuse scope;
- source references and non-negotiable identity/style traits;
- exact source dimensions, runtime slot, intended phone-scale size, crop, safe area, and alpha/mask requirements;
- camera, perspective, light direction, palette family, material family, and depth/occlusion band;
- pivot, ground baseline, contact points, sockets, attachment points, and solver-owned coordinates;
- required states and transitions, including failure and reduced-motion behavior;
- animation method: authored frame cycle, rig, shader, particles, or code-owned functional overlay;
- collision ownership and the boundary between decorative art and exact simulation;
- texture, draw-call, memory, and frame-time budget;
- acceptance evidence and known rejection conditions.

If these fields are missing, generation or implementation does not begin.

## Mandatory gates

| Gate | Required evidence | Automatic rejection examples |
|---|---|---|
| 1. Reference | canonical source opened locally; identity and style checklist | prompting from prose alone; changing character between assets |
| 2. Contract | written fields above | unknown pivot, baseline, scale, state list, or runtime slot |
| 3. Source | original output preserved with new versioned filename | overwrite of an accepted source; generated text or baked physics |
| 4. Production prep | real alpha/masks, safe crop, normalized anchors, no clipped cells | checkerboard painted into image; chroma fringe; tail or limb crossing a sprite cell |
| 5. Animation/rig | authored poses or rig, named states, contact phases, transitions | translating or wobbling one static sprite and calling it animation |
| 6. Integration | actual Godot node hierarchy, shared sockets, solver separation | art position used as the source of physical truth |
| 7. Motion capture | deterministic runtime sequence, not only screenshots | still image offered as proof of movement |
| 8. Visual QA | same-viewport before/after or reference/runtime comparison; phone-scale check | floating feet, sliding, occlusion of targets, illegible silhouette |
| 9. Automated gate | physics tests plus relevant asset/anchor checks | tests written around the error or omitted after a visual change |
| 10. Playtest | uncoached observation for player-facing flow | declaring intuitive behavior from author inspection alone |
| 11. Manifest | status, dimensions, source, runtime path, caveat, provenance | loose files with no accepted/rejected status |

## Character animation contract

- Canonical identity comes from one approved anchor and production sheet.
- A character has a root or ground socket independent of texture dimensions.
- Feet/paws, hand contacts, gaze target, prop sockets, and effect sockets are named and versioned.
- Walk/run cycles include contact, down/compression, passing, and up phases on both sides. Root movement is synchronized to gait distance so the character cannot skate when FPS changes.
- At minimum the vertical slice needs idle, walk, interact/brace, startled/reaction, success/settle, and Echo Sight transition states. Missing states remain `WIP` rather than being faked with a scale or rotation tween.
- Painterly frame animation is allowed when it is produced as a normalized reusable strip and passes identity/contact checks. Hidden-bone rigs are allowed when overlap and deformation remain invisible. Select per asset; do not force every character into one method.
- Professional tools are used where they add control: Krita for frame inspection/cleanup, Godot `AnimatedSprite2D`/`AnimationPlayer`/`Skeleton2D` for runtime, and Blender when a real mesh/rig/render pipeline is justified. Merely opening a file in an application is not a production gate.

Current Shorok walk implementation:

- rejected source: `apps/game/art/characters/source/shorok-walk-sheet-source-v1.png` — subjects crossed cell boundaries;
- rejected former slice source: `source/shorok-walk-sheet-source-v2.png`, `source/shorok-walk-sheet-alpha-v2.png`, and `shorok-walk-v2/*` — common canvas and baseline hid visible identity/scale drift;
- canonical source anchor: `apps/game/art/characters/source/shorok-anchor-v2-source.png`;
- WIP reconstruction and rig: `shorok-blender/triposr-v1/0/mesh.obj`, `shorok-mesh-rig-fit-v1.blend`, and `shorok-rigged-wip-v1.blend`;
- the fitting gate uses four independently measured paw volumes; L/R leg chains are deliberately asymmetric and the four low paw pads receive rigid toe weights so they cannot smear under IK;
- raw authored 24-frame Blender renders: `apps/game/art/characters/shorok-walk-blender-v1/frames/`;
- normalized runtime frames and anchor metadata: `apps/game/art/characters/shorok-walk-runtime-v1/`;
- runtime: ground socket plus distance-locked `AnimatedSprite2D` in `apps/game/src/main.gd`;
- automated gate: `apps/game/tests/animation_asset_test.gd`;
- motion evidence: `apps/game/art/reviews/shorok-walk-blender-v2.mp4`, `shorok-walk-blender-contact-v2.png`, `living-autumn-runtime-demo-v2.mp4`, and `shorok-crossing-contact-v4.jpg`;
- status: `WIP_RUNTIME_AND_DEVICE_QA_REQUIRED`; no root/object/pose scale keys are allowed, and this cycle is not accepted from a contact sheet alone.

## Living environment contract

- Separate stable geometry from animated foliage, mist, particles, light, and distant parallax.
- Each moving layer declares pivot, amplitude, frequency, gust response, z-band, and reduced-motion behavior.
- Neighboring layers must not move in lockstep. Wind affects branches, suspended elements, leaves, cloth, and fog through related but different responses.
- Motion must not hide the target, falsify a physical trace, or make UI harder to read.
- One generated full-screen illustration may be used as composition evidence, never as the only playable layer.
- Capture at least one full runtime loop and check first, middle, and gust frames.

Current living-background implementation uses a far forest/observatory plate, stable foreground cliffs, two independently pivoted canopy layers, drifting mist, and real leaf particles in `apps/game/src/visuals/living_autumn_background.gd`.

## Physics apparatus contract

- Decorative housing, moving part, pivot, collider, and solver geometry are separate concepts even if some share art.
- Rays, normals, hit points, vectors, circuit paths, graphs, timing bands, and prediction markers are exact code-rendered overlays.
- Decorative art may never contain a baked answer, functional beam, degree label, or collider cue.
- The visible pivot must agree with the solver pivot at the target viewport.
- Every change reruns the scientific fixtures and captures the affected state.

## Session closeout

Before reporting completion:

1. Save accepted and rejected source versions.
2. Run all affected automated gates.
3. Capture moving runtime evidence.
4. Inspect at native mobile resolution and at zoom.
5. Update `ART_MANIFEST.md`, this pipeline if the method changed, and the relevant task/spec.
6. State remaining WIP honestly; never substitute confidence for missing evidence.
