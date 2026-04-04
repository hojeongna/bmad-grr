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

# External skill dependencies
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
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

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `user_name`, `communication_language`, `document_output_language`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `~/.claude/workflows/set-worktree/steps-c/step-01-init.md` to begin the workflow.
