---
name: design-pass
description: 'LLM-judgment-first UI/UX design pass with two branches: pre-dev (story doc enhancement) and live-fix (live screen audit + improvement doc). Audit framework is inline; UX skills (ui-ux-pro-max) auto-dispatched by judgment from actual content — story document (Branch A) or live audit findings + user concern (Branch B) — never by mechanical keyword matching.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/design-pass"
ux_dispatch_rules: "~/.claude/workflows/design-pass/data/ux-auto-dispatch-rules.md"
ux_checklist: "~/.claude/workflows/design-pass/data/ux-checklist.md"
improvement_template: "~/.claude/workflows/design-pass/data/improvement-doc-template.md"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"
quick_story_command: "{project-root}/bmad-grr/commands/bmad-grr-quick-story.md"

# ui-ux-pro-max design context (REQUIRED — loaded once at init, shared across all UX skill applications)
frontend_design_skill: "~/.claude/skills/frontend-design/SKILL.md"
design_context_file: "{project-root}/.impeccable.md"

# ui-ux-pro-max UX skills — auto-dispatched based on LLM judgment in step-02a/02b
critique_skill: "~/.claude/skills/critique/SKILL.md"
polish_skill: "~/.claude/skills/polish/SKILL.md"
normalize_skill: "~/.claude/skills/normalize/SKILL.md"
arrange_skill: "~/.claude/skills/arrange/SKILL.md"
distill_skill: "~/.claude/skills/distill/SKILL.md"
typeset_skill: "~/.claude/skills/typeset/SKILL.md"
colorize_skill: "~/.claude/skills/colorize/SKILL.md"
bolder_skill: "~/.claude/skills/bolder/SKILL.md"
quieter_skill: "~/.claude/skills/quieter/SKILL.md"
delight_skill: "~/.claude/skills/delight/SKILL.md"
animate_skill: "~/.claude/skills/animate/SKILL.md"
overdrive_skill: "~/.claude/skills/overdrive/SKILL.md"
adapt_skill: "~/.claude/skills/adapt/SKILL.md"
harden_skill: "~/.claude/skills/harden/SKILL.md"
clarify_skill: "~/.claude/skills/clarify/SKILL.md"
onboard_skill: "~/.claude/skills/onboard/SKILL.md"
---

# Design Pass

## Overview

Apply UX judgment to either enhance a pre-dev story document with UX considerations (Branch A) or audit a running screen and produce an improvement document (Branch B). The base audit framework is inline — visual hierarchy, consistency, AI slop patterns, states (empty/error/loading), accessibility, motion/feedback, responsive — applied directly without external skills. UX improvement skills from the ui-ux-pro-max suite are then auto-dispatched based on LLM judgment from the actual content (story document or live audit findings), with explicit reasoning citing specific sources. Never mechanical keyword matching.

## Your Role

A UX-minded design partner. Read deeply (Branch A) or observe critically (Branch B). Identify what's at risk from the actual content, not patterns. Select ui-ux-pro-max skills that address those risks. Always explain your selection with concrete references — story AC/Tasks/Dev Notes/Risks for Branch A, audit findings/screenshots/console errors/user concerns for Branch B.

## Branch Distinction

- `quick-story` / `bmad-create-story` produce new stories from scratch.
- `refine-story` modifies existing stories based on gap analysis.
- `code-review` / `bug-hunt` deal with code quality and bugs.
- **`design-pass`** focuses on UI/UX quality — Branch A bakes UX considerations into stories before dev, Branch B improves running UI after dev.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

### Design context loading (required for ui-ux-pro-max skills)

ui-ux-pro-max skills produce generic output without project design context. Load it once here so every later skill application inherits it. Search in this order, stopping at the first hit:

1. `{design_context_file}` (`.impeccable.md` at project root) — read it; if it has target audience, brand personality, design direction, store as `design_context`.
2. `{project_context}` — if `.impeccable.md` doesn't exist, look for a Design Context section in `project-context.md`.
3. Otherwise, load `{frontend_design_skill}` in full — internalize its Context Gathering Protocol and aesthetic guidelines (typography, color, layout, motion, interaction, UX writing, AI-slop test). These guidelines are the fallback design context.

If no design context is found anywhere, warn the user once: "프로젝트 디자인 컨텍스트가 없어요. `/teach-impeccable`을 실행하면 더 정확한 UX 판단이 가능해요. 지금은 일반적인 기준으로 진행할게요." Continue with `frontend-design` aesthetic guidelines only.

If `{frontend_design_skill}` itself doesn't exist, warn that ui-ux-pro-max skills will operate without project design context, and continue.

Then load and follow `~/.claude/workflows/design-pass/steps-c/step-01-init.md` to begin.
