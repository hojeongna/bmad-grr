---
name: step-02-analyze
description: 'Give every AC a verification path — a Gherkin scenario or a named test; identify which can be developed in parallel'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-03-atdd-tdd-loop.md'
---

# Step 2 — Analyze

## Outcome

Every AC has a verification path recorded in the story file — a clean Gherkin scenario on the scenario track, a named test or an inspection note on the UI track. They are grouped by independence so the implementation loop can develop independent ones in parallel.

## Approach

### Convert ACs to Gherkin scenarios — scenario track

On the UI track skip this section and go to "Map ACs to tests" below.

For each AC, write a `Scenario:` block with Given/When/Then steps directly in the story file's Acceptance Criteria section. Existing prose ACs become the scenario title or are reformulated as Given/When/Then steps.

Guidelines:

- One scenario per AC. If an AC bundles two distinct behaviors, split it into two scenarios.
- Use domain language. Avoid UI mechanics ("click button") in favor of intent ("submit signup") unless the AC is specifically about UI behavior.
- A `Background:` section is fine for shared setup ("Given the user is logged in...").
- Keep scenarios runnable — every Given/When/Then phrase must be implementable as a step definition.
- For backend stories, scenarios target the public interface (HTTP endpoint, gRPC method, queue message) and assert both response and observable side-effects (DB row, emitted event, etc.).
- For frontend stories, scenarios target user-observable behavior (visible text, navigation, form state).

If an AC genuinely cannot be expressed as an executable scenario (e.g., "code is well-documented", "follows naming conventions"), mark it as a non-Gherkin AC in a clearly labeled list and note that it will be verified by inspection in step-04.

### Map ACs to tests — UI track

Do not rewrite the ACs. Leave them as the story author wrote them — `quick-story` renders them Given/When/Then, and that prose stays exactly as it is. What changes is that nothing here becomes a `.feature` file or runs under a BDD runner.

For each AC, name the test that will prove it and write that name under the AC in the story file, one line each:

- A component test, a unit test, or an integration test — in whatever the project already uses (Testing Library, Vitest, Jest, Playwright, etc.). Name the file it will live in.
- Where no automated test can reach the AC — visual fidelity, copy, layout, spacing — mark it for inspection instead, and say what will be inspected. `design-pass` is the usual instrument for that class of AC; point at it rather than inventing a check here.

An AC with neither a named test nor an inspection note is a gap. Close it here — step-04 verifies against this mapping and will have nothing to check otherwise.

### Independence analysis

For each pair of scenarios (or ACs, on the UI track), decide whether they can be developed independently:

- Different files / different modules / different endpoints → likely independent
- Shared data setup, shared schema migration, shared component → dependent
- One scenario's outcome is another's precondition → dependent

Group independent ones for parallel development in step-03. Those within a dependent group will be developed sequentially.

### Save and proceed

Save the updated story file. Communicate the scenario count (or the AC-to-test mapping on the UI track) and the parallel groups to the user briefly.

## Next

Load and follow `{nextStepFile}`.
