---
name: 'step-01-init'
description: 'Initialize PR workflow: check continuation, read worktree-map, analyze changes'

nextStepFile: './step-02-plan.md'
continueFile: './step-01b-continue.md'
---

# Step 1: Initialize & Analyze

## STEP GOAL:

To check for existing sessions, read the worktree-map from set-worktree, and analyze change volume across all repos to prepare for PR planning.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a PR management partner
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring git/PR expertise, user brings code changes and context

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and change analysis
- 🚫 FORBIDDEN to create PRs, commit, or push anything
- 🚫 FORBIDDEN to skip continuation check
- 💬 Present change analysis clearly

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Create state file with initial analysis
- 📖 Check for existing session FIRST
- 🚫 This is init - analyze only, no actions

## CONTEXT BOUNDARIES:

- set-worktree must have been run first (worktree-map required)
- User may have partial work from a previous session
- Must determine: which repos, how many changes, change volume per repo

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Check for Existing Session

Look for any existing `pr-state-*.md` files in `_bmad-output/` or `docs/`.

- **If found with incomplete status:** Load and execute `{continueFile}` to resume.
- **If not found OR all complete:** Continue to step 2 below.

### 2. Locate and Read Worktree Map

Search for `worktree-map.md` in:
1. `_bmad-output/worktree-map.md`
2. `docs/worktree-map.md`

- **If found:** Read and parse repo list, folders, branches, GitHub links
- **If not found:** Ask user for worktree-map location or repo details manually

"**PR Create starting!**

Found worktree map: `{map_path}`

**Repos detected:**

| # | Repo | Folder | Branch |
|---|------|--------|--------|
| 1 | {repo-1} | `{folder-1}` | `{branch-1}` |
| ... | ... | ... | ... |"

### 3. Analyze Change Volume

For each repo, collect change statistics:

```bash
cd {folder}
git diff {base}..HEAD --stat
git diff {base}..HEAD --shortstat
```

Present analysis:

"**Change Analysis:**

| # | Repo | Files Changed | Lines Added | Lines Removed | Total |
|---|------|---------------|-------------|---------------|-------|
| 1 | {repo-1} | {files} | +{added} | -{removed} | {total} |
| ... | ... | ... | ... | ... | ... |

{repos with > 1000 lines will be flagged for potential split}"

### 4. Create State File

Determine output location (`_bmad-output/` or `docs/`).

Create `pr-state-{date}.md`:

```markdown
---
stepsCompleted: ['step-01-init']
lastStep: 'step-01-init'
lastContinued: ''
status: IN_PROGRESS
date: '{date}'
worktreeMap: '{map_path}'
repos: []
prPlan: []
---

# PR State: {date}

## Repos
[repo details from worktree-map]

## Change Analysis
[change volume per repo]

## PR Plan
[to be filled in step-02]

## PR Status Tracking
[to be filled as PRs are created]
```

### 5. Auto-Proceed to Planning

Display: "**Change analysis complete. Let's plan your PRs...**"

#### Menu Handling Logic:

- After state file created and analysis presented, immediately load, read entire file, then execute {nextStepFile} to begin PR planning.

#### EXECUTION RULES:

- This is an auto-proceed init step after analysis
- Proceed directly to next step after state file is created
- Always halt if user wants to discuss the analysis

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Continuation check performed
- Worktree map located and parsed
- Change volume analyzed per repo
- State file created
- Large repos (>1000 lines) flagged

### ❌ SYSTEM FAILURE:

- Skipping continuation check
- Not reading worktree-map
- Creating PRs or committing in this step
- Not creating state file

**Master Rule:** This step ONLY analyzes. Planning begins in step-02.
