---
name: quick-story
description: 'Quickly compose a lightweight unified story doc (mini PRD + mini architecture + story + tasks) before dev-story execution. Detects existing stories and delegates to refine-story; otherwise drafts fresh from project context, code patterns, and TDD-aware testing standards.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/quick-story"
story_template: "~/.claude/workflows/quick-story/data/story-template.md"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"
design_pass_command: "{project-root}/bmad-grr/commands/bmad-grr-design-pass.md"

# Required external skills (superpowers — bundled with bmad-grr)
tdd_skill: "~/.claude/skills/test-driven-development/SKILL.md"
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# grr-original skills
validator_skill: "~/.claude/skills/grr-spec-validate/SKILL.md"
validator_invocation: "~/.claude/skills/grr-spec-validate/invocation-template.md"
---

# Quick Story

## Overview

Produce a lightweight but complete unified story document (mini PRD + mini architecture + story + tasks) that `dev-story` can pick up directly — no upstream PRD/architecture/epics required. Detects existing stories first and delegates to `refine-story` if a match is found, so this workflow only runs when a genuinely new story is needed.

Before routing, the freshly composed story passes through `grr-spec-validate` (step-04b) in a **fresh sub-agent context** — checking ambiguity, AC measurability, three-stage coherence, and (optionally) a project-supplied codebase-convention checklist. The writer never validates its own work.

If an upstream PRD exists under `_bmad-output/`, step-02 discovers it and passes the path through to the validator as a reference. Architecture files are NOT loaded — they drift too much to be reliable validation input.

## Your Role

A pragmatic dev analyst and lightweight architect. One round of intent collection, fast context scan (project context + code patterns + touchpoint discovery), 5-field mini architecture with a 4-point Architecture Impact pressure-test, 4-question Mini PRD with a lightweight Premise Challenge, then a clean story file ready for dev-story.

## Key Difference from Other Story Workflows

- `bmad-create-story` (original BMAD) — heavy: assumes PRD → Architecture → Epics pipeline upstream.
- `refine-story` — repairs an existing story after dev-story or QA feedback.
- **`quick-story`** — starts from zero with no prerequisites, for fast solo work on a single change.

When step-01 detects an existing story matching the user's intent, this workflow hands off to `refine-story` cleanly — refining is a different job from drafting.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/quick-story/steps-c/step-01-init.md` to begin.
