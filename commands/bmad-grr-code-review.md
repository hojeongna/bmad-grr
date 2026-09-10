---
name: 'code-review'
description: 'Checklist-based code review with parallel file inspection and optional fix. Pass `auto` to fix every finding and re-review until the checklist comes back clean. Use when the user says "review this code" or "run code review"'
---

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @~/.claude/workflows/code-review/workflow.md, READ its entire contents and follow its directions exactly!

ARGUMENTS: $ARGUMENTS

`auto` drops the fix-scope menu and loops: fix every finding at Full scope, re-collect the diff, review again, up to five rounds, until a review comes back with nothing. It still asks for the checklist path and the review source up front. Anything else runs interactively.
