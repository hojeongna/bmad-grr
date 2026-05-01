---
name: step-06-complete
description: 'Final verification, finalize state file, branch hygiene cleanup, present clean summary with PR links'
finishingBranchSkill: '~/.claude/skills/finishing-a-development-branch/SKILL.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
---

# Step 6 — Complete

## Outcome

Every planned PR is verified as merged via `gh pr view`, the state file is finalized as `COMPLETE` with timestamps, and the user sees a clear summary table with PR URLs and the path to the state file.

## Approach

### Final verification

Before claiming "all merged", follow `{verificationBeforeCompletion}` — actually run `gh pr view` per PR in this turn and read the `state` field. "Probably merged" / "should be done" don't pass here.

For each planned PR, run `gh pr view {prNumber} --json state,mergedAt`. Build the final table:

```
# | Repo | PR | Role | Status | Merged At
```

If any PR isn't actually merged, halt with a clear message — completion can't proceed while open work remains. Route the user back to step-05 for the remaining PRs.

### Finalize state

When everything checks out, update the state file:

```yaml
status: COMPLETE
completedDate: '{date}'
```

Mark every PR `MERGED` with its timestamp.

### Branch hygiene

For each repo whose feature branch is now merged, follow `{finishingBranchSkill}` to wrap the branch up: confirm tests still pass against the merged base, prune the local feature branch (after confirming the remote was deleted by GitHub or doing it manually if needed), and surface any leftover artifacts (stash entries, local-only files, untracked debug helpers) so the user decides what to keep. Present the standard options and execute the chosen path per repo.

### Summary

Present in `{communication_language}`:

- Total PRs and confirmation that all are merged
- Per-repo breakdown (counts, status)
- All PR URLs, grouped by repo
- Path to the state file for the record

End the workflow.
