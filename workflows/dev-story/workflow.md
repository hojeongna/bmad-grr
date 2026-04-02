---
name: dev-story
description: 'Execute story implementation with TDD skill enforcement and parallel agent dispatching. Use when the user says "dev this story [story file]" or "implement the next story with TDD"'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/dev-story"

# Story and sprint references
story_file: "" # Explicit story path; auto-discovered if empty
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# External skill dependencies (CRITICAL)
tdd_skill: "~/.claude/skills/test-driven-development/SKILL.md"
tdd_anti_patterns: "~/.claude/skills/test-driven-development/testing-anti-patterns.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
---

# Dev Story

**Goal:** Execute story implementation following a context-filled story spec file, enforcing TDD through direct skill loading and leveraging parallel agent dispatching for independent tasks.

**Your Role:** You are a senior developer agent that implements stories with strict TDD discipline. You MUST load and follow external skills directly — TDD is not optional, it is enforced by loading `{tdd_skill}` before any implementation. When independent tasks exist, you dispatch parallel agents following `{parallel_agents_skill}`.

**Key Difference from dev-story:** This workflow does NOT inline TDD instructions. Instead, it loads external skill files via Read tool and follows their exact directives. Skills are the source of truth.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file that must be followed exactly
- **Just-In-Time Loading**: Only the current step file is in memory — never load future step files until directed
- **Sequential Enforcement**: Steps must be completed in order, no skipping or optimization allowed
- **Skill-Driven Execution**: TDD and parallel agent behaviors are governed by external skill files, not inlined instructions
- **Continuous Execution**: Do NOT stop for "milestones", "significant progress", or "session boundaries" — continue until HALT or all tasks complete

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **LOAD SKILLS**: When directed to load a skill, use Read tool to load the FULL skill file and follow its directives
4. **SAVE STATE**: Track progress for continuation support
5. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 🎯 **ALWAYS** follow the exact instructions in the step file
- 📋 **NEVER** create mental todo lists from future steps
- 🔧 **ALWAYS** load TDD skill via Read before writing any production code
- 🔧 **ALWAYS** load parallel agents skill via Read before dispatching agents
- ✅ **ALWAYS** communicate in {communication_language}

### External Skill Loading Protocol

When a step instructs you to load a skill:
1. Use Read tool to load the FULL skill file from the specified path
2. Read the skill completely before acting
3. Follow the skill's directives EXACTLY as written
4. Do NOT summarize, abbreviate, or skip any skill rules
5. The skill's rules override any conflicting inline instructions

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `user_name`, `communication_language`, `user_skill_level`, `document_output_language`, `implementation_artifacts`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `~/.claude/workflows/dev-story/steps-c/step-01-init.md` to begin the workflow.
