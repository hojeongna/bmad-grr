---
name: step-05-final-report
description: 'Finalize the QA report; present clear summary; halt at the decision menu (Stop / Refine / Dev / Elicit / Party)'
stateFile: '{output_folder}/qa-test-{date}.state.md'
refine_story_command: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
dev_story_command: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5 — Final Report

## Outcome

The QA report file contains the full session record (per-story results, fixes applied, deferred issues, overall pass rate, health assessment). The user sees a clear summary and chooses the next step: stop, chain into `refine-story` for deferred issues, chain directly into `dev-story` for known fixes, or expand the discussion via elicitation/party mode. The state file is marked completed with the chosen disposition.

## Approach

### Load and finalize

Read `{stateFile}` for all story results, fixes, deferred issues, and session metadata. Read the QA report to verify it's up to date.

Update the report's final summary section:

- **Header** — date, scope, app URL.
- **Per-story results** — test-case table per story (pass/fail/fixed/deferred per case).
- **Fixes applied** — complete list with file changes.
- **Deferred issues** — complete list with severity and suggested fixes.
- **Overall summary** — aggregate pass rate, health assessment.

### Present summary

For single story, show one summary table; for epic, show per-story rows plus an epic-level aggregate.

| Metric | Value |
|--------|-------|
| Stories tested | … |
| Total test cases | … |
| ✅ Passed | … |
| 🔧 Fixed during QA | … |
| ⏸️ Deferred | … |
| 🚫 Blocked | … |
| **Overall Pass Rate** | … % |

Plus total fixes applied and total deferred.

### Decision menu

Halt for input. Show context-appropriate options:

**With deferred issues**
- `[R]` Refine — chain to `{refine_story_command}` with the affected story (story doc already has the QA Feedback section).
- `[D]` Dev — chain directly to `{dev_story_command}` if the deferred issues are clear enough to implement.
- `[S]` Stop — end the session; deferred issues remain in the story doc and QA report for later.
- `[A]` Advanced Elicitation
- `[P]` Party Mode

**No deferred issues**
- `[S]` Stop — session complete.
- `[A]` Advanced Elicitation
- `[P]` Party Mode

### Execute the decision

- `R` → state status `COMPLETED-REFINE`, then load and follow `{refine_story_command}` with the deferred-issues story path. (For epic mode with multiple deferring stories, process them in order.)
- `D` → state status `COMPLETED-DEV`, then load and follow `{dev_story_command}` with the deferred-issues story path.
- `S` → state status `COMPLETED`. Tell the user "QA session complete" and where the report lives.
- `A` → execute `{advancedElicitationTask}` and re-display the menu.
- `P` → execute `{partyModeWorkflow}` and re-display the menu.
