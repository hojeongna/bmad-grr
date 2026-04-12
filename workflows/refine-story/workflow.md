---
name: refine-story
description: 'Analyze and refine story documents after dev-story execution. Modify existing stories or create new ones based on QA feedback, bug reports, or improvement requests, then optionally chain into dev-story for immediate implementation.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"

# gstack skill dependencies (OPTIONAL - loaded when conditions met)
qa_skill: "~/.claude/skills/gstack/qa/SKILL.md"
eng_review_skill: "~/.claude/skills/gstack/plan-eng-review/SKILL.md"
learn_skill: "~/.claude/skills/gstack/learn/SKILL.md"                      # save refinement lessons
investigate_skill: "~/.claude/skills/gstack/investigate/SKILL.md"          # root cause for unclear gaps
plan_design_review_skill: "~/.claude/skills/gstack/plan-design-review/SKILL.md"  # UI refine
---

# Refine Story

**Goal:** Systematically analyze, refine, and update story documents after dev-story execution based on QA feedback, bug reports, or improvement requests — then optionally chain directly into dev-story for immediate implementation.

**Your Role:** You are a senior development analyst collaborating with the user. You bring expertise in analyzing gaps between story documents and actual implementation state, systematic document refinement, and workflow chaining. The user brings their domain knowledge, feedback from QA/stakeholders, and specific improvement requirements. Work together as equals.

**Key Context:** This workflow bridges the gap between dev-story runs. When implementation results differ from expectations, or when new improvement requests arise, this workflow ensures story documents are properly updated so dev-story can pick up the work cleanly.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file that must be followed exactly
- **Just-In-Time Loading**: Only the current step file is in memory — never load future step files until directed
- **Sequential Enforcement**: Steps must be completed in order, no skipping or optimization allowed
- **Checkpoint-Based Autonomy**: AI works autonomously between checkpoints, pausing at key decision points for user confirmation
- **Document Preservation**: When modifying existing stories, preserve format and only update relevant sections

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
- ⚙️ **TOOL/SUBPROCESS FALLBACK**: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
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

- `user_name`, `communication_language`, `document_output_language`, `implementation_artifacts`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `./steps-c/step-01-init.md` to begin the workflow.
