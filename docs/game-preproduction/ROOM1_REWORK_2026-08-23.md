# Room 1 rework — reflection rescue

Status: `ACTIVE / WIP`. This document supersedes the current Room 1 presentation where a wall marker is dragged and a bridge sprite is stretched into existence. It does not supersede the project-wide production gates.

## Why the current pass is rejected

- `shorok-walk-v2` shares a 512×512 canvas and paw baseline, but that gate was too weak. The visible silhouette width varies from 293 to 324 px (10.6%), while torso, muzzle, tail mass, and leg anatomy also drift. In runtime this reads as the fox growing and shrinking.
- The current bridge is a rigid painted object animated by changing `scale.x`. It therefore deforms instead of moving as a mechanism, has no visible storage position or hinge, and crosses ledges at different heights as an unexplained slanted strip.
- Releasing the mirror starts a hidden 1.15 s timer before Forecast. The outgoing beam then waits 0.18 s and takes 0.72 s to reveal. These delays make direct manipulation feel unresponsive.
- The forecast is a small wall marker even though the physical quantity being predicted is a ray direction. Its interaction area and its visible affordance do not match, and “ПРОВЕРИТЬ” frames the action as a school exercise.
- A correct result currently opens a route, but the screen never shows why the ray behaved that way or how the action maps to the school law of reflection.

## Player-facing scene logic

Шорох is stranded on the lower right observatory ledge. A light receiver above him releases a counterweighted stair-frame recessed vertically into the inner face of the right cliff. The stair rotates as one rigid body around a visible right-hand hinge and locks against the higher left ledge. Three treads have physically rotted away; an accurate pinned future supplies those missing treads briefly, which is why prediction—not merely aiming—is required for rescue.

Nothing appears from the ground or from empty space:

1. The folded frame is visible before interaction.
2. A cable visibly connects the receiver lock to the hinge housing.
3. On a receiver hit, the latch retracts, the counterweight drops, and the frame rotates out.
4. Only the three missing tread surfaces use the pale future-echo treatment.
5. Шорох crosses only after the frame is mechanically locked and the echo treads are stable.

## First-time core loop

### 1. Aim

- The incident ray and a short 32 px reflected “light stub” update on the same input frame as the mirror.
- The player drags the mirror itself; there is no delayed automatic mode switch.
- The receiver reacts subtly when the live short stub is close, but the full outgoing path is not revealed.

### 2. Draw the future

- On release, Echo Sight appears immediately on the same geometry.
- The player drags a broad ghost ray around the mirror hit point. The whole right half of the playfield is a valid touch surface; the handle is only visual feedback, not a tiny hit target.
- The predicted variable is `forecast_direction_angle`, not an arbitrary wall coordinate.
- The ghost ray remains visibly different from the real beam by line pattern and colour, including a non-colour shape cue.

### 3. Open the shutter

- The action is labelled `ПУСТИТЬ СВЕТ`, never `ПРОВЕРИТЬ`.
- The real reflected beam begins moving on the next rendered frame and traverses the visible segment at a constant world speed. There is no artificial pre-delay.
- The ghost ray remains on screen while the real ray travels, so discrepancy is readable without memory.

### 4. Read the consequence

- If the beam misses the receiver, a short physical spark/receiver recoil marks the real endpoint. The scene resets without a red cross or test language.
- If the receiver is hit but the forecast is inaccurate, the stair-frame opens but the missing treads remain unstable; Шорох braces and refuses the unsafe crossing.
- If both are accurate, the echo treads form, the frame locks, and Шорох crosses.

### 5. Learn inside the world

At first successful overlap, the mirror briefly reveals its normal and two equal angle arcs. Шорох says one diegetic line: `По разные стороны — одинаково. Вот что держит след.` The overlay is an explanation of the event that just saved him, not a detached lesson panel.

The next short setup rotates the mirror by a declared 10°. The player predicts before release and then sees the reflected ray rotate 20°. Only after that observation does the fieldbook record `поворот зеркала α → поворот отражённого луча 2α`. The numerical relation is never asserted by a fallible companion before the experiment.

## Scientific contract

- Solver remains the source of truth: `r = d - 2(d · n)n`.
- Forecast error is the smallest angular difference between the predicted and actual reflected directions.
- Initial success tolerance: 3° angular forecast error and 18 px receiver-centre error. These values remain subject to playtest, not silent tuning.
- The normal and equal-angle arcs are derived from the exact solver vectors, never hand-positioned decoration.
- Existing reflection golden cases remain mandatory; new tests cover angular forecast wraparound, immediate input response, rigid bridge transform, and the 10° → 20° transfer setup.

