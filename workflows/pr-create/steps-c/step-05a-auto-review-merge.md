---
name: step-05a-auto-review-merge
description: 'Auto mode only — wait for the PR reviews to land, act on what they flag, push, wait again, and merge once CI is green with nothing unresolved'
nextStepFile: './step-06-complete.md'
mergeLoopFile: './step-05-merge-loop.md'
testCreateFile: './step-04-test-create.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
maxRounds: 3
reviewWaitMinutes: 5
ciWaitMinutes: 10
---

# Step 5a — Auto Review & Merge

## Outcome

Every OPEN PR went through at least one review round — waited for reviews to land, acted on whatever arrived, pushed, waited again — and merged once CI was green with nothing unresolved. A PR that drew no reviews at all is left OPEN rather than merged: this step merges on the strength of a review, not on the passage of time. A merged PR with a queued successor routes through step-05's rebase path. The state file records every round: who said what, what was applied, and what was deliberately not.

## When this step runs

Auto mode only (`mode: auto` in the state file). Interactive mode never arrives here — it stays in `{mergeLoopFile}`, which polls for a merge somebody else performs. **This step merges by itself.** That is the whole difference, and it is why the gate below is not optional.

## Round structure

Per OPEN PR, at most `{maxRounds}` rounds of: **wait → collect → act → push → wait → gate**. The first wait gives reviewers time to see the PR; the second gives them time to see the fixes.

### Wait for reviews to land

Reviews arrive minutes after a push, and how many minutes depends on the reviewer. Poll instead of sleeping a flat `{reviewWaitMinutes}` — a fixed wait either stalls after the reviews are already in or clips a slow one. Treat `{reviewWaitMinutes}` as the ceiling, not the duration.

