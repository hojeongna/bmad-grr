---
name: step-06-wrapup
description: 'Remove all tracked debug logs, document the fix in story or bug report, verify cleanup, close the session'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
bugReportTemplate: '../data/bug-report-template.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 6 — Wrap-up

## Outcome

Every debug log tracked during the hunt is removed from the codebase (verified by DevTools and/or grep), the fix is documented in the story file or a fresh bug report, the state file is marked `COMPLETED`, and the user has a clear summary of what was found and fixed. The codebase is left cleaner than it was found — no `[BUG-HUNT]` residue.

## Approach

### Read the session

Load `{stateFile}` completely. Pay particular attention to:

- `debugLogs` — every entry must be removed.
- `documentationTarget` — story file path vs bug report flag.
- `fixDetails`, `hypotheses`, `architectureReviews`, `bugDescription` — material for documentation.
- `status` — if `UNRESOLVED` (closed via architecture review), the documentation captures the unresolved state instead of a fix.

### Remove every tracked debug log

For each entry in `debugLogs`, open the file and remove the tracked line. Verify the surrounding code still compiles/parses. Mark each entry as removed.

If `debugLogs` is empty (resolved at Level 1), nothing to remove — note that and continue.

### Verify cleanup

Grep the codebase for `[BUG-HUNT]` to catch any logs that drifted from the tracked list. For frontend bugs, also use Chrome DevTools to confirm no `[BUG-HUNT]` console output remains and the application still works as expected.

### Document the fix

**Story file branch** (`documentationTarget.type == 'story'`) — append to the story:

```markdown
## Bug Fix [{date}]

### Symptoms
- Expected: …
- Actual: …

### Root Cause
…

### Fix
- Method: …
- Files: …

### Debugging Process
- Final escalation level: …
- Hypotheses tried: …
- Architecture reviews: …  (omit if none)
```

**Bug report branch** (no story) — load `{bugReportTemplate}` and write `{implementation_artifacts}/bug-report-{date}.md` populated from the state file. Set the report's frontmatter `status` to `resolved` (or `unresolved` if the session closed at architecture review).

### Close the state file

Update `{stateFile}`:
```yaml
status: COMPLETED       # or UNRESOLVED if closed via architecture review
debugLogs: []
stepsCompleted: [..., 'step-06-wrapup']
```

## Communicate

Give the user a tight summary in `{communication_language}`:

- Bug (one line)
- Root cause (one line)
- Fix (one line)
- Final escalation level
- Documentation location
- Debug log cleanup confirmation

End the workflow.
