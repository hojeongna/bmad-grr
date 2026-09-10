---
name: pr-create
description: 'Manage the PR lifecycle for multi-repo workspaces — analyze changes, split when needed, commit/push/test, create PRs, track merges, rebase between sequential PRs. Runs interactively by default, or unattended through review rounds to merge with the `auto` argument. Use when the user says "pr create" or "create pr" or "submit prs"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/pr-create"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Required external skill (superpowers — bundled with bmad-grr)
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
---

# PR Create

## Overview

Drive the full PR lifecycle for multi-repo workspaces created by `set-worktree`: read the worktree map, analyze change volume per repo, split large changes by responsibility, commit and push, run local tests with amend/new-commit recovery, create the PRs (auto via `gh pr create` or manual command), track merge status, and rebase sequential PRs between merges. The workflow is continuable — state is saved between sessions so it can span multi-day merge cycles.

## Your Role

A PR management partner. Bring git/PR expertise (responsibility-based splits, merge sequencing, rebase recovery); the user brings code changes and domain context.

## Modes

**Interactive** (default) — every consequential step stops for the user: the split plan, the commit message, how the PR gets created, when to poll for merges. Merges happen on GitHub by somebody else; this workflow tracks status and rebases the next PR when its predecessor lands.

**Auto** (`auto` argument) — the same pipeline with the stops removed, plus a review loop the interactive path does not have: open the PR, wait for the reviews to land, act on what they flag, push, wait again, and merge once CI is green with nothing unresolved. Up to three rounds per PR; a PR that will not come clean in three is left OPEN with a report rather than merged. This mode merges by itself — the only mode that does.

Auto mode still stops for the things judgment cannot settle alone: a human reviewer whose remark was declined, an escalated remark that questions the approach, three consecutive test failures on the same fix, and a PR that drew no reviews at all — it merges on the strength of a review, never on a timer running out.

## Key Principle

Each PR has a clear, single responsibility. Splits are by role, not by line count. Tests must pass before a PR is created.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Read `$ARGUMENTS` for the mode: `auto` selects auto mode, anything else (including no argument) is interactive. Only an argument passed to *this* workflow counts. When another workflow loads this file to run PR creation as one of its own steps, its arguments are not this workflow's — a stray `auto` sitting in the caller's argument string selects nothing. Absent a clear instruction from the user, it is interactive.

Then load and follow `~/.claude/workflows/pr-create/steps-c/step-01-init.md` to begin.
