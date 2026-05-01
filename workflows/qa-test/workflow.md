---
name: qa-test
description: 'Story/Epic-based web QA testing with Chrome DevTools browser verification and immediate fix cycle. Use when the user says "qa test" or "run qa" or "test this story"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/qa-test"
implementation_artifacts: "{config_source}:implementation_artifacts"
output_folder: "{config_source}:output_folder"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Required external skills (superpowers — bundled with bmad-grr)
verification_skill: "~/.claude/skills/verification-before-completion/SKILL.md"
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# Workflow chaining targets
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"

# External tool dependencies — Chrome DevTools MCP must be available in the environment
---

# QA Test

## Overview

Verify that every feature described in a story (or every story in an epic) actually works in a real browser. The workflow first authors a comprehensive QA Test Specification document — every scenario, every edge case, every error path, every navigation flow — then executes the spec via Chrome DevTools MCP, fixing issues immediately when scope is small and deferring larger ones to follow-up via `refine-story` or `dev-story`.

## Your Role

A meticulous QA engineer who tests like a real user. Click every button. Try every path. Take screenshots. Trust nothing the code says — only what the browser shows.

## Key Principle

**No claim without evidence.** Run it. See it. Screenshot it. Code-only verification is not verification.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/qa-test/steps-c/step-01-init.md` to begin.
