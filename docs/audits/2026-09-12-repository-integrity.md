# PhysicsLab repository integrity — 2026-09-12

Status: dated repository evidence, NOT product CANON or authorization to resume
product work. Scope: repository, instructions, ownership and reproducibility.

No browser, screenshots, E2E, visual/a11y suite, application tests, build or
dependency installation was run. GitHub metadata and existing CI logs were read;
no PR or remote branch was changed. `fetch origin` did not prune remote refs.

## A. What is already consistent

- Next.js/npm is the canonical web runtime. Root scripts delegate to `apps/web`;
  root and web manifests match their lockfile root dependency specifications.
- Decisions 0001–0003 separate web, game, archives and optional adapters.
  `docs/archive/README.md`, `docs/content/README.md` and
  `docs/exam-reference/README.md` distinguish history, hypotheses and references
  from current requirements. Their existence is not a conflict.
- The four instruction files reconciled in the preceding task already preserve
  risk-based verification, continuity first and Mio's approved identity.
- Broad CI/release checks and decision 0004's persistence acceptance concern
  integration or a particular critical flow. They do not require a browser
  after a routine copy/style edit and were not removed.

## B. Real conflicts and corrections

| Finding | Correction in this task |
| --- | --- |
| PRODUCT requires a render after every visible edit, all themes/viewports | Replaced with the risk-based QUALITY contract requested by Sasha |
| QUALITY defaults every scoped implementation to `verify` | Verification now targets a concrete failure mode; command list is a catalog |
| AGENTS had to override those CANON texts indirectly | Removed the temporary override and linked the aligned QUALITY contract |
| README describes only an exam trainer and misplaces Playwright in the root package | Aligned description with PRODUCT and actual manifests; documented install limitations |
| RELEASE_GOAL calls the first Mio investigation/notebook only planned and the approved image still undecided | Distinguished implemented scenario/notebook, planned collection and separately reviewed new assets; no release or learner-efficacy claim |
| Missing START_HERE entry point | Added a small linked index; no requirement to read all current documents or inspect every edit |
| Visual references still prescribe Nova, recurring cats and dark-only identity | Replaced those prescriptions with the current Mio/theme contracts; scoped review criteria |
| Visual skill UI prompt requires desktop AND mobile and its short description has invalid text encoding | Replaced with a readable, scoped review prompt |
| NOVA.md directs new Nova integration and documents obsolete asset paths | Marked historical role, corrected current path mapping, forbade treating names as approval |
| Design-sync conventions/readmeHeader can carry old product styling and unconditional resync instructions | Limited these documents to the selected preview workflow and current document authority |
| Telegram skill points outside this repo to missing folders and routes to a now web-specific design skill | Pointed to existing repository-relative channel folders; removed cross-product design routing |

Available global instructions were inspected at
`C:/Users/lalad/.codex/AGENTS.md`, as well as instructions supplied to this
session. They support narrow context, grouped edits and proportional checks.
Older memory guidance still says to inspect every web change before/after;
it is superseded historical guidance, not a competing current mandate. No
global instruction or memory file was edited.

## C. History and uncertain areas

### Ownership and reachability

| Zone | Observed classification | Limit / decision |
| --- | --- | --- |
| `docs/archive/` | 23 tracked historical documents with explicit archive notice | Preserve as evidence |
| `legacy/` | 206 tracked files: earlier CRA/backend, Astro and prototypes | Outside canonical web root/commands; preserve history |
| `components/coach/Nova*`, CoachAvatar, CoachBubble | Legacy component cluster; CoachBubble imports NovaReaction; no caller from searched app/components/lib beyond that cluster | Candidate migration debt, not proof that every related asset is dead; no removal |
| `StudyDeskHero` | Definition found, no caller in searched app/components/lib; current home imports HomeEditorial | Old composition/reference, not current homepage authority |
| `public/mascot*` and `public/art/production` | Old assets coexist with current art; Nova modules actually map to `/art/production/tutor-*.webp` | No exhaustive asset/string/dynamic import analysis; not deletion-ready |
| `.design-sync/` | 52 tracked files: config, previews, CSS/fonts; config embeds conventions via readmeHeader | Optional preview workflow, real consumers exist |
| `.ds-sync/`, `ds-bundle/` | Ignored local packaging/tool runtime and generated output | Not required by root Next.js commands; clean-clone preview reproducibility not established |
| `apps/web/.ds-*` | Tracked generated entry, preview surface and 61 CSS/font files | Config points to these assets; generated does not mean unused |
| `apps/web/.vinext/` | 14 tracked files including fonts/styles and one process lock | Lock stores local process state despite ignore rule; audit branch removed it. No deletion here; adapter font consumers not fully traced |
| `Новая папка/` | Tracked standalone HTML/CSS/JS physics prototype; 3 blobs, 15,775 bytes in Git | Uses CDN Tailwind/p5; outside Next.js entry. Physical Windows file sizes differ due to line endings. Preserve/reference or archive placement is a user decision |
| `apps/game/` | Separate Godot project, 644 tracked files, own README/project file/tools | Separate product, not a conflicting web implementation |
| `PhysicsChannelKit/` | Two tracked npm manifest/lock files; local tool dependencies | Separate channel tooling; not web runtime |
| `PhysicsChannelOutput/` | 89 tracked files including authored output, drafts, character references and pipeline | Not disposable merely because some images were generated |
| `snapshots/` | Tracked archival manifest pinning the nested repository commits | Useful provenance, explicitly not instructions |
| `.next`, test-results, artifacts/output, game builds | Local generated/ignored output in the inspected layout; game builds have no tracked files | Not clean-clone prerequisites for Next.js source; nothing deleted |

