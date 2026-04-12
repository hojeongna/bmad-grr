---
name: 'step-03-document-complete'
description: 'Generate worktree mapping document, offer optional freeze for focused work, save worktree setup learnings, and complete the workflow'

freezeSkill: '~/.claude/skills/gstack/freeze/SKILL.md'
learnSkill: '~/.claude/skills/gstack/learn/SKILL.md'
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

### 3b. Optional: Freeze Workspace (gstack/freeze — OPTIONAL)

**IF `{freezeSkill}` exists (gstack installed):** The worktree workspace is now ready. If the user wants to **focus on just ONE of the worktrees** for the next session (a common pattern when working on a specific fix/feature in a multi-repo setup), `gstack/freeze` can enforce this by restricting edits to a single directory — preventing accidental cross-repo modifications.

Offer to the user:

"**집중 모드로 갈까요?** 🎯 (선택)

작업 중에 실수로 다른 repo 파일을 수정하는 걸 방지하려면 gstack/freeze로 한 worktree만 편집 가능하게 제한할 수 있어요.

- **[Y]** 네, 한 worktree만 집중할래요 → 어떤 worktree로?
- **[N]** 아니요, 여러 repo 오가면서 작업할래요"

**IF Y**: Present the worktree list from section 3 and ask which one to focus on. Then load the FULL `{freezeSkill}` file via Read tool and apply its directory boundary to that chosen worktree path. Report "**Freeze mode active** — edits are restricted to `{chosen_worktree}` until `/unfreeze`." Continue to section 4.

**IF N**: Skip to section 4.

**IF `{freezeSkill}` does NOT exist:** Silently skip this section entirely.

### 3c. Save Worktree Setup Learnings (gstack/learn — OPTIONAL)

**IF `{learnSkill}` exists (gstack installed):** Multi-repo worktree setups reveal coordination patterns and pitfalls — save them so future `set-worktree` runs benefit.

Load the FULL `{learnSkill}` file via Read tool, then save 1-3 distinct learning entries based on what this setup revealed:

**Candidates for learning entries:**

- **Repo coordination pattern** (type `pattern`) — e.g., "Frontend and API repos always need matching feature branches with the format `feature/YYMMDD-name`"
- **Branch base pattern** (type `preference`) — e.g., "This project uses `develop` as base for feature branches, `main` for hotfixes only"
- **Setup pitfall** (type `pitfall`) — e.g., "Never clone shared-types repo with `--depth 1` — it breaks cross-repo type generation"
- **Worktree organization** (type `pattern`) — e.g., "Use a `{project}-workspace` parent folder to keep all worktrees of one initiative together"
- **Operational learning** (type `operational`) — e.g., "Repo X requires `bun install` immediately after clone, not `npm install`"

Each entry:

- **key**: short kebab-case (e.g., `matching-feature-branches-frontend-api`)
- **insight**: one-sentence lesson
- **confidence**: 6-10
- **files**: worktree-map.md path
- **source**: `set-worktree`

Only log genuine reusable insights. Bar: "Would knowing this save 5+ minutes on the next multi-repo setup?"

"**Worktree learnings saved** ({n} entries) — future setups will see these patterns."

**IF `{learnSkill}` does NOT exist:** Silently skip.

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
