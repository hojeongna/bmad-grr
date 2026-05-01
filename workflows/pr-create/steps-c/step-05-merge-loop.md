---
name: step-05-merge-loop
description: 'Poll PR statuses; on merge of a sequential predecessor, rebase and route the next PR back to test/create; offer manual re-push for OPEN PRs that received extra edits; loop until all merged'
nextStepFile: './step-06-complete.md'
testCreateFile: './step-04-test-create.md'
updatePrFile: './step-04b-update-pr.md'
---

# Step 5 — Merge Track & Rebase

## Outcome

Every OPEN PR's GitHub status is checked via `gh`. Newly merged PRs are recorded. When a PR in a multi-PR repo merges and a successor PR is queued, the successor's branch is rebased onto the updated base, force-pushed with lease, and routed back to step-04 for its own test/create cycle. The workflow loops until every planned PR is `MERGED`, at which point it advances to step-06. The user can exit and resume later — state survives between sessions.

## Approach

### Status check

For each PR currently at status `OPEN`, run:

```
gh pr view {prNumber|prUrl} --json state,mergedAt,mergeable
```

Build a status table: PR, repo, state (`OPEN`/`MERGED`/`CLOSED`), mergeable (`yes`/`no`/`conflict`).

### Record merges

For each newly merged PR, update the state file (`status: MERGED`, `mergedAt: …`). Tell the user briefly per merge.

### Decide what's next

- **All planned PRs merged** → load and follow `{nextStepFile}`.
- **Some still open, none newly merged this poll** → present the user with `[R]` Refresh status / `[U]` Update an OPEN PR (when they made additional edits via another workflow — routes to `{updatePrFile}` for re-test + re-push) / `[X]` Exit and resume later. On `X`, save state and end the session cleanly. On `U`, ask which PR to update if there are multiple OPEN, then load and follow `{updatePrFile}` — it will re-route to this step after the push completes.
- **A PR just merged AND a successor PR exists in the same repo** → continue to "Rebase next PR" below.

### Rebase next PR

Inside the repo folder, switch to the successor branch and rebase onto the updated base:

```
git checkout {next_branch}
git rebase {base_branch}
```

**Rebase succeeds** → `git push --force-with-lease`. Route to `{testCreateFile}` so the successor goes through its own test/create cycle. (Step-04 handles the "open this PR now" flow.)

**Rebase has conflicts** → list conflicting files and offer:

- `[D]` Done — user resolved conflicts manually; run `git add -A && git rebase --continue && git push --force-with-lease`, then route to `{testCreateFile}`.
- `[A]` Abort — `git rebase --abort`. Help troubleshoot, then offer to retry.

### Persist

Update the state file on every status change, every rebase, and every successor route. Add `step-05-merge-loop` to `stepsCompleted` only when every planned PR has merged.

## Next

Loop back into step 1 of this file (status check) until all merged, or route to `{testCreateFile}` for a successor PR. When all are merged, load and follow `{nextStepFile}`.
