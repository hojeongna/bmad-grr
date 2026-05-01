---
name: step-03-atdd-tdd-loop
description: 'For each scenario: write failing acceptance test, drill down with TDD inner loop, verify scenario green'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-04-validate.md'
tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
tddAntiPatterns: '~/.claude/skills/test-driven-development/testing-anti-patterns.md'
subagentDrivenDevelopment: '~/.claude/skills/subagent-driven-development/SKILL.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
---

# Step 3 — ATDD-TDD Loop

## Outcome

Every Gherkin scenario from step-02 is green under the project's BDD runner, every supporting unit was implemented through RED-GREEN-REFACTOR per the TDD skill's Iron Law, and the story file's Tasks/Subtasks reflect what was actually built.

## Loop Structure

The outer loop is **acceptance** — driven by Gherkin scenarios. The inner loop is **unit TDD** — governed by the loaded TDD skill. Together they form ATDD: outer scenarios stay red until all required units exist; once outer turns green, the AC is genuinely done.

For each scenario (independent groups in parallel, dependent ones sequential):

1. Write or extend the project's `.feature` file(s) with the scenario.
2. Author step definitions sufficient to make the scenario executable. They will fail because the underlying behavior doesn't exist yet.
3. Run the BDD runner. Observe RED — confirm the failure is the expected one (missing behavior, not a typo or wiring error in the test itself).
4. Drill down — for each unit needed to satisfy the scenario, apply the TDD skill's RED-GREEN-REFACTOR cycle exactly. Watch each unit test fail, write minimal code to pass, refactor without adding behavior.
5. Re-run the BDD runner. Observe GREEN. If still red, return to (4) — diagnose what the scenario still needs.
6. Update the story's Tasks/Subtasks to reflect what was actually implemented. Add tasks if reality required them. Update File List as files are touched.

When all scenarios in the group are green, write technical decisions and notable surprises to the Dev Agent Record and move to the next group.

## Operational Rules

- **TDD skill governs the inner loop.** If its directives conflict with this file, follow the skill. RED must be observed before production code — non-negotiable.
- **Mocks are a last resort.** Before introducing a mock, read `{tddAntiPatterns}`. Mocking the system under test is forbidden.
- **Stay in scope.** Implement only what the current scenario needs. Out-of-scope behavior surfaces as its own scenario in step-02 (loop back if needed), not as a silent extra here.
- **3 consecutive failures on the same unit** → stop, surface the obstacle to the user, do not thrash.
- **Parallel groups** — when developing independent scenarios via subagents, give each subagent: the scenario text, the parent AC, the `{project_context}` path, the TDD skill path with explicit instruction to load and follow it, and a hard scope ("do not modify code outside this scenario's surface"). Collect results, resolve any file conflicts, run the full BDD suite to verify integration.
- **Optional rigor — context-isolated inner TDD.** For non-trivial implementations where the risk of "gaming the test" is real, load `{subagentDrivenDevelopment}` and follow it: dispatch separate sub-agents for the test-writer phase and the implementer phase, where the implementer never reads the test source code. The coordinator orchestrates, runs commands, and feeds only failure messages (never test source) back to the implementer. This is overkill for tiny tweaks but valuable for complex units where you want structural protection against test-fitting.
- **Verification before completion.** Before declaring any unit RED, GREEN, or REFACTOR-clean — and before declaring the scenario green at the outer level — load `{verificationBeforeCompletion}` and follow it: actually run the test command in this turn, read the actual output, cite the evidence (test counts, exit code) in your status update. "Should pass" / "looks right" are red flags; run the command instead.

## Dry-run mode

If step-01 ended in dry-run (no BDD runner available), still author scenarios and step definitions completely. Verify each scenario by reasoning and exhaustive unit-test coverage of its underlying behavior. Document the gap in Dev Notes so step-04 flags it for follow-up.

## Next

When every scenario is green (or fully authored in dry-run), load and follow `{nextStepFile}`.
