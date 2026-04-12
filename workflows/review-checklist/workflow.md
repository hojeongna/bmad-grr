---
name: review-checklist
description: 'Code review checklist generator. Base modes: project analysis, PR mining, interactive, universal. Auto-added gstack modes when installed: security (cso), structural (review), learnings-based (learn), audit (a11y/perf/theming). Use when the user says "create review checklist" or "generate checklist for code review"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/review-checklist"
project_context: "**/project-context.md"
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'

# gstack skill dependencies (OPTIONAL - each enables an additional checklist generation mode)
csoSkill: '~/.claude/skills/gstack/cso/SKILL.md'            # → Agent S (Security category)
reviewSkill: '~/.claude/skills/gstack/review/SKILL.md'      # → Agent R (Structural category)
learnSkill: '~/.claude/skills/gstack/learn/SKILL.md'        # → Agent L (Project-specific rules from past learnings)
auditSkill: '~/.claude/skills/audit/SKILL.md'               # → Agent Au (Accessibility / Performance / Theming) — ui-ux-pro-max plugin, at skill root
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
- 🔧 **ALWAYS** load selected gstack skills (cso/review/learn/audit) in FULL via Read when installed
- ⚠️ **IF** a selected gstack skill is missing, warn clearly and continue — never fail, never silently skip
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
