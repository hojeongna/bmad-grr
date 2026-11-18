---
name: 'code-review'
description: 'Checklist-based code review with responsibility-based inspection and optional fix. Pass `auto` to fix every finding and re-review until the checklist comes back clean. Use when the user says "review this code" or "run code review"'
---

Read `~/.claude/workflows/code-review/workflow.md` in full and follow it.

ARGUMENTS: $ARGUMENTS

`auto` fixes confirmed findings and re-reviews, at most five rounds. Supply checklist/source/base in arguments; ask only for missing inputs. Other calls are interactive.
