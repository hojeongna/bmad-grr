---
name: step-02-analyze
description: 'Express each AC as a Gherkin scenario; identify scenarios that can be developed in parallel'
nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-03-atdd-tdd-loop.md'
---

# Step 2 — Analyze

## Outcome

The story's Acceptance Criteria section contains a clean Gherkin scenario for every AC, each one independently executable by the project's BDD runner. Scenarios are grouped by independence so the implementation loop can develop independent ones in parallel.

## Approach

### Convert ACs to Gherkin scenarios

For each AC, write a `Scenario:` block with Given/When/Then steps directly in the story file's Acceptance Criteria section. Existing prose ACs become the scenario title or are reformulated as Given/When/Then steps.

Guidelines:

- One scenario per AC. If an AC bundles two distinct behaviors, split it into two scenarios.
- Use domain language. Avoid UI mechanics ("click button") in favor of intent ("submit signup") unless the AC is specifically about UI behavior.
- A `Background:` section is fine for shared setup ("Given the user is logged in...").
- Keep scenarios runnable — every Given/When/Then phrase must be implementable as a step definition.
- For backend stories, scenarios target the public interface (HTTP endpoint, gRPC method, queue message) and assert both response and observable side-effects (DB row, emitted event, etc.).
- For frontend stories, scenarios target user-observable behavior (visible text, navigation, form state).

If an AC genuinely cannot be expressed as an executable scenario (e.g., "code is well-documented", "follows naming conventions"), mark it as a non-Gherkin AC in a clearly labeled list and note that it will be verified by inspection in step-04.

### Independence analysis

For each pair of scenarios, decide whether they can be developed independently:

- Different files / different modules / different endpoints → likely independent
- Shared data setup, shared schema migration, shared component → dependent
- One scenario's outcome is another's precondition → dependent

Group independent scenarios for parallel development in step-03. Scenarios within a dependent group will be developed sequentially.

### Save and proceed

Save the updated story file. Communicate the scenario count and parallel groups to the user briefly.

## Next

Load and follow `{nextStepFile}`.
