---
name: 'step-01b-continue'
description: 'Resume an interrupted QA test session from the last completed step'

stateFile: '{output_folder}/qa-test-{date}.state.md'
step02: './step-02-test-plan.md'
step03: './step-03-execute-and-fix.md'
step04: './step-04-story-wrapup.md'
step05: './step-05-final-report.md'
---

# Step 1b: Continue Previous Session

## STEP GOAL:

Resume an interrupted QA test session by reading the state file and routing to the correct step.

## MANDATORY SEQUENCE

### 1. Load State

Read the found state file completely. Extract:
- `lastStep` — which step was last completed
- `status` — should be IN_PROGRESS
- `currentStoryIndex` — which story we're on
- All accumulated results

### 2. Present Session Context

"**Resuming QA session from {date}**

- **Scope:** {scope}
- **Last completed step:** {lastStep}
- **Stories progress:** {completed}/{total}
- **Current story:** {current story title}
- **QA Spec:** {qaSpecPath or 'not yet created'}
- **QA Report:** {qaReportPath or 'not yet created'}

Continuing from where we left off..."

### 3. Route to Next Step

Based on `lastStep`:

| Last Completed | Resume At |
|----------------|-----------|
| `step-01-init` | `{step02}` — generate test plan |
| `step-02-test-plan` | `{step03}` — execute tests |
| `step-03-execute-and-fix` | `{step04}` — story wrapup |
| `step-04-story-wrapup` | `{step02}` (if more stories) or `{step05}` (if all done) |

Load, read entire file, then execute the determined step.
