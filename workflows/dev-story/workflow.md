---
name: dev-story
description: 'Implement a story with BDD-based ATDD outer loop and TDD inner loop. Use when the user requests "dev this story [story file]" or "implement next story".'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/dev-story"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Story reference (optional — passed by user, else auto-discovered)
story_file: ""

# Required external skill (superpowers — bundled with bmad-grr)
tdd_skill: "~/.claude/skills/test-driven-development/SKILL.md"
---

# Dev Story (v2 — BDD-based ATDD)

## Overview

Implement a story file end-to-end through a **BDD-based ATDD outer loop** and a **TDD inner loop**. Each Acceptance Criterion is expressed as a Given/When/Then scenario, executed by the project's BDD runner, and made green by drilling down through unit-level RED-GREEN-REFACTOR (governed by the loaded TDD skill).

The workflow is universal — it auto-detects the project's BDD runner (Cucumber, pytest-bdd, playwright-bdd, godog, Reqnroll, etc.) from project files, and falls back to a one-time user choice persisted in config when nothing is detected.

## Your Role

Senior developer agent. Drives implementation from acceptance criteria, never from incidental code structure. Communicates in `{communication_language}` and produces documents in `{document_output_language}`.

## Approach

The workflow proceeds through five stages, each in its own file under `steps-c/`. Each stage describes the outcome it must produce; the executing agent decides the mechanics. Steps are followed in order — no skipping, no peeking ahead.

## Stages

1. **Init** — Find the target story (resume in-progress if present), load context, detect/confirm the project's BDD runner, load the TDD skill, mark the story in-progress.
2. **Analyze** — Express each AC as a Gherkin scenario (Given/When/Then); identify scenarios that can be developed in parallel.
3. **ATDD-TDD Loop** — Per scenario: write failing acceptance test → drill down with the TDD inner loop → confirm scenario green. Repeat until every scenario passes.
4. **Validate** — All scenarios green, full regression green, inline health check (types/lint/tests), AC satisfaction confirmed.
5. **Complete** — Run DoD checklist, mark story for review, update sprint status, summarize for the user.

## On Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults and continue — never block on config.

Then load and follow `~/.claude/workflows/dev-story/steps-c/step-01-init.md` to begin.

## Notes for the Executing Agent

- The TDD skill is **the** authority for the inner loop — load it via Read in step-01 and follow its directives literally. RED must be observed before any production code.
- Each stage has one file. Read it completely, do what it asks, then load the next.
- If a stage fails irrecoverably (missing dependency, broken sprint state, BDD runner unavailable with no user override), HALT and surface the obstacle — do not improvise around it.
- Continuous execution: do not pause between stages for "milestones". The user will interrupt if they want to.
