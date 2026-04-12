---
name: 'step-03-execute-and-fix'
description: 'Execute test cases one by one via Chrome DevTools MCP, fix immediately on failure, re-test, continue to next case'

nextStepFile: './step-04-story-wrapup.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
verification_skill: '~/.claude/skills/verification-before-completion/SKILL.md'
qa_skill: '~/.claude/skills/gstack/qa/SKILL.md'
investigate_skill: '~/.claude/skills/gstack/investigate/SKILL.md'
---

# Step 3: Execute Tests & Fix

## STEP GOAL:

Execute every test case from the QA Test Specification document via Chrome DevTools MCP. The spec is the single source of truth — follow it line by line like a human tester would. For each test case: navigate, interact, screenshot, verify against the expected result written in the spec. When a test fails — fix immediately if scope is small, then re-test. If the fix scope is too large, mark as deferred and continue. Never skip a test case.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 🤝 You facilitate DECISIONS (present fix/defer choices). You execute TASKS autonomously — test execution and immediate fixes ARE execution tasks.
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a tool you do not have access to, achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a meticulous QA engineer executing tests in the real browser
- ✅ Screenshot evidence is mandatory for every test result
- ✅ Fix immediately when possible — delay kills momentum
- ✅ When a fix is too big, document it clearly and move on

### Step-Specific Rules:

- 🖥️ ALL testing happens via Chrome DevTools MCP
- 📸 EVERY test result requires screenshot evidence
- 🔧 Fix immediately on failure when scope is small (single file, < ~30 lines changed)
- 📝 Defer to refine-story when scope is large (multiple files, architectural change, new feature needed)
- 🔄 After every fix, re-test the fixed case AND re-test any previously passing cases that might be affected
- 🚫 NEVER skip a test case, even if a previous fix seems to cover it

## EXECUTION PROTOCOLS:

- 🎯 Execute test cases in priority order (P0 first, then P1, then P2)
- 💾 Update QA report after each test case
- 📖 Load debugging skill when a fix requires investigation
- 🔄 Re-test loop: fix → re-test fixed case → check affected cases → continue

## CONTEXT BOUNDARIES:

- QA Test Specification document exists from step-02 (the single source of truth for all test cases)
- QA Report document initialized from step-02 (for recording execution results)
- State file tracks current test case index and paths to both documents
- Chrome DevTools MCP must be available — if unavailable, inform user and halt (no silent fallback)
- App must be running at the configured URL

### Epic Mode Context Warning

In epic mode with many stories, context may grow large across repeated test cycles. If you detect context pressure (slow responses, compaction warnings), save current progress to state file and inform the user:

"**Context getting large after {N} stories. Recommend saving and resuming:**
- Current progress saved to state file
- Run `qa test` again to resume from where we left off"

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Context and Skills

Read `{stateFile}` to get current story, test case progress, and document paths (`qaSpecPath`, `qaReportPath`).

Read the QA Test Specification document COMPLETELY — this is your test script. Every test case in this document must be executed exactly as written.

Read the QA Report document to know what has already been recorded.

Load these skills via Read tool (FULL file):
- `{verification_skill}` — governs how we verify each test result
- `{qa_skill}` (if exists) — structured QA methodology

### 2. Connect to Browser

Use Chrome DevTools MCP to:
- Navigate to the app URL from state file
- Take an initial screenshot to confirm the app is running
- Check console for any pre-existing errors

"**Browser connected. App loaded at {URL}.**
Starting test execution — {N} test cases to run.

---"

### 3. Execute Test Case Loop

Execute test cases following the spec document order: scenario groups (TS) in sequence, then NAV, REG, UI. Within each group, execute by priority (P0 → P1 → P2).

**For each test case in the QA Test Specification:**

#### 3a. Announce Current Test

"**[{TC-ID}] {test case name}** (P{priority}) — {scenario group name}
_{precondition from spec}_"

#### 3b. Execute Test Steps

Follow the exact steps written in the spec document. Using Chrome DevTools MCP:
- Navigate to the page specified in the test case
- Perform each interaction exactly as described (click, type, scroll, etc.)
- Use the exact inputs specified in the spec
- Wait for expected UI responses
- Take screenshot at each verification point

#### 3c. Verify Result

Compare actual browser state against the **Expected Result** column in the spec:

**Tools to use:**
- `take_screenshot` — visual verification against expected outcome
- `list_console_messages` / `get_console_message` — check for errors
- `evaluate_script` — verify DOM state when needed
- `list_network_requests` — check API calls if relevant

#### 3d. Record Result

**IF PASS:**

"✅ **[TC-{NN}] PASS** — {brief description of what was verified}
📸 _[screenshot taken]_"

