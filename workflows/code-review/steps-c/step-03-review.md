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

Group by changed behavior, responsibility and contract, keeping producers and consumers together even across files. Small starts with one reviewer for the whole diff; full adds reviewers only for independent responsibilities. File/line counts help balance load, not decide independence. Every review/re-review has at most five concurrent agents; queue further groups.

Use fresh reviewers who did not implement the change, without the writing conversation. Each receives the full checklist, owned responsibility/paths, relevant diffs (including deletions), and related source paths. They may read callers, consumers and surrounding code together; findings must identify a defect introduced by the diff, not unrelated unchanged code. Return checklist item, location, evidence, impact and suggested fix, or PASS for the assigned group.

### Confirm candidates

Aggregate as `candidate_findings`, deduplicate by defect, and confirm with reproduction or a static/code check first. Keep confirmed findings as `primary_findings`; retain refuted/uncertain ones with evidence and reasons. Additional agents are for unresolved risky judgments, not a mandatory second verification wave.

A fix owner cannot dismiss a HIGH finding alone: new evidence must be accepted by the original independent reviewer or another independent reviewer; otherwise keep it unresolved.

## Next

Load and follow `{nextStepFile}`.
