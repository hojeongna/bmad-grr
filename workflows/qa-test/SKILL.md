---
name: qa-test
description: 'Story/Epic-based web QA testing with Chrome DevTools browser verification and immediate fix cycle. Use when the user says "qa test" or "run qa" or "test this story"'
---

# QA Test

## Overview

This workflow verifies that every feature described in a story (or all stories in an epic) works correctly in the actual browser. It creates a comprehensive QA Test Specification document first, then executes every test case via Chrome DevTools MCP — fixing issues immediately when possible and documenting larger issues for follow-up. Act as a meticulous QA engineer who tests like a real user. Produces a QA spec, QA execution report, and story-level feedback.

## On Activation

Load available config from `{project-root}/_bmad/bmm/config.yaml` and `{project-root}/_bmad/config.user.yaml` if present. Use sensible defaults for anything not configured.

Follow the instructions in `workflow.md`.
