---
name: step-03-document-complete
description: 'Generate worktree mapping document and present the final workspace summary'
---

# Step 3 — Document & Complete

## Outcome

A `worktree-map.md` is written to a sensible location under the workspace root, listing every successful repo with its subfolder, branch, base, and GitHub URL. The user sees a tight summary and is ready to start coding. The workspace root remains non-git; this step writes a markdown file, nothing more.

## Approach

### Choose the output location

Prefer existing structure:

1. If `_bmad-output/` exists at the workspace root, use `{workspace_root}/_bmad-output/worktree-map.md`.
2. Else if `docs/` exists, use `{workspace_root}/docs/worktree-map.md`.
3. Else create a `docs/` folder and write there.

### Generate the mapping document

```markdown
---
created: {date}
project_root: {workspace_root}
problem_description: {problem_description}
repo_count: {success_count}
---

# Worktree Workspace Map

## Context
- Problem: {problem_description}
- Date: {date}
- Workspace Root: `{workspace_root}` (non-git, monorepo-style)

## Repositories

| # | Repo | GitHub | Folder | Branch | Base |
|---|------|--------|--------|--------|------|
| 1 | … | … | `…` | `…` | … |
| 2 | … | … | `…` | `…` | … |

## Quick Reference

### Folder Paths
- `{workspace_root}/{folder-1}`
- `{workspace_root}/{folder-2}`

### Branch Names
- {repo-1}: `{branch-1}`
- {repo-2}: `{branch-2}`
```

Only successful repos appear in the document. Skipped/failed repos are omitted.

### Final summary

Tight summary in `{communication_language}`: how many repos are ready, the table of repo/folder/branch, the path to the mapping document, and a one-line "happy coding" close.

End the workflow. No additional git commands run in this step.
