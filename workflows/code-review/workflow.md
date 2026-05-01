---
name: code-review
description: 'Checklist-based code review with parallel per-file inspection and optional fix. Use when the user says "review this code" or "run code review"'

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

## Key Principle

**Checklist supremacy.** No checklist → halt. Every finding must reference a specific checklist item. Reviews target only the changed/added lines from the diff, never unchanged code.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/code-review/steps-c/step-01-init.md` to begin.
