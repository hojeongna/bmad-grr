---
name: step-04-validate
description: 'Verify all scenarios green, run regression, inline health check, confirm AC satisfaction'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-05-complete.md'
---

# Step 4 — Validate

## Outcome

Every Gherkin scenario from step-02 passes under the BDD runner, the full project test suite passes (no regressions), basic code health is acceptable, every AC is verifiably satisfied (Gherkin or inspection), and Tasks/Subtasks marked [x] correspond to real, working implementations.

## Approach

### Acceptance verification

Run the full BDD suite for this story (or all scenarios if scoping by tag/path is awkward). Every scenario authored in step-02 must be green. Any scenario still red is a step-03 escape — return to step-03 and finish it.

### Regression

Run the project's complete test suite (unit + integration + BDD). All previously-passing tests must still pass. Regressions are blockers — fix before continuing, do not mark the story for review with regressions outstanding.

### Inline health check

Run the project's standard quality commands — typically type check, linter, dead-code detector. Use whatever the project actually exposes (`npm run typecheck`, `tsc --noEmit`, `mypy`, `ruff`, `eslint`, `golangci-lint`, etc.). If a command isn't configured, skip it — don't fabricate. Report results to the user briefly.

### Non-Gherkin AC inspection

For ACs marked in step-02 as non-executable, verify by inspection now: read the relevant code/docs, confirm the AC is met, write a one-line note in the Dev Agent Record explaining how it was verified.

### Task ledger reconciliation

Re-read the story's Tasks/Subtasks. Every checked item must correspond to working code. Every unchecked item must be either irrelevant (and explicitly noted as such) or done. The File List must reflect every file touched.

## On failure

If any of the above gates fail, document the specific failure in the Dev Agent Record and HALT — do not proceed to step-05 with a half-done story.

## Next

Load and follow `{nextStepFile}`.
