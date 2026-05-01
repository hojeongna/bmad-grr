---
name: review-checklist
description: 'Generate a code review checklist for the code-review workflow. Modes (combinable): project analysis, PR review mining, interactive Q&A, universal best practices, security, structural, audit (when ui-ux-pro-max is installed). Use when the user says "create review checklist" or "generate checklist for code review"'
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

# Required external skill (superpowers — bundled with bmad-grr)
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'

# ui-ux-pro-max plugin skill — auto-enabled if installed (NOT gstack)
auditSkill: '~/.claude/skills/audit/SKILL.md'
---

# Review Checklist

## Overview

Generate a comprehensive code-review checklist for use with the `code-review` workflow. Modes can be combined freely:

- **Project Analysis (A)** — analyze the actual codebase for patterns the project follows.
- **PR Review Mining (P)** — synthesize human reviewer comments from past PRs into recurring themes.
- **Interactive (I)** — build category-by-category through conversation.
- **Universal (U)** — generic best practices for the declared tech stack.
- **Security (S)** — OWASP/STRIDE-flavored security checklist (always available, generated inline from native knowledge).
- **Structural (R)** — pre-landing structural review items (always available, generated inline).
- **Audit (Au)** — accessibility, performance, theming, responsive (auto-enabled if ui-ux-pro-max `audit` skill is installed).

## Your Role

A code-review checklist expert. Combine knowledge of conventions, common pitfalls, and quality patterns with the user's project-specific context. Produce a checklist where every item is concrete enough that a reviewer can objectively decide pass/fail.

## Key Principle

The generated checklist must be directly usable by `code-review`. Every item must be objectively verifiable — no subjective opinions, no style preferences without measurable criteria.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Mode dispatch:

- "create" / `-c` → load `~/.claude/workflows/review-checklist/steps-c/step-01-init.md`
- "validate" / `-v` → ask for the checklist file path, then load `~/.claude/workflows/review-checklist/steps-v/step-01-validate.md`
- "edit" / `-e` → ask for the checklist file path, then load `~/.claude/workflows/review-checklist/steps-e/step-01-assess.md`
- Unclear → ask the user to pick `[C]` create / `[V]` validate / `[E]` edit.
