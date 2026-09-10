---
name: dev-story
description: 'Implement a story with a TDD inner loop, under a BDD acceptance loop — unless the story is tagged change_type: ui, where the tests a project already has carry acceptance instead. Use when the user requests "dev this story [story file]" or "implement next story".'

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

# Dev Story (v2 — ATDD)

## Overview

Implement a story file end-to-end through an **acceptance outer loop** and a **TDD inner loop**. The inner loop never changes: every supporting unit goes through RED-GREEN-REFACTOR under the loaded TDD skill. The outer loop depends on the story's `change_type`, read from its frontmatter in step-01:

- **Scenario track** (`change_type` is anything but `ui`) — each AC becomes a Given/When/Then scenario, executed by the project's BDD runner.
- **UI track** (`change_type: ui`) — no Gherkin scenarios and no BDD runner. Each AC is carried by the project's own component / unit / integration tests, or by inspection where no automated test can reach it.

The split exists because Gherkin scenarios earn their keep against a public interface (endpoint, queue message, emitted event) and mostly get in the way in front of a rendered screen, where fidelity is checked by `design-pass` and behavior by component tests.

On the scenario track the workflow auto-detects the BDD runner (Cucumber, pytest-bdd, playwright-bdd, godog, Reqnroll, etc.) from project files, and falls back to a one-time user choice persisted in config when nothing is detected.

## Your Role

Senior developer agent. Drives implementation from acceptance criteria, never from incidental code structure. Communicates in `{communication_language}` and produces documents in `{document_output_language}`.

## Approach

The workflow proceeds through five stages, each in its own file under `steps-c/`. Each stage describes the outcome it must produce; the executing agent decides the mechanics. Steps are followed in order — no skipping, no peeking ahead.

## Stages

1. **Init** — Find the target story (resume in-progress if present), load context, settle the story's track, detect/confirm the BDD runner on the scenario track, load the TDD skill, mark the story in-progress.
2. **Analyze** — Give every AC a verification path: a Gherkin scenario on the scenario track, a named test (or an inspection note) on the UI track. Identify which can be developed in parallel.
3. **ATDD-TDD Loop** — Per AC: write the failing acceptance test → drill down with the TDD inner loop → confirm it green. Repeat until every AC passes.
4. **Validate** — Acceptance green, full regression green, inline health check (types/lint/tests), AC satisfaction confirmed.
5. **Complete** — Run DoD checklist, mark story for review, update sprint status, summarize for the user.

## On Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults and continue — never block on config.

Then load and follow `~/.claude/workflows/dev-story/steps-c/step-01-init.md` to begin.

## Notes for the Executing Agent

- The TDD skill is **the** authority for the inner loop — load it via Read in step-01 and follow its directives literally. RED must be observed before any production code.
- Each stage has one file. Read it completely, do what it asks, then load the next.
- If a stage fails irrecoverably (missing dependency, broken sprint state, BDD runner unavailable on the scenario track with no user override), HALT and surface the obstacle — do not improvise around it.
- Continuous execution: do not pause between stages for "milestones". The user will interrupt if they want to.
