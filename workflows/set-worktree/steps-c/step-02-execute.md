---
name: step-02-execute
description: 'Clone repos and create branches in parallel; never git init the workspace root'
nextStepFile: './step-03-document-complete.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 2 — Parallel Clone & Branch Creation

## Outcome

Every repo from the confirmed plan is cloned into its own independent subfolder under the workspace root, the configured base branch is checked out, and the new feature branch is created and switched to. Each subfolder ends up with its own `.git` directory; the workspace root remains non-git. Successes and failures are reported clearly with a path for retry/skip/abort.

## Approach

### Inline safety checks (run before any git operation)

Before issuing any `git` command, verify all of:

1. **Workspace root is not a git repo.** If `.git` exists at the workspace root path, halt and surface the constraint from workflow.md — this workflow does not run inside an existing git repo without explicit user override (and even then, the cloning happens into independent subfolders, never as part of the root tree).
2. **Target subfolders are clean.** For each planned subfolder, check it doesn't already exist with content. If it exists and is non-empty, ask the user: skip this repo, choose a different subfolder name, or remove the existing folder.
3. **Branch names don't collide.** For each repo, the new branch must not already exist locally or remotely on the target. If it does, ask the user: choose a different name or check out the existing branch.
4. **No `git init` on the root.** Never. This is a structural rule; do not add any command that would create a `.git` at the workspace root.

### Load the parallel agents skill

Read `{parallel_agents_skill}` for the dispatch pattern. One sub-agent per repo.

### Per-repo clone + branch (parallel)

Each sub-agent runs, scoped to its assigned repo and subfolder:

```bash
git clone {repo_url} {subfolder_name}
cd {subfolder_name}
git checkout {branch_base}     # only if not the default
git checkout -b {branch_name}
```

Never `cd ..` and run `git init`. Never `git submodule add` from the workspace root unless the user explicitly requested submodule mode in step-01 (they didn't, by default).

Each sub-agent returns a structured result: repo, status (`SUCCESS`/`FAILURE`), folder, branch, base, and an error string when failed.

If sub-agents are unavailable, run the same commands sequentially in the main thread and report progress per repo.

### Aggregate results

Build a results table and report `{success_count}/{total}` to the user.

### Handle failures

If any repo failed, present:

- `[R]` Retry — re-run the failed repos only
- `[S]` Skip — continue with the successful ones; failed repos are dropped from downstream documentation
- `[A]` Abort — remove all subfolders created during this run and exit cleanly (without touching the workspace root)

Halt for input. On `A`, perform the cleanup carefully — only remove subfolders this workflow created in this run; do not touch unrelated content.

## Next

Once results are aggregated and any failures are handled, load and follow `{nextStepFile}`.
