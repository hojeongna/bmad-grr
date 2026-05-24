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

### Verify root-cause reasoning (fresh sub-agent)

Skip this section if `status: UNRESOLVED` — there is no fix to validate against.

Otherwise, dispatch a sub-agent to independently assess whether the documented root cause and fix coherently explain the observed symptoms. The same context that ran the hunt has anchoring on its own hypothesis path — a fresh judge is more reliable.

Build an evidence packet from the state file:

- `bugDescription` (symptoms — expected vs actual)
- `rootCause` (final statement)
- `fixDetails` (what changed, which files)
- `debugLogs` (relevant outputs that pinned the cause — last N lines per entry)
- `hypothesesRejected` (1-line summaries — why earlier paths were wrong)
- Diff of the fix (`git diff` for the changed files, or the changed-line ranges)

Then invoke `Task` / `Agent`:

```text
Independently assess a bug-hunt session's reasoning chain. You are a
fresh context — you did NOT run the hunt.

Inputs:
- bug_description: <symptoms>
- root_cause: <final root cause statement>
- fix: <fix description + diff/files>
- evidence: <debug log excerpts that supported the root cause>
- rejected_hypotheses: [<short reason per rejected branch>]

Constraints:
- You see ONLY the above plus the changed files (read-only for spot
  checks).
- You do NOT have access to the main conversation.
- Do NOT modify any file.

Answer one question: does the root cause + fix coherently and
completely explain the observed symptoms, supported by the cited
evidence?

Output: a single fenced JSON block, no prose around it:

{
  "coherence": "COHERENT" | "WEAK" | "INCOHERENT",
  "gaps": [
    "<specific reasoning gap or missing link>",
    "<a fix that only treats a symptom but not the cause>",
    "<evidence cited that does not actually support the cause>"
  ],
  "fix_addresses_root_cause": true | false,
  "notes": "<short summary, ≤ 200 chars>"
}
```

Parse the JSON.

#### Branch on the assessment

- **COHERENT** — proceed to "Document the fix". Append the assessment to the documentation under a `### Reasoning Verification` subsection (one line: `coherence: COHERENT`).
- **WEAK** — present `gaps` to the user. Offer `[R]` revise documentation to address gaps before saving, `[A]` accept and save with the WEAK verdict + gaps recorded in the documentation, `[E]` extend the hunt (re-enter step-02 with the gaps as new questions).
- **INCOHERENT** — STRONG signal that the fix may not actually solve the bug. Halt. Tell the user the specific gaps and ask: `[E]` extend the hunt, `[A]` accept anyway and proceed with a documented `INCOHERENT` verdict (rare — needs explicit confirmation), `[X]` discard fix and re-enter step-02.

For both WEAK and INCOHERENT, the documentation includes the full JSON assessment so the audit trail captures the disagreement.

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
