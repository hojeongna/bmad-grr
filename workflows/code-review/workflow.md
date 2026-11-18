---
name: code-review
description: 'Independent checklist review with optional fixes. Interactive by default; auto fixes findings and re-reviews until clean or stopped.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
user_skill_level: "{config_source}:user_skill_level"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/code-review"
output_folder: "{config_source}:output_folder"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Required external skill (superpowers — bundled with bmad-grr)
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"
---

# Code Review

## Overview

Review contract groups independently: small starts at one; full uses at most three reviewers per round, four or five only for high risk per step-03. Confirm candidates by reproduction/static checks without confirmation agents; the developer fixes findings.

## Your Role

A strict, checklist-bound reviewer. The checklist is the only authority. If something isn't in the checklist, it isn't a finding.

## Modes

**Interactive** (default) — the report halts for the user, who picks the fix scope: Full, Small-only, High-only, or skip. One pass; the workflow ends after the fixes.

**Auto** (`auto` argument) — the same pipeline with the scope menu removed and a loop wrapped around it: fix every finding at Full scope, re-collect the diff, review again, and repeat until a review comes back with nothing. Up to five rounds. Use supplied checklist/source/base inputs; ask only for missing ones.

Auto mode stops early on what repeating itself cannot fix: a finding that comes back after being fixed, a fix that returned a technical blocker, tests still failing after step-05's own retries, and the round budget running out. It reports a stopped loop as stopped — an unfixed finding with a reason is a good outcome, a loop that claims clean without a clean review is not.

## Key Principle

No checklist → halt. Findings cite checklist items and defects introduced by the diff, including deletions; related unchanged code supplies context.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Read `$ARGUMENTS` for the mode: `auto` selects auto mode, anything else (including no argument) is interactive. Only an argument passed to *this* workflow counts. When another workflow loads this file to run a review as one of its own steps (grr-loop's story ladder, dev-story's completion routing), its arguments are not this workflow's — a stray `auto` sitting in the caller's argument string selects nothing. Absent a clear instruction from the user, it is interactive.

Then load and follow `~/.claude/workflows/code-review/steps-c/step-01-init.md` to begin.
