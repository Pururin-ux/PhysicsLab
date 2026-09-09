# «Лис, которого не было» — GDD v0.1

Status: pre-production hypothesis, 2026-08-22. This document is a buildable direction, not proof that the game is fun. The vertical slice and observed playtests are the next gates.

## One-line promise

**Ты видишь один возможный исход физической цепочки, закрепляешь его как временную дорогу и вместе с живым отброшенным будущим успеваешь пройти по ней, пока настоящее догоняет прогноз.**

## What the game is

- Genre: portrait mobile **causal-heist puzzle adventure**.
- Camera: layered 2D side view, compact rooms, no free-roaming 3D dungeon.
- Primary experience: exploration, apparatus manipulation, prediction, a short spectacular cascade, traversal through the predicted future, and character consequences.
- Primary audience: Russian-speaking players approximately 12–17. The player is treated as a curious person, not as a pupil being examined.
- Session shape: one room takes about 3–7 minutes after onboarding; a natural session is 2–3 rooms, but the game never punishes stopping.
- Platforms: Android first, offline; iOS later.

This is not a platformer with equations between jumps and not a quiz hidden behind fantasy art. If the dialogue and educational labels are removed, manipulating the world, forecasting it, and surviving the cascade must still be enjoyable.

## The fictional rule and the scientific boundary

The ruined forest-observatory called **Предел** calculates possible futures as pale weather moving through the world, then prunes branches that did not happen. A small fox, **Шорох**, somehow remained alive after its branch was cut away. The player can pin one forecast briefly, turning its trace into a usable bridge, shield, route, or trap.

The pinning of futures is explicit fantasy. Everything inside the apparatus—rays, mirrors, refraction, forces, heat, circuits, oscillations—follows the declared physical model. The game never presents a fantastic effect as a real physical law.

The antagonist is not a wizard who “broke physics.” It is the observatory's blind custodian, the **Садовник**, which wants one perfectly predictable history and prunes alternatives like dead branches. The dramatic question is personal: can the player preserve a companion who, according to the system, should not exist? The epistemic theme is that a model is a useful prediction, not a prophecy; a discrepancy is information.

## Visual cast

All earlier red-cloak, anime-adventurer, cute luminous fox, paper-puppet, and crystal-cave outputs are exploration only, **not** canonical design. Production must not fall back to generic fantasy-anime faces, chibi proportions, plush mascots, gold gothic frames, or weapon silhouettes.

### Player character — Neri (working name)

- A slender 16–17-year-old explorer with a long, alert silhouette and physical confidence rather than heroic swagger. Proportions are stylized realism, never chibi.
- Angular, memorable face; cropped uneven dark hair flattened by rain; tired, observant eyes; restrained expressions that can shift from dry amusement to fear without becoming anime reaction icons.
- Weather-darkened asymmetric coat in soot umber and bruised plum, with a narrow dead-leaf lining visible only in motion. One weighted shoulder cape and one close tool arm create the silhouette; there is no bright scarf.
- Signature tool is a crescent lens-gauntlet made from cloudy optical glass and oxidized iron. It lays a thin fog-bone forecast trace into the world; there is no sword, staff, wand, or generic adventurer gear.
- A small stitched repair under one eye and three fixed peaks in the hair silhouette prevent identity drift between generated poses.
- Palette: peat, soot, bruised plum, oxidized iron, fog-bone skin highlights, and a scarce dead-leaf copper accent.

### Шорох — the discarded fox

- A lean soot-and-russet fox with long alert ears, amber eyes, a small bronze pendant, a pale muzzle and one large feathered tail. He must feel alive, intelligent and slightly uncanny, never plush, chibi, or interchangeable with a generic pet mascot.
- The accepted silhouette, markings, pendant, eye color and tail volume are fixed identity anchors. Locomotion may use a normalized authored frame atlas; tails, ears, pendant and cloth may additionally use bones or procedural secondary motion when that improves contact and responsiveness.
- One forepaw is indistinct in Stable Reality, as if rain passes through it. Pinning a future covers it in a thin rime edge and makes it solid enough to hold or trigger an object. Its gameplay ability is therefore visible in its body.
- Long low muzzle, large directional ears, narrow chest, and horizontal running posture must read unmistakably as a fox, never as a cat icon.
- A disproved belief sheds a brief dried-rowan fracture pattern; a demonstrated causal link forms a closed pale vein. Shape and motion duplicate color meaning for accessibility.

