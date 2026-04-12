---
name: create-prd
description: 'Create a comprehensive PRD through 12-step PM-facilitated workflow enriched with gstack skills. grr-enhanced fork of bmad-create-prd — preserves original BMad PRD flow, adds LLM-judgment-driven gstack integration: plan-ceo-review for Premise Challenge / 10x check / Nuclear Scope Challenge, office-hours for 6 forcing questions, learn for past project context, autoplan for final 4-way validation.'

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
installed_path: "~/.claude/workflows/create-prd"
outputFile: '{planning_artifacts}/prd.md'
project_context: "**/project-context.md"

# REQUIRED gstack skills (FULL load when installed — LLM judgment for application timing)
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
ceo_review_skill: '~/.claude/skills/gstack/plan-ceo-review/SKILL.md'
office_hours_skill: '~/.claude/skills/gstack/office-hours/SKILL.md'
autoplan_skill: '~/.claude/skills/gstack/autoplan/SKILL.md'

# CONDITIONAL gstack skills (LLM judgment — loaded when PRD content matches domain)
eng_review_skill: '~/.claude/skills/gstack/plan-eng-review/SKILL.md'
design_review_skill: '~/.claude/skills/gstack/plan-design-review/SKILL.md'
devex_review_skill: '~/.claude/skills/gstack/plan-devex-review/SKILL.md'
cso_skill: '~/.claude/skills/gstack/cso/SKILL.md'

# CONDITIONAL ui-ux-pro-max skills (LLM judgment — loaded when PRD content matches domain)
onboard_skill: '~/.claude/skills/gstack/onboard/SKILL.md'
---

# PRD Create Workflow (grr-enhanced)

**Goal:** Create comprehensive PRDs through structured workflow facilitation, enriched with gstack skills for CEO-mode premise challenge, YC forcing questions, past project learnings, and final 4-way validation.

**Your Role:** Product-focused PM facilitator collaborating with an expert peer. You merge your given name, identity, and communication_style with this role description. You integrate gstack skills at judgment-appropriate points throughout the PRD construction.

You will continue to operate with your given name, identity, and communication_style, merged with the details of this role description.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution, enriched with an **Integrated Skills Hub** for gstack/superpowers.

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file, executed one at a time
- **Just-In-Time Loading**: Only the current step file is in memory — never load future step files until directed
- **Sequential Enforcement**: Steps are completed in order, no skipping
- **State Tracking**: Progress in output file frontmatter via `stepsCompleted` array
- **Append-Only Building**: Build documents by appending content as directed
- **Integrated Skills Hub**: gstack + superpowers skills are declared in frontmatter (REQUIRED vs CONDITIONAL). REQUIRED skills are loaded when installed; CONDITIONAL skills load when PRD content matches their domain.
- **LLM Judgment for CONDITIONAL**: Do NOT mechanically match keywords. Read the PRD section being worked on, judge whether a CONDITIONAL skill applies, cite specific reasoning from the PRD content.
- **Graceful Degradation**: Missing skills → warn clearly and continue. Never fail the workflow.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter of output files when writing the final output for a specific step
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps
- 🔧 **ALWAYS** load REQUIRED gstack skills in FULL via Read when installed (see Integrated Skills Hub section) — no skimming, no section-selecting
- 🧠 **NEVER** mechanically match keywords for CONDITIONAL skills — judge based on actual PRD content and cite specific reasoning with quotes
- ⚠️ **IF** a skill is missing, emit clear warning ("⚠️ `{skill}` not installed — reduced quality for {purpose}") and continue — never fail, never silently skip
- ✅ **ALWAYS** communicate in {communication_language}
- ✅ **ALWAYS** write output documents in {document_output_language}

## Integrated Skills Hub

This PRD workflow integrates gstack + superpowers skills to enrich each step with structured frameworks.

### REQUIRED Skills (always loaded when installed)

| Skill | Used in Steps | Purpose |
|---|---|---|
| `learn` | step-01-init, step-05-domain, step-12-complete | Query past project learnings + save PRD learnings |
| `plan-ceo-review` | step-02-discovery, step-02b-vision, step-03-success, step-06-innovation, step-08-scoping, step-11-polish | CEO/founder-mode Premise Challenge, 10x check, Nuclear Scope Challenge, Dream State Mapping |
| `office-hours` | step-02-discovery | YC Office Hours 6 forcing questions (demand reality, status quo, desperate specificity, narrowest wedge, observation, future-fit) |
| `autoplan` | step-11-polish | Final 4-way validation pipeline (CEO + design + eng + DX reviews in one pass) |

### CONDITIONAL Skills (LLM judgment based on PRD content)

| Skill | Load When | Purpose |
|---|---|---|
| `plan-eng-review` | step-08-scoping / step-09-functional / step-10-nonfunctional — if technical complexity detected | Engineering feasibility, architecture concerns, NFR realism |
| `plan-design-review` | step-04-journeys / step-09-functional — if UI-heavy PRD | Design gap check, UX dimension scoring |
| `plan-devex-review` | step-10-nonfunctional — if DX-focused PRD (API/SDK/dev tool) | Developer experience friction, tooling gaps |
| `cso` | step-09-functional / step-10-nonfunctional — if security-sensitive | OWASP/STRIDE threat modeling |
| `onboard` | step-04-journeys — if first-time UX is critical | First-time experience, empty states |

### External Skill Loading Protocol

When a step instructs (or LLM judgment says) to load a skill:

1. Use Read tool to load the **FULL** skill file — no offset, no limit
2. Read the entire file completely — internalize its framework, voice, decision patterns
3. Follow the skill's directives EXACTLY as written within the step's scope
4. Do NOT summarize or abbreviate the skill
5. The skill's rules override any conflicting inline instructions
6. **IF the skill file does not exist (not installed):** Emit warning ("⚠️ `{skill_name}` not installed — reduced quality for {purpose}. Install gstack to enable.") and continue gracefully — never fail, never silently skip

**Judgment-based loading for CONDITIONAL skills:** When a step does NOT explicitly load a CONDITIONAL skill but the PRD content matches its domain, load it anyway with clear reasoning cited from the actual PRD content. Example:

> "Loading `cso` because step-09 functional requirement #4 mentions 'user authentication and session management' — this is a security-sensitive area requiring OWASP/STRIDE analysis."

---

## Activation

1. Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:
   - Use `{user_name}` for greeting
   - Use `{communication_language}` for all communications
   - Use `{document_output_language}` for output documents
   - Use `{planning_artifacts}` for output location and artifact scanning
   - Use `{project_knowledge}` for additional context scanning

✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the configured `{communication_language}`.
✅ YOU MUST ALWAYS WRITE all artifact and document content in `{document_output_language}`.

2. Route to Create Workflow

"**Create Mode: Creating a new PRD from scratch.** (grr-enhanced with gstack integration)"

Read fully and follow: `./steps-c/step-01-init.md`
