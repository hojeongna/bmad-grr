---
name: step-05-fix
description: 'Implement the root-cause fix, verify with DevTools, loop back to the appropriate level if verification fails'
nextStepFile: './step-06-wrapup.md'
loopBackFiles:
  level-1: './step-02-code-analysis.md'
  level-2: './step-03-debug-logs.md'
  level-3: './step-04-web-search.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5 — Fix

## Outcome

The confirmed root cause is fixed with a single focused change (no bundled refactoring, no "while we're here" cleanups). The fix is verified in the actual application via Chrome DevTools (frontend) or direct testing (backend). If verification succeeds, the workflow advances to wrap-up; if it fails, the workflow loops back to the escalation level that produced the (apparently false) hypothesis.

## Approach

### Plan the change

Read `{stateFile}` for the confirmed hypothesis and root cause. Present the fix plan: which files change, exactly what changes, what stays out of scope. Get user agreement before implementing.

### Implement

For multi-file or split FE/BE changes, load `{parallel_agents_skill}` and dispatch sub-agents in parallel — each returns the change made and a per-file verification note. For a single-file or small change, implement directly.

Address the root cause only. No refactoring of unrelated code. No "improvements" disguised as part of the fix.

### Verify in the real environment

**Frontend bugs** — use Chrome DevTools MCP:
- Reproduce the original failure path; confirm the bug is gone.
- Check the console — no new errors; `[BUG-HUNT]` logs (still in code at this point) show the corrected values.
- Take a screenshot to capture the corrected state.
- Scan adjacent functionality for regressions.

**Backend bugs** — exercise the affected endpoint or job, inspect logs, check data integrity.

### Persist progress

Update `{stateFile}`:

If verified:
```yaml
fixImplemented: true
fixVerified: true
fixDetails:
  method: ''
  files: []
  changes: ''
```

If failed: append to `hypotheses` as a level-`{lastEscalationLevel}` failure with the verification observations. Add `step-05-fix` to `stepsCompleted` and append to the Investigation Log.

## Routing

Present a menu (halt for input):

- **Verified**: `[A]` `[P]` `[C]` Continue to Wrap-up
- **Verification failed**: `[A]` `[P]` `[C]` Loop back to Level `{lastEscalationLevel}`

Menu handling:
- `A` / `P` — standard
- `C` (verified) → `{nextStepFile}`
- `C` (failed) → load and follow the matching entry in `{loopBackFiles}` based on `lastEscalationLevel`
