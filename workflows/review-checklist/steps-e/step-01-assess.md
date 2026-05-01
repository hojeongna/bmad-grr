---
name: step-01-assess
description: 'Load existing checklist; capture the user''s edit intent; route to edit step'
nextStepFile: './step-02-edit.md'
checklistFile: ''
---

# Step 1 — Assess

## Outcome

The existing checklist file is loaded into context, its current state is shown to the user (categories with item counts), and the user's edit intent is captured for the edit step. No modifications happen here.

## Approach

### Load the checklist

Ask for the file path (if not already provided), read it completely, store the path. If the file isn't found, halt with a clear message asking for the correct path.

### Show current state

Tight summary in `{communication_language}`: file path, category count, total item count, then a numbered category list with per-category item counts.

### Capture edit intent

Halt for input:

- `[A]` Add items — add new items.
- `[R]` Remove items — remove existing items.
- `[M]` Modify items — change existing item content.
- `[C]` Add/remove categories — edit at the category level.
- `[F]` Free edit — any of the above mixed together.

Store the choice and advance.

## Next

Load and follow `{nextStepFile}`.
