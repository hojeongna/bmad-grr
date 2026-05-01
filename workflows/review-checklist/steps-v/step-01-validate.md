---
name: step-01-validate
description: 'Validate checklist quality — specificity, duplicates, completeness, code-review compatibility, item quality'
nextStepFile: './step-02-report.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 1 — Validate

## Outcome

Findings are collected for an existing checklist file across five quality dimensions, each with severity (HIGH / MEDIUM / LOW) and a suggested fix. The checklist file is not modified — only assessed. Results are passed to the report step.

## Approach

### Load the checklist

Read the user-provided path completely. If the path wasn't already provided (standalone validation), ask for it once and halt for input.

### Run five checks

- **Specificity** — every item is specific enough that a reviewer can objectively decide pass/fail. Vague items ("Follow naming conventions") get flagged with a more concrete rewrite suggested ("Components use PascalCase naming").
- **Duplicates** — scan for duplicate or near-duplicate items within and across categories.
- **Completeness** — load `{analysisCategories}` and check whether categories that should apply to the declared tech stack are missing.
- **Compatibility with `code-review`** — frontmatter present (project, techStack, generatedDate); `## Category` headers; `- [ ] item` format; items reviewable by reading code (not requiring runtime testing).
- **Item quality** — actionable (reviewer knows what to check), non-overlapping with other items, relevant to the tech stack.

### Collect findings

For each finding capture: check name, severity, specific item or location, what's wrong, suggested fix. Store the list for the report step.

## Next

Load and follow `{nextStepFile}`.
