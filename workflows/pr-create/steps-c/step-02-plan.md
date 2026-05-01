---
name: step-02-plan
description: 'Plan PR split strategy per repo (single PR, AI split, or manual split) with clear roles and merge order'
nextStepFile: './step-03-commit-push.md'
---

# Step 2 — Plan

## Outcome

Each repo has either a single-PR plan (small change) or a responsibility-based multi-PR plan with explicit merge order. Each planned PR has a role/responsibility, file list, and position in the sequence. The plan is recorded in the state file with every PR at status `PLANNED`. No git operations happen here.

## Approach

### Per-repo evaluation

For each repo, look at the change-volume row from step-01:

- **<1000 lines total** → single PR. Tell the user briefly: "{repo}: {N} lines — single PR is fine."
- **≥1000 lines total** → recommend a split and ask `[A]` AI-proposed split or `[M]` manual split.

### AI-proposed split

Run `git diff {base}..HEAD --name-only` in the repo. Group changed files by responsibility (feature area / module / type of change / logical dependency). Propose:

```
PR # | Role/Responsibility | Files | Est. Lines
1    | Schema migration    | …     | ~120
2    | API endpoints       | …     | ~340
3    | Frontend wiring     | …     | ~180

Merge order: PR1 → PR2 → PR3 (each subsequent PR rebases on the previous merge)
```

Halt for `[Y]` Accept / `[E]` Edit. On `E`, take the user's adjustment and re-present.

### Manual split

Ask the user to describe how they want to split this repo. Accept any natural format ("PR1: schema, PR2: API, PR3: frontend" or per-file lists). Parse, confirm, and re-present until they accept.

### Cross-repo plan

When all repos have plans, present the consolidated plan in a single table:

```
# | Repo | PR | Role | Files | Order
```

### Persist

Write the full PR plan to the state file's `prPlan` array. Each PR has: `repo`, `prNum`, `role`, `files`, `mergeOrder`, `status: PLANNED`. Add `step-02-plan` to `stepsCompleted`.

### Menu

Offer `[C]` Continue. Halt for input. On `C`, advance.

## Next

Load and follow `{nextStepFile}`.
