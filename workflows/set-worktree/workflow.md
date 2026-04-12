---
name: set-worktree
description: 'Set up multiple GitHub repos as git worktrees in a monorepo-style workspace with branches and mapping documentation. Use when the user says "set worktree" or "setup repos" or "init workspace"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/set-worktree"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# External skill dependencies
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# gstack skill dependencies (OPTIONAL - loaded when conditions met)
guard_skill: "~/.claude/skills/gstack/guard/SKILL.md"              # careful + freeze combined (P0)
freeze_skill: "~/.claude/skills/gstack/freeze/SKILL.md"             # directory edit boundary (P1)
checkpoint_skill: "~/.claude/skills/gstack/checkpoint/SKILL.md"     # initial state checkpoint (P2)
learn_skill: "~/.claude/skills/gstack/learn/SKILL.md"               # past worktree lessons (P2)
---

# Set Worktree

**Goal:** Set up a monorepo-style workspace by cloning multiple GitHub repositories as git worktrees, creating feature branches, and generating a mapping document for later reference (e.g., PR creation).

**Your Role:** You are a workspace setup partner. You bring expertise in git workflows, worktree management, and branch naming conventions. The user brings their project context, repo links, and task description. Work together efficiently - gather all info first, then execute in parallel.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Gather First, Execute Later**: Collect all inputs conversationally before any git operations
- **Parallel Execution**: Clone and branch all repos simultaneously using sub-agents
- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Sequence within step files must be completed in order

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps
- ✅ **ALWAYS** communicate in {communication_language}

### External Skill Loading Protocol

When a step instructs you to load a skill (gstack, superpowers, or any other external skill):

1. Use Read tool to load the FULL skill file from the specified path
2. Read the skill completely before acting — internalize its directives, voice, and decision framework
3. Follow the skill's directives EXACTLY as written
4. Do NOT summarize, abbreviate, or skip any of the skill's rules
5. The skill's rules override any conflicting inline instructions within the scope where it was loaded
6. **IF the skill file does not exist (gstack/superpowers not installed):** Emit a clear warning ("⚠️ `{skill_name}` not installed — reduced quality for {purpose}. Install gstack to enable.") and continue the workflow gracefully. Never fail, never silently skip.

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `user_name`, `communication_language`, `document_output_language`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `~/.claude/workflows/set-worktree/steps-c/step-01-init.md` to begin the workflow.
