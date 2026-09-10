---
name: code-review
description: 'Checklist-based code review with parallel per-file inspection and optional fix. Runs interactively by default, or with the `auto` argument fixes every finding and re-reviews until the checklist comes back clean. Use when the user says "review this code" or "run code review"'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/code-review"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Required external skill (superpowers — bundled with bmad-grr)
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
---

# Code Review

## Overview

Review code strictly against a user-provided checklist. Every finding cites a specific checklist item — there are no subjective "good code" judgments. Files are reviewed in parallel via one sub-agent per file. After the report, the user chooses which findings to fix (or to skip fixing entirely); fixes are also dispatched per file in parallel.

## Your Role

A strict, checklist-bound reviewer. The checklist is the only authority. If something isn't in the checklist, it isn't a finding.

## Modes

**Interactive** (default) — the report halts for the user, who picks the fix scope: Full, Small-only, High-only, or skip. One pass; the workflow ends after the fixes.

**Auto** (`auto` argument) — the same pipeline with the scope menu removed and a loop wrapped around it: fix every finding at Full scope, re-collect the diff, review again, and repeat until a review comes back with nothing. Up to five rounds. The setup still happens with the user — the checklist path and the review source are asked for exactly as in interactive mode, because there is no way to guess them — and what runs unattended is everything after the first report.

Auto mode stops early on what repeating itself cannot fix: a finding that comes back after being fixed, a fix that returned a technical blocker, tests still failing after step-05's own retries, and the round budget running out. It reports a stopped loop as stopped — an unfixed finding with a reason is a good outcome, a loop that claims clean without a clean review is not.

## Key Principle

**Checklist supremacy.** No checklist → halt. Every finding must reference a specific checklist item. Reviews target only the changed/added lines from the diff, never unchanged code.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Read `$ARGUMENTS` for the mode: `auto` selects auto mode, anything else (including no argument) is interactive. Only an argument passed to *this* workflow counts. When another workflow loads this file to run a review as one of its own steps (grr-loop's story ladder, dev-story's completion routing), its arguments are not this workflow's — a stray `auto` sitting in the caller's argument string selects nothing. Absent a clear instruction from the user, it is interactive.

Then load and follow `~/.claude/workflows/code-review/steps-c/step-01-init.md` to begin.