Both characters use large silhouette changes and small facial detail. Neri's crescent gauntlet, Шорох's amber eyes, bronze pendant and feathered tail, pale leaf-vein forecasts, and a single dead-leaf accent are the recurring signatures on icons, loading transitions, store art, and animation.

## Signature verbs

1. **Explore** — tap a reachable surface to walk there; inspect physical clues in the room.
2. **Tune** — drag a world-space handle to rotate, slide, connect, load, or release an apparatus part.
3. **Forecast** — place a point, draw a path, order events, mark a time window, or shade an expected distribution.
4. **Pin** — commit the forecast before observation.
5. **Cue the fox** — assign Шорох one embodied action: hold, block, carry, trigger, or test.
6. **Ride the cascade** — release 5–12 seconds of deterministic action and traverse the temporary geometry created by the accurate part of the forecast.
7. **Read the discrepancy** — see where reality diverged from the pinned shadow, then alter the setup or the hypothesis.

There is no virtual D-pad in the target interaction model. Movement is tap-to-walk between reachable anchors; apparatus is direct manipulation. During a cascade, the player follows a route drawn in Forecast Mode and can issue one clearly telegraphed fox cue. This keeps the fantasy of moving through a dungeon without turning portrait touch controls into imprecise platforming.

## Moment-to-moment loop

```text
enter room
  → notice an immediate physical desire (“I need that bridge to rise”)
  → move through the room and manipulate 1–3 apparatus variables
  → enter Forecast Mode
  → commit an outcome and a traversal route
  → assign one fox intervention
  → release a short cascade
  → run through the accurate part of the forecast
  → observe the mismatch or a new consequence
  → retry in under three seconds, find another solution, or leave through the opened route
```

A first attempt should reach its cascade within 60–90 seconds. No pre-room lecture is allowed. The first useful explanation appears only after the player has made a prediction and seen a consequence.

## Why prediction is gameplay rather than a quiz

- The prediction becomes a physical resource. Accuracy controls where the temporary geometry appears and how long it remains stable.
- A rough prediction can produce a short, flickering foothold; a robust one produces a longer, wider route. There is no red cross or score screen.
- The player must forecast **and** plan a route through the resulting cascade. Knowing a formula without understanding the room is insufficient.
- Continuous parameters and interacting phenomena make blind enumeration unattractive, while retries remain fast and free.
- Most rooms allow at least two valid configurations. Optional secrets reward robust understanding, not one designer-approved numerical answer.
- Transfer is tested in a later room where the same relation appears in a new physical context without its old visual cues.

## Room state machine

Every room uses the same underlying states:

1. `ARRIVE` — one visual mystery and one reachable action.
2. `EXPLORE` — move, inspect, and tune apparatus.
3. `FORECAST` — the same scene switches to its shadow representation; simulation is previewed without revealing the answer.
4. `COMMIT` — the prediction is locked.
5. `CASCADE` — deterministic simulation and traversal run together.
6. `SETTLE` — stable outcome, mismatch trace, and character reaction.
7. `REFLECT` — optional short hypothesis exchange or notebook manipulation.
8. `EXIT` — route forward, alternate route, or voluntary retry.

## Four room formats

The content changes the dramatic task without changing the engine:

- **Escape:** build a temporary route through a moving cascade.
- **Investigation:** choose between two embodied hypotheses and construct a discriminating experiment.
- **Duet:** player and fox must occupy or trigger two causally linked positions.
- **Long chain:** several familiar subsystems interact; the challenge is order, timing, and robustness rather than a new formula.

Optional **wonder rooms** have no fail state. They are small toys where players discover an extreme, symmetry, resonance, or counterintuitive limit and can leave whenever they want.

## Companion system: Шорох

Шорох is not a hint button and is not omniscient.

