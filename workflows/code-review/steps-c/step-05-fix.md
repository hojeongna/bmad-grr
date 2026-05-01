---
name: step-05-fix
description: 'Apply checklist-based fixes via parallel per-file agents, run available tests, auto-retry failures'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-06-complete.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 5 — Fix

## Outcome

Every finding inside the selected `fixScope` is fixed by a dedicated per-file sub-agent. After fixes, available project tests run automatically; failures trigger up to three auto-retry rounds. Nothing outside the report's findings is modified — no "while we're here" cleanups.

## Approach

### Filter findings by scope

Apply `fixScope` from step-04:

- `ALL` — every finding
- `SMALL` — only SMALL-scope findings
- `HIGH` — only HIGH-priority findings

Group filtered findings by file. Briefly tell the user the fix plan (counts by priority and file count).

### Dispatch per-file fix agents

Read `{parallelAgentsSkill}` for the dispatch pattern. One agent per file — never batch.

Each agent receives:

1. **File path** to fix.
2. **All filtered findings for that file** — checklist category, item, line number, description, and how-to-fix from the report.
3. **Fix instruction**: read the file completely; for every finding, apply the minimum change that resolves it without breaking surrounding code; do not skip, defer, or "save for later" any finding inside the assigned scope.
4. **Scope lock**: modify only the assigned file; no improvements beyond the listed findings; no refactors.
5. **No-deferral rule**: "too complex" and "too large" are not valid reasons to skip a fix; if a fix truly cannot be applied, return a concrete technical reason (e.g., file deleted, syntax conflict).
6. **Output**: list of fixes applied with checklist item, change description, and lines affected.

### Verify completion

Aggregate results. Confirm every assigned finding was addressed. If any agent deferred without a concrete technical reason, surface that to the user — that's a real failure, not just a partial result.

### Run available tests

Detect what the project actually exposes:

- `tsc --noEmit` if `tsconfig.json` exists
- `npm/pnpm/yarn run build` if `package.json` `scripts.build` exists (detect package manager from lockfile: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, otherwise npm)
- `npm/pnpm/yarn test` if `scripts.test` exists; `pytest` if `pytest.ini` or `pyproject.toml` pytest config; `behave` if its config exists

Run only what's detected. If a test fails, analyze the failure, fix it, and re-run only the failed test. Up to three rounds. After three rounds, surface the failure honestly and continue — don't pretend it passed.

## Communicate

Brief summary: fixed count, any unfixed items with reasons, and test results.

## Next

Load and follow `{nextStepFile}`.
