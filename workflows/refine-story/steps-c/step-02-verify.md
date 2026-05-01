---
name: step-02-verify
description: 'Optionally verify the issue visually in the running app via Chrome DevTools or Playwright before analysis'
nextStepFile: './step-03-analyze.md'
---

# Step 2 — Visual Verification (optional)

## Outcome

If the user wants to verify the issue in the running app, observed findings (screenshots, console state, discrepancies vs expected behavior) are captured and ready to feed into the gap analysis. If the user skips, the workflow advances directly to analysis.

## Approach

### Ask whether to verify

Offer `[Y]` Verify visually / `[N]` Skip to analysis. On `N`, skip the rest of this step.

### Confirm the server is running

If the user wants to verify, find out whether the server is up:

- `[R]` Already running.
- `[S]` Start it for me — ask for the start command and run it; wait for ready signal.
- `[U]` User will start it manually — wait for confirmation.

### Determine the target URL

Ask which URL to inspect. If a URL was already given in step-01, suggest it as the default.

### Inspect

Use Chrome DevTools MCP (or Playwright MCP if available):

1. Navigate to the URL.
2. Take a screenshot of the current state.
3. Describe what you observe.
4. Compare observed behavior with the story's AC and Tasks.
5. Note discrepancies, bugs, or improvement areas — with screenshot evidence.

If the user wants to check additional pages or states, repeat.

### Summarize

Present a tight findings list. These notes feed into step-03 analysis.

## Next

Load and follow `{nextStepFile}`.
