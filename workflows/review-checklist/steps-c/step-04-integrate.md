---
name: step-04-integrate
description: 'Merge results from every executed mode into a single unified checklist; deduplicate, resolve conflicts with the user, organize by category'
nextStepFile: './step-05-finalize.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
analysisCategories: '../data/analysis-categories.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4 — Integrate

## Outcome

A single unified checklist exists, organized by category, with duplicates removed and conflicts resolved by the user. Every surviving item traces back to one of the executed modes — no items invented during integration. The user has reviewed the integrated preview before advancing.

## Approach

### Collect every mode's results

Gather what each executed mode produced (A/P/U/S/R/Au/I). Show the user a tight count by mode.

### Deduplicate

- **Exact duplicates** — keep one copy.
- **Near duplicates** (same intent, different wording) — merge into the most specific/clear version.
- **Overlapping items** — combine into a single comprehensive item.

Show the deduplication delta.

### Resolve conflicts

For items that contradict each other across modes (e.g., "Components use default exports" vs. "Components should use named exports"), present both side by side and ask the user:

- `[1]` Keep item 1
- `[2]` Keep item 2
- `[B]` Keep both (apply contextually)
- `[N]` Remove both

Wait for input on each conflict. Don't silently resolve.

### Organize by category

Use `{analysisCategories}` as the primary structure. Items that don't fit go into "Other" (or a new clearly-named category). Within each category, order by importance (critical first, nice-to-have last).

### Preview

Present the integrated checklist with totals (item count, category count, sources used) and the per-category breakdown. Halt for input:

- `[A]` Advanced Elicitation
- `[P]` Party Mode
- `[C]` Continue — proceed to final review

`A`/`P` execute their workflows then redisplay the menu. The user may also request specific changes — apply them, re-present, redisplay the menu. On `C`, save the integrated state.

## Next

Load and follow `{nextStepFile}`.
