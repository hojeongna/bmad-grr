---
name: step-05-route
description: 'Present a clean summary; route to dev-story (immediate implementation), design-pass (mockup coverage check first), or save-only exit'
devStoryCommand: '~/.claude/commands/bmad-grr-dev-story.md'
designPassCommand: '~/.claude/commands/bmad-grr-design-pass.md'
---

# Step 5 — Route

## Outcome

Summarize the validated story and execute the supplied next route; ask only when none was supplied.

## Approach

### Final summary

Present in `{communication_language}`:

| Item | Value |
|---|---|
| Story Key | `{story_key}` |
| File | `{story_path}` |
| Complexity | `{complexity}` |
| Status | `ready-for-dev` ✓ |
| sprint-status | 등록 완료 ✓ |
| Scope | small rationale / full architecture and PRD |
| Validation | `grr-spec-validate` ✓ (or `overridden` if step-04b's `[O]` was chosen) |

### Offer routing

Use the supplied route, or ask:

- `[D]` Run `dev-story` now — implement immediately in this session (recommended; context is warm).
- `[U]` Run `design-pass` Mode P first — check this story against the HTML mockup and promote anything it doesn't cover into AC / Tasks before deciding `D` / `S`. Offer this only when a `design-handoff` mockup actually exists for this UI; without one there's nothing to compare against. After design-pass returns, re-offer `D` / `S` (the `U` option is consumed).
- `[S]` Stop here — file is saved and `sprint-status.yaml` is registered; a future `dev-story` invocation auto-picks it up.

### Execute routing

- `D` → load and follow `{devStoryCommand}` with the explicit story path so dev-story doesn't need to re-scan sprint-status. End this workflow.
- `U` → load and follow `{designPassCommand}` with the story key/path and the mockup path as context (Mode P). After design-pass completes, return here and re-offer `D` / `S`.
- `S` → tell the user the file path and that it's queued as `ready-for-dev`; a future `dev-story` will pick it up automatically. End this workflow.
