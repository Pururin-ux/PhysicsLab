# Vertical slice — «Первый отброшенный путь»

Status: build specification v0.1. Room 1's complete forecast/cascade/retry gray box is implemented and exported for Android; art integration and Rooms 2–3 remain validation gates. Target length: 12–20 minutes for a first-time player. The full slice must prove one signature mechanic, one cross-domain chain, one second physics family, one companion belief update, and one scalable art scene.

## What the slice must answer

1. Is “pin a future and traverse it during a cascade” intrinsically fun without rewards or school framing?
2. Can a player understand the relation between their prediction, the resulting temporary geometry, and the real physical outcome?
3. Does Шорох feel like an embodied partner rather than a hint avatar?
4. Can one room runtime express optics, a coupled heat/mechanics chain, and a circuit/magnet chain?
5. Can the same modular scene switch between Stable Reality and Forecast Mode?
6. Can Codex produce, normalize, rig, animate, and assemble the assets without requiring Sasha to draw?

The slice is not allowed to add progression menus, currency, daily systems, a level map, accounts, cloud saves, shops, or more than one chapter of art.

## Shared portrait composition

```text
┌──────────────────────────────┐
│ pause          quiet state   │  safe-area strip
│                              │
│     layered playable room    │
│     hero + fox + apparatus   │  ~82–88% of screen
│     code-drawn causal traces │
│                              │
│ context handle near object   │
│                              │
│ [forecast/pin]     [fox cue] │  compact bottom edge
└──────────────────────────────┘
```

No generic card stack covers the scene. A forecast marker appears at the physical target; a rotation handle hugs the mirror pivot; a timing band sits on the moving object. Dialogue is spoken in the room and limited to two short lines.

## Shared interaction

- Tap a reachable surface: hero walks there.
- Drag a world-space handle: tune the nearby apparatus.
- Hold Forecast: switch the same scene to shadow state; simulation traces may be scrubbed but do not reveal the correct answer.
- Place the requested forecast representation.
- Tap Pin: commit.
- Tap one highlighted physical target: assign Шорох's action.
- Tap Release or lift the Forecast hold: run the deterministic cascade and authored traversal route.
- On mismatch: colour drains, rain and leaves reverse along recorded paths, and the scene settles back in under three seconds while a pale discrepancy vein remains faintly visible.

## Beat 0 — «След, которого нет»

**Purpose:** teach the fantasy and controls before any named school relation.

### First frame

Neri stands on a root-cracked observatory ledge above black rainwater. Across a narrow gap, a weather-dark plank is held upright by a fraying cord. A long fox-shaped absence bends the fog and wet leaves across empty air, but no animal is visible in Stable Reality.

### Player actions

1. Tap the cord winch; the plank starts to tilt in a short preview.
2. Forecast Mode reveals the plank's possible landing arc and the running shadow.
3. The player places a landing-point marker and pins it.
4. On release, the plank falls. The accurate part of the predicted arc grows a pale, frost-veined footing just long enough to cross.
5. The hero reaches the other side and pulls Шорох out of the erased layer.

### Physics model

Simple constrained rotation around a hinge with a declared center of mass. The teaching target is causal prediction, not the pendulum equation. Engine rigid-body physics is not the source of truth.

### Failure language

If the marker is far from the endpoint, rime grows in the wrong place and melts before Neri steps on it. The actual endpoint remains as a compressed ring of wet leaves. No text says “incorrect.”

### Narrative beat

Шорох: “Ты тоже это видел? Тогда я не совсем ошибка.”

## Room 1 — «Слепая лестница»

**Purpose:** prove the signature mechanic with a clear, exact relation.

### Layout

- Top-left: fixed milk-white beam source in a weathered iron lens housing.
- Center: one plane mirror on a pivoting arm.
- Right: a segmented absorbing wall above a gap.
- Bottom-left: hero and Шорох beside the mirror control.
- Exit: high right ledge, unreachable in Stable Reality.

The ray, hit point, mirror normal, and reflected direction are rendered in code. Decorative art never contains a baked beam.

### Player desire

“Make a light path hit the wall where it can become a staircase.”

### Inputs and forecast

- Drag mirror angle continuously.
- Place one prediction marker on the right wall.
- Draw a three-step route from the start ledge to that marker.
- Assign Шорох to hold the mirror after release.

### Cascade

