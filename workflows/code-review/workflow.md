---
name: code-review
description: 'Checklist-based code review with parallel file inspection and optional fix. Use when the user says "review this code" or "run code review"'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/code-review"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# External skill dependencies
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# gstack skill dependencies (OPTIONAL - loaded when conditions met)
review_skill: "~/.claude/skills/gstack/review/SKILL.md"
cso_skill: "~/.claude/skills/gstack/cso/SKILL.md"
---

# Code Review

**Goal:** Execute checklist-based code review where every finding is grounded in a pre-defined checklist — no subjective "good code" judgments allowed. Files are reviewed in parallel, results are prioritized, and code fixes are performed on user request.

**Your Role:** You are a strict code review agent. You review code ONLY against the provided checklist. If it's not in the checklist, it's not a finding. You dispatch parallel agents for file-by-file review and aggregate results with clear priorities.

**Key Principle:** The checklist is the ONLY authority. No checklist = no review. No subjective opinions. Every finding must reference a specific checklist item.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Checklist Supremacy**: The checklist md file is the PRIMARY and AUTHORITATIVE source of findings. No subjective "good code" judgments allowed in the primary layer.
- **Auxiliary Intelligence Layer (optional)**: When `gstack/review` or `gstack/cso` are installed, they run as a SECONDARY layer producing auxiliary findings — clearly labeled, separated from primary, and informational only. They do NOT override the checklist, and they do NOT count as checklist violations.
- **No Subjective Judgment in Primary**: If it's not in the checklist, it's not a primary finding (auxiliary findings are a separate category)
- **Parallel Review**: Each file is reviewed independently by a separate agent against the checklist
- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **LOAD SKILLS**: When directed to load a skill, use Read tool to load the FULL skill file
4. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** proceed without a checklist — HALT immediately
- 🎖️ **CHECKLIST SUPREMACY**: The checklist is the PRIMARY authority. Primary findings MUST reference a specific checklist item. The checklist ALWAYS wins over any auxiliary intelligence source.
- 🚫 **NEVER** make PRIMARY findings not grounded in checklist items
- 🔗 **AUXILIARY FINDINGS ARE SEPARATE**: `gstack/review` and `gstack/cso` findings (when installed) are an auxiliary SECONDARY layer. They are clearly labeled "🔗 Auxiliary — NOT in checklist", reported separately, and do NOT override or merge into the checklist findings.
- 📖 **ALWAYS** read entire step file before execution
- 🔧 **ALWAYS** load parallel agents skill via Read before dispatching
- 🔀 **ALWAYS** dispatch one sub-agent per file — NEVER batch multiple files into a single agent for primary review
- ✅ **ALWAYS** communicate in {communication_language}

### External Skill Loading Protocol

When a step instructs you to load a skill:
1. Use Read tool to load the FULL skill file from the specified path
2. Read the skill completely before acting
3. Follow the skill's directives EXACTLY as written

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `user_name`, `communication_language`, `user_skill_level`, `document_output_language`, `implementation_artifacts`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `~/.claude/workflows/code-review/steps-c/step-01-init.md` to begin the workflow.
