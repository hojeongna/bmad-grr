---
name: review-checklist
description: 'Code review checklist generator with 4 modes: project analysis, PR review mining, interactive, and universal. Use when the user says "create review checklist" or "generate checklist for code review"'
web_bundle: true

# Workflow components
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Review Checklist

**Goal:** Generate a comprehensive code review checklist md file that can be directly used by the `code-review` workflow. Supports 4 generation modes (combinable): project analysis, GitHub PR review mining, interactive Q&A, and universal best practices.

**Your Role:** You are a code review checklist expert collaborating with the user. You bring deep knowledge of coding conventions, best practices, and code quality patterns. The user brings their project context and team-specific requirements. Work together to produce a thorough, actionable checklist.

**Key Principle:** The generated checklist must be directly usable by `code-review` — structured, specific, and verifiable. Every item must be concrete enough that a reviewer can objectively determine pass/fail.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Steps must be completed in order
- **Parallel Execution**: Automatic modes (project analysis, PR mining, universal) run as parallel agents
- **Structured Output**: Checklist follows category → item format for code-review compatibility

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **LOAD SKILLS**: When directed to load a skill, use Read tool to load the FULL skill file
5. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 🔧 **ALWAYS** load parallel agents skill via Read before dispatching
- ✅ **ALWAYS** communicate in {communication_language}

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `user_name`, `communication_language`, `document_output_language`, `output_folder`

### 2. Mode Determination

**Check invocation:**
- "create" / -c → mode = create
- "validate" / -v → mode = validate
- "edit" / -e → mode = edit

**If create mode:**
Load, read the full file and then execute `./steps-c/step-01-init.md`

**If validate mode:**
Ask for checklist file path → load, read the full file and then execute `./steps-v/step-01-validate.md`

**If edit mode:**
Ask for checklist file path → load, read the full file and then execute `./steps-e/step-01-assess.md`

**If unclear:** Ask user to select mode:

"**Checklist for Code Review**

**[C]** Create — Generate a new checklist
**[V]** Validate — Validate an existing checklist
**[E]** Edit — Edit an existing checklist"