Current HEAD's largest blob is about 4 MB. That does NOT establish that every
old branch/history is free of large objects: all-history blob traversal was
outside this bounded audit. Game art and channel images are substantial owned
assets, not an automatic cleanup target.

### Local untracked paths

| Path | Classification / evidence |
| --- | --- |
| `.codex/` | Local Codex environment definition: setup invokes the two npm installations; named dev/type/physics actions. No secrets observed in that file; not application data |
| `PhysLabProt/` | Independent nested Git repo, clean at `8a78905`; origin `Pururin-ux/PhysLabProt`; backend/frontend and research PDFs, not a parent submodule |
| `physics-lab-ui/` | Independent nested Git repo, clean at `7dfbac1`; origin `Pururin-ux/physics-lab-ui`; own Next/package/pnpm lock and local build/dependencies, not a parent submodule |
| `catalog-1227.pdf` | Local textbook reference, 214 PDF pages; title extracted directly from PDF page 7 says grade 9, 2026 |
| `catalog-980.pdf` | Local textbook reference, 173 PDF pages; SHA256 matches the existing source register; title/paragraph evidence also retained in the Adobe text extraction |

Both nested HEADs match the tracked snapshot manifest. They are separately
owned source repositories, not proven redundant copies. Neither they nor the
PDFs/environment were staged or deleted.

PDF SHA256 values:

- catalog-1227: `25a2294694ecd4376bd28e6ffb3528de15d3f962fc2cbd1e1c9c3ca4ec5b792b`
- catalog-980: `d9cee3ba898f11ba1008ab4093c3fa5bb79941b213fbe6dfb8dfbfae53aaed78`

The `physics9Book` URL containing `Fizika_8kl` is therefore NOT evidence of a
wrong grade: the local source PDF is a grade 9 textbook. Its URL was not
changed or re-fetched; freshness of the remote bytes was not established.
The earlier audit's unresolved filename concern is historical uncertainty,
not a product defect to reproduce blindly.

### Remaining uncertainty

- LEARNING_MODEL requires a separate product decision for physics/validation/
  persistence/progression changes; RELEASE_GOAL permits autonomous product
  development. This can mean a documented decision rather than extra user
  permission, so it is not proof of a blocking contradiction. No learning
  policy was rewritten.
- Telegram-specific third-party skill availability and full pipeline operation
  were not verified; only the broken local paths and scope crossing were fixed.
- New files under frontend-design and physics-telegram-creator still match
  `.gitignore`; existing tracked frontend files remain tracked. Telegram skill
  edits are local ignored edits, so they will not travel with a normal commit.
  Changing ignore/tracking policy was left for a separate repository decision.

## D. Why there is no single published working state yet

### Branches and PRs

Observed lineage:

```text
origin/main fd13e59 (2026-08-17)
  -> clean redesign 438061e
  -> source-only ca820ef (PR #25)
  -> product snapshot 8eea592
  -> local snapshot HEAD 2d5a037
  -> documentation 62038dc -> origin/snapshot 92d72e0
  -> audit/instruction commits -> origin/audit 82e7c02
```

The current product source is on the snapshot lineage. Between local HEAD and
audit HEAD, the only `apps/` differences are `NOVA.md` and deletion of
`.vinext/dev/lock.json`: audit does not contain a newer application
implementation. Current local instruction edits are uncommitted.

Even the remote audit branch is not instruction-consistent by itself: its
START_HERE protocol still requires before/after renders and both themes and
viewports, while its newer AGENTS/skills reject that ritual. Its PRODUCT and
QUALITY retain the old rules corrected locally in this task. Importing that
entire branch later without reconciliation would reintroduce the conflict.

