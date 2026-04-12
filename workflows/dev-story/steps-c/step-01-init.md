---
name: 'step-01-init'
description: 'Find story, load context, load TDD skill, and prepare for implementation'

nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-02-setup.md'
continueFile: '~/.claude/workflows/dev-story/steps-c/step-01b-continue.md'

tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
---

# Step 1: Initialize Story and Load Skills

## STEP GOAL:

Find the next ready story, load all project context and story information, load the TDD skill, and prepare for implementation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior developer agent implementing stories with strict TDD discipline
- ✅ You follow story file tasks/subtasks exactly as written
- ✅ You MUST load external skills via Read tool and follow their directives

### Step-Specific Rules:

- 🎯 Focus ONLY on finding story, loading context, and loading TDD skill
- 🚫 FORBIDDEN to start any implementation in this step
- 🚫 FORBIDDEN to skip TDD skill loading
- 💬 This is an autonomous init step — auto-proceed when ready

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track story_key and story_path for later steps
- 📖 Load all context before proceeding
- 🚫 FORBIDDEN to proceed without TDD skill loaded

## CONTEXT BOUNDARIES:

- Available: sprint-status.yaml, project-context.md, story files
- Focus: Story discovery and context preparation
- Limits: Do NOT implement anything yet
- Dependencies: None — this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Check for Continuation

Check if this workflow has been run before with an in-progress story:
- Look for story files with status "in-progress" in {implementation_artifacts}
- If found: Load {continueFile} to resume
- If not found: Continue to story discovery

### 2. Find Next Ready Story

**If {story_file} is provided:**
- Use the provided story path directly
- Read COMPLETE story file
- Extract story_key from filename or metadata

**If {story_file} is NOT provided and {sprint_status} exists:**
- Load the FULL sprint-status.yaml file
- Read ALL lines from beginning to end
- Find the FIRST story where:
  - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
  - NOT an epic key or retrospective
  - Status equals "ready-for-dev"

**If no sprint-status exists:**
- Search {implementation_artifacts} for story files with "ready-for-dev" status
- Look for files matching pattern: *-*-*.md

**If no ready story found:**

"No ready-for-dev stories found.

**Options:**
1. Run `create-story` to create next story
2. Specify a particular story file path

Which would you like to do?"

HALT and wait for user response.

### 3. Load Story and Project Context

- Read COMPLETE story file
- Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status
- Load {project_context} for coding standards and project patterns (if exists)
- Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications
- Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks

**If no incomplete tasks:** Story is already complete — inform user and HALT.
**If story file inaccessible:** HALT: "Cannot develop story without access to story file"

### 3b. Query Prior Learnings (gstack/learn — OPTIONAL)

**IF `{learn_skill}` exists (gstack installed):** Before writing any implementation code, check what the project has already learned about the area this story touches.

Load the FULL `{learn_skill}` file via Read tool and invoke its search capability using keywords derived from:

- Story title and key
- Touchpoint files mentioned in Dev Notes
- Domain area (auth, payment, API, UI, data, integration, etc.)

Focus on entries of type `architecture`, `pattern`, and `pitfall` — these bind the implementation:

- `architecture` — project-wide architectural rules to respect (don't violate)
- `pattern` — reusable implementation patterns to follow (don't reinvent)
- `pitfall` — known traps to avoid (don't repeat past mistakes)

Capture as `prior_learnings` in context. These should influence implementation decisions throughout step-04 — **the TDD skill rules still govern HOW to implement (RED-GREEN-REFACTOR is non-negotiable), but prior_learnings inform WHAT patterns to apply and WHAT pitfalls to avoid within that TDD cycle.**

"**Prior learnings loaded** ({n} relevant entries) — implementation will respect these."

**IF `{learn_skill}` does NOT exist:** Silently skip. (Strongly recommend installing gstack for full project intelligence.)

### 4. Load TDD Skill (CRITICAL)

**This is non-negotiable. You MUST load the TDD skill before any implementation begins.**

- Use Read tool to load the FULL content of {tddSkill}
- Read the skill completely
- Internalize the Iron Law: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"
- Internalize the Red-Green-Refactor cycle
- Internalize the Verification Checklist

"TDD Skill loaded. All implementation will follow strict RED-GREEN-REFACTOR discipline."

### 5. Present Story Summary and Proceed

"**Story loaded and ready for implementation**

**Story:** {{story_key}}
**Status:** {{current_status}}
**Tasks remaining:** {{incomplete_task_count}}
**First task:** {{first_task_description}}
**TDD Skill:** Loaded

**Proceeding to setup...**"

### 6. Auto-Proceed

Display: "**Proceeding to sprint status setup...**"

#### Menu Handling Logic:

- After story and TDD skill are loaded, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed init step with no user choices
- Proceed directly to next step after setup

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the story is found, context is loaded, and TDD skill is loaded will you proceed to step-02-setup.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Story found and fully loaded
- Project context loaded (if exists)
- TDD skill loaded via Read tool
- First incomplete task identified
- Story summary communicated
- Auto-proceeded to step-02

### FAILURE:

- Skipping TDD skill loading
- Not reading complete story file
- Proceeding without identifying incomplete tasks
- Starting implementation in this step

**Master Rule:** The TDD skill MUST be loaded. Skipping this is SYSTEM FAILURE.
