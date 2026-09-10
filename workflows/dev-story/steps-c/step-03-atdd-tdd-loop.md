---
name: step-03-atdd-tdd-loop
description: 'For each scenario or AC: write the failing acceptance test, drill down with TDD inner loop, verify it green'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-04-validate.md'
tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
tddAntiPatterns: '~/.claude/skills/test-driven-development/testing-anti-patterns.md'
subagentDrivenDevelopment: '~/.claude/skills/subagent-driven-development/SKILL.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
---

# Step 3 — ATDD-TDD Loop

## Outcome

Every acceptance check from step-02 is green — Gherkin scenarios under the BDD runner on the scenario track, the named tests on the UI track — every supporting unit was implemented through RED-GREEN-REFACTOR per the TDD skill's Iron Law, and the story file's Tasks/Subtasks reflect what was actually built.

## Loop Structure — scenario track

The outer loop is **acceptance** — driven by Gherkin scenarios. The inner loop is **unit TDD** — governed by the loaded TDD skill. Together they form ATDD: outer scenarios stay red until all required units exist; once outer turns green, the AC is genuinely done.

For each scenario (independent groups in parallel, dependent ones sequential):

1. Write or extend the project's `.feature` file(s) with the scenario.
2. Author step definitions sufficient to make the scenario executable. They will fail because the underlying behavior doesn't exist yet.
3. Run the BDD runner. Observe RED — confirm the failure is the expected one (missing behavior, not a typo or wiring error in the test itself).
4. Drill down — for each unit needed to satisfy the scenario, apply the TDD skill's RED-GREEN-REFACTOR cycle exactly. Watch each unit test fail, write minimal code to pass, refactor without adding behavior.
5. Re-run the BDD runner. Observe GREEN. If still red, return to (4) — diagnose what the scenario still needs.
6. Update the story's Tasks/Subtasks to reflect what was actually implemented. Add tasks if reality required them. Update File List as files are touched.

When all scenarios in the group are green, write technical decisions and notable surprises to the Dev Agent Record and move to the next group.

## Loop Structure — UI track

No `.feature` files, no step definitions, no BDD runner. The AC itself is the outer loop, carried by the test step-02 named for it.

For each AC (independent groups in parallel, dependent ones sequential):

1. Write the test step-02 named — component, unit, or integration, in the file step-02 named, using whatever the project already uses.
2. Run it. Observe RED — confirm the failure is the expected one (missing behavior, not a broken render harness or a bad selector).
3. Drill down — same TDD skill, same RED-GREEN-REFACTOR, for each unit the AC needs.
4. Re-run. Observe GREEN. If still red, return to (3) — diagnose what the AC still needs.
5. Update the story's Tasks/Subtasks and File List exactly as on the scenario track.

ACs that step-02 marked for inspection have no test to run here. Leave them for step-04 — do not invent an automated check to make them look covered.

When all ACs in the group are green, write technical decisions and notable surprises to the Dev Agent Record and move to the next group.

## Operational Rules

- **TDD skill governs the inner loop.** If its directives conflict with this file, follow the skill. RED must be observed before production code — non-negotiable.
- **Mocks are a last resort.** Before introducing a mock, read `{tddAntiPatterns}`. Mocking the system under test is forbidden.
- **Stay in scope.** Implement only what the current scenario (or AC) needs. Out-of-scope behavior surfaces as its own scenario or AC in step-02 (loop back if needed), not as a silent extra here.
- **3 consecutive failures on the same unit** → stop, surface the obstacle to the user, do not thrash.
- **Parallel groups** — when developing independent scenarios (or ACs) via subagents, give each subagent: the scenario text, or the AC plus the test step-02 named for it, the `{project_context}` path, the TDD skill path with explicit instruction to load and follow it, and a hard scope ("do not modify code outside this one's surface"). Collect results, resolve any file conflicts, then run the full BDD suite — or, on the UI track, the project's own test suite — to verify integration.
- **Optional rigor — context-isolated inner TDD.** For non-trivial implementations where the risk of "gaming the test" is real, load `{subagentDrivenDevelopment}` and follow it: dispatch separate sub-agents for the test-writer phase and the implementer phase, where the implementer never reads the test source code. The coordinator orchestrates, runs commands, and feeds only failure messages (never test source) back to the implementer. This is overkill for tiny tweaks but valuable for complex units where you want structural protection against test-fitting.
- **Verification before completion.** Before declaring any unit RED, GREEN, or REFACTOR-clean — and before declaring the scenario or AC green at the outer level — load `{verificationBeforeCompletion}` and follow it: actually run the test command in this turn, read the actual output, cite the evidence (test counts, exit code) in your status update. "Should pass" / "looks right" are red flags; run the command instead.

## Dry-run mode — scenario track

Not the same thing as the UI track: dry-run means scenarios exist but cannot be executed, while the UI track means there are no scenarios at all. If step-01 ended in dry-run (no BDD runner available), still author scenarios and step definitions completely. Verify each scenario by reasoning and exhaustive unit-test coverage of its underlying behavior. Document the gap in Dev Notes so step-04 flags it for follow-up.

## Next

When every scenario is green (or fully authored in dry-run), or every named test is green on the UI track, load and follow `{nextStepFile}`.
