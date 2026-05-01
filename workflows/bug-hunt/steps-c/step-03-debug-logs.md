---
name: step-03-debug-logs
description: 'Level 2 — instrument with debug logs, gather Chrome DevTools evidence, retest hypothesis'
nextStepFile: './step-04-web-search.md'
skipToFixFile: './step-05-fix.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3 — Debug Logs + DevTools (Level 2)

## Outcome

Level 2 investigation is complete: targeted debug logs are inserted at strategically chosen points (every log tracked in the state file for later removal), runtime evidence is gathered via Chrome DevTools MCP (frontend) or server logs (backend), a stronger hypothesis is formed and tested, and the state file reflects the new evidence. If the hypothesis succeeds, the user can skip to fix; if it fails, Level 3 is queued.

## Approach

### Plan log placement

Read `{stateFile}` for prior findings. Based on the failed Level 1 hypothesis, identify the strategic insertion points (where data flow becomes opaque, where state changes happen). Present the insertion plan to the user before adding any logs.

### Insert and track

For each approved point, add a targeted log statement with the prefix `[BUG-HUNT]` so it's easy to grep later. Log the values that matter: variable state, props, computed results, branching conditions.

**Track every log in `{stateFile}`** — `debugLogs` array entries with `file`, `line`, `content`. This is non-negotiable: every log added must be tracked, because every log must be removed at wrap-up.

For backend bugs, use the project's logging mechanism (console.log/print/structured logger) with the same `[BUG-HUNT]` prefix.

### Gather runtime evidence

**Frontend bugs** — use Chrome DevTools MCP:
- Take a screenshot of the bug state
- Read console messages (collect `[BUG-HUNT]` output, capture errors)
- Inspect network requests (request/response shape vs expectation)
- Evaluate DOM state if relevant

**Backend bugs** — read server logs for `[BUG-HUNT]` entries, inspect API responses, check database state if pertinent (Supabase MCP is fine when available).

### Synthesize

Trace the data flow from the evidence: where does it diverge from expected? Compare against the Level 1 hypothesis — what does the runtime evidence reveal that code reading missed?

### New hypothesis + minimal test

Form a new hypothesis backed by the evidence, present it to the user with the proposed minimal test, then run the test and verify with DevTools/logs.

### Persist progress

Update `{stateFile}`:
- Append to `hypotheses` with `level: 2` and the runtime evidence
- Set `lastEscalationLevel: 2`
- Add `step-03-debug-logs` to `stepsCompleted`
- Append findings to the Investigation Log

## Routing

After the test, present a menu (halt for input):

- **If hypothesis succeeded**: `[A]` `[P]` `[S]` Skip to Fix, `[C]` Continue to Level 3
- **If hypothesis failed**: `[A]` `[P]` `[C]` Continue to Level 3

Menu handling matches step-02 (`A` → elicitation, `P` → party mode, `S` → `{skipToFixFile}`, `C` → `{nextStepFile}`).
