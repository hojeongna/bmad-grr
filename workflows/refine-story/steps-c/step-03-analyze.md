---
name: step-03-analyze
description: 'Gap analysis between story documents and current state; per-story decision (modify vs create new); user-confirmed change proposal'
nextStepFile: './step-04-execute.md'
advancedElicitationSkill: 'bmad-advanced-elicitation'
partyModeSkill: 'bmad-party-mode'
brainstormingSkill: 'bmad-brainstorming'
---

# Step 3 — Analyze

## Outcome

For each loaded story, the gap between the story's AC/Tasks and the current implementation/feedback is identified. A per-story decision is reached: modify existing story vs create a new one. Specific change proposals (AC edits, task edits, new tasks, Dev Notes additions) are presented and the user has explicitly confirmed before any document changes happen in step-04.

## Approach

### Analyze the current state

With 3 or more stories, call the **Workflow** tool (or parallel `Agent` calls where the Workflow tool isn't available) with one `agent()` per story; with fewer, analyze them inline. Per story: load the story, check completed `[x]` vs incomplete `[ ]` tasks against the actual implementation, score AC satisfaction and task completion, and return structured findings `{story_key, gaps_found, tasks_affected, recommendation}`. When a story implicates another, pipeline another round over it and repeat until no new story surfaces (cap at 3 rounds). Aggregate the results.

If the cause of the gap is unclear (not surfaced in step-02 visual findings, not obvious from the diff), do a focused web search for related error patterns, framework behaviors, or known issues, and incorporate findings.

### Decide refinement approach per story

- **Modify existing** — original intent is correct but implementation diverged or AC needs tightening. Use for: result differs from expectation, bug fix, minor scope change.
- **Create new** — entirely independent improvement or feature. Use for: new feature request, additive enhancement, separate scope.

### Propose specific changes

For each story being modified, write the explicit edits — for example:

- `AC change`: AC-1 modified from `<old>` → `<new>`; AC-N added.
- `Tasks change`: Task 1.1 modified and **unchecked** `[ ]`; Task 1.N added; Task 2.1 unchanged `[x]`.
- `Dev Notes` addition: refinement reason, related visual findings.

For new stories, write title, AC, tasks, and the relationship to existing stories.

### Checkpoint — user confirmation

Present the full proposal in `{communication_language}`. Halt for input. If the user wants changes, adjust and re-present. Don't proceed to execution until the user explicitly confirms.

### Menu

After confirmation, offer `[A]` Advanced Elicitation, `[P]` Party Mode, `[B]` Brainstorming, `[C]` Continue. `A`/`P`/`B` invoke the `{advancedElicitationSkill}` / `{partyModeSkill}` / `{brainstormingSkill}` skill and return to the menu. `C` advances.

## Next

On `C`, load and follow `{nextStepFile}`.
