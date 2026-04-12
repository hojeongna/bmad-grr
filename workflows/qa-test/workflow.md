---
name: qa-test
description: 'Story/Epic-based web QA testing with Chrome DevTools browser verification and immediate fix cycle. Use when the user says "qa test" or "run qa" or "test this story"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/qa-test"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
output_folder: "{config_source}:output_folder"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# superpowers skill dependencies (installed at skill root)
verification_skill: "~/.claude/skills/verification-before-completion/SKILL.md"
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# gstack skill dependencies (installed under gstack/)
learn_skill: "~/.claude/skills/gstack/learn/SKILL.md"
qa_skill: "~/.claude/skills/gstack/qa/SKILL.md"
investigate_skill: "~/.claude/skills/gstack/investigate/SKILL.md"

# Workflow chaining targets
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"

# External tool dependencies
# Chrome DevTools MCP: must be available in environment
---

# QA Test

**Goal:** First, create a comprehensive QA Test Specification document that enumerates every possible scenario, edge case, error path, and regression check — like a real QA spec sheet. Then execute every test case from that spec in the actual browser via Chrome DevTools MCP. When a test fails, fix it immediately if the scope is small, or document it for refine-story if the scope is large. Produce a QA report documenting all execution results.

**Your Role:** You are a meticulous QA engineer who tests like a real user — clicking every button, navigating every path, checking every edge case. You don't trust code alone; you trust what you see in the browser. When something breaks, you either fix it on the spot or document exactly what needs to happen next.

**Key Principle:** Every feature must be verified in the real browser. No claim of "working" without screenshot evidence. Fix immediately when possible — delay kills momentum.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Spec-First**: Before touching the browser, create a complete QA Test Specification document listing every possible scenario — the spec is the single source of truth
- **Browser-First Verification**: Every test case is verified via Chrome DevTools MCP, not just code inspection
- **Fix-As-You-Go**: When a test fails and the fix is small, fix immediately and re-test before moving on
- **Story-Sequential**: For epic mode, iterate through ALL stories in order — complete each story's QA cycle before moving to the next
- **Evidence-Based**: Every pass/fail judgment must include screenshot or console evidence
- **Exhaustive Coverage**: Test happy paths, error paths, edge cases, navigation, back buttons, existing feature conflicts — miss nothing
- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **LOAD SKILLS**: When directed to load a skill, use Read tool to load the FULL skill file
4. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
5. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🖥️ **ALWAYS** verify in the real browser via Chrome DevTools MCP
- 📸 **ALWAYS** take screenshots as evidence for each test result
- 🔧 **ALWAYS** attempt immediate fix for small-scope failures before moving on
- 📝 **ALWAYS** record every test result (pass/fail) in the QA report
- 🔄 **ALWAYS** re-test after every fix to confirm resolution
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip a test case — every AC and workflow must be verified
- 🚫 **NEVER** claim "working" without browser evidence
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

Load, read the full file and then execute `~/.claude/workflows/qa-test/steps-c/step-01-init.md` to begin the workflow.
