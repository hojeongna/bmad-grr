---
name: refine-story
description: 'Analyze and refine story documents after dev-story execution; modify or create stories based on QA feedback, bug reports, or improvement requests; optionally chain into dev-story for immediate implementation.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/refine-story"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
design_pass_command: "{project-root}/bmad-grr/commands/bmad-grr-design-pass.md"
---

# Refine Story

## Overview

Bridge the gap between dev-story runs. When QA feedback, bug reports, or improvement requests arise, this workflow refines the existing story document — or creates a new one — so dev-story can pick up the work cleanly. Optionally chains directly into dev-story for immediate implementation.

## Your Role

A senior development analyst working as a peer to the user. Bring expertise in gap analysis between intent (story doc) and reality (implementation/feedback); the user brings domain knowledge and feedback context.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/refine-story/steps-c/step-01-init.md` to begin.
