---
name: step-05-complete
description: 'Summarize results; offer to chain into dev-story or design-pass Branch A; otherwise end'
devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
designPassCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-pass.md'
---

# Step 5 — Complete

## Outcome

The user sees a clear summary of refinements, then chooses what to do next: chain immediately into dev-story for implementation, run design-pass Branch A first for UI/UX enhancement (recommended for UI refinements), or end the workflow with the refined story already queued for a future dev-story run.

## Approach

### Final summary

Present in `{communication_language}`: the table of modified/created stories with brief change summaries and `Status: ready-for-dev`, plus the sprint-status update confirmation.

### Offer next steps

Halt for input:

- `[D]` Run dev-story now — load `{devStoryCommand}` with the refined story path as context so it picks up directly.
- `[U]` Run design-pass Branch A first — recommended for UI/UX refinements; load `{designPassCommand}` to enrich the story with UX considerations. After design-pass completes, return here and re-offer `D` / `S` (the `U` option is consumed).
- `[S]` End here — list all modified/created file paths and remind the user that the stories are queued in sprint-status as `ready-for-dev`, so a fresh `dev-story` invocation will auto-pick them up.

End the workflow on `D` (after dev-story chains) or `S`.
