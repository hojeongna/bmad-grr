---
name: create-epics-and-stories
description: 'Transform PRD + Architecture into comprehensive epics and stories through 4-step workflow enriched with gstack skills. grr-enhanced fork of bmad-create-epics-and-stories — preserves original flow, adds plan-ceo-review for value validation, plan-eng-review for feasibility, dispatching-parallel-agents for parallel story analysis, test-driven-development for TDD decomposition, autoplan for final 4-way validation, learn for past epic sizing.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
main_config: '{project-root}/_bmad/bmm/config.yaml'
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
planning_artifacts: "{config_source}:planning_artifacts"
project_knowledge: "{config_source}:project_knowledge"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/create-epics-and-stories"
outputFile: '{planning_artifacts}/epics.md'
project_context: "**/project-context.md"

# REQUIRED gstack skills (FULL load when installed — LLM judgment for application timing)
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
ceo_review_skill: '~/.claude/skills/gstack/plan-ceo-review/SKILL.md'
eng_review_skill: '~/.claude/skills/gstack/plan-eng-review/SKILL.md'
autoplan_skill: '~/.claude/skills/gstack/autoplan/SKILL.md'

# REQUIRED superpowers skills (bundled with bmad-grr)
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
tdd_skill: '~/.claude/skills/test-driven-development/SKILL.md'

# CONDITIONAL gstack skills (LLM judgment based on epic/story content)
cso_skill: '~/.claude/skills/gstack/cso/SKILL.md'
design_review_skill: '~/.claude/skills/gstack/plan-design-review/SKILL.md'
devex_review_skill: '~/.claude/skills/gstack/plan-devex-review/SKILL.md'
---

# Create Epics and Stories (grr-enhanced)

**Goal:** Transform PRD requirements and Architecture decisions into comprehensive stories organized by user value, enriched with gstack skills for value validation, feasibility checking, parallel story analysis, and multi-lens final validation.

**Your Role:** In addition to your name, communication_style, and persona, you are also a product strategist and technical specifications writer collaborating with a product owner. This grr-enhanced version adds gstack integration at key decision points. Work together as equals.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution, enriched with an **Integrated Skills Hub**.

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file, executed one at a time
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Steps completed in order, no skipping
- **State Tracking**: Progress in output file frontmatter via `stepsCompleted` array
- **Append-Only Building**: Build documents by appending content as directed
- **Integrated Skills Hub**: gstack + superpowers skills declared in frontmatter (REQUIRED vs CONDITIONAL). REQUIRED skills loaded when installed; CONDITIONAL based on LLM judgment of epic/story content.
- **LLM Judgment**: Do NOT mechanically match keywords. Read the epic/story content, judge relevance, cite reasoning.
- **Graceful Degradation**: Missing skills → warn clearly and continue.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: Only proceed to next step when user selects 'C' (Continue)
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter of output files when writing final output for a specific step
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps
- 🔧 **ALWAYS** load REQUIRED gstack + superpowers skills in FULL via Read when installed — no skimming
- 🧠 **NEVER** mechanically match keywords for CONDITIONAL skills — judge based on actual epic/story content
- ⚠️ **IF** a skill is missing, emit clear warning and continue — never fail, never silently skip
- ✅ **ALWAYS** communicate in {communication_language}
- ✅ **ALWAYS** write output documents in {document_output_language}

## Integrated Skills Hub

This workflow integrates gstack + superpowers skills to enrich each step with structured frameworks.

### REQUIRED Skills (always loaded when installed)

| Skill | Used in Steps | Purpose |
|---|---|---|
| `learn` | step-01-validate-prerequisites, step-04-final-validation | Past epic sizing + save epic/story learnings |
| `plan-ceo-review` | step-02-design-epics | CEO-mode value validation per epic (Is this epic earning its weight?) |
| `plan-eng-review` | step-02-design-epics, step-03-create-stories | Engineering feasibility per epic + per-story complexity check |
| `dispatching-parallel-agents` | step-03-create-stories | Parallel analysis of multiple epics / stories (superpowers) |
| `test-driven-development` | step-03-create-stories | TDD decomposition — each story's testability |
| `autoplan` | step-04-final-validation | Final 4-way validation pipeline |

### CONDITIONAL Skills (LLM judgment based on content)

| Skill | Load When | Purpose |
|---|---|---|
| `cso` | step-02 / step-03 / step-04 — if any epic/story touches security | OWASP/STRIDE per affected epic |
| `plan-design-review` | step-03 / step-04 — if UI-heavy stories | Design coherence across story breakdown |
| `plan-devex-review` | step-03 / step-04 — if DX stories | DX coherence across story breakdown |

### External Skill Loading Protocol

When a step instructs (or judgment says) to load a skill:

1. Use Read tool to load the **FULL** skill file — no offset, no limit
2. Read the entire file completely — internalize framework, voice, decision patterns
3. Follow the skill's directives EXACTLY as written within the step's scope
4. Do NOT summarize or abbreviate the skill
5. **IF skill file does not exist:** Emit warning ("⚠️ `{skill_name}` not installed — reduced quality for {purpose}") and continue gracefully

## Activation

1. Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:
   - Use `{user_name}` for greeting
   - Use `{communication_language}` for all communications
   - Use `{document_output_language}` for output documents
   - Use `{planning_artifacts}` for output location and artifact scanning
   - Use `{project_knowledge}` for additional context scanning

2. First Step EXECUTION

Read fully and follow: `./steps/step-01-validate-prerequisites.md` to begin the workflow.

**Note:** This grr-enhanced version adds gstack integration at step-02 (design epics), step-03 (create stories), and step-04 (final validation). Each step loads REQUIRED skills and applies them to the current work.
