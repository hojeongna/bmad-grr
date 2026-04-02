---
name: 'step-01b-continue'
description: 'Resume workflow from previous session'

tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
nextStepOptions:
  step-02: '~/.claude/workflows/dev-story/steps-c/step-02-setup.md'
  step-03: '~/.claude/workflows/dev-story/steps-c/step-03-analyze.md'
  step-04: '~/.claude/workflows/dev-story/steps-c/step-04-implement.md'
  step-05: '~/.claude/workflows/dev-story/steps-c/step-05-validate.md'
  step-06: '~/.claude/workflows/dev-story/steps-c/step-06-completion.md'
  step-07: '~/.claude/workflows/dev-story/steps-c/step-07-communicate.md'
---

# Step 1b: Continue Workflow

## STEP GOAL:

Resume the dev-story workflow from where it was left off in a previous session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior developer agent resuming story implementation
- ✅ You MUST reload the TDD skill even when continuing

### Step-Specific Rules:

- 🎯 Focus ONLY on determining where to resume
- 🚫 FORBIDDEN to skip TDD skill reload
- 💬 This is an auto-proceed step

## MANDATORY SEQUENCE

### 1. Find In-Progress Story

- Search {implementation_artifacts} for story files with status "in-progress"
- If {story_file} is provided, use that directly
- Read the COMPLETE story file
- Parse all sections

### 2. Determine Resume Point

- Count completed tasks [x] vs incomplete tasks [ ]
- Identify the first incomplete task
- Determine which step to resume from based on state:
  - If story just loaded but no tasks started → step-03 (analyze)
  - If tasks are partially complete → step-03 (analyze remaining tasks)
  - If all tasks complete but DoD not done → step-06 (completion)

### 3. Reload TDD Skill

- Use Read tool to load the FULL content of {tddSkill}
- This is required even on continuation — skills must be fresh in context

### 4. Welcome Back and Route

"**Welcome back! Resuming story implementation...**

**Story:** {{story_key}}
**Progress:** {{completed_tasks}}/{{total_tasks}} tasks complete
**Next task:** {{next_task_description}}
**TDD Skill:** Reloaded

**Resuming from {{resume_step}}...**"

Route to the appropriate step from {nextStepOptions}.

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- In-progress story found and loaded
- Resume point correctly determined
- TDD skill reloaded
- Routed to correct step

### FAILURE:

- Skipping TDD skill reload
- Wrong resume point determination
- Not reading complete story file
