# Research and product decisions v0.1

Status: decision memo based on a bounded public scan and current project context. No market dataset, player interviews, prototype telemetry, pricing test, or store-account verification exists yet. Treat every demand or retention statement below as a hypothesis.

## Executive decision

Proceed only to a **small Godot gray-box vertical slice** of the “pin a future” mechanic. Do not build the full campaign, commission a large asset set, or merge the concept into the existing PhysicsLab web app.

The current direction is differentiated enough to test because the same forecast simultaneously:

1. commits the player before observation;
2. predicts a real physical cascade;
3. becomes temporary traversal geometry;
4. changes a physically present companion's action and beliefs;
5. drives a two-state visual transformation of the same room.

It is not possible to prove that “nobody has ever created anything like it.” The defensible claim is narrower: the bounded scan found adjacent physics games, laser puzzles, systemic construction games, time-loop/automation games, and knowledge-gated exploration, but not this exact combination and core verb. Originality must be demonstrated by a playable interaction, not asserted from a pitch.

## User and buyer hypotheses

### Primary player

Russian-speaking teenager, approximately 12–17, with a phone and at least mild curiosity about puzzles, fantasy, or clever systems. They are not assumed to self-identify as “loving physics.” They want agency, surprise, competence, character attachment, and something worth showing a friend.

### Possible buyer

A parent may pay because the game has intellectual and educational value, but the purchase page must sell the player's experience honestly. A product designed primarily to reassure adults is likely to become the trainer skin the project is trying to avoid.

### Jobs to be done

- Player: “Give me a compact world whose rules I can master and bend into clever escapes.”
- Player: “Give me a companion and mystery I care enough about to continue.”
- Parent: “Offer screen time that is genuinely engaging and leaves transferable intuition without manipulation.”
- Creator: “Produce a coherent mobile game without requiring manual illustration or frame-by-frame animation from Sasha.”

These are working hypotheses and require interviews and behavioral observation.

## Adjacent products and the territory to avoid

