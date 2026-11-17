---
name: step-03-review
description: 'Independent checklist review grouped by responsibility and contract; confirm candidate findings against evidence'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-04-report.md'
---

# Step 3 — Independent Review

## Outcome

Every changed responsibility is independently reviewed against the full checklist. Confirmed, refuted and uncertain findings are ready for the report. Reviewers do not modify files.

## Approach

### Group the work

Keep a contract's producers/consumers with one reviewer. Small starts with one for the whole diff; full uses at most three per round, sharing groups as needed. Permissions, payments, concurrency, external APIs or comparable risk may justify four or five; otherwise stay within three. File counts only balance load.

Use fresh reviewers who did not implement the change, without the writing conversation. Give each the full checklist, assigned paths/diffs including deletions, and related source. Read callers/consumers together; report only defects introduced by the diff. Return checklist item, location, evidence, impact and fix, or PASS.

### Confirm candidates

Deduplicate `candidate_findings`; confirm by reproduction or static/code check first. Keep confirmed items as `primary_findings`, refuted/uncertain items with reasons and evidence. Do not spawn confirmation agents; assigned reviewers handle independent acceptance below.

Refuting any HIGH candidate requires a new reproduction command/result, static check, or independent confirmation. The original or another independent reviewer must accept the evidence; the fix owner alone cannot dismiss it. Otherwise keep it unresolved.

## Next

Load and follow `{nextStepFile}`.
