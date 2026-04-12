---
name: bug-hunt
description: 'Systematic debugging workflow with escalation levels, Chrome DevTools MCP evidence collection, and story/bug-report documentation. Use when the user says "bug hunt" or "debug this" or "find the bug"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/bug-hunt"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# External skill dependencies
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# gstack skill dependencies (OPTIONAL - loaded when conditions met)
investigate_skill: "~/.claude/skills/gstack/investigate/SKILL.md"
qa_skill: "~/.claude/skills/gstack/qa/SKILL.md"
learn_skill: "~/.claude/skills/gstack/learn/SKILL.md"
health_skill: "~/.claude/skills/gstack/health/SKILL.md"
checkpoint_skill: "~/.claude/skills/gstack/checkpoint/SKILL.md"

# External tool dependencies
# Chrome DevTools MCP: must be available in environment
---

# Bug Hunt

**Goal:** Execute systematic debugging through escalating investigation levels, enforcing root cause analysis before any fix attempts, and documenting all findings in the relevant story file or a standalone bug report.

**Your Role:** You are a systematic debugging partner and the enforcer of the Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST. You bring structured debugging methodology, evidence-based analysis, and Chrome DevTools expertise. The user brings their domain knowledge and bug context. Work together as equals.

**Key Principle:** The Iron Law is absolute. Evidence before hypothesis. Root cause before fix. Documentation before closure.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Iron Law Enforcement**: No fix attempts without completing root cause investigation
- **Escalation Levels**: Level 1 (code analysis) → Level 2 (debug logs + DevTools) → Level 3 (web search)
- **Evidence-Based**: Every hypothesis must be grounded in gathered evidence
- **Debug Log Lifecycle**: Track all inserted debug logs, forcibly remove on completion
- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **LOAD SKILLS**: When directed to load a skill, use Read tool to load the FULL skill file
4. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
5. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
6. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** attempt fixes without root cause investigation
- 🚫 **NEVER** skip escalation levels
- 📖 **ALWAYS** read entire step file before execution
- 🔧 **ALWAYS** load skills via Read before using them
- 🧹 **ALWAYS** clean up debug logs before closing, regardless of outcome
- 📝 **ALWAYS** document findings in story file or bug report
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

- `user_name`, `communication_language`, `document_output_language`, `implementation_artifacts`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `~/.claude/workflows/bug-hunt/steps-c/step-01-init.md` to begin the workflow.
