---
name: 'step-01-init'
description: 'Initialize bug hunt: gather bug info, check story file, create state tracking'

nextStepFile: './step-02-code-analysis.md'
continueFile: './step-01b-continue.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
bugReportTemplate: '../data/bug-report-template.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 1: Initialize Bug Hunt

## STEP GOAL:

To gather bug information, determine documentation target (story file or bug report), and create the state tracking file for this debugging session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a systematic debugging partner and Iron Law enforcer
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring structured debugging methodology, user brings bug context and domain knowledge
- ✅ Together we hunt the root cause

### Step-Specific Rules:

- 🎯 Focus ONLY on gathering bug info and setting up the session
- 🚫 FORBIDDEN to start investigating or fixing anything
- 🚫 FORBIDDEN to skip continuation check
- 💬 Ask about the bug conversationally, collect key details

## EXECUTION PROTOCOLS:

- 🎯 Check for existing state file FIRST (continuation detection)
- 💾 Create state file with initial bug info
- 📖 Load systematic-debugging skill for reference throughout workflow
- 🚫 This is init - set up everything, investigate nothing

## CONTEXT BOUNDARIES:

- This is the first step - no prior context exists
- User may provide minimal info ("why is this broken") or detailed bug report
- Must determine: bug description, story file (if any), FE/BE context
- No investigation happens here - that's step-02

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Check for Existing Session

Look for any existing `bug-hunt-*.state.md` files in `{output_folder}`.

- **If found with incomplete status:** Load and execute `{continueFile}` to resume.
- **If not found OR all complete:** Continue to step 2 below.

### 2. Load Systematic Debugging Skill

Load and read `{systematic_debugging_skill}` completely. This skill governs the entire debugging process. Internalize the Iron Law:

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

### 3. Gather Bug Information

"**Bug Hunt started!**

Which bug shall we hunt down?

Please tell me:
- **What's the problem?** (Expected behavior vs actual behavior)

Any of these would also help:
- Error messages or stack traces
- Reproduction URL or page
- Related code files
- Frontend / Backend context"

**Wait for user response.** Accept whatever level of detail they provide.

### 4. Determine Documentation Target

"**Do you have a story file?**

- **[Y]** Yes, I have a story file → Please provide the path
- **[N]** No, I don't → I'll create a new bug report"

**If Y:** Store story file path. Verify file exists at the given path.
**If N:** Will create bug report from `{bugReportTemplate}` at wrapup. Note this in state.

### 5. Determine Context Type

If not already clear from bug description:

"**Is this bug frontend, backend, or both?**
- **[F]** Frontend - Can verify with Chrome DevTools
- **[B]** Backend - Log/API analysis needed
- **[A]** Both / Not sure"

This determines which tools to prioritize in investigation steps.

### 6. Create State File

Create `{stateFile}` with gathered information:

```markdown
---
stepsCompleted: ['step-01-init']
lastStep: 'step-01-init'
lastContinued: ''
status: IN_PROGRESS
date: '{date}'
lastEscalationLevel: 0
bugDescription:
  expected: '[expected behavior]'
  actual: '[actual behavior]'
  errorMessage: '[error message or none]'
  url: '[reproduction URL or none]'
  contextType: '[frontend/backend/both]'
documentationTarget:
  type: '[story/bug-report]'
  path: '[story file path or TBD]'
debugLogs: []
hypotheses: []
architectureReviews: []
---

# Bug Hunt State: {date}

## Bug Summary
[one-line summary]

## Investigation Log
[appended at each step]
```

### 7. Confirm and Proceed

"**Session ready!**

To summarize:
- **Bug:** [one-line summary]
- **Documentation target:** [story file / bug report]
- **Context:** [FE / BE / both]

Now let's start with code analysis. Remember the Iron Law: **Absolutely NO fix attempts without root cause investigation!**"

**Proceeding to code analysis...**

### 8. Auto-Proceed to Next Step

This is an init step with no user menu choices at the end.

#### Menu Handling Logic:

- After state file created and summary confirmed, immediately load, read entire file, then execute `{nextStepFile}` to begin Level 1 investigation.

#### EXECUTION RULES:

- This is an auto-proceed init step with no menu
- Proceed directly to next step after setup is complete
- Always halt if user wants to add more context about the bug

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Continuation check performed
- Bug information gathered (at minimum: expected vs actual)
- Documentation target determined (story file or bug report)
- Context type identified (FE/BE/both)
- State file created with all gathered info
- Systematic debugging skill loaded
- Iron Law stated to user

### ❌ SYSTEM FAILURE:

- Skipping continuation check
- Starting investigation in this step
- Not creating state file
- Not loading systematic debugging skill
- Attempting any fix or hypothesis

**Master Rule:** This step ONLY gathers information and sets up. Investigation begins in step-02.
