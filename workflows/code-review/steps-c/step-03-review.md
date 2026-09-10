---
name: step-03-review
description: 'Parallel per-file checklist review — one sub-agent per file by default, every finding cites a specific checklist item'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-04-report.md'
askAgentCountAbove: 10
---

# Step 3 — Parallel Review

## Outcome

Every collected file has been reviewed against the full checklist, restricted to that file's changed/added lines — by its own sub-agent, or by an agent holding a small group of files when the user asked for fewer agents. Findings are aggregated for the report step. No file is modified during this step.

## Approach

### Decide the agent count

Below `{askAgentCountAbove}` files: one agent per file, nothing to ask. That is the shape this review is built around — one agent, one file, one scope.

At `{askAgentCountAbove}` files or more, halt and ask:

```
25 files collected. How many sub-agents?
  [Enter] 25 — one per file (default)
  [N]     a number — the 25 files split across N agents
```

Say once, and only once, what a lower number costs: an agent holding four files carries what it just decided in the first one into the fourth, and findings thin out toward the end of a long list. Then take the answer. The user knows their file count and their budget; this is a question, not an argument.

Split by **changed-line count, not file count**. Step-02 already counted lines per file, and a split handing one agent five 400-line files while another gets five 10-line files finishes no sooner than no split at all.

In auto mode, ask on round 1 and reuse that answer for every later round — a loop that stops to ask each round is not unattended.

### Prepare each agent

Each agent receives:

1. **The full checklist** (every category, every item — not a summary).
2. **The file path** to review — or the small group of paths it owns.
3. **The diff content** (changed/added lines only) from step-02, per file.
4. **A scope-locked instruction**: review only the changed/added lines; the agent may use Read for surrounding context but only the diff lines are subject to checklist evaluation; for each violation, return the checklist category, the specific item, file path and line number, what is wrong, and how to fix it; do not modify any files; do not flag unchanged code.
5. **Output format**: a structured list of findings; if no violations exist on the changed lines, return `PASS - no checklist violations in changed lines of {file_path}`.

An agent holding more than one file gets one rule on top: work the files one at a time and return findings **per file, never as a merged list**. Nothing learned in one file justifies a finding in another — the checklist is the only thing that carries across them.

### Review and verify via the Workflow tool

Call the **Workflow** tool for this — every review, regardless of file or finding count. Write a script with two phases:

- **Review** — one `agent()` per file, or per file group when the user set a lower agent count, each reviewing only its changed/added lines per the per-agent context above. Aggregate the results as `candidate_findings` (group by file, retain checklist references, dedupe identical findings on the same location, note files that passed clean).
- **Verify** — distribute `candidate_findings` across `agent()` calls however the script balances best (batched or grouped, not forced to one-per-finding); each confirms or refutes its assigned findings against the code (claim = the violation, evidence = the cited checklist item + the changed lines). Keep confirmed findings, drop refuted ones, surface uncertain ones. Verification only — do **not** loop to re-discover, since the diff is already the entire work-list.

Store the surviving findings as `primary_findings` for step-04, and carry the refuted/uncertain list so the report can show what was checked and dropped.

## Next

Load and follow `{nextStepFile}`.
