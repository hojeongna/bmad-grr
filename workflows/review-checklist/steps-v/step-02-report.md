---
name: 'step-02-report'
description: 'Present validation findings and offer to fix via edit mode'

editStep: '../steps-e/step-01-assess.md'
---

# Step 2: Report — Validation Results

## STEP GOAL:

Present validation findings as a clear report and offer to fix issues via edit mode.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Step-Specific Rules:

- Present findings clearly with priorities
- FORBIDDEN to auto-fix — offer edit mode instead

## MANDATORY SEQUENCE

### 1. Present Report

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**
**Checklist Validation Report**

**File:** {file_path}
**Total items:** {item_count}
**Issues found:** {issue_count} (🔴 High: {high}, 🟡 Medium: {med}, 🟢 Low: {low})

---

For each finding:
🔴/🟡/🟢 **[Check Name]** — {description}
  Item: {specific item or location}
  Suggestion: {suggested fix}

---

**Score:** {pass_count}/{total_checks} passed
**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 2. Handle Results

**IF zero issues:**

"**All Clear! The checklist passed all validation checks.**"

Workflow complete.

**IF issues found:**

"**Would you like to fix the issues?**
**[E]** Edit — Fix issues in edit mode
**[D]** Done — Complete without fixing (report only)"

#### Menu Handling Logic:

- IF E: Load, read entire file, then execute {editStep} with validation findings as context
- IF D: Workflow complete.

#### EXECUTION RULES:

- ALWAYS halt and wait for user input when issues exist
- Auto-complete only when zero issues found

### 3. End

Workflow complete.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Clear report with severity levels
- All findings presented with specific references
- Edit mode offered when issues exist
- Auto-complete when all checks pass

### FAILURE:

- Unclear or unstructured report
- Auto-fixing without user consent
- Not offering edit mode when issues found

**Master Rule:** Report clearly, offer to fix, never auto-fix.
