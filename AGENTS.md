# AGENTS.md

## Project role

You are working on PhysicsLab, an educational physics web app.

Your job is not just to make code pass tests. Your job is to protect physics correctness, student learning flow, visual clarity, and project stability.

## Default workflow

1. Inspect current state before editing.
2. Identify files, constraints, acceptance criteria, and anti-goals.
3. Keep every task narrow.
4. Do not rewrite architecture unless explicitly requested.
5. Do not touch unrelated files.
6. Do not commit or push unless explicitly requested.
7. If tests fail, diagnose root cause before changing code.
8. Do not skip tests, weaken assertions, or hide failures.
9. Do not self-approve visual quality.
10. Provide evidence: screenshots, runtime smoke, checks, and scope confirmation.

## Scope rules

Do not touch these unless the task explicitly allows it:

- physics logic
- graph mapping
- shared primitives
- package files
- config files
- unrelated pages
- mascot assets
- screenshot infrastructure

If a task allows only specific files, edit only those files.

## Physics rules

Physics correctness comes first.

Do not change formulas, sign conventions, graph mapping, units, coordinate definitions, or simulation logic unless the task explicitly asks for physics work.

If physics wording changes, preserve meaning and report the exact change.

## Visual/UI rules

For visual tasks:

- Use fresh screenshots.
- Check desktop, tablet, mobile 390px, and narrow mobile 360px.
- Do not solve layout problems only by shrinking padding.
- Improve hierarchy, composition, and learning clarity.
- Do not add mascot work unless explicitly requested.
- Do not claim production-ready without human review.
- End visual reports with: "Ready for human visual review; visual acceptance not self-approved."

## Testing rules

For implementation tasks, run:

- npm run check
- npm run test:physics
- npm run build
- npm run screenshots

If a full screenshot suite fails, isolate the failing case before editing.

## Final report format

For implementation tasks, report:

1. Files changed
2. Exact changes
3. Tests/checks run
4. Runtime smoke results
5. Screenshot paths when visual
6. Scope confirmation
7. Remaining risks
8. Commit/push status

## Commit rules

Do not commit or push unless the user explicitly asks.

When asked to commit:

1. Verify `git status --short`.
2. Verify expected changed files only.
3. Run final checks.
4. Commit only the accepted scope.
5. Push only after successful checks.