Record the push timestamp first (`gh pr view {prNumber} --json updatedAt` right after pushing, or the head commit's `%cI`). Anything left before that belongs to the previous round and has already been answered.

Poll `gh pr view {prNumber} --json reviews,comments,statusCheckRollup` and stop as soon as either holds:

- a review or comment carries a timestamp after the push, or
- the ceiling is reached.

Space the polls with a backgrounded `until` loop (`run_in_background`) that exits once the condition holds or the ceiling passes, then read its output — a foreground `sleep` is blocked, and repeating the same tool call in a tight loop burns the session for nothing. The Monitor tool is for a standing watch that fires repeatedly; this is a single "wait until X, then continue", which the backgrounded loop serves better.

Ceiling reached with nothing new is not the same as nobody objecting — it means nobody has looked yet. A slow bot, an unassigned reviewer, a reviewer in another timezone all produce the same empty result as a clean bill of health, and the gate cannot tell them apart.

So extend once: wait a second `{reviewWaitMinutes}` and poll again. If that comes back empty too, stop the auto loop for this PR, leave it OPEN, and put "no reviews arrived within {2 × reviewWaitMinutes}" in the report. **Auto mode does not merge a PR no reviewer has seen.** Reading the reviews and acting on them is the entire reason this step exists; merging with zero reviews collected is a timer wearing the costume of a review process.

A round that collected at least one remark proceeds normally — even if every remark turned out to be trivial, somebody looked.

### Collect what the reviewers said

Three sources, all of them — a remark missed here is a remark that blocks the merge later:

- **Verdicts and bodies** — `gh pr view {prNumber} --json reviews,reviewDecision`. The `reviews` list is every review ever submitted; `reviewDecision` is GitHub's own aggregate of where each reviewer currently stands. Read the list for what was said, and the decision for whether anything still blocks — do not re-derive that aggregate by grouping the list yourself, because your grouping and GitHub's are what the merge button actually disagree about.
- **Inline comments** — `gh api repos/{owner}/{repo}/pulls/{prNumber}/comments` for file- and line-anchored remarks.
- **Thread resolution** — the REST list does not say whether a thread was resolved. Ask GraphQL:

```
gh api graphql -f query='
  query($owner:String!,$repo:String!,$pr:Int!){
    repository(owner:$owner,name:$repo){
      pullRequest(number:$pr){
        reviewThreads(first:100){ nodes {
          isResolved isOutdated
          comments(first:20){ nodes { author{login __typename} body path line createdAt } }
        } }
      }
    }
  }' -F owner={owner} -F repo={repo} -F pr={prNumber}
```

Keep what landed after this round's push timestamp, and note each remark's author. Bot and human remarks are weighted differently at the gate, so make that call on `__typename` (`Bot` / `User`) rather than on a `[bot]` suffix — the suffix is a naming convention, not a guarantee.

### Act on each remark

Auto mode acts without asking. That is permission to use judgment, not permission to obey: work through each remark and settle it exactly one of three ways.

- **Apply** — it identifies a real defect, a convention violation, or a clear improvement within this PR's role. Fix it.
- **Decline** — it is wrong about the code, asks for something this PR deliberately is not doing, or would widen scope (a refactor, a redesign, a file this PR does not touch). Do not fix it. Record the reason.
- **Escalate** — it says the approach itself is wrong, or acting on it would change behavior outside the PR's role. Do not fix it, stop the auto loop for this PR, report.

Nothing is settled silently. Every remark lands in the state file under one of the three with its author and a one-line reason.

Then run the tests exactly as step-04 detects and runs them. Failures are fixed and re-run; three consecutive failures on the same fix stop the auto loop for this PR rather than thrashing at it.

### Commit and push

One commit per round. Name the round and what it answers — `review round 2: null guard on empty payload, per codex` beats `fix review comments`. Push to the existing branch (`git push`); the PR picks it up. Amend only when the round produced no reviewable change of its own, and then `git push --force-with-lease` — never plain `--force`.

### Merge gate

After the second wait, **both** must hold. Before claiming either, follow `{verificationBeforeCompletion}`: run the command in this turn and read its output. "CI should be green by now" does not merge a PR.

1. **CI green** — `gh pr checks {prNumber} --required` shows every required check passing. The flag matters: without it the command reports optional checks too, and one flaky optional job would hold a gate GitHub itself does not hold. Failing is not green — it re-enters "Act" as a defect rather than as a reviewer remark, and **that re-entry consumes a round too**, exactly as a pending timeout does. Otherwise a CI failure your local tests do not reproduce loops forever: the three-strike counter in "Act" only moves when local tests fail, and an environment-only break, a flaky remote-only job, or a lint check that never runs locally keeps them passing while CI stays red. A repo with no checks configured at all reports none, which is not green either: it is *unverified*. Say so in the report and let the review gate carry the decision by itself, which is precisely why that gate has to mean something. Pending is not green either: poll up to `{ciWaitMinutes}`, and if it is *still* pending at that ceiling, end the round as a failure to reach the gate. That consumes a round. Waiting on indefinitely does not, and a wait no counter can end is how an unattended loop stops being one.
2. **Nothing unresolved, and something was reviewed** — at least one review or review comment was collected for this PR across the rounds so far (a PR with none never reaches this gate; see the wait section), `reviewDecision` is not `CHANGES_REQUESTED`, and no thread is `isResolved: false` other than ones this round declined on the record. One exception overrides the rest: **a declined thread from a human reviewer stops the loop.** A person disagreeing is not something to merge past, however good the reason looked.

Both hold → merge:

```
gh pr merge {prNumber} --squash --delete-branch
```

Use the merge method the repo actually permits. `--squash` is the default here; if repo settings forbid it, read what they do allow — `gh api repos/{owner}/{repo} --jq '{squash:.allow_squash_merge,merge:.allow_merge_commit,rebase:.allow_rebase_merge}'` — and take `--merge` before `--rebase`, rather than failing the round over the flag.

### When the round budget runs out

`{maxRounds}` rounds without reaching the gate means it is not converging: a reviewer keeps finding new things, or CI keeps failing. (Escalation, a declined human remark, two silent waits and three local test failures do not land here — each stops the loop the moment it happens, whatever the round count.) Stop the auto loop for that PR, leave it OPEN, and hand back to `{mergeLoopFile}` with the per-round summary. **Auto mode does not merge a PR it could not get clean** — an unmerged PR with an explanation is a good outcome here; a merged PR nobody vetted is not.

### After a merge

A merged PR with a queued successor in the same repo takes `{mergeLoopFile}`'s "Rebase next PR" path — rebase, force-with-lease, then `{testCreateFile}` for the successor's own test/create cycle, which returns here because the mode is still auto. Follow that section rather than restating it.

### Persist

After every round, update the state file: round number, reviewers seen, remarks applied / declined / escalated with reasons, test and CI results, the commit pushed. On merge, set the PR `MERGED` with its timestamp. Add `step-05a-auto-review-merge` to `stepsCompleted` when every planned PR has merged or stopped.

### Report

When the loop ends — merged or stopped — tell the user in `{communication_language}`, per PR: rounds used, what was applied, what was declined and why, what was escalated, and the final state. Say plainly when a round drew no reviews: "round 1 — no reviews arrived within the wait" is the most important line that report can carry, and a tally of empty counts buries it. Auto mode ran unattended; the report is the only place the user sees what it decided on their behalf, so it names decisions, not just counts.

## Next

All planned PRs merged → load and follow `{nextStepFile}`.
Any PR stopped before the gate → load and follow `{mergeLoopFile}` so the remaining work continues under the interactive path.
