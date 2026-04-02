---
name: 'step-03-complete'
description: 'Confirm edits saved and offer validation'

validateStep: '../steps-v/step-01-validate.md'
---

# Step 3: Complete — Edit Confirmation

## STEP GOAL:

Confirm edits are saved and offer to run validation on the edited checklist.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

## MANDATORY SEQUENCE

### 1. Completion Summary

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**
**Checklist Edit Complete!**

**File:** {file_path}
**Total items:** {item_count}
**Categories:** {category_count}
**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 2. Suggest Validation

"**Would you like to validate the edited checklist?**
**[V]** Validate — Run quality validation
**[D]** Done — Complete"

#### Menu Handling Logic:

- IF V: Load, read entire file, then execute {validateStep}
- IF D: Workflow complete.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Clear completion summary
- Validation offered

### FAILURE:

- Not offering validation after edit
