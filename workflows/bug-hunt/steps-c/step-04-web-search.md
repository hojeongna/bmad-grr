---
name: 'step-04-web-search'
description: 'Level 3 investigation: web search for solutions, combined with previous evidence for final hypothesis'

nextStepFile: './step-04b-architecture.md'
skipToFixFile: './step-05-fix.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Web Search (Level 3)

## STEP GOAL:

To escalate investigation by searching the web for known issues, solutions, and patterns related to the bug, combining external knowledge with internal evidence to form a final hypothesis.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a systematic debugging partner executing Level 3 investigation
- ✅ Levels 1+2 were insufficient - now we search externally
- ✅ Combine web findings with internal evidence for strongest hypothesis
- ✅ Iron Law still active - this is the LAST investigation level before architecture review

### Step-Specific Rules:

- 🎯 Level 3: Web search to find known issues and solutions
- 🚫 FORBIDDEN to attempt fixes before forming evidence-based hypothesis
- 📋 This is the last escalation level - if this fails, we question architecture
- 💬 Search strategically based on error messages, library versions, patterns
- 🔢 Track hypothesis count - 3 total failures across all levels triggers architecture review

## EXECUTION PROTOCOLS:

- 🎯 Search based on specific error messages and patterns
- 💾 Update state file with findings
- 📖 Count total hypothesis failures across all levels
- 🚫 3+ total failures → architecture review (step-04b)

## CONTEXT BOUNDARIES:

- Level 1 (code analysis) and Level 2 (debug logs + DevTools) findings in state
- Previous hypotheses and their failure reasons documented
- Web search is the final tool before questioning architecture
- Combine ALL evidence: code analysis + runtime + external knowledge

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Context

Read `{stateFile}` to get:
- All previous findings from Level 1 and Level 2
- Failed hypotheses and their reasons
- Error messages, library names, patterns observed
- Total hypothesis failure count

### 2. Formulate Search Strategy

"**Level 3: Web Search Escalation**

Searching based on evidence gathered from Level 1 (code analysis) and Level 2 (debug logs + DevTools).

**Search keywords:**
1. [error message based search]
2. [library/framework + symptoms]
3. [discovered patterns + solutions]

Does this search direction look right? Let me know if you have additional keywords!"

**Wait for user input.**

### 3. Execute Web Search

Use WebSearch and WebFetch tools to:

**a. Search for error messages** - Exact error strings often lead to solutions
**b. Search for library-specific issues** - Known bugs, version incompatibilities
**c. Search for pattern-specific solutions** - Similar problems others have solved

For each useful result:
- Note the source URL
- Extract the relevant solution or insight
- Evaluate if it matches our internal evidence

### 4. Synthesize All Evidence

"**All evidence consolidated:**

**Level 1 (code analysis):**
[key findings]

**Level 2 (debug logs + DevTools):**
[runtime evidence]

**Level 3 (web search):**
[external findings - with sources]

**Combined analysis:**
[conclusion drawn from all evidence combined]"

### 5. Form Final Hypothesis (Collaborative)

"**Final hypothesis:**

Combining evidence from all levels:
- **Hypothesis:** [specific root cause]
- **Evidence:** [code analysis + runtime + web search combined]
- **Test method:** [how to verify with minimal change]
- **External references:** [include URLs if available]

Do you agree with this hypothesis?"

**Wait for user input.**

### 6. Test Hypothesis (Minimal Change)

- Make the SMALLEST possible change
- Use DevTools to verify if applicable
- Document result clearly

### 7. Count Total Failures

Check total hypothesis failures across ALL levels (from state file `hypotheses` array).

**If this hypothesis also failed AND total failures >= 3:**
→ Trigger architecture review (step-04b)

**If this hypothesis also failed AND total failures < 3:**
→ Allow one more attempt at this level

### 8. Update State File

Update `{stateFile}`:
```yaml
lastEscalationLevel: 3
```

Add to `hypotheses` and update `stepsCompleted`.

Append to Investigation Log with web search findings and sources.

### 9. Present MENU OPTIONS

**If hypothesis SUCCEEDED:**

Display: "**Root cause found at Level 3! Proceed to fix?**

**Select:** [A] Advanced Elicitation [P] Party Mode [S] Skip to Fix [C] Continue"

**If hypothesis FAILED and total failures >= 3:**

Display: "**3+ hypothesis failures. A fundamental architecture review may be needed.**

**Select:** [A] Advanced Elicitation [P] Party Mode [C] Proceed to Architecture Review"

**If hypothesis FAILED and total failures < 3:**

Display: "**Want to try once more at this level?**

**Select:** [A] Advanced Elicitation [P] Party Mode [R] Retry this level [C] Proceed to Architecture Review"

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- S option only when hypothesis succeeded
- R option only when failures < 3

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF S (success only): Update state file, then load, read entire file, then execute {skipToFixFile}
- IF R (retry): Return to section 2 of this step, form new search strategy
- IF C: Update state file, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Strategic web search based on gathered evidence
- External findings combined with internal evidence
- Final hypothesis formed with comprehensive evidence base
- Total failure count tracked accurately
- Architecture review triggered at 3+ failures
- All findings documented with sources

### ❌ SYSTEM FAILURE:

- Searching randomly without strategy
- Ignoring previous level findings
- Not counting total failures
- Not triggering architecture review at 3+ failures
- Attempting fixes without evidence synthesis

**Master Rule:** This is the last investigation level. If it fails, we question architecture - not try harder.
