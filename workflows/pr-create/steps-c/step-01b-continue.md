---
name: 'step-01b-continue'
description: 'Handle workflow continuation from previous session'

stateFilePattern: 'pr-state-*.md'
---

# Step 1b: Continue Workflow

## STEP GOAL:

To resume the PR workflow from where it was left off in a previous session by reading the state file and routing to the appropriate step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Step-Specific Rules:

- 🎯 Focus ONLY on reading state and routing
- 🚫 FORBIDDEN to modify any PR or repo state
- 💬 Clearly show where we left off

## MANDATORY SEQUENCE

### 1. Read State File

Load the most recent `{stateFilePattern}` and read:
- `stepsCompleted` array
- `lastStep` value
- `status` of each PR in the plan
- Overall workflow status

### 2. Present Current State

"**Welcome back!**

**Last session:** {lastStep}
**PR Status:**

| # | PR | Repo | Status |
|---|-----|------|--------|
| 1 | {pr-1} | {repo-1} | {PLANNED/PUSHED/OPEN/MERGED} |
| ... | ... | ... | ... |

**Resuming from where we left off...**"

### 3. Route to Correct Step

Based on `lastStep` and PR statuses:

- **If lastStep is step-02-plan and plan incomplete:** Route to step-02-plan.md
- **If PRs are PLANNED but not pushed:** Route to step-03-commit-push.md
- **If PRs are PUSHED but not opened:** Route to step-04-test-create.md
- **If PRs are OPEN (waiting for merge):** Route to step-05-merge-loop.md
- **If all PRs MERGED:** Route to step-06-complete.md

Update state file `lastContinued` with current date.

Load, read entire file, then execute the appropriate step file.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- State file read correctly
- Current status presented clearly
- Routed to correct step

### ❌ SYSTEM FAILURE:

- Not reading state file
- Routing to wrong step
- Modifying state without user confirmation

**Master Rule:** Read state, show status, route correctly.
