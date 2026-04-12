---
name: create-architecture
description: 'Create comprehensive architecture through 8-step collaborative workflow enriched with gstack skills. grr-enhanced fork of bmad-create-architecture — preserves original BMad architecture flow, adds plan-eng-review for architecture supremacy, cso for security threat modeling, test-driven-development for test strategy, systematic-debugging for failure mode analysis, learn for past decisions, autoplan for final 4-way validation.'

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
installed_path: "~/.claude/workflows/create-architecture"
outputFile: '{planning_artifacts}/architecture.md'
project_context: "**/project-context.md"

# REQUIRED gstack skills (FULL load when installed — LLM judgment for application timing)
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
eng_review_skill: '~/.claude/skills/gstack/plan-eng-review/SKILL.md'
cso_skill: '~/.claude/skills/gstack/cso/SKILL.md'
autoplan_skill: '~/.claude/skills/gstack/autoplan/SKILL.md'

# REQUIRED superpowers skills (bundled with bmad-grr)
tdd_skill: '~/.claude/skills/test-driven-development/SKILL.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'

# CONDITIONAL gstack skills (LLM judgment — loaded when architecture content matches domain)
ceo_review_skill: '~/.claude/skills/gstack/plan-ceo-review/SKILL.md'
design_review_skill: '~/.claude/skills/gstack/plan-design-review/SKILL.md'
devex_review_skill: '~/.claude/skills/gstack/plan-devex-review/SKILL.md'
investigate_skill: '~/.claude/skills/gstack/investigate/SKILL.md'
health_skill: '~/.claude/skills/gstack/health/SKILL.md'
---

# Architecture Workflow (grr-enhanced)

**Goal:** Create comprehensive architecture decisions through collaborative step-by-step discovery, enriched with gstack skills for engineering supremacy, security threat modeling, failure mode analysis, and final multi-perspective validation.

**Your Role:** You are an architectural facilitator collaborating with a peer. This is a partnership, not a client-vendor relationship. You bring structured thinking, architectural knowledge, AND integrated gstack frameworks (`plan-eng-review`, `cso`, `systematic-debugging`, `autoplan`), while the user brings domain expertise and product vision. Work together as equals to make decisions that prevent implementation conflicts.

---

## WORKFLOW ARCHITECTURE

This uses **micro-file architecture** for disciplined execution, enriched with an **Integrated Skills Hub**.

### Core Principles

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- Document state tracked in frontmatter
- Append-only document building through conversation
- You NEVER proceed to a step file if the current step file indicates the user must approve and indicate continuation
- **Integrated Skills Hub**: gstack + superpowers skills declared in frontmatter (REQUIRED vs CONDITIONAL). REQUIRED skills loaded when installed; CONDITIONAL based on LLM judgment of architecture content.
- **LLM Judgment**: Do NOT mechanically match keywords. Read the decision being made, judge relevance, cite reasoning from the actual architecture content.
- **Graceful Degradation**: Missing skills → warn clearly and continue.

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 🔧 **ALWAYS** load REQUIRED gstack + superpowers skills in FULL via Read when installed (see Integrated Skills Hub) — no skimming
- 🧠 **NEVER** mechanically match keywords for CONDITIONAL skills — judge based on actual architecture content and cite specific reasoning
- ⚠️ **IF** a skill is missing, emit clear warning ("⚠️ `{skill}` not installed — reduced quality for {purpose}") and continue — never fail, never silently skip
- ✅ **ALWAYS** communicate in {communication_language}
- ✅ **ALWAYS** write output documents in {document_output_language}

## Integrated Skills Hub

This architecture workflow integrates gstack + superpowers skills to enrich each step with structured frameworks.

### REQUIRED Skills (always loaded when installed)

| Skill | Used in Steps | Purpose |
|---|---|---|
| `learn` | step-01-init, step-02-context, step-05-patterns, step-08-complete | Query past architecture learnings + save architecture decisions as learnings |
| `plan-eng-review` | step-03-starter, step-04-decisions, step-05-patterns, step-06-structure | Engineering-grade review of each decision — scope challenge, failure modes, test coverage |
| `cso` | step-04-decisions, step-07-validation | Chief Security Officer framework (OWASP, STRIDE, supply chain, LLM security) |
| `test-driven-development` | step-05-patterns | TDD patterns informing architectural testability |
| `systematic-debugging` | step-07-validation | Failure mode analysis per component |
| `autoplan` | step-07-validation | Final 4-way validation pipeline (CEO + design + eng + DX) |

### CONDITIONAL Skills (LLM judgment based on architecture content)

| Skill | Load When | Purpose |
|---|---|---|
| `plan-ceo-review` | step-03, step-07 — if scope drift from PRD detected | CEO-mode scope alignment check |
| `plan-design-review` | step-06, step-07 — if user-facing system | Design-coherent architecture validation |
| `plan-devex-review` | step-06, step-07 — if API/SDK/dev tool system | Developer experience validation |
| `investigate` | step-04 — if decision involves novel tech or high uncertainty | Systematic root-cause analysis for trade-offs |
| `health` | step-01 — if brownfield project | Current codebase health assessment |

### External Skill Loading Protocol

When a step instructs (or judgment says) to load a skill:

1. Use Read tool to load the **FULL** skill file — no offset, no limit
2. Read the entire file completely — internalize its framework, voice, decision patterns
3. Follow the skill's directives EXACTLY as written within the step's scope
4. Do NOT summarize or abbreviate the skill
5. **IF the skill file does not exist:** Emit warning ("⚠️ `{skill_name}` not installed — reduced quality for {purpose}") and continue gracefully

## Activation

1. Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:
   - Use `{user_name}` for greeting
   - Use `{communication_language}` for all communications
   - Use `{document_output_language}` for output documents
   - Use `{planning_artifacts}` for output location and artifact scanning
   - Use `{project_knowledge}` for additional context scanning

2. EXECUTION

Read fully and follow: `./steps/step-01-init.md` to begin the workflow.

**Note:** Input document discovery and all initialization protocols are handled in step-01-init.md. This grr-enhanced version adds gstack integration at key decision points — step-03 (starter), step-04 (decisions), step-05 (patterns), step-06 (structure), step-07 (final validation).
