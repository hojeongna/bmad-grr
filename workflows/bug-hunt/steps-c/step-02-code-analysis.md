---
name: 'step-02-code-analysis'
description: 'Level 1 investigation: code analysis with sub-agents, hypothesis formation and testing'

nextStepFile: './step-03-debug-logs.md'
skipToFixFile: './step-05-fix.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Code Analysis (Level 1)

## STEP GOAL:

To investigate the bug through code analysis using sub-agents, identify patterns and root cause candidates, form a hypothesis, and test it with minimal change.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a systematic debugging partner executing Level 1 investigation
- ✅ Follow systematic-debugging skill Phase 1 (Root Cause) and Phase 2 (Pattern Analysis)
- ✅ You bring code analysis expertise, user brings domain context
- ✅ Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION

### Step-Specific Rules:

- 🎯 Level 1: Code analysis ONLY - no debug logs, no web search yet
- 🚫 FORBIDDEN to attempt fixes before root cause is identified
- 🚫 FORBIDDEN to add debug logs (that's Level 2)
- 💬 Present findings to user, form hypothesis collaboratively
- 🔧 Use sub-agents for parallel multi-file analysis (Pattern 2 + Pattern 4)
- 💬 Sub-agents return structured findings, not full file contents
- ⚙️ If sub-agents unavailable, perform analysis in main thread sequentially

## EXECUTION PROTOCOLS:

- 🎯 Follow systematic-debugging Phase 1 then Phase 2
- 💾 Update state file with findings and hypothesis
- 📖 Track escalation level in state
- 🚫 Only proceed to hypothesis after sufficient evidence gathered

## CONTEXT BOUNDARIES:

- Bug info gathered in step-01 is available in state file
- systematic-debugging skill loaded in step-01 guides the process
- This is Level 1 - code analysis only, no instrumentation
- If hypothesis fails here, we escalate to Level 2 (debug logs)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Context

Read `{stateFile}` to get bug description, context type, and any previous investigation notes.

Load `{parallel_agents_skill}` for multi-file analysis capability.

### 2. Phase 1: Root Cause Investigation (Code Analysis)

Following systematic-debugging Phase 1:

**a. Read Error Messages Carefully**
- If error messages/stack traces were provided, analyze them thoroughly
- Note line numbers, file paths, error codes
- Don't skip past warnings

**b. Identify Related Code Files**
- Based on bug description and error messages, identify all potentially related files
- Consider: component files, utility functions, API routes, state management, styles

**c. Parallel Code Analysis (Sub-Agents)**
- DO NOT BE LAZY - For EACH related file, launch a sub-agent that:
  1. Reads the file completely
  2. Analyzes for patterns related to the bug
  3. Traces data flow relevant to the issue
  4. Returns structured findings: `{file, relevantCode, suspiciousPatterns, dataFlowNotes}`
- If sub-agents unavailable: read and analyze files sequentially in main thread

**d. Check Recent Changes**
- Run `git diff` and `git log --oneline -10` on related files
- What changed recently that could cause this?
- New dependencies, config changes?

### 3. Phase 2: Pattern Analysis

Following systematic-debugging Phase 2:

**a. Find Working Examples**
- Locate similar working code in the codebase
- What works that's similar to what's broken?

**b. Compare and Identify Differences**
- What's different between working and broken?
- List every difference, however small

**c. Present Findings to User**

"**Level 1 Code Analysis Results:**

**Analyzed files:**
[file list]

**Findings:**
[key findings]

**Comparison with working similar code:**
[differences]

**Recent changes:**
[related git changes]"

### 4. Form Hypothesis (Collaborative)

"**Let me form a hypothesis:**

Based on the analysis:
- **Hypothesis:** [specifically what the root cause is]
- **Evidence:** [why I think this]
- **Test method:** [how to verify with minimal change]

Does this hypothesis seem right? Let me know if you have a different opinion!"

**Wait for user input.** Adjust hypothesis based on user's domain knowledge.

### 5. Test Hypothesis (Minimal Change)

Following systematic-debugging Phase 3:

- Make the SMALLEST possible change to test the hypothesis
- ONE variable at a time
- Don't fix multiple things at once

**After testing:**

"**Test results:**
- **Hypothesis:** [hypothesis content]
- **Result:** [success / failure]
- **Observations:** [what was confirmed]"

### 6. Update State File

Update `{stateFile}`:
```yaml
lastEscalationLevel: 1
```

Add to `hypotheses`:
```yaml
- hypothesis: '[hypothesis content]'
  result: '[success/failure]'
  evidence: '[evidence]'
  level: 1
```

Update `stepsCompleted` to include `step-02-code-analysis`.

Append to Investigation Log:
```markdown
## Level 1: Code Analysis
- Analyzed files: [list]
- Findings: [summary]
- Hypothesis: [content] → [result]
```

### 7. Present MENU OPTIONS

**If hypothesis SUCCEEDED:**

Display: "**Root cause found at Level 1! Proceed to fix?**

**Select:** [A] Advanced Elicitation [P] Party Mode [S] Skip to Fix [C] Continue to Level 2 anyway"

**If hypothesis FAILED:**

Display: "**Unresolved at Level 1. Escalating to Level 2 (debug logs).**

**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Level 2"

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

- Code analysis performed systematically (not randomly)
- Sub-agents used for parallel file analysis
- Pattern comparison with working code done
- Hypothesis formed collaboratively with user
- Hypothesis tested with minimal change
- All findings documented in state file
- User informed of result and next steps

### ❌ SYSTEM FAILURE:

- Attempting fixes without completing analysis
- Skipping pattern comparison
- Adding debug logs (that's Level 2!)
- Not using sub-agents for multi-file analysis
- Forming hypothesis without evidence
- Not updating state file

**Master Rule:** This is Level 1. Code analysis ONLY. If it fails, we escalate - we don't guess harder.
