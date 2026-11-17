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
planning_artifacts: "{config_source}:planning_artifacts"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "~/.claude/commands/bmad-grr-dev-story.md"
refine_story_command: "~/.claude/commands/bmad-grr-refine-story.md"
design_pass_command: "~/.claude/commands/bmad-grr-design-pass.md"

# Required external skills (superpowers — bundled with bmad-grr)
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# grr-original skills
validator_skill: "~/.claude/skills/grr-spec-validate/SKILL.md"
validator_invocation: "~/.claude/skills/grr-spec-validate/invocation-template.md"
---

# Quick Story

## Overview

Write one story for `dev-story`; route an existing matching story to `refine-story`.

Before routing, `grr-spec-validate` (step-04b) independently checks the story in a fresh context.

Use an upstream PRD as a reference when present; derive architecture from current code.

**Small branch.** Use `small` only for a clear, low-risk, local change with known current and expected behavior. Shared contracts/state, permissions, payments, external APIs, concurrency, new dependencies, or uncertain impact require `full`, regardless of file count; promote on discovery. After step-02 confirms small, go directly to step-04: write one story containing problem/user/scope, observable ACs and edge cases, ordered tasks, touchpoints/constraints, verification notes, and the usual status/change_type/Dev Agent Record/File List. Record the small rationale in Dev Notes; omit the full template and separate architecture step. Step-04b uses one fresh validator for all applicable rubrics. Pass supplied answers, save permission and next route through arguments; ask only about missing decisions. Both paths retain DoD, independent code review, Hojeong's screen acceptance and human merge; ticket coding stays Opus+xhigh.

## Your Role

A pragmatic analyst: establish intent, inspect current code, and write a verifiable story at the change's scope.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/quick-story/steps-c/step-01-init.md` to begin.
