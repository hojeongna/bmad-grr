---
name: step-04b-architecture
description: 'Architecture review after 3+ hypothesis failures — document findings, agree on new direction, restart investigation'
restartStepFile: './step-02-code-analysis.md'
nextStepFile: './step-06-wrapup.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4b — Architecture Review

## Outcome

Three or more hypotheses have failed; the architectural assumption is honestly questioned with the user, all failed attempts are documented in the story file or bug report, a new direction is agreed on, and the investigation either restarts from Level 1 with that new direction or closes the bug as unresolved (after multiple architecture reviews).

## Approach

### Surface every failed attempt

Read `{stateFile}` completely — every hypothesis with its level, evidence, and failure reason; every escalation tried; current debug logs in code; all prior architecture reviews.

### Honest discussion with the user

Present the failed attempts side-by-side and ask the fundamental questions:

- Are the failures clustered around the same module, or scattered? Scattered failures often mean the architectural assumption is wrong.
- Is each fix attempt making the system more complex without resolving the symptom?
- Would a refactor be cheaper than continued bug-hunting?
- Is there a structurally different approach that sidesteps the problem entirely?

This is collaborative, not unilateral. Wait for the user's input. Their domain knowledge often surfaces the answer here.

### Agree on a new direction

Once the user agrees the architecture needs to change, write the new direction concisely: what will be done differently, what lessons came from the failed attempts, how the next investigation should be scoped.

### Document in the bug record

Append to the story file or bug report (per `documentationTarget`):

```markdown
## Architecture Review [{date}]

### Failed Hypotheses
1. [Level 1] [hypothesis] → [reason]
2. [Level 2] [hypothesis] → [reason]
3. [Level 3] [hypothesis] → [reason]

### Architectural Issue Discovered
[concise description]

### New Direction
[what we will do differently]

### Lessons Learned
[carry forward into the restart]
```

### Persist progress

Update `{stateFile}`:
- Append to `architectureReviews`: `{ date, failedHypotheses, architectureIssue, newDirection }`
- Reset `lastEscalationLevel: 0`
- Add `step-04b-architecture` to `stepsCompleted`
- Append review summary to the Investigation Log

## Routing

Check `architectureReviews.length` in state.

- **First review**: present `[C]` Continue (restart from Level 1 with new direction), `[A]` `[P]`. On `C`, load and follow `{restartStepFile}`.
- **Second or later review** (we've already restarted at least once): present `[C]` Continue (try again with new direction), `[U]` Unresolved (close out and document), `[A]` `[P]`. On `U`, set `status: UNRESOLVED` in state and route to `{nextStepFile}` (wrap-up will document the unresolved closure).