| Adjacent product | What it demonstrates | Territory already occupied / lesson for us |
|---|---|---|
| [Newton's Fourth Law](https://store.steampowered.com/app/3023490/Newtons_Fourth_Law/) | a game can foreground real physics and calculations in a mysterious universe | do not center the pitch on repairing broken laws of physics or on calculation puzzles |
| [Proton & Electron Demo](https://store.steampowered.com/app/3356670/) | science concepts can inhabit a 2D platform adventure | “platform through a world repaired by a school topic” is not sufficient differentiation |
| [Elloveo](https://apps.apple.com/us/app/elloveo-a-science-game/id1437824301) | a mobile science game can use a coherent visual puzzle language | clarity and elegance matter; a generic fantasy overlay does not create novelty |
| [A Slower Speed of Light](https://gamelab.mit.edu/games/a-slower-speed-of-light/) | a physical phenomenon can transform the player's direct perception and movement | the strongest educational mechanics change what play feels like, not just what answer is entered |
| [Opus Magnum](https://www.zachtronics.com/opus-magnum/) | a small systemic grammar can produce expressive, multi-solution machines | depth should come from interacting primitives and visible execution |
| [The Last Clockwinder](https://www.playstation.com/en-us/games/the-last-clockwinder/) | planning followed by embodied execution can become spectacle | the cascade should be emotionally rewarding, not merely a result screen |
| [Outer Wilds](https://blog.playstation.com/archive/2019/10/08/explore-a-solar-system-that-resets-every-22-minutes-in-the-outer-wilds-out-this-month) | knowledge itself can gate exploration | progression can be new understanding and prediction capacity rather than XP |
| [Mirror Beam](https://play.google.com/store/apps/details?id=com.devtrox.laser.path.mirror.beam.reflection.puzzle) and [Glass](https://play.google.com/store/apps/details?id=com.cube3rd.glass) | laser/mirror manipulation is already a commodity mobile puzzle | a mirror room alone is a prototype, not a product identity |

## Originality mechanism

The novel center is not “fantasy + physics,” a mascot, or a hand-drawn style. It is the causal conversion:

```text
player-authored physical forecast
  → committed before observation
  → evaluated continuously against deterministic reality
  → accurate portion materializes as temporary traversal affordance
  → companion acts inside the same cascade
  → mismatch becomes both feedback and story
```

This links learning, game power, visual identity, and narrative stakes. Removing any one link weakens the differentiation:

- no commit: trial-and-error laser puzzle;
- no traversal payoff: interactive lesson;
- no deterministic physical model: fantasy puzzle with science decoration;
- no embodied companion: hint UI;
- separate forecast illustration: unscalable concept art rather than a game system.

## Why the active late-autumn direction can scale

The active «Осенний Предел» direction uses one modular living late-autumn scene for Stable Reality and Forecast Mode rather than mixing paper theatre, neon fantasy, depressive black-water horror, or cave/crystal imagery.

- Shared silhouettes and geometry keep authoring bounded.
- Material/gradient swaps, fog, rime masks, and code-rendered traces provide the state contrast.
- Bark, leaf banks, ruined plaster, roots, ironwork, moss, windblown foliage, and fog are families of repeatable modules whose irregular edges hide seams.
- Bold silhouettes remain legible on phones.
- A small soot/deep-olive/fog-cream/copper palette and a fixed warm diffuse light model provide consistency even when source assets are generated in batches.
- Character motion can come from normalized authored frame atlases, hidden-bone mesh/sprite rigs, cloth and tail springs, mask animation, and procedural secondary motion selected per state.

All earlier proof sheets are rejected as final style references; they validate decomposition or room readability only. The first technical art milestone is the «Осенний Предел» RGBA kit, anchors, an accepted reusable atlas/rig package, and an on-device scene that remains readable without bright cyan/orange contrast.

## Motivation and ethical engagement

Self-determination research on games supports focusing on competence, autonomy, and relatedness rather than coercion: [Przybylski, Rigby, and Ryan](https://selfdeterminationtheory.org/SDT/documents/2010_PrzybylskiRigbyRyan_ROGP.pdf). Research also supports the learning value of prediction and prediction error when followed by observation, including deeper conceptual learning in active prediction conditions: [prediction error and curiosity](https://pubmed.ncbi.nlm.nih.gov/26783880/) and [active prediction study](https://pmc.ncbi.nlm.nih.gov/articles/PMC12480893/).

Product translation:

- competence: readable causal chains, fast retries, increasing forecast resolution;
- autonomy: multiple solutions, optional wonder rooms, optional explanations;
- relatedness: Шорох is physically dependent on and changed by shared experiments;
- curiosity: every room opens with a visible contradiction or incomplete causal chain;
- surprise: familiar phenomena later interact across domains;
- anticipation: Forecast Mode lets the player imagine a spectacular execution before committing.

The request to “use every psychological trick” is deliberately bounded. The US FTC describes dark patterns as design practices that trick or manipulate consumers and has acted against unwanted purchases in games: [FTC dark-pattern report](https://www.ftc.gov/news-events/news/press-releases/2022/09/ftc-report-shows-rise-sophisticated-dark-patterns-designed-trick-trap-consumers) and [Fortnite order](https://search.ftc.gov/news-events/news/press-releases/2023/03/ftc-finalizes-order-requiring-fortnite-maker-epic-games-pay-245-million-tricking-users-making). Because the target includes minors, this project excludes coercive retention and deceptive monetization by design.

## Business model hypothesis

Preferred first test:

- free prologue plus the first short chapter;
- one transparent purchase for the rest of the authored game;
- no ads in play, no subscriptions for core content, no consumable currency, no random rewards;
- optional educator/parent context can exist outside the player's main loop, not on every room.

Why this is only a hypothesis:

- no pricing interviews have been conducted;
- no acquisition channel has been validated;
- Belarus payout/tax/account operations have not been verified end to end;
- willingness to pay for a Russian-language premium mobile puzzle game is unknown.

The vertical slice should test desire to continue before testing price.

## Product risks, signals, and decisions

| Risk | Earliest observable signal | Decision rule |
|---|---|---|
| game feels like homework | players call it a test/trainer or wait for instructions | change the core interaction before adding content |
| forecast is decorative | players ignore precision and still traverse | strengthen the mapping from forecast accuracy to geometry |
| trial-and-error dominates | repeated releases with no inspection of discrepancy | reduce combinatorial inputs and make causal contrast more legible |
| companion is UI | players refer to Шорох as “подсказка” and do not track its position | give it necessary physical agency and fewer explanatory lines |
| art is not scalable | each room needs repainting, inconsistent proportions, or manual cleanup | stop art expansion; fix modular generation/rig pipeline first |
| engine abstraction is false | circuit stress room needs a second lifecycle | refactor at room three or stop data-driven expansion |
| physics trust fails | any visible critical result contradicts the fixture | block release and fix the solver/presentation mismatch |
| mobile feel fails | text, targets, camera, or frame time fail on a low/mid Android device | reduce effects and interaction density before expanding scope |
| narrative overwhelms play | first cascade occurs after more than 90 seconds for most observed players | cut exposition and move story into action/reaction |

## Measurement plan

### Qualitative slice gate

Use observed uncoached sessions with at least five target-age players. This sample supports design diagnosis, not market-size claims. Record player explanations and behavior separately from anonymized event telemetry.

### First behavioral metrics

- time from launch to first controlled action;
- time to first forecast and first cascade;
- forecast edits before commit;
- discrepancy inspection before retry;
- retry latency;
- unprompted optional-route choice;
- voluntary start of the next room;
- transfer prediction in a new visual setup;
- words players use to describe the experience.

### Metrics after a distributable demo

Define but do not target-retrofit these until there is a baseline:

- prologue completion;
- chapter start and completion;
- day-1/day-7 return among consented, non-incentivized installs;
- percentage reaching a second solution or wonder room;
- hint offer/acceptance by room;
- purchase-page view and purchase conversion;
- refund/support reasons and device failure rate.

Retention alone is not success. A design that increases returns through coercion, confusion, or sunk-cost pressure fails the product principles.

## Plugin audit

The relevant installed tool bundles are already available and enabled:

- **Game Studio** — game foundations, UI, playtest, Phaser/web paths, and sprite pipeline;
- **Creative Production** — persistent art board, delegated image generation, and production QA;
- **Product Design** — user-context persistence, research, ideation, and design audit;
- **Build Web Apps** — useful only if the distribution decision moves toward Phaser/Capacitor or Telegram;
- **Data Analytics** — product hypotheses, measurement plan, KPI design, and later telemetry analysis.

No dedicated Godot or Flutter plugin was available through the callable plugin-management surface, and none of the currently recommended but uninstalled plugins is relevant to game/mobile implementation. Therefore no unrelated plugin was installed merely to satisfy an installation step. Codex plugin availability can depend on plan/workspace configuration: [OpenAI plugin documentation](https://help.openai.com/en/articles/20001256-plugins-in-codex/).

## Confirmed, inferred, unknown

### Confirmed in current context

- The existing PhysicsLab product is a Next.js/React web application and should remain intact.
- Sasha does not draw or animate and expects Codex to own a reproducible production pipeline.
- The selected visual direction is «Осенний Предел»: living painterly late-autumn dark fantasy, mysterious and melancholic without depressive grading, explicitly excluding paper puppets, cheerful luminous fantasy, anime/chibi cast, neon cyan/orange contrast, black-water horror, and cave/crystal imagery.
- Google currently lists Belarus for Google Play developer and merchant registration: [supported locations](https://support.google.com/googleplay/android-developer/answer/9306917?hl=en).
- Relevant game/design/production plugins are installed; no Godot/Flutter-specific plugin is callable.

### Design inference

- A side-view portrait causal adventure is more feasible and legible than free 3D exploration for a solo AI-assisted production.
- Godot is the best current fit for the selected game-first direction.
- A free demo plus one-time purchase is ethically and structurally aligned.
- The “pin a future” conversion is sufficiently distinct to justify one vertical-slice test.

### Unknown until tested

- whether the core cascade is fun;
- whether target players understand the forecast without coaching;
- whether they care about Шорох;
- whether the art pipeline survives actual alpha extraction, rigging, animation, and device rendering;
- whether the target audience will pay and at what price;
- acquisition cost and viable distribution channel;
- App Store enrollment/payout details for Sasha's exact situation;
- final campaign length and production time.

## Next decision

Review the GDD, stack, slice, and four proof images as one package. If the premise still feels right, approve only the first gray-box milestone: headless reflection fixtures plus Room 1 through its first complete forecast → cascade → traversal → discrepancy loop.
