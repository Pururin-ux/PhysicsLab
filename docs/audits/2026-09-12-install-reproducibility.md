# PhysicsLab clean installation — 2026-09-12

Status: technical verification evidence and proposed integration plan, not
product-release acceptance. Working branch: `snapshot/astra-2026-09-09`,
HEAD `2d5a037`; earlier local instruction/document reconciliation preserved.

## Cause and ownership

The direct `@rolldown/binding-win32-x64-msvc@1.0.1` dev dependency first appears
in the available development history at `db48b6a` (2026-08-28), and in the
published clean lineage at `438061e` (2026-09-04), alongside Sites/Vinext/Vite
adapter dependencies. Those snapshot commits do not document the original
shell command or why it was added; a local workaround is not an established fact.

The locked ownership chain is:

```text
Sites/Vinext adapter + its Vite peer dependency
  -> vite 8.0.13
     -> rolldown 1.0.1
        -> optional platform bindings 1.0.1
```

Vite's installed metadata directly requires Rolldown. Rolldown already declares
Windows, Linux and other bindings as optional dependencies. The application's
extra direct Windows dependency made that package mandatory on Linux, producing
the previously confirmed `EBADPLATFORM`. No application import requires the
Windows package directly in the searched source/configuration.

## Final changes

- Removed only the direct Windows binding from `apps/web/package.json`.
  The binding remains locked with `optional: true`, owned by Rolldown.
