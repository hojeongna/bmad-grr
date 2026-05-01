---
name: step-06-complete
description: 'Update story/sprint status if applicable, reflect changes back into story docs, present summary'
---

# Step 6 — Complete

## Outcome

If the review was tied to a story, the story's `Status` is moved from `review` to `done`, sprint tracking is updated to match, and the code-review changes are reflected in the story document so the story stays consistent with the actual code state. The user sees a clear summary and suggested next actions.

## Approach

### Story status update

If `review_source == "story"` (the story path is already known), load the story file, set `Status: done`, and — if `{sprint_status}` exists — update the matching key to `done` in `sprint-status.yaml`, preserving comments and structure.

If the review was diff- or manual-based, ask the user once: is there a related story document? Wait for the answer; don't assume. If yes, take the path and run the same update; if no, skip status updates.

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
- Suggested next steps: review and test the modified code; update the checklist if new patterns emerged; if UI was touched, consider running `bmad-grr-design-pass` on the live result.

End the workflow.
