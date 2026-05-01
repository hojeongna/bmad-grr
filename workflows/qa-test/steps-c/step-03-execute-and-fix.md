---
name: step-03-execute-and-fix
description: 'Execute every test case via Chrome DevTools MCP; fix small-scope failures immediately; defer large-scope failures with clear documentation'
nextStepFile: './step-04-story-wrapup.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
verification_skill: '~/.claude/skills/verification-before-completion/SKILL.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
---

# Step 3 — Execute & Fix

## Outcome

Every test case in the QA spec has been executed in a real browser via Chrome DevTools MCP, with screenshot evidence for every pass/fail judgment. Small-scope failures were fixed immediately and re-tested (with regression checks on related cases); large-scope failures were deferred with concrete documentation and impact-on-subsequent-cases noted. The QA report is updated progressively, and the state file reflects current progress.

## Approach

### Load context and skills

Read `{stateFile}` for current story, progress, and `qaSpecPath` / `qaReportPath`. Read the QA spec completely — it is the test script for this step. Read the QA report for what's already recorded.

Load `{verification_skill}` (full file) — it governs how each test result is verified.

### Connect to the browser

Use Chrome DevTools MCP to navigate to the app URL from state, take an initial screenshot, and check console for pre-existing errors. If Chrome DevTools MCP is unavailable, halt and tell the user — silent fallback is not appropriate for browser-first verification.

### Execute the test loop

For every test case in spec order (TS first by group, then NAV, REG, UI), executing within each group by priority (P0 → P1 → P2):

1. **Announce** — `[TC-{NN}] {name}` (P{priority}) — {scenario group} — _{precondition}_.
2. **Execute** the steps as written: navigate, interact (click/type/scroll/etc. exactly per spec), wait for expected UI responses, screenshot at verification points.
3. **Verify** against the spec's Expected Result using `take_screenshot`, `list_console_messages`, `evaluate_script`, `list_network_requests` as appropriate.
4. **Record**:
   - **PASS** — `✅ [TC-NN] PASS — {what was verified}`. Update report and state. Continue.
   - **FAIL** — `❌ [TC-NN] FAIL — {what went wrong}`. Capture expected vs actual. Proceed to fix assessment.

### Fix assessment

When a test fails, classify the fix scope:

- **Small (FIX NOW)** — single file, ~30 lines or fewer, no architectural change, no new dependencies, root cause visible.
- **Large (DEFER)** — multiple files, architectural change, new component/feature needed, root cause unclear, or would block remaining tests.

### Fix path (small scope)

If root cause isn't immediately obvious, load `{systematic_debugging_skill}` and apply its root-cause methodology — keep the investigation focused (this is a quick fix, not a deep dive).

Implement the fix. Re-execute the same test case via Chrome DevTools MCP. If it now passes, record `🔧 FIXED & VERIFIED` with the changed files.

**Regression check** — re-test any previously-passed cases that could be affected by the fix. If any now fails, treat as a new failure (back to fix assessment).

### Defer path (large scope)

Record `⏸️ [TC-NN] DEFERRED` with the issue, expected/actual, the reason for deferral, and a high-level fix recommendation. Update the report and state.

If the deferred issue blocks subsequent test cases, mark them as `🚫 BLOCKED` with the blocking reference.

### Persist progressively

After every test result, update state via the qa-state.py script:

```
# pass
... --updates '{"incrementPassed":true}'
# fix
... --updates '{"addFix":{"tc":"TC-NN","cause":"...","fix":"...","files":["..."]}}'
# defer
... --updates '{"addDeferred":{"tc":"TC-NN","issue":"...","severity":"P1","suggested":"..."}}'
# blocked
... --updates '{"incrementBlocked":true}'
```

When all test cases are complete, set storyStatus to `tested` and append the final log entry.

### Watch for context pressure (epic mode)

In epic mode with many stories, context can grow. If responses slow or compaction signals appear, save current progress to the state file and tell the user to resume with `qa test` in a fresh session.

## Next

After every test case is complete, present the per-result table (Pass / Fixed / Deferred / Blocked), then load and follow `{nextStepFile}`.
