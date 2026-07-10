---
name: loop
description: 'Drive a project from idea — or any later entry point (has-prd, has-epics-sprint, resume) — through implementation to an optional PR/deploy, orchestrating existing grr and native BMAD workflows in sequence rather than reimplementing their internal logic. Use when the user says "grr loop", "run the full loop", or "idea to deploy".'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/loop"
planning_artifacts: "{config_source}:planning_artifacts"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
stateFile: "{implementation_artifacts}/grr-loop-state-{date}.md"
state_template: "~/.claude/workflows/loop/data/grr-loop-state-template.md"
project_context: "**/project-context.md"
---

# Loop

## Overview

Take a project from wherever it currently stands — a bare idea with no PRD, a PRD with no architecture, epics and a sprint already scoped, or a loop left mid-run from a prior session — and drive it through planning, design, architecture, epics, sprint setup, and a per-story dev/review/QA loop to an optional PR and deploy, entirely by orchestrating the grr and native BMAD workflows that already do this work. `grr-loop` does not reimplement any of their internal logic: each phase's job is to check a precondition, invoke the one existing command or skill responsible for that phase, wait for it to finish, verify its exit condition against real artifacts on disk, update the shared state file, and route to the next phase.

The one behavior `grr-loop` adds on top of what those workflows already do is the story-loop retry ladder: every story in `sprint-status.yaml` is driven all the way to `clean` or `escalated` — never silently skipped — using a shared 3-attempt budget across dev-story, bug-hunt, and refine-story, with code-review and qa-test folded into the same ladder rather than treated as separate retry budgets.

## Your Role

A router, not an implementer. Bring sequencing discipline (precondition → invoke → verify → record → route) and honest escalation; let each invoked workflow bring its own domain expertise. When a downstream workflow is interactive and grr-loop is running headless, say so plainly rather than pretending the loop automated something it didn't.

## Key Principle

Every step's job is to check, invoke, wait, verify against real artifacts, update `{stateFile}`, and point to the next step — not to restate or duplicate the invoked workflow's own steps. State lives in one place: `{stateFile}` (frontmatter + Phase Log / Story Ladder / Escalated Stories), with `sprint-status.yaml` remaining the sole source of truth for per-story status.

## Phases (in order)

1. **Init / Resume** — resolve entry point, capture deploy/design/retro choices, verify the spec-gate precondition, create or reload `{stateFile}`.
2. **Planning** — produce a validated `prd.md` (fresh-idea entry point only).
3. **Design** — for UI-bearing projects, hand off to `design-handoff` for a UX/UI guide and redesign spec.
4. **Architecture** — produce `architecture.md` via `bmad-create-architecture`.
5. **Epics** — produce `epics.md` via `bmad-create-epics-and-stories`, gated by `grr-spec-validate`.
6. **Sprint Setup** — generate `sprint-status.yaml` and resolve the shared code-review checklist path.
7. **Story Loop** — drive every story through dev-story → code-review → qa-test under the shared 3-attempt retry ladder to clean-or-escalated.
8. **Report** — consolidate clean/escalated results; gate on escalation before PR/deploy; terminal when `deploy_option` is `none`.
9. **PR & Deploy** — create (and, per `deploy_option`, merge and/or deploy) PRs for the finished work; mark the loop `COMPLETE`.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/loop/steps-c/step-01-init.md` to begin.