- Pinned Node 22.23.2 in `.nvmrc`; documented the compatible Node 22 range in
  root/web engines. This remains within the existing Node major and satisfies
  Lighthouse's >=22.19 requirement. Node 22 remains a maintained LTS branch;
  [official release schedule](https://nodejs.org/en/about/previous-releases).
- Pinned npm 11.11.0 in root `packageManager` and root/web engines. All three
  CI jobs install that npm pin after setting up Node from `.nvmrc`.
- Regenerated root/web lockfiles with the pinned Node/npm from manifests and
  existing locks in isolated directories without `node_modules`.
- Updated README and current ARCHITECTURE with the installation contract.

No dependency package version, resolved archive, integrity hash, package count,
or `os`/`cpu`/`libc` constraint changed. The root lock diff updates engines; the
web lock diff updates its root manifest metadata and one optional flag.

### Why npm is pinned separately

Node 22.23.2 ships with npm 10.9.8. An initial lock regeneration with that npm
dropped `libc` metadata from 48 existing entries and changed dependency flags.
That result was rejected. npm 11.11.0 preserves the existing lock metadata and
supports this Node version; it is also the version already installed on Windows.
The final proof below uses npm 11.11.0 only. Preliminary npm 10 runs are not the
acceptance evidence for the final configuration.

Official Node archives were checked against their published SHA256 sums. The
npm 11.11.0 archive was checked against registry SHA512 integrity metadata.
No system-wide Node/npm installation was changed during this task.

## Verification actually performed

The final installations used separate empty project directories containing only
the root and web manifests/lockfiles. No existing `node_modules` was copied.
The npm cache could be reused; this was a clean dependency tree, not an
offline or cache-independent availability test.

Both used normal `npm ci` and `npm ci --prefix apps/web`, with only audit/fund
output disabled. Lifecycle scripts were enabled. No `--force`, platform
override, `--legacy-peer-deps`, omission of optional dependencies, or engine
bypass was used. `--ignore-scripts` was used only while generating lockfiles,
not during the clean-install acceptance runs.

| Environment | Root install | Web install | Narrow native check |
| --- | --- | --- | --- |
| Windows x64, Node 22.23.2 / npm 11.11.0 | passed, 1 package | passed, 672 packages | `import('rolldown')` exposes the expected function |
| Ubuntu/WSL Linux x64, Node 22.23.2 / npm 11.11.0 | passed, 1 package | passed, 673 packages | same native module import passed |

The native import checks the specific risk that removing the direct binding
would leave Rolldown without a usable platform binary. It is not a build,
adapter deployment test or product UI test.

No `EBADPLATFORM`, `EBADENGINE` or npm error appears in the final web logs.
An existing ESLint deprecation notice remains; it does not cause installation
failure and was not used as a reason for an unrelated upgrade.

Additional narrow checks:

- Root/web manifest declarations and lockfile root entries agree.
- SHA256 of both lockfiles is unchanged by either OS installation and agrees
  with the working checkout:
  - root: `e9abe9e9ea7563b6f3166a7c196f0487d51705cdb2a9f11fa775ae14754c54d1`
  - web: `e65c72f3d209d7be6e6600070c617dfb62b6b622859304519c94fa3996a999f0`
- CI YAML parses; all three jobs select `.nvmrc` and install the root npm pin
  before project dependency installation.
- Hash comparison preserved the preceding instruction edits; only README was
  intentionally extended with the now-correct installation instructions.

Logs and isolated Windows dependencies are under
`C:/Users/lalad/AppData/Local/Temp/physicslab-install-6e4f0d5b/`:
`final-windows-root.log`, `final-windows-web.log`,
`final-linux-root.log`, `final-linux-web.log`.
The final Linux dependency tree is
`/home/lalad/physicslab-install-6e4f0d5b/project` in WSL. These are local
verification artifacts, not files to add to the product repository.

### Boundaries

No application build, typecheck, unit/physics suite, E2E, visual/a11y check,
browser, production smoke or deployment was run. No new GitHub CI run was
triggered. Clean Ubuntu installation in WSL is real Linux evidence but is not
a run on a GitHub-hosted runner. macOS, ARM and Alpine/musl were not exercised.
System Node remains separate from the pinned project environment; developers
must select the README versions before running project commands.

The earlier integrity audit remains a dated pre-fix record. Its install blocker
and Node/Lighthouse mismatch are resolved by this change; its open repository
integration and ownership questions still apply.

## Recommended GitHub integration — proposal only

Fresh remote metadata still shows:

- origin/main: `fd13e59`;
- origin/snapshot/astra-2026-09-09: `92d72e0`;
- origin/audit/mio-2026-09-10: `82e7c02`;
- open PRs #25 (older source-only snapshot) and #2 (historical audit).

Current HEAD descends from origin/main. Therefore a normal new-branch PR can
preserve the existing clean lineage without force-push or rewriting main.

Recommended sequence after Sasha authorizes publishing:

1. Create `codex/reproducible-snapshot` from this current snapshot HEAD and
   preserve the reviewed local working state. Do not start from local `main`,
   which has a different old history. Do not wholesale-merge audit or pull
   snapshot's newer documents over the locally reconciled rules.
2. Stage an explicit allowlist, then make two reviewable commits: instruction/
   document reconciliation, followed by installation/runtime pinning and its
   evidence. Where README contains both changes, assign hunks deliberately.
   Include START_HERE and the two audit reports as documentation, not runtime.
3. Exclude nested repositories, PDFs, `.codex` environment state, generated
   install artifacts and other untracked data. The ignored Telegram skill is
   a separate tracking decision; do not silently force-add it. Tracked Vinext
   process state is a separately identified cleanup issue, not authorization
   to delete it in this task.
4. Before push, compare branch/base, changed files, app-source parity and
   reachable large blobs. This is a pre-publication check, not a demand to
   rerun the entire historical audit after ordinary edits.
5. Push the new branch and open a PR into origin/main describing the complete
   snapshot plus reconciled instructions and reproducible installation.
   Existing CI will run at that integration boundary. Resolve its actual
   failures within an explicitly agreed integration scope; current installation
   evidence is not a claim that all CI jobs will pass.
6. After review and suitable integration checks, merge normally into main.
   Keeping GitHub's default as main then makes it the current canonical state;
   no separate default-branch change is inherently required.
7. Only with Sasha's approval, close #25 as superseded and decide the fate of
   historical #2. Retain old branches unless their removal is explicitly
   authorized after ownership/history review. Local main/worktree alignment
   is also a separate non-destructive follow-up.

No branch, commit, push, PR, merge, force-push, closure or cleanup was performed.
Publishing/committing, merging main, PR closure, branch deletion, and tracking
currently ignored/untracked material require explicit authorization. The
proposed branch name is a recommendation, not an existing created branch.