Update QA report: mark test case as PASS with evidence.
Update state file: increment `passed` count.
→ **Continue to next test case (3a)**

**IF FAIL:**

"❌ **[TC-{NN}] FAIL** — {what went wrong}
📸 _[screenshot of failure]_
**Expected:** {expected behavior}
**Actual:** {actual behavior}"

→ **Proceed to Fix Assessment (section 4)**

### 4. Fix Assessment

When a test case fails, assess fix scope:

**Small scope (FIX NOW):**
- Single file change
- ~30 lines or fewer
- No architectural impact
- No new dependencies needed
- Clear root cause visible

**Large scope (DEFER):**
- Multiple file changes required
- Architectural change needed
- New feature or component needed
- Root cause unclear and needs deep investigation
- Would take significant time and block remaining tests

### 5. Immediate Fix Path (Small Scope)

#### 5a. Diagnose

If the root cause is not immediately obvious, load `{systematic_debugging_skill}` via Read tool and follow its root cause analysis methodology. Keep investigation focused — this is a quick fix, not a deep dive.

If the issue needs deeper investigation beyond quick diagnosis, load `{investigate_skill}` (if gstack installed) for structured investigation.

#### 5b. Implement Fix

"🔧 **Fixing TC-{NN}...**
**Root cause:** {identified cause}
**Fix:** {what will be changed}
**File(s):** {affected files}"

Implement the fix in the source code.

#### 5c. Re-test Fixed Case

Use Chrome DevTools MCP to re-execute the exact same test case steps:

**IF FIX VERIFIED:**

"✅ **[TC-{NN}] FIXED & VERIFIED**
📸 _[screenshot of working state]_
**Changes:** {files changed and what was done}"

Update QA report: mark as FIXED with fix details and evidence.
Update state file: increment `fixed` count, add to `fixes_applied`.

#### 5d. Regression Check

After a fix, re-test any previously PASSED test cases that could be affected by the change:

"🔄 **Regression check** — re-testing {N} related cases..."

For each related case:
- Re-execute via Chrome DevTools MCP
- If still passes: note "regression check: pass"
- If now fails: treat as a new failure (back to section 4)

→ **Continue to next test case (3a)**

### 6. Defer Path (Large Scope)

"⏸️ **[TC-{NN}] DEFERRED** — fix scope too large for immediate resolution.

**Issue:** {detailed description}
**Expected:** {expected behavior}
**Actual:** {actual behavior}
**Why deferred:** {reason — e.g., requires architectural change, multiple files, new component}
**Suggested fix approach:** {high-level recommendation}"

Update QA report: mark as DEFERRED with full details.
Update state file: increment `deferred` count, add to `deferred_issues`.

**Check if the deferred issue blocks subsequent test cases:**
- If YES: note which test cases are blocked, mark them as BLOCKED in the report
- If NO: continue to next test case

→ **Continue to next test case (3a)**

### 7. Test Execution Complete

When all test cases have been executed:

"**Test execution complete for: {story title}**

| Result | Count |
|--------|-------|
| ✅ Pass | {N} |
| 🔧 Fixed | {N} |
| ⏸️ Deferred | {N} |
| 🚫 Blocked | {N} |
| **Total** | **{N}** |"

### 8. Update State File

After each test case result, update state incrementally:

```bash
# On PASS:
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" --updates '{"incrementPassed":true}'

# On FIX:
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" --updates '{"addFix":{"tc":"TC-NN","cause":"...","fix":"...","files":["..."]}}'

# On DEFER:
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" --updates '{"addDeferred":{"tc":"TC-NN","issue":"...","severity":"P1","suggested":"..."}}'

# On BLOCKED:
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" --updates '{"incrementBlocked":true}'
```

When all test cases complete:
```bash
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" \
  --updates '{"addStep":"step-03-execute-and-fix","storyStatus":"tested","logEntry":"Testing complete: {passed} pass, {fixed} fixed, {deferred} deferred"}'
```

Update QA report with execution summary.

### 9. Auto-Proceed to Next Step

After all test cases are complete, immediately load, read entire file, then execute `{nextStepFile}` for story wrapup.

---

## SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Every test case executed via Chrome DevTools MCP (not just code inspection)
- Screenshot evidence for every pass/fail judgment
- Small-scope failures fixed immediately and re-tested
- Regression checks performed after every fix
- Large-scope failures properly documented with fix recommendations
- Blocked test cases identified and noted
- QA report updated progressively
- State file current at all times

### ❌ SYSTEM FAILURE:

- Skipping any test case
- Claiming pass without screenshot evidence
- Not attempting immediate fix for small-scope failures
- Not re-testing after a fix
- Not checking for regressions after a fix
- Leaving large-scope failures undocumented
- Not updating QA report after each case