The light turns on, intersects the mirror, reflects, hits the wall, and exposes three buried frost-veins. The part of the pinned route close to the actual beam exit solidifies. Neri auto-runs the committed short route while Шорох braces the mechanism.

### Scientific contract

```text
r = d - 2(d · n)n
```

For a fixed incident ray, rotating the plane mirror by `α` changes the reflected ray direction by `2α`. A dedicated fixture covers this exact relationship so the earlier `10° → 10°` error cannot recur.

Golden cases include normal incidence, oblique incidence, positive/negative rotations, near-parallel non-hit geometry, intersection endpoint tolerances, and mirror-angle wraparound.

### Discovery, not lecture

After one mismatch, the old predicted direction and actual direction remain as differently patterned traces. The player can rotate the mirror by the same amount again and see the reflected trace move twice as far. Numerical degrees appear only when the player taps and holds both traces.

### Mastery route

A second, narrower exit is reachable if the player predicts the hit point robustly enough that the staircase persists after Шорох lets go. It reveals a relationship scene, not a star or currency.

## Room 2 — «Восковая нить»

**Purpose:** prove that interacting phenomena create depth without adding a new game shell.

### Layout

- Fixed lamp and rotatable mirror on the left.
- Dark absorbing plate suspended above a waxed cord.
- Cord holds a counterweight.
- Counterweight drives a scissor bridge over a central gap.
- Hero begins left; exit is right and above.
- Шорох can either hold the mirror or tug a latch, but not both in one cascade.

### Player desire

“Raise the bridge and cross before the mechanism settles.”

### Editable variables

- mirror angle;
- exposure duration before the run;
- one of two fox interventions.

### Forecast contract

1. Order four event glyphs in world space: `beam hits plate → plate heats → wax releases → bridge rises`.
2. Mark the expected bridge-height window.
3. Draw a route using that window.

The glyphs are physical pictograms, not a text quiz. A wrong order alters where the pinned geometry appears, so the commitment matters to traversal.

### Deterministic model

- ray intersection and reflected direction;
- absorbed power `P_abs = A · I` for declared absorptivity `A` and incident power `I`;
- lumped heat accumulation `Q = P_abs · Δt`;
- explicit wax-release threshold with mass, heat capacity, starting temperature, and latent-energy term stored in the room fixture;
- constrained counterweight displacement mapped to scissor-lift height.

The simplified thermal model is stated in the notebook after play. It is not presented as a universal material simulation.

### Cascade spectacle

Pale light hits the plate; muted dried-rowan heat branches propagate through dark metal; the wax cord sags and snaps; the counterweight falls; the bridge unfolds; frost-veined echo steps become solid while Neri and the fox cross. Every visual beat is driven by the ordered event log.

### Fox belief update

Before the first attempt, Шорох suspects that “brighter-looking light always heats more.” The player can disprove this by comparing a reflective and absorbing patch under the same beam. Later dialogue changes from color/brightness language to absorbed-energy language.

### Multiple solutions

- High absorption with shorter exposure, fox on the latch.
- Lower absorption with longer exposure, fox stabilizing the mirror.
- Precision route that crosses before full bridge height.

## Room 3 — «Тихая рука»

**Purpose:** stress the abstraction with a second physics family before more content is produced.

### Layout

- A small DC source and three movable connection tiles.
- Two branches: lamp branch and coil branch.
- An electromagnet lifts an iron latch when its calibrated force exceeds the latch weight.
- The latch releases a rolling mass that tips a seesaw bridge.
- Шорох can hold one switch closed for a scheduled interval.

### Player desire

“Keep enough current through the coil long enough to release the bridge, without losing the lit route.”

### Editable variables

- series/parallel tile arrangement from a bounded set;
- switch timing;
- fox switch assignment.

### Forecast contract

- Shade the expected current distribution between two branches.
- Order `coil energizes → latch rises → mass rolls → seesaw tips`.
- Mark the safe crossing interval.

### Deterministic model

- graph-based ideal DC solution using declared component values;
- component power for the visible lamp state;
- coil current passed into an explicitly calibrated room-specific force model;
- constrained latch, rolling, and seesaw motion.

The coil force model is treated as a declared apparatus calibration, not as a universal closed-form electromagnet law. The learning target is circuit distribution and threshold reasoning.

### Why it validates architecture

The room reuses the same forecast types, event log, fox action slot, pin evaluation, traversal window, art state switch, and replay. Only domain components and their event adapters are new. If the room requires a parallel “circuit room engine,” the architecture fails.

