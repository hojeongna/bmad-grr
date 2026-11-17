---
name: step-01-init
description: 'Settle the mode; load the mandatory checklist; select the review source (story / git diff / manual file list)'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-02-collect.md'
---

# Step 1 — Init

## Outcome

The mode is settled, a checklist is loaded into context (categories and items parsed and ready for downstream agents), and the review source is selected — story file, git diff range, or a manual file list. The workflow halts here if no checklist is provided.

## Approach

### Mode

Interactive or auto, per the workflow's activation. Say which one is running before anything else. In auto mode add one line on what that means here: no fix-scope menu, every finding gets fixed, and the review repeats until it comes back clean or the loop stops itself.

Use the checklist, source and diff base supplied in arguments; ask only for missing inputs in either mode.

### Require a checklist (non-negotiable)

Read the supplied checklist markdown path, or ask for it if absent. Parse and retain every category and item for step-03.

If the user has no checklist or refuses to provide one, HALT — without a checklist there is nothing authoritative to review against. Suggest running `review-checklist` to generate one.

### Select review source

Offer three options:

- `[S]` Story document — review the files listed in a story's File List section. Ask for the story path and load it.
- `[D]` Git diff — review by diff range (collected in step-02).
- `[M]` Manual — review a specific list of files provided by the user.

Store `review_source` and `story_file` (if S) for downstream steps.

## Next

Once the checklist is loaded and a review source is chosen, load and follow `{nextStepFile}`.
