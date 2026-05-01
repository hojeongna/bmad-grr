---
name: step-02-report
description: 'Present validation findings; offer to fix via edit mode; do not auto-fix'
editStep: '../steps-e/step-01-assess.md'
---

# Step 2 — Report

## Outcome

The user sees a tight validation report with severity-ranked findings and a clear next-step choice: jump into edit mode to fix issues, or end the session with the report only. Nothing is auto-fixed.

## Approach

### Present the report

Tight format: file path, total items, issue counts by severity, then per-finding lines:

```
🔴/🟡/🟢 [Check Name] — {description}
  Item: {specific item or location}
  Suggestion: {suggested fix}
```

End with a one-line score (`Pass: {n}/{total} checks`).

### Handle the result

- **Zero issues** — congratulate briefly and end the workflow.
- **Issues exist** — halt for input:
  - `[E]` Edit — load and follow `{editStep}` carrying the findings as context.
  - `[D]` Done — end the workflow with the report only (no fixes).