- It is always physically in the room and can interact with one object per cascade.
- It proposes short, explicitly framed hypotheses: “Мне кажется…”, “Проверим, что будет, если…”.
- A wrong hypothesis is never delivered in the visual language of a fact.
- Its internal belief state is deterministic content data, not generated dialogue and not an online LLM.
- Demonstrating a causal link updates later gestures, forecasts, jokes, and available interventions.
- The player can disagree by action; there is no mandatory dialogue-choice quiz.
- Its arc moves from pretending certainty, through fear of being erased, to accepting that uncertainty does not make it unreal.

The relationship supplies continuity between rooms. The fox remembers *what the pair actually demonstrated*, not merely which level ID was completed.

## Progression without XP inflation

The main progression is increased **forecast resolution**:

1. **Point** — where an object or ray will arrive.
2. **Path** — the shape of a trajectory.
3. **Order** — which event happens first.
4. **Timing** — when a short window opens.
5. **Distribution** — how energy, current, pressure, or intensity divides.
6. **Interaction** — how two physical subsystems alter one another.
7. **Robustness** — which prediction remains useful when an initial value is uncertain.

The notebook is an optional **weather atlas** inside the lens-gauntlet: causal relations appear as pale veins across stacked smoky observation plates, and the player can rotate or connect them. It is not a list of textbook paragraphs. Cosmetics, if any, are found as authored story objects and never randomized purchases.

## Engagement design and ethical boundary

The intended pull comes from:

- an unanswered visual question in the first seconds of every room;
- agency and multiple viable solutions;
- immediate, readable consequences;
- the competence pleasure of making a long chain unfold exactly as imagined;
- character attachment and unresolved narrative stakes;
- secrets that require noticing a causal relation;
- alternating tension, wonder, humor, and quiet;
- short retries with no loading interstitial;
- visible anticipation: the player sees the future they are about to risk.

The project will not use punitive streaks, energy timers, timed chests, loot boxes, fake scarcity, guilt notifications, deceptive purchasing, ads disguised as play, or pay-to-win. The working commercial hypothesis is a free prologue/chapter followed by a transparent one-time purchase; it remains unvalidated.

## Campaign atlas v0

This is the intended dramatic and mechanical spine, so the team can design a coherent production system. Exact room geometry and even room count remain changeable until the vertical slice is observed with players.

