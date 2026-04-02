---
name: 'step-03-debug-logs'
description: 'Level 2 investigation: add debug logs, use Chrome DevTools to gather evidence, form and test hypothesis'

nextStepFile: './step-04-web-search.md'
skipToFixFile: './step-05-fix.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Debug Logs + Chrome DevTools (Level 2)

## STEP GOAL:

To escalate investigation by inserting targeted debug logs into the code, using Chrome DevTools MCP to observe runtime behavior, gather concrete evidence, and form a stronger hypothesis.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a systematic debugging partner executing Level 2 investigation
- ✅ Level 1 (code analysis) was insufficient - now we instrument the code
- ✅ Chrome DevTools MCP is your primary evidence-gathering tool
- ✅ Iron Law still active: evidence before fixes

### Step-Specific Rules:

- 🎯 Level 2: Debug logs + Chrome DevTools - active instrumentation
- 🚫 FORBIDDEN to attempt fixes before gathering DevTools evidence
- 🚫 FORBIDDEN to use web search (that's Level 3)
- 📋 TRACK every debug log added (file path + content) - they MUST be removed later
- 🔧 Use Chrome DevTools MCP for: screenshots, console messages, network requests, DOM inspection
- 💬 For backend bugs: use server logs instead of DevTools

## EXECUTION PROTOCOLS:

- 🎯 Insert debug logs strategically, not randomly
- 💾 Track ALL debug logs in state file debugLogs array
- 📖 Use DevTools to observe actual runtime behavior
- 🚫 Every log added must be tracked for later removal

## CONTEXT BOUNDARIES:

- Level 1 code analysis findings are in state file
- Previous hypothesis failed - need runtime evidence
- Chrome DevTools MCP available for frontend bugs
- Backend bugs: use server-side logging
- All debug logs MUST be tracked for cleanup

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Context

Read `{stateFile}` to get:
- Bug description and context type (FE/BE/both)
- Level 1 findings and failed hypothesis
- Any existing debug logs from previous sessions

### 2. Plan Debug Log Placement

Based on Level 1 findings, identify strategic insertion points:

"**Adding debug logs based on suspected areas from Level 1:**

**Insertion plan:**
1. [file:location] - [what to verify]
2. [file:location] - [what to verify]
3. [file:location] - [what to verify]

Do these locations look right? Let me know if you'd like to add or change any!"

**Wait for user input.**

### 3. Insert Debug Logs

For each approved insertion point:

**a. Add targeted console.log/console.warn statements:**
- Use distinctive prefix: `[BUG-HUNT]` for easy identification
- Log relevant variable values, state, and data flow
- Example: `console.log('[BUG-HUNT] componentName:', { props, state, computedValue });`

**b. Track EVERY log in state file:**
```yaml
debugLogs:
  - file: '[file path]'
    line: [line number]
    content: "console.log('[BUG-HUNT] ...')"
  - file: '[file path]'
    line: [line number]
    content: "console.log('[BUG-HUNT] ...')"
```

**For backend bugs:**
- Use appropriate logging (console.log for Node, print for Python, etc.)
- Same `[BUG-HUNT]` prefix for identification

### 4. Gather Evidence with Chrome DevTools

**For frontend bugs (contextType = frontend or both):**

Use Chrome DevTools MCP tools:

**a. Take screenshot** - Visual state of the bug
**b. Check console messages** - Look for [BUG-HUNT] logs and any errors
**c. Inspect network requests** - API responses matching expectations?
**d. Evaluate DOM state** - Actual rendered state vs expected

"**DevTools evidence:**

**Console logs ([BUG-HUNT]):**
[collected log output]

**Console errors:**
[display errors if any]

**Network requests:**
[related API requests/responses]

**Screen state:**
[screenshot-based observations]"

**For backend bugs (contextType = backend):**
- Check server logs for [BUG-HUNT] entries
- Inspect API response data
- Check database state if relevant (guide: can use Supabase MCP, etc.)

### 5. Analyze Evidence

"**Evidence analysis results:**

**Data flow trace:**
[A] → [B] → [problem occurs here] → [C]

**Comparison with Level 1 hypothesis:**
[why previous hypothesis was wrong / new findings]

**New findings:**
[what was learned from debug logs and DevTools]"

### 6. Form New Hypothesis (Collaborative)

"**New hypothesis:**

Based on runtime evidence:
- **Hypothesis:** [specific root cause]
- **Evidence:** [evidence confirmed from DevTools/logs]
- **Test method:** [how to verify with minimal change]

Do you agree with this hypothesis?"

**Wait for user input.**

### 7. Test Hypothesis (Minimal Change)

- Make the SMALLEST possible change to test
- ONE variable at a time
- Use DevTools to verify the test result

"**Test results:**
- **Hypothesis:** [hypothesis content]
- **Result:** [success / failure]
- **DevTools confirmation:** [what was observed]"

### 8. Update State File

Update `{stateFile}`:
```yaml
lastEscalationLevel: 2
```

Add to `hypotheses`:
```yaml
- hypothesis: '[hypothesis content]'
  result: '[success/failure]'
  evidence: '[DevTools/log evidence]'
  level: 2
```

Update `stepsCompleted` to include `step-03-debug-logs`.

Append to Investigation Log.

### 9. Present MENU OPTIONS

**If hypothesis SUCCEEDED:**

Display: "**Root cause found at Level 2! Proceed to fix?**

**Select:** [A] Advanced Elicitation [P] Party Mode [S] Skip to Fix [C] Continue to Level 3 anyway"

**If hypothesis FAILED:**

Display: "**Unresolved at Level 2. Escalating to Level 3 (web search).**

**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Level 3"

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- S option only available when hypothesis succeeded
- ONLY proceed when user selects C or S

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF S (success only): Update state file, then load, read entire file, then execute {skipToFixFile}
- IF C: Update state file, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Debug logs strategically placed (not random)
- ALL debug logs tracked in state file debugLogs array
- Chrome DevTools evidence gathered systematically
- Runtime behavior observed and documented
- New hypothesis formed with concrete evidence
- Hypothesis tested with minimal change
- State file updated

### ❌ SYSTEM FAILURE:

- Adding debug logs without tracking them
- Random log placement without strategy
- Not using Chrome DevTools for frontend bugs
- Attempting fixes before gathering evidence
- Using web search (that's Level 3!)
- Forgetting to track debug logs for later cleanup

**Master Rule:** Track EVERY debug log. They MUST be removed later. Lost tracking = debug code in production.
