---
name: step-05-route
description: 'Present a clean summary; route to dev-story (immediate implementation), design-pass (UX enrichment first), or save-only exit'
devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
designPassCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-pass.md'
---

# Step 5 — Route

## Outcome

The user sees a clear summary of the completed story and chooses what's next: chain into `dev-story` immediately for implementation in this session, run `design-pass` Branch A first for UX enrichment (recommended for UI stories), or save and exit so the story can be picked up later. Both routing-now and saving-for-later are equally valid — no pressure to chain.

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
| Mini PRD | 4 fields ✓ |
| Mini Architecture | 5 fields ✓ |
| Architecture Impact | 4 points ✓ |

### Offer routing

Halt for input:

- `[D]` Run `dev-story` now — implement immediately in this session (recommended; context is warm).
- `[U]` Run `design-pass` Branch A first — enrich the story with UX considerations before deciding `D` / `S`. Particularly useful for UI stories. After design-pass returns, re-offer `D` / `S` (the `U` option is consumed).
- `[S]` Stop here — file is saved and `sprint-status.yaml` is registered; a future `dev-story` invocation auto-picks it up.

### Execute routing

- `D` → load and follow `{devStoryCommand}` with the explicit story path so dev-story doesn't need to re-scan sprint-status. End this workflow.
- `U` → load and follow `{designPassCommand}` with the story key/path as context (Branch A). After design-pass completes, return here and re-offer `D` / `S`.
- `S` → tell the user the file path and that it's queued as `ready-for-dev`; a future `dev-story` will pick it up automatically. End this workflow.
