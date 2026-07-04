---
name: step-03-review
description: 'Parallel per-file checklist review — one sub-agent per file, every finding cites a specific checklist item'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-04-report.md'
---

# Step 3 — Parallel Review

## Outcome

Every collected file has been reviewed by its own dedicated sub-agent against the full checklist, restricted to the file's changed/added lines. Findings are aggregated for the report step. No file is modified during this step.

## Approach

### Prepare each agent

Each agent receives:

1. **The full checklist** (every category, every item — not a summary).
2. **The file path** to review.
3. **The file's diff content** (changed/added lines only) from step-02.
4. **A scope-locked instruction**: review only the changed/added lines; the agent may use Read for surrounding context but only the diff lines are subject to checklist evaluation; for each violation, return the checklist category, the specific item, file path and line number, what is wrong, and how to fix it; do not modify any files; do not flag unchanged code.
5. **Output format**: a structured list of findings; if no violations exist on the changed lines, return `PASS - no checklist violations in changed lines of {file_path}`.

### Review and verify via the Workflow tool

Call the **Workflow** tool for this — every review, regardless of file or finding count. Write a script with two phases:

- **Review** — one `agent()` per collected file (never batched — batching breaks scope isolation), each reviewing only its changed/added lines per the per-agent context above. Aggregate the results as `candidate_findings` (group by file, retain checklist references, dedupe identical findings on the same location, note files that passed clean).
- **Verify** — distribute `candidate_findings` across `agent()` calls however the script balances best (batched or grouped, not forced to one-per-finding); each confirms or refutes its assigned findings against the code (claim = the violation, evidence = the cited checklist item + the changed lines). Keep confirmed findings, drop refuted ones, surface uncertain ones. Verification only — do **not** loop to re-discover, since the diff is already the entire work-list.

Store the surviving findings as `primary_findings` for step-04, and carry the refuted/uncertain list so the report can show what was checked and dropped.

## Next

Load and follow `{nextStepFile}`.
