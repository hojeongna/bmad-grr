---
name: qa-test
description: 'Story/Epic-based web QA testing with Chrome DevTools browser verification and immediate fix cycle. Use when the user says "qa test" or "run qa" or "test this story"'
---

# QA Test

## Overview

Verifies every feature in a story (or every story in an epic) in a real browser. Authors a QA Test Specification covering scenarios, edge cases, error paths, navigation, regression, accessibility, and responsive views; then executes the spec via Chrome DevTools MCP, fixing small-scope issues immediately and deferring larger ones to follow-up.

## On Activation

Load configuration from `{project-root}/_bmad/bmm/config.yaml` and `{project-root}/_bmad/config.user.yaml` if present. Use sensible defaults for anything not configured.

Follow the instructions in `workflow.md`.
