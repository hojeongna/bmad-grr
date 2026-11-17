---
name: step-05-fix
description: 'Apply scoped checklist fixes by responsibility, run available tests, recover failures'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-06-complete.md'
recollectStepFile: '~/.claude/workflows/code-review/steps-c/step-02-collect.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 5 — Fix

## Outcome

Resolve selected findings with the developer; delegate only independent responsibility groups, at most five concurrently. Run available checks after relevant changes, with up to three recovery rounds. Stay within the reported defects.

## Approach

### Filter findings by scope

Apply `fixScope` from step-04:

- `ALL` — every finding
- `SMALL` — only SMALL-scope findings
- `HIGH` — only HIGH-priority findings

Group selected findings by responsibility/contract; summarize the fix scope.

### Apply fixes

The developer applies minimal fixes. Delegate independent groups via `{parallelAgentsSkill}` with responsibility, files, findings and scope; keep coupled contracts together and serialize overlapping edits. Return fixes or a technical blocker, not size alone. Step-03's new-check and independent-acceptance rule also covers refuting HIGH candidates; fix owners cannot dismiss them alone.

### Verify completion

Confirm each selected finding was addressed; report unresolved items and blockers.

In auto mode, record two things for the round gate: which findings were actually applied (keyed by file + checklist item, not by line number — the lines just moved), and any finding that came back with a technical blocker. Both are stop conditions there, so a fix that quietly went missing from the record reads as a fix that worked.

### Run available tests

Run whatever typecheck / build / test commands the project actually defines (package manager from the lockfile) — only what's there, nothing fabricated. If a test fails, analyze the failure, fix it, and re-run only the failed test. Up to three rounds. After three rounds, surface the failure honestly and continue — don't pretend it passed.

## Communicate

Brief summary: fixed count, any unfixed items with reasons, and test results.

## Next

Interactive mode → load and follow `{nextStepFile}`.

Auto mode → load and follow `{recollectStepFile}` to re-collect the diff against the pinned base and review again. The round gate already cleared this round before the fixes ran; it sees the results of them on the next pass.
