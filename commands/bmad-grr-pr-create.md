---
name: 'pr-create'
description: 'Manage PR lifecycle: analyze changes, split large PRs by responsibility, commit/push/test, create PRs, track merges and rebase. Pass `auto` to run unattended through review rounds to merge. Use when the user says "pr create" or "create pr" or "submit prs"'
---

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @~/.claude/workflows/pr-create/workflow.md, READ its entire contents and follow its directions exactly!

ARGUMENTS: $ARGUMENTS

`auto` runs the workflow unattended: no confirmation stops, and after each PR opens it waits for the reviews to land, acts on what they flag, pushes, waits again, and merges once CI is green with nothing unresolved. Anything else runs interactively.
