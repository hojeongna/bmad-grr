---
name: pr-create
description: 'Manage the PR lifecycle for multi-repo workspaces — analyze changes, split when needed, commit/push/test, create PRs, track merges, rebase between sequential PRs. Use when the user says "pr create" or "create pr" or "submit prs"'
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

## Key Principle

Each PR has a clear, single responsibility. Splits are by role, not by line count. Tests must pass before a PR is created. Merges happen on GitHub — the workflow tracks status and rebases the next PR when its predecessor lands.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/pr-create/steps-c/step-01-init.md` to begin.
