---
name: step-03-analyze
description: 'Gap analysis between story documents and current state; per-story decision (modify vs create new); user-confirmed change proposal'
nextStepFile: './step-04-execute.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
brainstormingWorkflow: '{project-root}/_bmad/core/workflows/brainstorming/workflow.md'
---

# Step 3 — Analyze

## Outcome

For each loaded story, the gap between the story's AC/Tasks and the current implementation/feedback is identified. A per-story decision is reached: modify existing story vs create a new one. Specific change proposals (AC edits, task edits, new tasks, Dev Notes additions) are presented and the user has explicitly confirmed before any document changes happen in step-04.

## Approach

### Analyze the current state

**Single story** — compare the story's AC and Tasks against the situation. Check completed `[x]` vs incomplete `[ ]` tasks. Identify what was implemented correctly, what diverged, and what's missing entirely.

**Multiple stories or epic** — dispatch one sub-agent per story for parallel analysis. Each sub-agent loads the story, scores AC satisfaction and task completion, and returns structured findings (`{story_key, gaps_found, tasks_affected, recommendation}`). Sequential fallback if sub-agents unavailable. Aggregate.

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

After confirmation, offer `[A]` Advanced Elicitation, `[P]` Party Mode, `[B]` Brainstorming, `[C]` Continue. `A`/`P`/`B` execute their respective workflows and return to the menu. `C` advances.

## Next

On `C`, load and follow `{nextStepFile}`.
