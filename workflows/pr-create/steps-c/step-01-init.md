---
name: step-01-init
description: 'Initialize or resume PR session; read the worktree map; analyze per-repo change volume; create or restore state file'
nextStepFile: './step-02-plan.md'

# Resume routing — used when an in-progress state file exists
nextStepOptions:
  step-02-plan: './step-02-plan.md'
  step-03-commit-push: './step-03-commit-push.md'
  step-04-test-create: './step-04-test-create.md'
  step-04b-update-pr: './step-04b-update-pr.md'
  step-05-merge-loop: './step-05-merge-loop.md'
  step-06-complete: './step-06-complete.md'
---

# Step 1 — Init / Resume

## Outcome

A PR session is set up (or resumed): the worktree map is loaded, per-repo change volume is computed, and the state file is created with the planned-but-not-yet-pushed PR queue. If a previous session is in progress, it's restored and the workflow routes directly to the right next step based on the recorded `lastStep` and per-PR statuses.

## Approach

### Resume detection (merged from old step-01b)

Look for any `pr-state-*.md` in `_bmad-output/` or `docs/` with `status: IN_PROGRESS`. If found, load it completely. Read `stepsCompleted`, `lastStep`, the per-PR status table, the worktree map path, and the recorded plan.

Welcome the user back, present the per-PR status table:

| # | PR | Repo | Status |
|---|----|------|--------|
| 1 | … | … | PLANNED / PUSHED / OPEN / MERGED |

Before routing, **detect post-PR local changes** for each repo with at least one OPEN PR. Inside the repo folder check:

- `git status --short` — any uncommitted edits?
- `git log {remote_tracking}..HEAD --oneline` — any local commits not yet on the remote branch?

If either is non-empty for a repo whose PR status is `OPEN`, the user has come back from another workflow (typically `refine-story`, `dev-story`, or manual edits) with extra work. Route to `step-04b-update-pr` so those changes go through tests and reach the existing PR via a follow-up push.

Update `lastContinued` in the state file. Route to the appropriate file in `{nextStepOptions}`:

- Plan incomplete → `step-02-plan`
- PRs PLANNED but not pushed → `step-03-commit-push`
- PRs PUSHED but not opened → `step-04-test-create`
- **PRs OPEN AND repo has uncommitted edits or unpushed commits → `step-04b-update-pr`**
- PRs OPEN with clean working tree → `step-05-merge-loop`
- All PRs MERGED → `step-06-complete`

Skip the rest of this step.

### Locate the worktree map

Search for `worktree-map.md` in:

1. `_bmad-output/worktree-map.md`
2. `docs/worktree-map.md`

If found, parse the repo list (folder, branch, GitHub URL, base branch). If not found, ask the user for the location or for repo details manually.

Show the loaded repo list briefly.

### Per-repo change analysis

For each repo, run from its folder:

```
git diff {base}..HEAD --shortstat
git diff {base}..HEAD --stat
```

Build the change table (files changed, additions, deletions, total). Flag repos with >1000 lines as candidates for splitting.

### Create the state file

Choose the output location (prefer `_bmad-output/`, fall back to `docs/`). Write `pr-state-{date}.md`:

```yaml
---
stepsCompleted: ['step-01-init']
lastStep: 'step-01-init'
lastContinued: ''
status: IN_PROGRESS
date: '{date}'
worktreeMap: '{map_path}'
repos: []
prPlan: []
---

# PR State: {date}
## Repos
## Change Analysis
## PR Plan         # filled in step-02
## PR Status Tracking
```

## Next

Load and follow `{nextStepFile}`.
