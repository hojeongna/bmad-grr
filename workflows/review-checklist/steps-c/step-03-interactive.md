---
name: step-03-interactive
description: 'Build checklist items category-by-category through conversation; if other modes also ran, refine their results with the user'
nextStepFile: './step-04-integrate.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 3 — Interactive

## Outcome

The user has walked through categories at their own pace, adding team-specific rules, modifying or skipping items as they choose. If other modes also ran, their results are used as starting points and refined here. Any extra rules outside the standard categories are also captured. Results are stored for the integration step.

## Approach

### Set context

Load `{analysisCategories}` for the category list.

If automatic modes (A/P/U/S/R/Au) also ran, frame the conversation as refinement: "We'll go through each category — for each, I'll show what the auto-generated agents produced; you confirm, modify, or add."

If interactive-only, frame it as discovery: "Tell me the rules your team cares about; I can suggest common items if you're unsure; you can skip any category."

### Walk through categories

Present 2–3 categories at a time, not all at once. For each:

- If auto results exist for this category, show them concisely.
- Ask whether there are team-specific rules they want to capture.
- Suggest 1–2 common items if the user seems unsure — don't pre-fill, ask.
- The user may add, modify, or skip.

Respect early exit: if the user says "done" or "enough", stop the walkthrough.

### Capture extras

After the categories, ask once: "Any additional rules not covered above? Team conventions, frequently flagged items, easy-to-miss things?". Record what they share.

### Summarize

Brief summary in `{communication_language}`: items added, items modified, categories skipped.

## Next

Load and follow `{nextStepFile}`.
