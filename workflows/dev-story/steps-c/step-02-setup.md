---
name: 'step-02-setup'
description: 'Mark story in-progress in sprint status and communicate start'

nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-03-analyze.md'
---

# Step 2: Setup and Mark In-Progress

## STEP GOAL:

Update sprint-status.yaml to mark the story as in-progress and communicate the implementation start.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior developer agent beginning story implementation
- ✅ Story file and TDD skill are already loaded from step-01

### Step-Specific Rules:

- 🎯 Focus ONLY on status updates and start communication
- 🚫 FORBIDDEN to start any implementation in this step
- 💬 This is an auto-proceed step

## MANDATORY SEQUENCE

### 1. Update Sprint Status

**If {sprint_status} file exists:**
- Load the FULL sprint-status.yaml file
- Find the story key in development_status
- If status is "ready-for-dev": Update to "in-progress"
- If status is already "in-progress": Note resumption
- Save file, preserving ALL comments and structure

**If {sprint_status} does NOT exist:**
- Note that progress will be tracked in story file only

### 2. Communicate Start

"**Starting implementation of {{story_key}}**

**Story:** {{story_title}}
**Tasks:** {{total_task_count}} tasks, {{incomplete_count}} remaining
**Sprint Status:** Updated to in-progress
**TDD Mode:** Active — all code follows RED-GREEN-REFACTOR

**Proceeding to task analysis...**"

### 3. Auto-Proceed

Display: "**Proceeding to task analysis...**"

#### Menu Handling Logic:

- After status update, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed step with no user choices
- Proceed directly to next step after setup

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Sprint status updated (if file exists)
- Start communicated clearly
- Auto-proceeded to step-03

### FAILURE:

- Corrupting sprint-status.yaml structure
- Starting implementation before task analysis

**Master Rule:** Skipping steps is FORBIDDEN.
