---
name: step-01-init
description: 'Initialize or resume bug hunt; gather bug info, set up state tracking, load TDD/debugging skill'
nextStepFile: './step-02-code-analysis.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
bugReportTemplate: '../data/bug-report-template.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'

# Resume targets — used when an in-progress state file exists
nextStepOptions:
  step-02-code-analysis: './step-02-code-analysis.md'
  step-03-debug-logs: './step-03-debug-logs.md'
  step-04-web-search: './step-04-web-search.md'
  step-04b-architecture: './step-04b-architecture.md'
  step-05-fix: './step-05-fix.md'
  step-06-wrapup: './step-06-wrapup.md'
---

# Step 1 — Init / Resume

## Outcome

A bug-hunt session is set up (or resumed): the bug is described, documentation target is decided, the systematic-debugging skill is loaded, the state file exists with current progress, and the next investigation step is queued. Any debug logs left from a previous session are surfaced so they don't get lost.

## Approach

### Resume detection

Look in `{output_folder}` for any `bug-hunt-*.state.md` with `status: IN_PROGRESS`. If one exists, this is a resume — load it completely, re-extract `stepsCompleted`, `lastStep`, `lastEscalationLevel`, `debugLogs`, `hypotheses`, `bugDescription`, `documentationTarget`, `architectureReviews`. Reload `{systematic_debugging_skill}`. Welcome the user back, summarize where the hunt stopped, and warn explicitly if `debugLogs` is non-empty (those logs are still in the code). Ask whether they have new context, then route to the appropriate file in `{nextStepOptions}` based on `lastStep`. Update `lastContinued` in the state file. Skip the rest of this step.

If no in-progress state file exists, this is a fresh start — continue below.

### Skill load

Load the full content of `{systematic_debugging_skill}` into context. Internalize the Iron Law: **no fixes without root cause investigation first**. Evidence precedes hypothesis.

### Bug intake

Ask the user, in `{communication_language}`, what the bug is. Accept whatever level of detail they offer (ideal: expected vs actual behavior, error messages, reproduction URL/page, related files, frontend vs backend context). Don't insist on a structured form — capture what they share.

### Documentation target

Determine where the fix will be documented:

- If the user has a story file, take the path and verify it exists.
- Otherwise, plan to create a fresh bug report from `{bugReportTemplate}` at wrap-up.

### Context type

Identify whether the bug is frontend (verifiable via Chrome DevTools MCP), backend (logs/API analysis), or both. This shapes tool choice in later steps.

### State file

Create `{stateFile}` with the gathered information. Required frontmatter fields:

```yaml
stepsCompleted: ['step-01-init']
lastStep: 'step-01-init'
lastContinued: ''
status: IN_PROGRESS
date: '{date}'
lastEscalationLevel: 0
bugDescription:
  expected: ''
  actual: ''
  errorMessage: ''
  url: ''
  contextType: ''  # frontend / backend / both
documentationTarget:
  type: ''  # story / bug-report
  path: ''
debugLogs: []
hypotheses: []
architectureReviews: []
```

Body section: a one-line bug summary and an "Investigation Log" header that subsequent steps will append to.

## Communicate

Briefly summarize the session setup to the user (bug, documentation target, context type) and state the Iron Law explicitly.

## Next

Load and follow `{nextStepFile}` to begin Level 1 investigation.
