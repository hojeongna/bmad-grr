---
name: step-04-validate
description: 'Verify acceptance green, run regression, inline health check, confirm AC satisfaction'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-05-complete.md'
---

# Step 4 — Validate

## Outcome

Every acceptance check from step-02 passes, the full project test suite passes (no regressions), basic code health is acceptable, every AC is verifiably satisfied (by its scenario, by its named test, or by inspection), and Tasks/Subtasks marked [x] correspond to real, working implementations.

## Approach

### Acceptance verification

**Scenario track** — Run the full BDD suite for this story (or all scenarios if scoping by tag/path is awkward). Every scenario authored in step-02 must be green.

**UI track** — Run every test step-02 named for an AC. All must be green. There is no BDD suite to run; do not go looking for one.

Either way, anything still red is a step-03 escape — return to step-03 and finish it.

### Regression

Run the project's complete test suite (unit + integration, plus BDD where the project has it). All previously-passing tests must still pass. Regressions are blockers — fix before continuing, do not mark the story for review with regressions outstanding.

### Inline health check

Run the project's standard quality commands — typically type check, linter, dead-code detector. Use whatever the project actually exposes (`npm run typecheck`, `tsc --noEmit`, `mypy`, `ruff`, `eslint`, `golangci-lint`, etc.). If a command isn't configured, skip it — don't fabricate. Report results to the user briefly.

### Inspection-only AC verification

Some ACs have no test by design — non-executable ACs on the scenario track, and ACs step-02 marked for inspection on the UI track. Verify each by inspection now: read the relevant code, docs, or rendered screen, confirm the AC is met, and write a one-line note in the Dev Agent Record explaining how it was verified.

An AC that step-02 left with neither a test nor an inspection note is a step-02 escape, not something to wave through here.

### Task ledger reconciliation

Re-read the story's Tasks/Subtasks. Every checked item must correspond to working code. Every unchecked item must be either irrelevant (and explicitly noted as such) or done. The File List must reflect every file touched.

## On failure

If any of the above gates fail, document the specific failure in the Dev Agent Record and HALT — do not proceed to step-05 with a half-done story.

## Next

Load and follow `{nextStepFile}`.