| ID | Room | Format | Physical heart | Forecast | Game consequence | Fox beat |
|---|---|---|---|---|---|---|
| P0 | След, которого нет | Escape/tutorial | falling plank, center of mass | landing point | the first pinned shadow becomes a step | the player discovers Шорох inside the erased branch |
| 1 | Слепая лестница | Escape | reflection from one plane mirror | beam exit point | the reflected trace hardens into a staircase | the fox distrusts light it cannot touch |
| 2 | Двойной поворот | Duet | rotating mirror; reflected ray turns by `2α` | path after a mirror rotation | player and fox cross on two timed light-creases | its confident `α → α` guess is visibly disproved, never stated as fact |
| 3 | Стеклянная пасть | Escape | refraction at two boundaries | refracted path | a bent shadow route avoids the Editor's sweep | Шорох learns that “straight” depends on the medium |
| 4 | Два солнца | Investigation | converging lens and focal region | location of strongest heating | focused light releases one of two routes | the fox holds a screen and reacts to the hot spot |
| 5 | Восковая нить | Long chain | absorption → heating → melting → counterweight | event order and bridge height | a scissor bridge rises only during the predicted window | it must choose when to let go, not what answer to say |
| 6 | Украденный рассвет | Chapter escape | reflection + refraction + heat | full path and timing | a long moving route outruns an erasing wall | first voluntary act of trust between player and fox |
| W1 | Туманное стекло | Wonder | transmission, absorption, scattering as distinct effects | no required commit | freely paint the room with light and discover hidden layers | wordless play |
| 7 | Чужой вес | Escape | torque and lever arms | rotation direction and endpoint | the predicted lever arc becomes a ramp | the fox volunteers as a movable load |
| 8 | Три руки | Duet | fixed and movable pulleys | displacement and required pull | a suspended route rises while the pair traverse it | it learns that easier force costs distance |
| 9 | Самое короткое падение | Escape | projectile motion | landing path | the arc forms a temporary rail for a falling key and the hero | the fox tries to “help” horizontally, exposing independence of motions |
| 10 | Дыхание снизу | Investigation | pressure and buoyancy | equilibrium height | a floating chamber becomes an elevator | the fox tests two objects with equal size and different mass |
| 11 | Поющая балка | Investigation | forced oscillation and resonance | amplitude window | vibration releases sand from a latch without breaking the route | it becomes frightened of the loudest-looking option, which need not be best |
| 12 | Король противовесов | Long chain | torque + pulley + projectile + oscillation | order and timing | one room-sized kinetic escape plays as a continuous shot | Шорох performs a three-step intervention from learned actions |
| W2 | Подводный сад | Wonder | buoyancy and coupled pendulums | no required commit | plants, bubbles, and weights form a tactile physics toy | quiet relationship scene |
| 13 | Развилка тока | Investigation | series/parallel DC circuits | current distribution and lamp states | only one route stays lit long enough to cross | the fox's body glow makes current state spatially legible |
| 14 | Тёплая проволока | Escape | Joule heating and thermal expansion | threshold time | a bimetal latch bends and opens a moving gate | the fox must break contact before overheating |
| 15 | Тихая рука | Duet | current, electromagnet, force threshold | event order and pickup state | a lifted iron mass becomes a moving shield | it discovers that an invisible field can still transfer force |
| 16 | Лестница эха | Escape | sound reflection and delay | arrival order | echo-triggered platforms unfold in sequence | Шорох navigates by listening when the room goes dark |
| 17 | Стоячая тень | Investigation | standing waves and nodes | node positions | pinned nodes are safe islands through a vibrating hall | the fox stops equating “not moving” with “no wave” |
| 18 | Восемь секунд | Chapter escape | circuit → magnet → mechanics → heat → wave trigger | multi-stage timing | an eight-second room-wide heist joins every learned verb | the pair improvise after one deliberately uncertain input |
| W3 | Мастерская послесвечения | Wonder | free combinations of unlocked apparatus | player-chosen | build and replay miniature causal machines | authored banter reacts to discovered combinations |
| 19 | Точная ложь | Investigation | two models matching the same early observations | discriminating outcome | the player creates the experiment that reveals the hidden variable | Шорох admits that confidence and evidence are different |
| 20 | Будущее на двоих | Finale | robust prediction under bounded uncertainty | a range, not one exact point | several physically valid endings coexist long enough to save the fox | its existence is no longer contingent on pretending certainty |

## Failure, recovery, and difficulty

- Wrong predictions do not kill the character. Colour drains, rain and leaves briefly reverse along their recorded paths, and the scene returns to the last stable state in under three seconds.
- The failed forecast remains as a faint discrepancy trace for the next attempt.
- Repeated failure first changes staging and camera emphasis, then offers the fox a test action, and only then offers an explicit hint. Hints describe a next experiment, not the solution.
- Optional precision routes and secrets create depth for advanced players; the main route accepts conceptual accuracy within a physically declared tolerance.
- Difficulty is controlled through number of coupled variables, forecast representation, and timing overlap—not by hiding controls or adding arithmetic volume.

## Content acceptance test

A room is rejected if any answer is “yes” to one of these:

- Would it still work if the physics object were replaced by a colored key?
- Can a player succeed through a tiny finite combination search without observing causality?
- Is the fox functioning only as a dialogue bubble?
- Is the explanation required before the player can act?
- Does the room need a bespoke full-screen illustration or a one-off animation system that cannot be reused? Reusable authored character cycles and short effect atlases are allowed.
- Does the visible simulation contradict the tested analytical model?
- Does progression depend on an extrinsic number instead of a new way of forecasting or acting?

## Open decisions

- Final title and name/trademark availability.
- Narrower age target after observed reading and motor behavior.
- Exact length and price after prototype and demand testing.
- Whether the final game includes Russian only or a language-neutral first slice.
- Which optional school-standard measurements are exposed without turning play into exam preparation.