GitHub still defaults to `main`. Local `main` is instead `e41fa8b`, diverged
from origin/main by 168 local-only and one remote-only commit. It is historical
work, not an interchangeable spelling of the published main branch.

- [PR #25](https://github.com/Pururin-ux/PhysicsLab/pull/25): source-only
  `ca820ef` into main; mergeable but UNSTABLE, all three CI jobs failed during
  installation. It predates the current snapshot, so merging it alone would
  not publish the current product.
- [PR #2](https://github.com/Pururin-ux/PhysicsLab/pull/2): old repository
  assessment draft, CONFLICTING. Useful historical review; not a current
  integration plan. Neither PR was closed or modified.

The live origin has 15 branches. `git branch -r` also shows 18 cached tracking
refs absent from `git ls-remote --heads origin`; these are not 18 still-open
remote branches. No prune was performed.

| Live branch group | Assessment |
| --- | --- |
| main, snapshot, audit | Baseline, current product lineage, subsequent document audit respectively |
| source-only and clean redesign branches | Ancestors of current snapshot; useful integration history |
| high-fidelity-formula-card, interactive-platform-redesign, physlab-v3-test-template, v3-next-iteration | All four remote heads point to the same old `1899696` baseline despite feature names; stale labels, not four independent current products |
| architecture/monorepo-direction, feature/accelerated-motion-v2, copilot/research-physicslab-repository | Older divergent histories with unique commits; age alone does not prove all useful work was incorporated |
| copilot/research-project-structure-analysis | Old divergent assessment, PR #2 |
| arena/01a04886-physicslab, audit/quick-wins-2026-08 | Earlier experiments/fixes with unique commits; no proof of patch equivalence or safe deletion |

Additional worktrees exist: a clean-source checkout at `ca820ef`, and a detached
checkout at `e41fa8b` with an untracked learning-component directory. They were
not changed and must not be treated as fully synchronized with this checkout.

### Installation reproducibility

1. **Confirmed blocker:** direct non-optional
   `@rolldown/binding-win32-x64-msvc@1.0.1` in web package/lockfile. Installed
   npm's `checkPlatform` rejects the current metadata on linux/x64 with
   `EBADPLATFORM`, and accepts the win32/x64 control. The existing
   [CI run 33877739048](https://github.com/Pururin-ux/PhysicsLab/actions/runs/33877739048)
   independently records the same installation failure. This task did not run CI.
2. **Confirmed engine mismatch:** `.nvmrc` / CI uses Node 22.18.0; the locked
   Lighthouse requires >=22.19. With observed local `engine-strict=false`, this
   is an engine warning/unsupported tool runtime, not the demonstrated fatal
   install cause. Local Node is 24.14.1, so local success would not establish CI
   parity. No Node or dependency configuration was changed.
3. Root and web dependency declarations match their lockfile root entries;
   resolved HTTP package URLs use registry.npmjs.org. This narrow metadata
   check is not proof of a complete clean installation on either OS.
4. CI is triggered for main pushes/PRs into main. No CI verification for the
   current snapshot/audit heads was established; green older/default runs do
   not validate them.
5. Optional adapters bring required development dependencies into ordinary web
   installation even though their product role is optional. Separating them
   is an architectural choice, not an automatic audit correction.

## E. Minimal next steps and final boundary

1. Review the document-only reconciliation. Keep the risk-based workflow and
   current authored product decisions; no new visual direction is needed.
2. As a separate technical task, correct the direct platform binding and
   Node/Lighthouse mismatch, regenerate the relevant lockfile coherently, and
   verify clean installation on Windows and Linux. Do not bypass using --force.
3. Choose one published integration branch based on the current snapshot plus
   reviewed instruction/doc changes. Decide separately how PR #25 and the
   GitHub default branch should reflect it. No automatic merge/force-push.
4. Decide whether to track portable local skills/environment configuration and
   where source PDFs and nested projects belong. Preserve original data.
5. Only then consider targeted legacy/process-state cleanup based on ownership
   and actual consumers. Do not delete branches because their names look old.

Files edited in this task: AGENTS, README, current PRODUCT/QUALITY/RELEASE_GOAL,
new START_HERE, visual-verdict SKILL/UI metadata/two craft references,
design-sync NOTES/conventions, coach NOVA.md, and the local ignored Telegram
SKILL. This audit report is new. The preceding task's frontend-design and
acceptance-contract changes were preserved without further edits.

No application code, package/lockfile, CI/config runtime, product CANON choice,
legacy data, branch, PR or index was changed. The YAML change is skill display
metadata only. Conflicting instruction wording is reconciled locally; there
is still no single synchronized published checkout, and clean cross-platform
installation remains blocked.