## Art and animation proof inside the slice

One production scene must demonstrate:

- room assembled from reusable peat/stone floor, root bank, observatory wall, iron arch, platform, mirror, absorber, bridge, fog, and forest-background modules;
- separate Neri and fox sprite/mesh layers with explicit pivots, contact anchors and either clean authored atlases, hidden bones, or a documented hybrid;
- at least idle, walk, brace/interact, startled, and Forecast transition animations;
- stable and forecast materials applied to the same node hierarchy;
- code-drawn ray, normal, heat propagation, circuit trace, timing band, and discrepancy;
- portrait safe-area behavior at three aspect ratios;
- no generated text or functional diagram baked into an image.

All paper, bright blue/orange luminous, generic red-cloak, cute-fox, depressive black-water, and cave/crystal pre-production PNGs are rejected visual explorations. They may inform decomposition or geometry only. Canonical art must follow the Neri/Шорох and «Осенний Предел» specifications in `GDD.md`, `CONTEXT.md`, and `PRODUCTION_PIPELINE.md`. Before anything enters the runtime, it must be generated as individual transparent or correctly bounded layers, normalized, and verified in motion. A contact sheet on a dark background is not a production atlas.

## Audio direction

- Stable Reality: dry and damp leaves, old wood/iron foley, distant rooks, branch creaks, soft grass, and close variable wind. The ambience is melancholic and inhabited, not funereal.
- Forecast Mode: ambient sound loses its high end, nearby droplets briefly reverse, a low pulse follows the simulation clock, and causal traces use brittle frost-like ticks.
- Cascade: physical events create the rhythm; music does not announce right/wrong. The first shot ends with Шорох safely planted on the opened bridge, before his silhouette can overlap the optical apparatus.
- Mismatch: a soft twig crack and breath of reversed rain located at the divergence point, never a buzzer.
- Шорох has authored breaths, chirps, paw sounds, and a small motif; full voice acting is optional and outside the first slice.

## Instrumentation for playtest builds

Record locally and anonymously unless explicit consent exists:

- time to first move, first apparatus change, first forecast, and first release;
- number and type of forecast edits before commit;
- room-state dwell times;
- discrepancy magnitude and retry latency;
- hints offered, accepted, and ignored;
- solution path and optional-route choice;
- whether the player voluntarily starts another room.

Do not collect names, contact data, advertising identifiers, or microphone/video. Observer notes remain separate from telemetry.

## Playtest protocol

Use at least five target-age players for the first qualitative gate. Do not coach and do not ask “понятно?” during play.

After each room, ask:

1. “Что ты сейчас пытался сделать?”
2. “Почему механизм сработал именно так?”
3. Show a materially different setup and ask for a prediction before running it.
4. “Что тебе хочется сделать дальше?”

Observe whether players lean into the cascade, retry quickly, inspect the discrepancy, talk to/about the fox, and choose an optional route.

## Slice decision gates

The sample is too small for population statistics; these are go/no-go observations:

- at least 4 of 5 reach the first cascade without verbal instruction;
- at least 3 of 5 correctly transfer the reflection relation to a visually different mirror setup;
- at least 3 of 5 voluntarily start the next room or investigate the optional route;
- no participant describes the open experience primarily as “тест”, “викторина”, or “тренажёр”;
- every visible critical outcome matches its golden fixture;
- both art states run from one modular scene;
- hero and fox run from reusable rigs;
- the circuit room reuses the same room engine;
- a measured Android build meets the agreed frame-time budget.

If the forecast is understood but the cascade is not exciting, redesign the action payoff. If the cascade is exciting but prediction is ignored, redesign the pin-to-geometry dependency. If neither is compelling, stop the project rather than adding content or art.

## Build order

1. Headless reflection solver and golden fixtures.
2. Gray-box Room 1 with tap movement, Forecast, Pin, and replay.
3. First uncoached test with two players using gray boxes.
4. Generic causal event log and forecast evaluator.
5. Gray-box Room 2; refactor only through proven common abstractions.
6. Gray-box Room 3 as cross-family stress test.
7. Normalize one room kit and both puppet rigs.
8. Apply the two-state art system to the existing scene.
9. Audio, haptics, accessibility, and device profiling.
10. Five-player slice gate and a written continue/change/stop decision.
