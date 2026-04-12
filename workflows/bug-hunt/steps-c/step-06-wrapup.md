---
name: 'step-06-wrapup'
description: 'Final step: remove all debug logs, update story file or create bug report, verify cleanup'

stateFile: '{output_folder}/bug-hunt-{date}.state.md'
bugReportTemplate: '../data/bug-report-template.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 6: Wrapup

## STEP GOAL:

To clean up ALL debug logs from the code, document the fix in the story file or create a bug report, verify cleanup with DevTools, and close out the bug hunt session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a systematic debugging partner completing the hunt
- ✅ Debug log cleanup is NON-NEGOTIABLE
- ✅ Documentation ensures the work is preserved
- ✅ Leave the codebase cleaner than you found it

### Step-Specific Rules:

- 🎯 Three tasks: cleanup debug logs, document, verify
- 🚫 FORBIDDEN to skip debug log removal
- 🚫 FORBIDDEN to close without documentation
- 📋 Use debugLogs array from state file - remove EVERY tracked log
- 🔧 Use Chrome DevTools to verify no [BUG-HUNT] logs remain in console

## EXECUTION PROTOCOLS:

- 🎯 Remove ALL debug logs tracked in state file
- 💾 Write documentation to story file or create bug report
- 📖 Verify cleanup with DevTools
- 🚫 This is the FINAL step - no nextStepFile

## CONTEXT BOUNDARIES:

- Fix is implemented and verified (from step-05)
- Debug logs tracked in state file debugLogs array
- Documentation target known (story file or bug report)
- All investigation history available in state file

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load State

Read `{stateFile}` completely. Extract:
- `debugLogs` array (CRITICAL - every log must be removed)
- `documentationTarget` (story or bug report)
- `fixDetails` (what was fixed)
- `hypotheses` (debugging journey)
- `architectureReviews` (if any)
- `bugDescription` (original bug)

### 2. Remove ALL Debug Logs

**This is NON-NEGOTIABLE.**

For EACH entry in `debugLogs`:
1. Open the file at the tracked path
2. Find and remove the tracked debug log content
3. Verify the removal doesn't break the code
4. Mark as removed

"**Removing debug logs...**

| # | File | Status |
|---|------|------|
| 1 | [file path] | ✅ Removed |
| 2 | [file path] | ✅ Removed |
| 3 | [file path] | ✅ Removed |

**Total [N] debug logs removed!**"

**If debugLogs is empty:** "No debug logs present (resolved at Level 1). Skipping!"

### 3. Verify Cleanup with DevTools

**For frontend bugs:**

Use Chrome DevTools MCP:
- **Check console** - No more `[BUG-HUNT]` messages
- **Take screenshot** - Application still works correctly after cleanup
- **Quick functional test** - Original bug still fixed after log removal

"**Cleanup verification:**
- [BUG-HUNT] logs remaining: [none ✅ / found ❌]
- Application working normally: [confirmed ✅]
- Bug fix intact: [confirmed ✅]"

**If any [BUG-HUNT] logs found:** Grep codebase for `[BUG-HUNT]` and remove missed logs.

### 4. Document: Story File Update OR Bug Report

**Branch A: Story file exists (documentationTarget.type = 'story')**

Append to the story file at `documentationTarget.path`:

```markdown
## Bug Fix [{date}]

### Symptoms
- Expected behavior: [{bugDescription.expected}]
- Actual behavior: [{bugDescription.actual}]

### Root Cause
- Cause summary: [{extracted from fixDetails}]
- Cause location: [{related files/functions}]
- Why it occurred: [{analysis result}]

### Fix Details
- Fix method: [{fixDetails.method}]
- Changes made: [{fixDetails.changes}]

### Related Files
| File | Change Type | Description |
|------|----------|------|
[generated from fixDetails.files]

### Debugging Process
- Escalation level: [{final level}]
- Attempted hypotheses: [{hypotheses summary}]
```

**Branch B: No story file (documentationTarget.type = 'bug-report')**

Load `{bugReportTemplate}` and create bug report at `{implementation_artifacts}/bug-report-{date}.md`:

Fill in all template fields from state file data:
- Symptoms: from bugDescription
- Root Cause: from fixDetails
- Fix Details: from fixDetails
- Related Files: from fixDetails.files
- Debugging Process: from hypotheses
- Architecture Review: from architectureReviews (if any)
- Next Steps if Unresolved: N/A (resolved)

Set frontmatter status to `resolved`.

### 5. Update State File (Final)

Update `{stateFile}`:
```yaml
status: COMPLETED
debugLogs: []  # All removed
stepsCompleted: [..., 'step-06-wrapup']
```

### 5b. Save Bug Learning (gstack/learn — OPTIONAL)

**IF `{learn_skill}` exists (gstack installed):** Save the distilled lesson from this bug hunt so future sessions can benefit from this experience.

Load the FULL `{learn_skill}` file via Read tool, then use its `learn add` capability (or the `gstack-learnings-log` binary directly) to persist a learning entry:

- **type**: `pitfall` (for bug-related learning) OR `pattern` (if the root cause revealed a reusable pattern)
- **key**: short kebab-case key describing the lesson (e.g., `auth-token-refresh-race`, `async-state-stale-closure`)
- **insight**: ONE SENTENCE describing the root cause and the fix principle. Focus on the *why* and *how* so future agents recognize the pattern, NOT the specific line change
- **confidence**: judgment call based on how reproducible and how well understood the root cause is (1-10)
- **files**: related files from the fix (so staleness detection can flag this entry if the files are deleted)
- **source**: `bug-hunt`

**Example entry:**

> type: `pitfall` • key: `auth-token-refresh-race` • insight: "Token refresh runs concurrently with request retry — guard with a shared promise or mutex to avoid double refresh" • confidence: 8 • files: ["src/auth/refresh.ts"] • source: `bug-hunt`

This entry becomes available to future `/learn search` calls, including step-01 of the next bug-hunt, dev-story, refine-story, and review-checklist generation. That's how the project gets smarter over time.

"**Learning saved** ✓ — Future bug hunts will see this pattern in their prior-learnings query."

**IF `{learn_skill}` does NOT exist:** Silently skip.

### 6. Final Summary

"**Bug Hunt Complete! 🎉**

**Summary:**
- **Bug:** [{one-line summary}]
- **Root cause:** [{one-line cause}]
- **Fix:** [{one-line fix description}]
- **Escalation:** Level [{final level}]
- **Documentation:** [{story file path or bug report path}]
- **Debug logs:** All removed ✅

Iron Law upheld: Root cause investigation → Evidence-based hypothesis → Verified fix!

Great work! 💪"

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- ALL debug logs removed from code (zero remaining)
- DevTools confirms no [BUG-HUNT] logs in console
- Application still works after cleanup
- Documentation written to story file OR bug report created
- State file marked COMPLETED
- User receives clear summary

### ❌ SYSTEM FAILURE:

- Debug logs left in code (ANY remaining = failure)
- Skipping DevTools cleanup verification
- Not documenting in story/bug report
- Closing without summary
- Not marking state as COMPLETED

**Master Rule:** Debug logs in production is UNACCEPTABLE. Remove EVERY single one. Verify with DevTools. Document EVERYTHING.
