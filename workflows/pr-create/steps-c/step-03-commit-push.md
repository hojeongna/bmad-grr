---
name: step-03-commit-push
description: 'Stage and commit the right files per planned PR; push to remote; update state'
nextStepFile: './step-04-test-create.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 3 — Commit & Push

## Outcome

For each PR currently at status `PLANNED`, the correct files are staged (only this PR's files when the repo has a multi-PR split; all changes when it's a single PR), a meaningful commit is created with the user's approval, and the branch is pushed to `origin`. The state file moves matching PRs to status `PUSHED`. No PRs are created in this step.

## Approach

### Determine what to process

From the state file, find PRs with status `PLANNED`. The processing rules:

- If multiple repos each have a single PLANNED PR → process them in parallel via sub-agents (load `{parallel_agents_skill}`).
- If a single repo has multiple PRs → process only the first unpushed PR in the merge order.

### Stage, preview, commit, push (per PR)

Inside each repo folder:

- **Multi-PR split** — `git add` only the files belonging to the current PR's role.
- **Single PR** — `git add -A`.

Show the preview before committing:

```
Commit preview for {repo} — {pr_role}:
{generated commit message}

Files staged: {count}
Lines: +{added} -{removed}

[Y] Commit   [E] Edit message
```

Halt for input. On `E`, accept the user's revised message.

After confirmation:

```
git commit -m "{message}"
git push -u origin {branch_name}
```

Report `Pushed: {repo} → origin/{branch_name}`.

### Persist

Update each processed PR's status to `PUSHED` in the state file. Add `step-03-commit-push` to `stepsCompleted`.

### On push failure

If `git push` fails, surface the exact error and halt — common causes are protected branches, force-with-lease conflicts, or auth issues. Don't retry blindly.

## Next

Load and follow `{nextStepFile}`.
