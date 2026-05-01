---
name: step-01-init
description: 'Select generation modes; collect mode-specific inputs; create the output file from template'
nextStepFile: './step-02-execute.md'
skipToInteractive: './step-03-interactive.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
templateFile: '../data/checklist-template.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 1 — Init

## Outcome

The user has selected one or more generation modes, all required inputs for those modes are collected, the output file exists with frontmatter populated, and the workflow is routed to the right next step (parallel execute → step-02 if any automatic mode was selected; interactive-only → step-03).

## Approach

### Mode selection

Present the mode catalog. Modes can be combined (comma-separated):

- `[A]` Project Analysis — analyze the actual codebase
- `[P]` PR Review Mining — synthesize human reviewer comments from GitHub PRs
- `[I]` Interactive — build category-by-category through conversation
- `[U]` Universal — best practices for the declared tech stack
- `[S]` Security — OWASP/STRIDE-flavored items generated inline
- `[R]` Structural — pre-landing structural items generated inline
- `[Au]` Audit (a11y / performance / theming / responsive) — auto-included when ui-ux-pro-max `audit` skill is installed

Halt for input. Examples: `A,U,S` or `A,P,I,U,S,R`. Halt with no proceed if zero modes are selected.

### Mode-specific inputs

For each selected mode, collect what it needs:

- **A** — project root path (default: current directory).
- **P** — GitHub repo (`owner/repo`); PR range (e.g., "last 20", "last 3 months").
- **U** — tech stack (e.g., "React, TypeScript, Next.js, Tailwind").
- **I** — no input here (handled in step-03).
- **S, R** — no extra input beyond the tech stack already provided for `U` (or asked separately if `U` wasn't selected).
- **Au** — auto-detected from `auditSkill` presence; no extra input required.

### Convention document discovery (if A or U is selected)

Ask whether the project has a conventions document:

- `[D]` Direct path — user provides it; load via Read.
- `[S]` Auto-scan — search common locations (`CONVENTIONS.md`, `CONTRIBUTING.md`, `.eslintrc*`, `.prettierrc*`, `tsconfig.json`, `STYLEGUIDE.md`, `CODING_STANDARDS.md`); present found files for the user to confirm which to use.
- `[N]` None — proceed without a conventions document.

If a conventions document is found, ask how to use it:

- `[C]` Convention-based — generate from rules in the document.
- `[R]` Code-based — generate from patterns in the actual code.
- `[B]` Both — reflect the document plus actual code patterns.

### Create the output file

Copy `{templateFile}` to `{outputFile}`. Fill frontmatter: project name, tech stack, date, selected modes.

### Route

- If any of `A` / `P` / `U` / `S` / `R` / `Au` was selected (i.e. any automatic mode), load and follow `{nextStepFile}` to dispatch parallel agents.
- If only `I` was selected, load and follow `{skipToInteractive}` to start the conversation.
