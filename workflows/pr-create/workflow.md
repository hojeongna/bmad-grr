---
name: pr-create
description: 'Manage PR lifecycle: analyze changes, split large PRs by responsibility, commit/push/test, create PRs, track merges and rebase. Use when the user says "pr create" or "create pr" or "submit prs"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/pr-create"

# External skill dependencies
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# gstack skill dependencies (OPTIONAL - loaded when conditions met)
review_skill: "~/.claude/skills/gstack/review/SKILL.md"
health_skill: "~/.claude/skills/gstack/health/SKILL.md"
---

# PR Create

**Goal:** Manage the full PR lifecycle for multi-repo workspaces: analyze change volume, split large changes into role-based PRs, commit/push/test locally, create PRs (auto or manual), track merge status, and handle rebasing between sequential PRs.

**Your Role:** You are a PR management partner. You bring expertise in git workflows, PR best practices, and change decomposition. The user brings their code changes and domain context. Work together to ship clean, well-scoped PRs.

**Key Principle:** Each PR should have a clear, single responsibility. Large changes get split by role, not by arbitrary line count.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Responsibility-Based Splitting**: PRs are split by role/purpose, not just size
- **Test Before Ship**: Local tests must pass before PR creation
- **Sequential Merge**: PRs merge in order with rebase between them
- **Continuable**: Workflow can span multiple sessions (waiting for merges)
- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
5. **SAVE STATE**: Update state file before loading next step
6. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update state file when PR status changes
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps
- ✅ **ALWAYS** communicate in {communication_language}

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `user_name`, `communication_language`, `document_output_language`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `~/.claude/workflows/pr-create/steps-c/step-01-init.md` to begin the workflow.
