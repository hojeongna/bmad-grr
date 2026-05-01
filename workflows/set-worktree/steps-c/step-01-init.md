---
name: step-01-init
description: 'Gather workspace context — workspace root (must not be a git repo), problem description, repo links, branch base/name/folder per repo'
nextStepFile: './step-02-execute.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 1 — Init / Gather Context

## Outcome

A complete setup plan is gathered and confirmed by the user: the workspace root (verified non-git), the problem description that drives branch naming, the list of GitHub repos with their base branch, an agreed branch type and name (with per-repo overrides if needed), and the per-repo subfolder names. No git operations run in this step.

## Approach

### Confirm the workspace root — and verify it is NOT a git repo

Detect the current working directory. Show it to the user and ask whether this should be the workspace root.

**Then verify the root is not already a git repository.** Check whether `.git` exists at the chosen root. If it does:

- The workspace root must not be a git repo (this workflow's monorepo-style constraint — see workflow.md).
- Tell the user clearly: "이 폴더는 이미 git 저장소예요. 모노레포 워크스페이스 루트는 git이 아닌 빈 폴더여야 합니다."
- Offer two paths:
  1. Use a different (non-git) folder — ask for a path, create it if missing, and proceed.
  2. Continue here anyway (clones will appear as untracked entries inside the existing repo, or you'd need to add them as submodules later by hand). Only proceed if the user explicitly confirms this trade-off.

Do not ever run `git init` on the workspace root. Do not "convert" the root into a git repo as part of this workflow.

### Gather problem context

Ask the user, in `{communication_language}`, what they're working on. The phrase becomes the source of the branch description. Accept any level of detail.

### Collect GitHub repository links

Ask for repo URLs (one per line or comma-separated). Parse each: extract the repo name from the URL. Show the parsed list back so the user can correct typos before any cloning happens.

### Configure branch base per repo

Default each repo's base to `main`. Let the user override per repo (e.g., "2: develop, 3: staging").

### Branch type and name

Offer four types: `[F]` feature, `[X]` fix, `[R]` refactor, `[C]` chore. Generate a branch name with the pattern `{type}/{YYMMDD}-{description}` where `{description}` is derived from the problem context (kebab-case, in `{communication_language}` if appropriate). Let the user accept the same name for all repos or override per repo.

### Subfolder names

Generate `{repo-name}-{branch-type}-{YYMMDD}-{description}` per repo. The user can override.

### Present the full plan and confirm

Show a single table with all per-repo details (repo, GitHub URL, base, branch, subfolder) plus the workspace root. Present `[Y]` Proceed / `[E]` Edit. Halt for input. On `E`, ask what to change, update, and re-display.

## Next

Once the plan is confirmed, load `{parallel_agents_skill}` (used in step-02), then load and follow `{nextStepFile}`.