## Asset contracts

### Counterweighted stair-frame v1

- Gameplay role: a visible physical consequence of the receiver hit and a grounded crossing surface.
- Deliverables: `folding-stair-frame-game-v1.png`, `stair-hinge-housing-game-v1.png`, `stair-counterweight-game-v1.png`; isolated RGBA, no baked ray, cable, glow, text, or echo trace.
- View: side-on with the same slight top-plane visibility as the ledges; late-autumn painterly realism; wet old iron, dark oak, lichen stone; no gold filigree or steampunk ornament.
- Frame target: 128–142 logical px from hinge to landing at 390×844. The stair has an intentionally rising stepped top surface matching the 42–48 px ledge height difference.
- Pivot: frame root at the right hinge centre; closed rotation stores the frame down the right inner wall; open rotation ends at the authored landing angle. No scaling animation is permitted.
- Occlusion: frame behind characters, hinge above frame, echo treads above frame but below paws.
- Motion: 80 ms latch anticipation, 520–680 ms gravity/counterweight rotation, 120 ms lock recoil, then settle. One rigid transform; no squash/stretch.
- Mobile gate: mechanism origin, destination, and lock state must be readable at arm’s length without text.

### Шорох walk Blender v1

- Gameplay role: cross the opened stair with alert, cautious confidence.
- Source invariant: canonical soot-black/russet fox, angular ears, amber eye, bronze ring, feathered tail, long-legged silhouette.
- Delivery: one hidden-bone Blender mesh rig fitted to four distinct paw volumes, then rendered as 24 authored 512×512 RGBA frames. Runtime prep may translate a whole canvas to baseline 444 px but may not rescale, crop, warp, or interpolate the character.
- Poses: a four-beat cautious walk sampled over 24 frames with explicit stance/swing phases for all four paws, plus chest/head counter-motion and delayed tail follow. Each paw contact remains attributable to a named rig chain.
- Identity gates: fixed muzzle length, ear spacing, eye position, rib-cage length, hip height, ring diameter, and tail-root position; torso landmark scale drift ≤ 3%, head scale drift ≤ 3%, root jitter ≤ 2 px after anchoring.
- Motion gates: no frame may be accepted only because the alpha bounds pass. Review deformation poses, the full 24 FPS source, a playback-rate-appropriate game loop, distance-locked runtime motion, paw slip, and a native-size crossing capture. Acceptance also requires real-device QA.
- Secondary action: tail follows with one-frame overlap; head counter-rotates subtly; no whole-sprite breathing or scale tween.

### Шорох idle/reaction v1

- Use enough keyed frames for readable timing (target 24 frames for a two-second 12 FPS game loop, or an equivalent 24 FPS source), covering an asymmetric ear turn, single blink, nose/whisker check, slow tail settle, weight transfer, receiver-startle, bridge-lock recoil, and cautious first step.
- Feet remain fixed during idle. Any body rise comes from leg/shoulder articulation, not resizing the sprite.

### Neri idle/operate v1

- Neri’s silhouette must be readable at 125–140 logical px: asymmetric coat split, crescent gauntlet, short uneven hair, narrow stance; remove the generic bright scarf emphasis.
- Idle uses blink, gaze shift toward Шорох, gauntlet-hand tension, and independent coat hem/strap motion. No whole-sprite bob.
- Mirror operation includes reach anticipation, planted hand, shoulder follow-through, and release settle.

## Runtime and composition gates

- Input-to-ray visual response: no more than one rendered frame.
- The reflected beam’s propagation starts without a fixed delay; constant-speed travel is visually continuous at 60 FPS.
- All rigid mechanisms animate by rotation/translation around documented pivots, never by non-uniform scale.
- Character feet are checked against the real painted surface on every runtime frame, not only source-canvas baselines.
- At least one foreground branch, two canopy groups, mist, leaves, hanging receiver cable, coat hem, and both characters have independent motion frequencies; none may obscure the beam, receiver, predicted ray, or paws.
- Approval requires a full portrait capture, an enlarged crossing capture, onion-skin character review, native Android-scale review, automated physics/flow tests, and an uncoached player pass. Until then every changed art item remains `WIP`.
