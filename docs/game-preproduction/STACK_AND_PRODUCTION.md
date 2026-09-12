# Stack and production plan v0.1

Status: active vertical-slice implementation. Godot, the Android toolchain, and export templates are installed; the tested gray-box room is under `apps/game` and a signed arm64 debug APK has been exported.

## Decision

Use **Godot 4.7.2 stable + GDScript + Compatibility renderer**, Android native first.

This choice follows from the product, not from familiarity: the proposed experience is a 2D game with world-space interaction, deterministic cascades, layered scenes, hidden-bone sprite/mesh rigs, shaders, audio, and mobile export. It is no longer a mostly textual app with a few simulations.

Official references:

- [Godot release archive](https://godotengine.org/download/archive/)
- [Godot 2D skeleton documentation](https://docs.godotengine.org/en/stable/tutorials/animation/2d_skeletons.html)
- [Android export](https://docs.godotengine.org/en/latest/tutorials/export/exporting_for_android.html)
- [iOS export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html)
- [SVG importer](https://docs.godotengine.org/en/stable/classes/class_resourceimportersvg.html)

GDScript is preferred over C# for the first release because the Godot Android export documentation still marks C# mobile export as experimental. The Compatibility renderer is the safest first target for a broad Android range; visual quality comes from composition, texture, masks, and restrained effects rather than expensive 3D lighting.

## Alternatives considered

| Option | Strong fit | Cost in this project | Verdict |
|---|---|---|---|
| Godot + GDScript | 2D scene authoring, animation state machines, shaders, input, audio, native mobile export, editor-visible levels | a new runtime beside the current web app; Codex must own the asset tooling and engine setup | **Chosen for slice** |
| Flutter + Flame | app-shell UI, Dart, mobile distribution, simple component game loop | more custom work for mesh/sprite animation, scene tooling, authoring, and game-state visualization | fallback if the product returns to text-heavy lesson screens |
| Phaser + TypeScript + Capacitor | reuses web knowledge, fast browser/Telegram prototype, mature 2D web engine | primary runtime remains a web view; native mobile feel and asset/device QA become a wrapper concern | fallback if Telegram/web becomes the primary channel |
| Existing Next.js app | preserves current PhysicsLab stack and typed web physics | wrong product boundary for a game-first dungeon; risks turning the game back into a trainer | keep intact as a separate product |

References for the alternatives: [Flame documentation](https://docs.flame-engine.org/latest/index.html), [Phaser documentation](https://docs.phaser.io/), and [Capacitor documentation](https://capacitorjs.com/docs).

## Repository boundary

The existing `apps/web` remains unchanged. If the slice is approved, create a separate package:

```text
apps/game/
  project.godot
  src/
    core/                 deterministic clock, events, saves, accessibility
    physics/
      geometry/
      optics/
      mechanics/
      circuits/
      thermal/
      waves/
    gameplay/
      room/
      forecast/
      cascade/
      traversal/
      companion/
    presentation/
      puppet/
      camera/
      fx/
      audio/
      ui/
    content/
      chapters/
      dialogue/
      beliefs/
  assets/
    source/               immutable generated/source assets
    normalized/           cropped RGBA parts with pivots
    atlases/              packed runtime textures
    materials/
    audio/
  tests/
    unit/
    fixtures/
    golden/
  tools/
    asset_normalizer/
    atlas_builder/
    room_validator/
```

Do not share runtime code directly between Next.js and Godot. Share versioned, implementation-neutral fixtures and schemas where useful.

## Simulation architecture

Teaching-critical outcomes use deterministic analytical solvers. The engine's general-purpose rigid-body physics is limited to secondary motion and visual debris.

```text
RoomDefinition
  → apparatus parameters
  → deterministic domain solvers
  → ordered CausalEvents
  → ForecastEvaluator
  → pinned geometry / traversal window
  → presentation adapters
```

Examples:

- optics: ray/segment intersection, vector reflection, Snell refraction, absorption events;
- mechanics: forces, torque, constrained motion, pulley relations, projectile paths;
- circuits: graph-based DC solution and component state;
- thermal: explicit lumped heat-capacity models with declared assumptions;
- waves: parameterized propagation, reflection, and standing-wave geometry.

Use a fixed simulation step (`60 Hz`) and an event log with stable ordering. A replay must reproduce the same causal event sequence from the same room data and player inputs.

For reflection, the tested vector relation is:

```text
r = d - 2(d · n)n
```

For a fixed incident ray, rotating a plane mirror by `α` rotates the reflected direction by `2α`. This relation receives a visible golden fixture before any art is attached.

## Room data contract

Author rooms as typed Godot `Resource` files for editor usability, with a canonical JSON export for validation and golden tests.

```text
RoomDefinition
  id
  schema_version
  world_bounds
  start_state
  goal_state
  apparatus[]
  editable_parameters[]
  forecast_contract
    type: point | path | order | timing | distribution | interaction
    target
    tolerance_model
    pin_mapping
  fox_actions[]
  causal_links[]
  traversal_plan
  dialogue_beats[]
  accessibility_overrides
  fixture_ids[]
```

Scripts may introduce a new domain solver or presentation behavior. Individual rooms may not fork the room state machine or add one-off physics inside scene scripts.

## Two visual states from one scene

Stable Reality and Forecast Mode must use identical transforms, collision geometry, animation state, camera, and apparatus state.

- Stable Reality material: painterly sprites with bark/cloth grain, deep olive shade, warm fog-cream sky light, sparse copper/rust foliage, and low-frequency fog/parallax. The mood is autumnal and mysterious, not bleak or cave-like.
- Forecast material: reduced-saturation soot silhouettes, fog-bone leaf-vein/rime traces, muted dried-rowan divergence marks, direction hatching, and stronger local value separation.
- The transition is a 180–260 ms material and lighting change plus a short audio cue; it never loads a second illustration.
- Rays, normals, vectors, circuit paths, trajectories, timing bands, and labels are code-rendered overlays.
- Color is redundant with shape: accurate predictions use continuous vein motifs with closed nodes; uncertainty or dangerous transfer uses broken branches and triangular notches.

The current concept images prove a coherent visual direction only. They do **not** prove runtime modularity. That gate passes only when one Godot scene switches between both states without replacing its geometry.

## Scalable art pipeline owned by Codex

Sasha is not expected to draw, rig, or clean assets manually.

1. **Art bible:** lock the «Осенний Предел» palette, value hierarchy, painterly edge treatment, warm diffuse light direction, character proportions, environment material families, and forbidden motifs.
2. **Canonical references:** one hero turnaround, one fox turnaround, expressions, scale reference, and four approved action silhouettes.
3. **Generate by families:** a room-kit batch, a prop batch, and a character-part batch; never a new full-screen image per level.
4. **Normalize:** crop, remove backgrounds, preserve alpha, match scale, create padding, and name deterministically.
5. **Annotate anchors:** record pivot, attachment points, collision proxy, depth band, and material tags in a sidecar manifest.
6. **Prepare animation source:** choose per asset between a clean reusable frame atlas, a `Skeleton2D` rig, or a hybrid; expose equipment/hand/ground/contact anchors either way.
7. **Animate:** use `AnimatedSprite2D` for authored locomotion and reactions, `AnimationPlayer`/`AnimationTree` for state blending and rigs, IK where useful, and scripted secondary motion only for parts such as ears, cloth, foliage and pendant. A static sprite moved with a sine wave is never accepted as a character animation.
8. **Atlas:** pack chapter assets, keep immutable sources, and produce reproducible atlases.
9. **QA:** automated alpha/bounds/pivot checks, then real-device screenshots and motion capture.

Generated video is excluded from runtime. Reusable frame-by-frame strips are allowed for character locomotion/reactions and small effects when their silhouette, contacts, scale, padding and identity pass the automated and visual gates in `PRODUCTION_PIPELINE.md`.

## Character rig scope

### Hero

Reusable parts: angular face base, fixed three-peak cropped-hair silhouette, eyes/brows, mouth, weighted shoulder cape, asymmetric weather coat panels, tool arm and crescent gauntlet, upper/lower arms, hands, thighs, shins, boots, coat lining, and two forecast overlays. Earlier red-cloak and bright-luminous figures validate only decomposition and are not character references.

Minimum animation library:

- idle variants;
- walk and short run;
- stop and turn;
- reach, rotate, pull, push, brace;
- crouch, stumble, fall, land;
- enter/exit Forecast Mode;
- two quiet relationship poses and three room reactions.

### Шорох

Reusable parts: head, long muzzle, torn/whole ears, narrow soot-black torso, pelvis, upper/lower legs, three complete paws, one indistinct/rime-edged forepaw pair, one multi-segment ragged tail, fog eyes, sparse russet underside, three delayed tail-afterimage emitters, and causal-vein overlay. The rig and assembled poses must remain unmistakably fox-like at phone scale.

Minimum library:

- idle, sniff, look, ear flick;
- walk, scamper, leap, land;
- hold, block, carry, trigger;
- propose, doubt, startled, revise, trust;
- shadow dissolve/reform using a mask rather than generated video.

When a state uses a rig, keep it to roughly 8–14 deforming/transform bones. When a state uses an authored atlas, preserve common sockets, contacts, padding and identity across frames. Capes, ears, pendant and tail may use a deterministic damped-spring layer driven from the authored pose.

## Environment kit

Build rooms from reusable side-view modules:

- mossed stone floor segments, root shelves, leaf banks, ravine ledges, and fog-softened depth edges;
- ruined observatory walls, weather-dark timber, broken plaster, and iron braces;
- arch halves, lens mounts, narrow bridges, ledges, gaps, and stairs;
- bare-branch foreground occluders, reed/grass clusters, fog bands, and distant forest silhouettes;
- mirror, prism, lens, absorber, lamp;
- lever, pulley, counterweight, scissor lift, rail;
- wire, switch, lamp, resistor, coil, magnet;
- water tank, float, heater, resonator, membrane;
- one chapter-specific hero prop and one narrative landmark per room, using autumnal materials rather than gemstones.

Each module has a physics-neutral visual shell and separate functional nodes/colliders. Ornamental silhouettes never masquerade as interactive objects.

## Mobile production budgets for the slice

These are initial engineering constraints, not measured final limits:

- logical viewport: `390 × 844`, portrait, safe-area aware;
- target: stable `60 fps`; offer a `30 fps` battery mode;
- first device tier: mid/low Android with the Compatibility renderer;
- at most 5 parallax depth bands in a room;
- at most 2 chapter atlases of `2048 × 2048` resident for the slice, plus UI/effects atlas;
- cap simultaneous code-rendered causal traces and particles through pooled nodes;
- vertical-slice install target: under `50 MB`; stretch target under `30 MB` after measurement;
- room restart: under `300 ms` once assets are warm;
- no network requirement after installation;
- no full-screen raster background larger than necessary for its parallax band.

Budgets become contractual only after profiling on named devices. Visual ambition is reduced before simulation clarity or input latency.

## UI and accessibility

- The playfield occupies at least 82% of the portrait screen in normal play.
- The persistent controls are pause, Forecast/Pin, and one context-sensitive fox cue. Object controls live next to their object.
- No currency bar and no home-screen dashboard during a room.
- Body text is limited to two short lines during play; longer notebook material is optional and outside the cascade.
- Touch targets are at least 48 logical pixels and stay clear of device safe areas.
- Support scalable text, reduced motion, screen shake toggle, high-contrast causal traces, haptics toggle, and independent music/effects/dialogue levels.
- Physics meaning must never be encoded by color alone.

## Test gates

1. Domain unit tests and authored analytical fixtures pass.
2. Room schema validation rejects missing forecast targets, cycles without delays, and unbound fox actions.
3. Replay determinism test produces identical ordered events and end state.
4. Forecast scoring has boundary tests around every tolerance transition.
5. Stable/Forecast screenshots use the same scene transforms.
6. Rig QA checks part names, pivots, bounds, and missing animation tracks.
7. Portrait layouts pass at narrow, standard, and tall aspect ratios.
8. A real Android build meets the measured frame-time and memory budget before adding another chapter.

## Distribution notes

Google currently lists Belarus as supporting both developer and merchant registration for Google Play; this still requires a real account/payment verification before relying on it operationally: [Google Play supported locations](https://support.google.com/googleplay/android-developer/answer/9306917?hl=en).

Apple's enrollment documentation notes that developer-program availability can be region-dependent but does not settle every Belarus operational detail on its own: [Apple Developer enrollment](https://developer.apple.com/help/account/membership/program-enrollment). Treat iOS enrollment, contracts, tax, and payout as a separate pre-release check.

## Stop conditions

Pause expansion if any of these remain true after the slice:

- the cascade is less enjoyable than merely solving the apparatus;
- players describe the experience primarily as a quiz or trainer;
- a second physics family requires a second room engine;
- the art cannot be assembled from transparent modular assets without manual repainting;
- a wrong forecast is visually indistinguishable from an engine bug;
- measured Android performance requires removing the two-state visual identity.
