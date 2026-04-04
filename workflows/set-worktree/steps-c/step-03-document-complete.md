---
name: 'step-03-document-complete'
description: 'Generate worktree mapping document and complete the workflow'
---

# Step 3: Generate Mapping & Complete

## STEP GOAL:

To generate the worktree mapping document that records all setup details (folder paths, repo links, branches) for reference by future workflows like pr-create, and complete the workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a workspace setup partner wrapping up
- ✅ Clear, useful documentation matters for future workflows

### Step-Specific Rules:

- 🎯 Focus ONLY on generating the mapping document and presenting final summary
- 🚫 FORBIDDEN to run any additional git commands
- 🚫 FORBIDDEN to modify any repo or branch
- 💬 Present results clearly - user should feel ready to start coding

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Create mapping document in correct location
- 📖 This is the final step - no next step to load

## CONTEXT BOUNDARIES:

- Step-01 gathered all configuration (repos, branches, folders)
- Step-02 executed all git operations and reported results
- Successful repos and their details are in memory
- This step ONLY documents and wraps up

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Determine Output Location

Check for the mapping document output location:

1. Check if `_bmad-output/` folder exists at project root
   - **If yes:** Use `{project_root}/_bmad-output/worktree-map.md`
2. **If no:** Check if `docs/` folder exists
   - **If yes:** Use `{project_root}/docs/worktree-map.md`
3. **If neither:** Create `docs/` folder and use `{project_root}/docs/worktree-map.md`

### 2. Generate Mapping Document

Create `worktree-map.md` with the following structure:

```markdown
---
created: {date}
project_root: {project_root}
problem_description: {problem_description_from_step_01}
repo_count: {number_of_successful_repos}
---

# Worktree Workspace Map

## Context

**Problem:** {problem_description}
**Date:** {date}
**Project Root:** `{project_root}`

## Repositories

| # | Repo | GitHub Link | Folder | Branch | Base |
|---|------|-------------|--------|--------|------|
| 1 | {repo-1} | {github-link-1} | `{folder-1}` | `{branch-1}` | {base-1} |
| 2 | {repo-2} | {github-link-2} | `{folder-2}` | `{branch-2}` | {base-2} |
| ... | ... | ... | ... | ... | ... |

## Quick Reference

### Folder Paths
- `{project_root}/{folder-1}`
- `{project_root}/{folder-2}`
- ...

### Branch Names
- {repo-1}: `{branch-1}`
- {repo-2}: `{branch-2}`
- ...
```

### 3. Present Final Summary

"**Workspace setup complete!**

**{success_count} repos** ready to go:

| Repo | Folder | Branch |
|------|--------|--------|
| {repo-1} | `{folder-1}` | `{branch-1}` |
| ... | ... | ... |

**Mapping document saved to:** `{mapping_doc_path}`

Happy coding!"

### 4. Workflow Complete

This is the final step. No next step to load.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Mapping document created in correct location (`_bmad-output/` or `docs/`)
- All successful repos documented with complete details
- Final summary presented clearly
- User is ready to start coding

### ❌ SYSTEM FAILURE:

- Running git commands in this step
- Missing repos from the mapping document
- Not checking for `_bmad-output/` before falling back to `docs/`
- Creating mapping document without frontmatter

**Master Rule:** This step ONLY generates documentation and presents the final summary. The workspace is already set up.
