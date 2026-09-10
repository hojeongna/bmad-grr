---
name: step-06-complete
description: 'Update story/sprint status if applicable, reflect changes back into story docs, present summary, offer design-pass routing when UI was touched'
designPassCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-pass.md'
handoffOutputPath: '{output_folder}/design-handoff'
---

# Step 6 — Complete

## Outcome

If the review was tied to a story, the story's `Status` is moved from `review` to `done`, sprint tracking is updated to match, and the code-review changes are reflected in the story document so the story stays consistent with the actual code state. The user sees a clear summary and suggested next actions.

## Approach

### Story status update

If `review_source == "story"` (the story path is already known), load the story file, set `Status: done`, and — if `{sprint_status}` exists — update the matching key to `done` in `sprint-status.yaml`, preserving comments and structure.

If the review was diff- or manual-based, ask the user once: is there a related story document? Wait for the answer; don't assume. If yes, take the path and run the same update; if no, skip status updates.

Auto mode does not ask — it skips straight past the status update and says so in the summary. A story path it was never given is not one it should go looking for while running unattended.

**A stopped auto loop leaves the status alone even when the story path is known.** Stopping means findings survived; `done` would be a claim the last review contradicts.

### Reflect review changes into the story

For each known story document, after the status update:

- Load the story completely.
- Look for sections that describe implementation approach, data flow, file structure, or architecture. If code-review fixes changed any of those, update the story to match the actual post-review state.
- Append a `## Code Review Changes` section (or extend an existing equivalent: `## Changes`, `## Notes`, `## Review Notes`) with: date, files modified, summary of changes per file, checklist items that triggered the changes.

### Summary

Tight summary in `{communication_language}`:

- Review source
- Files reviewed and total changed lines
- Violations found / fixed
- Checklist used
- Story status (if updated)
- Suggested next steps: review and test the modified code; update the checklist if new patterns emerged.

In auto mode add the loop's history — one line per round with findings found and fixed — and how it ended: cleared on round N, or stopped by which condition with what is still unfixed. The user was not asked anything after the first report, so this summary is the whole record of what ran on their behalf; a stop condition buried under a fix tally is the one thing it must not do.

### Offer routing

If the review touched UI **and** a mockup exists (look for `{handoffOutputPath}/auto-draft/*.html` or `converted/*.html`), halt for input:

- `[U]` Run `design-pass` Mode L — check the running screen against the HTML mockup it was built from. Review fixes can drift a screen away from its mockup, and that drift is invisible to a checklist-based review.
- `[S]` Stop.

On `U`, load and follow `{designPassCommand}` with the mockup path, the app URL, and the story path (when known). Don't show this menu at all when the review was non-UI or no mockup exists — there's nothing to compare against, and offering it anyway trains the user to skip the prompt.

Auto mode does not halt here either: when the same conditions hold, name `design-pass` Mode L as the suggested next step in the summary and end. Auto mode loops a review, it does not take the user into a second workflow unasked.

End the workflow.
