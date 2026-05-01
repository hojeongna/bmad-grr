---
name: step-03-complete
description: 'Confirm edits and offer validation; end the workflow'
validateStep: '../steps-v/step-01-validate.md'
---

# Step 3 — Complete

## Outcome

The user has confirmation that the edits are saved (or were discarded), sees a clean summary (file path, item count, category count), and chooses whether to run validation immediately on the updated checklist or end the workflow.

## Approach

Brief summary in `{communication_language}` — file path, total items, category count — then halt for input:

- `[V]` Validate — load and follow `{validateStep}` to run quality validation on the edited checklist.
- `[D]` Done — end the workflow.
