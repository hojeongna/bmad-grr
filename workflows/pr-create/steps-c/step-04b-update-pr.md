---
name: step-04b-update-pr
description: 'Push additional changes to an existing OPEN PR — run CI/local tests, fix failures, commit (amend or new), push to the same branch. No new PR is created.'
nextStepFile: './step-05-merge-loop.md'
---

# Step 4b — Update Open PR

## Outcome

The current PR (status `OPEN`) on its existing branch receives the additional changes the user made via another workflow (typically `refine-story`, `dev-story`, manual edits, etc.). Local CI/test commands pass, the new commit is pushed to the same remote branch (so the existing PR picks up the update on GitHub automatically), and the workflow returns to merge tracking. **No new PR is created** — this is a follow-up push, not a fresh PR.

## When this step runs

Two entry paths:

1. **Auto-routed from step-01 (resume)** — the resume check found PRs at status `OPEN` AND the matching repo's working tree has uncommitted changes or unpushed commits ahead of the remote branch.
2. **Manually selected from step-05** — the user chose `[U]` Update PR in the merge-loop menu because they came back from another workflow with extra work.

## Approach

### Identify the target PR(s)

Read the state file. Pick the OPEN PR(s) whose repo folder shows local divergence from the remote branch. Confirm the target with the user, especially in multi-PR setups:

```
Open PRs with local changes:
  [1] {repo} #{prNum} — branch `{branch}` — {N} uncommitted, {M} unpushed
  [2] …
Which PR are we updating? (1 / 2 / A=all)
```

If only one is detected, confirm it briefly before proceeding.

### Show what changed

Inside the repo folder, show:

```
git status --short
git log {remote_tracking}..HEAD --oneline    # local commits not yet on remote
git diff --stat HEAD                          # uncommitted changes
```

Tell the user briefly: how many files changed, which commits are unpushed, whether there are uncommitted edits.

### Run tests / CI locally

Detect the project's actual test entry points (same logic as step-04: `package.json` `scripts.test`, `Makefile` `test`, `pytest.ini` / `pyproject.toml` pytest, `.github/workflows/*.yml` for CI test command hints). Run what's actually there — type check, build, unit tests, integration tests — in a sensible order. Don't fabricate.

If the repo has CI defined and a CI test command can be inferred from the workflow file, run that command locally so the push reaches the remote with high confidence of CI passing.

### Handle test failures (amend or new commit)

- **Tests pass** → skip to the push step.
- **Tests fail** → show a tight failure summary and ask:
  - `[A]` Amend the most recent commit (when the changes logically belong to the previous commit) — `git commit --amend --no-edit` after `git add -A`, then `git push --force-with-lease`.
  - `[N]` New commit (when the changes are a distinct unit of work) — `git commit -m "fix: …"` then `git push`.

Ask the user to fix the failure (or fix it inline if scope is small and it's clearly within this step's domain). After the fix, re-run the tests. Repeat until passing.

### Stage and commit any pending changes (if not already committed)

If there are uncommitted edits at this point (the user may have left them after the other workflow), present a commit preview:

```
Files staged: …
Lines: +… −…
Suggested commit message: …
[Y] Commit   [E] Edit message   [A] Amend the previous commit instead
```

Halt for input. Use `git commit -m "{message}"` or `git commit --amend --no-edit` per the user's choice.

### Push

Push to the existing remote branch:

- After amend → `git push --force-with-lease` (safe force; never plain `--force`).
- After new commit → `git push`.

GitHub automatically updates the existing PR with the new commit(s); no `gh pr create` is needed.

Report:

```
Updated: {repo} #{prNum} → branch `{branch}` (+{commits} commit, {files} files changed)
```

### Persist

Update the state file: append a `pushed_update` event entry to the PR's record (timestamp, commits added, files touched). Keep the PR status as `OPEN` — only `step-05-merge-loop` flips it to `MERGED`. Add `step-04b-update-pr` to `stepsCompleted` if it isn't there already.

## Next

Load and follow `{nextStepFile}` so merge tracking continues with the updated PR.
