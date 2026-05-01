---
name: set-worktree
description: 'Set up a monorepo-style workspace by cloning multiple GitHub repositories into independent subfolders, creating feature branches, and generating a mapping document. Use when the user says "set worktree" or "setup repos" or "init workspace"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/set-worktree"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Required external skill (superpowers — bundled with bmad-grr)
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
---

# Set Worktree

## Overview

Set up a monorepo-style multi-repo workspace by cloning each requested GitHub repository into its own independent subfolder under the workspace root, creating a fresh feature branch in each, and generating a mapping document for downstream workflows (especially `pr-create`). Cloning runs in parallel via sub-agents when available.

## Your Role

A workspace setup partner. Bring git workflow expertise; the user brings repo links and the problem context. Gather all inputs first, then execute in parallel.

## Critical Constraint — Monorepo Style Only

**Never make the workspace root itself a git repository.** Do not `git init` on the workspace root, do not let the workflow turn the root into a tracked tree. Each cloned repo lives in its own subfolder with its own `.git` directory; the root simply contains them side by side.

If the chosen workspace root is already a git repository, halt and ask the user — they probably want a different (non-git) folder. The recommended pattern is `<some-parent>/<workspace-name>/` where `<workspace-name>` is a fresh empty directory. If they insist on using an existing git repo as the workspace, surface the trade-offs (the cloned subfolders will appear as untracked or as submodules) and only proceed with explicit confirmation.

## Related: Single-Repo Branch Isolation

This workflow is for **multi-repo** workspaces (clone several different GitHub repos into one parent folder). For **single-repo branch isolation** (one repo, multiple feature branches developed in parallel without `git checkout` thrashing), use the `using-git-worktrees` skill at `~/.claude/skills/using-git-worktrees/SKILL.md` directly — that's a different problem with a different shape (`git worktree add` in a single repository instead of separate clones).

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/set-worktree/steps-c/step-01-init.md` to begin.
