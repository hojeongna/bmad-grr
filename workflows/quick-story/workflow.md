---
name: quick-story
description: 'Quickly compose a lightweight unified story doc (mini PRD + mini architecture + story + tasks) before dev-story execution. Detects existing stories and delegates to refine-story, otherwise drafts a fresh doc using optional gstack skills (learn, plan-eng-review, health, qa) for Prior Learnings lookup and Architecture Impact analysis.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/quick-story"
story_template: "~/.claude/workflows/quick-story/data/story-template.md"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"

# gstack skill dependencies (REQUIRED - load FULL file unconditionally when installed; warn on miss)
learn_skill: "~/.claude/skills/gstack/learn/SKILL.md"
eng_review_skill: "~/.claude/skills/gstack/plan-eng-review/SKILL.md"
ceo_review_skill: "~/.claude/skills/gstack/plan-ceo-review/SKILL.md"
health_skill: "~/.claude/skills/gstack/health/SKILL.md"
qa_skill: "~/.claude/skills/gstack/qa/SKILL.md"

# gstack skill dependencies (CONDITIONAL - loaded when change_type / touchpoints match domain)
design_review_skill: "~/.claude/skills/gstack/plan-design-review/SKILL.md"  # UI/UX scope
devex_review_skill: "~/.claude/skills/gstack/plan-devex-review/SKILL.md"    # DX / tooling scope

# superpowers skill dependencies (REQUIRED - bundled with bmad-grr install)
tdd_skill: "~/.claude/skills/test-driven-development/SKILL.md"
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
---

# Quick Story

**Goal:** Produce a lightweight but complete unified story document (mini PRD + mini architecture + story + tasks) that `dev-story` can pick up without any prior PRD, architecture, or epic artifacts. Fast path for solo dev work and small changes, with optional gstack integration for Prior Learnings retrieval and Architecture Impact sanity checks.

**Your Role:** You are a pragmatic dev analyst and lightweight architect. You pull context from `project-context.md`, prior learnings (via `gstack/learn`), and light code scanning — then draft a mini architecture, run it through `gstack/plan-eng-review` for a quick 4-point Impact sanity check, compose a unified story document, and hand off cleanly to `dev-story`.

**Key Difference from other story workflows:**

- `bmad-create-story` assumes a full PRD → architecture → epics pipeline already exists upstream (heavy)
- `bmad-grr-refine-story` assumes an existing story document needs post-dev refinement (repairs)
- **`bmad-grr-quick-story` starts from zero**, with NO prerequisites — for fast solo work on a single change, standalone

**When to delegate to refine-story:** If step-01 detects an existing story matching the user's intent, this workflow hands off to `bmad-grr-refine-story` cleanly — because refining an existing story is a different job than drafting a new one.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file that must be followed exactly
- **Just-In-Time Loading**: Only the current step file is in memory — never load future step files until directed
- **Sequential Enforcement**: Steps must be completed in order, no skipping or optimization allowed
- **Compact But Thorough**: Lightweight *output* (concise story doc), but *context gathering* is thorough — all REQUIRED skills fully loaded, all relevant perspectives consulted. Quality over token cost.
- **Required Skill Loading**: REQUIRED skills listed in frontmatter (gstack + superpowers bundled with bmad-grr) are loaded in FULL via Read when installed, not section-selected. CONDITIONAL skills load only when `change_type` or touchpoints match their domain.
- **Missing Skill Handling**: If a REQUIRED skill is not installed, warn the user clearly but continue producing the story — never fail the workflow because of missing install, but never silently skip either.
- **Existing Work Detection**: Always check for existing stories first. If found, delegate to refine-story — do not duplicate.
- **Dev-Story Compatibility**: Output format must match what `dev-story` expects so chaining works without any transformation.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **LOAD SKILLS**: When directed to load a gstack skill, use Read tool to load the FULL skill file (or the needed sections) and follow its directives
5. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 🎯 **ALWAYS** follow the exact instructions in the step file
- 📋 **NEVER** create mental todo lists from future steps
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 🔀 **ALWAYS** delegate to refine-story when step-01 detects an existing matching story
- 📄 **ALWAYS** produce a dev-story-compatible output format (Status / Story / AC / Tasks / Dev Notes / Dev Agent Record / File List)
- 🔧 **ALWAYS** load REQUIRED skills in FULL via Read when installed — no skimming, no section-selection. This includes large files like `plan-eng-review` (~22K tokens) and `plan-ceo-review` (~29K tokens). Quality > token cost.
- ⚠️ **IF** any REQUIRED skill is missing, warn the user with a clear line ("⚠️ {skill} not installed — reduced quality") and continue. Never fail, never silently skip.
- 🎛️ **CONDITIONAL skills** (plan-design-review, plan-devex-review, systematic-debugging) load only when `change_type` or touchpoints match their domain — not every run
- ⚙️ **TOOL/SUBPROCESS FALLBACK**: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ **ALWAYS** communicate in {communication_language}

### External Skill Loading Protocol

When a step instructs you to load a gstack or superpowers skill:

1. Use Read tool to load the **FULL** skill file from the specified path — no offset, no limit, no section-select. Yes, even for large files.
2. Read the entire file completely. Internalize the skill's directives, voice, priority hierarchy, and decision framework.
3. Follow the skill's directives EXACTLY as written throughout the step where it was loaded
4. Do NOT summarize, abbreviate, or skip any of the skill's rules — the skill is the source of truth
5. The skill's rules override any conflicting inline instructions in this workflow
6. **Missing skill handling:**
   - **REQUIRED skill missing**: Emit a clear warning to the user ("⚠️ `{skill_name}` is required but not installed — workflow will proceed with reduced quality. Install bmad-grr (`bash install.sh`) and gstack to enable."). Then continue the workflow without that skill's contribution to the current step.
   - **CONDITIONAL skill missing but domain matches**: Same warning pattern, continue without.
   - **CONDITIONAL skill domain does not match**: Silently skip (no warning needed — not applicable to this run).

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `user_name`, `communication_language`, `document_output_language`, `implementation_artifacts`, `output_folder`

### 2. First Step Execution

Load, read the full file and then execute `./steps-c/step-01-init.md` to begin the workflow.
