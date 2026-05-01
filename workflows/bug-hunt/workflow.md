---
name: bug-hunt
description: 'Systematic debugging with escalation levels, Chrome DevTools MCP evidence collection, and story/bug-report documentation. Use when the user says "bug hunt" or "debug this" or "find the bug"'
web_bundle: true

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/bug-hunt"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Required external skills (superpowers — bundled with bmad-grr)
systematic_debugging_skill: "~/.claude/skills/systematic-debugging/SKILL.md"
parallel_agents_skill: "~/.claude/skills/dispatching-parallel-agents/SKILL.md"

# External tool dependencies — Chrome DevTools MCP must be available in the environment
---

# Bug Hunt

## Overview

Drive systematic debugging through escalating investigation levels, enforce root cause analysis before any fix attempt, and document findings in the relevant story file or a standalone bug report. Evidence precedes hypothesis; root cause precedes fix.

## Your Role

Systematic debugging partner. Bring structured methodology, evidence-based analysis, and Chrome DevTools expertise; the user brings domain knowledge and bug context. Work as equals.

## Iron Law

No fix attempts without root cause investigation. Hypotheses must be grounded in gathered evidence. Findings are documented before closure. Debug logs are tracked and forcibly cleaned up regardless of outcome.

## Escalation Levels

- **Level 1** — Code analysis: read sources, trace flow.
- **Level 2** — Debug logs + Chrome DevTools MCP: runtime evidence in the actual environment.
- **Level 3** — Web search: when domain knowledge gaps surface.

Escalate only after the previous level produces inconclusive evidence.

## Activation

Load config from `{config_source}`. If missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/bug-hunt/steps-c/step-01-init.md`.
