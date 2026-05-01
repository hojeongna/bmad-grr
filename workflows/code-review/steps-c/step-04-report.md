---
name: step-04-report
description: 'Aggregate findings, assign priority and scope, present the report, route to fix or completion'
fixStepFile: '~/.claude/workflows/code-review/steps-c/step-05-fix.md'
completeStepFile: '~/.claude/workflows/code-review/steps-c/step-06-complete.md'
receivingCodeReviewSkill: '~/.claude/skills/receiving-code-review/SKILL.md'
---

# Step 4 — Report

## Outcome

The user sees a clear, file-grouped report with priority and scope assigned to every finding, then chooses the fix scope (or skips fixes). Findings always cite a specific checklist item — no subjective entries.

## Approach

### Assign priority

For every finding:

- **HIGH** — likely incorrect behavior, broken patterns, bug-causing violations.
- **MEDIUM** — naming/structure issues, wrong file location, organizational drift.
- **LOW** — style and minor naming inconsistencies.

### Assign scope

For every finding:

- **SMALL** — single-line changes, rename, import addition, type annotation.
- **LARGE** — multi-file or logic-altering changes, refactors, structural moves.

### Present the report

Short, file-grouped, with totals at the top:

```
Code Review Report
Total files: {n}
Violations: {N} (🔴 High {h}, 🟡 Medium {m}, 🟢 Low {l})
Scope: 🔧 Small {s}, 🏗️ Large {l}

📄 path/to/file.ts — FAIL
  🔴 [Category] Item: description (line {line}) [SMALL/LARGE]
  ...

📄 path/to/other.ts — PASS
```

### Handle the no-violations case

If zero violations were found, congratulate briefly and route directly to `{completeStepFile}` (no fix step needed).

### Ask about fixes

When violations exist, halt and present:

- `[F]` Full — fix every finding regardless of priority/scope
- `[S]` Small — fix only SMALL-scope items (any priority)
- `[H]` High — fix only HIGH-priority items (any scope)
- `[X]` Skip — proceed without fixing

Set `fixScope` accordingly and route: `F`/`S`/`H` → `{fixStepFile}`, `X` → `{completeStepFile}`.

### Discipline for handling pushback during fix selection

If the user pushes back on findings (says "this is wrong", "the reviewer doesn't understand X", "we don't actually need this"), follow `{receivingCodeReviewSkill}`: verify the codebase reality before agreeing to drop a finding (it might be wrong, but the burden of proof is technical evidence, not "the user said so"). Push back politely with the checklist citation if the user's reasoning doesn't hold up. If the user has clarifying context the checklist couldn't have, accept it and adjust — but never silently drop a finding without recording the reason.
