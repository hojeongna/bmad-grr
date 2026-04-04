---
name: 'step-05-merge-loop'
description: 'Track PR merge status, rebase next PR, and loop back for sequential PRs'

nextStepFile: './step-06-complete.md'
testCreateFile: './step-04-test-create.md'
---

# Step 5: Merge Track & Rebase

## STEP GOAL:

To track merge status of open PRs, handle rebasing for sequential PRs, and loop back to create the next PR when the current one is merged.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a PR management partner tracking the merge lifecycle
- ✅ Patient and systematic - merges take time
- ✅ This step may span multiple sessions (continuable)

### Step-Specific Rules:

- 🎯 Track merge status and handle rebase
- 🚫 FORBIDDEN to merge PRs (that happens on GitHub)
- 💬 Clearly report what's merged and what's pending
- 📋 Handle rebase conflicts gracefully

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Update state file on every status change
- 📖 This is a looping step - may execute multiple times
- 🚫 Don't force-merge or auto-approve

## CONTEXT BOUNDARIES:

- Step-04 created PR(s) with status OPEN
- Some PRs may need to wait for merge
- Sequential PRs in same repo need rebase after prior merge
- This step loops until all PRs are processed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Check All PR Statuses

For each OPEN PR in state file:

```bash
gh pr view {pr_number_or_url} --json state,mergedAt,mergeable
```

Present status:

"**PR Status Check:**

| # | Repo | PR | Status | Mergeable |
|---|------|----|--------|-----------|
| 1 | {repo-1} | #{pr_num} | {OPEN/MERGED/CLOSED} | {yes/no/conflict} |
| ... | ... | ... | ... | ... |"

### 2. Handle Merged PRs

For each newly merged PR:

"**{repo-name} PR #{pr_num} merged!** ✅"

Update state file: status → MERGED.

### 3. Check for Remaining PRs

**If ALL PRs are MERGED:**

"**All PRs merged! Proceeding to completion...**"

→ Load {nextStepFile} (step-06-complete)

**If OPEN PRs remain but none newly merged:**

"**Waiting for merge on {count} PR(s).**

| PR | Repo | Link |
|----|------|------|
| #{num} | {repo} | {url} |

Come back when a PR is merged. Your progress is saved!

**Options:**
- **[R]** Refresh - Check merge status again
- **[X]** Exit - Save and exit (resume later with continuation)"

- **If R:** Re-run step 1
- **If X:** Update state file, end workflow (user will continue later)

**If a PR was just merged AND more PRs remain in the same repo:**

→ Continue to step 4 (rebase).

### 4. Rebase Next PR

For the next PR in the merge sequence for the same repo:

"**Rebasing next PR onto merged changes...**"

```bash
cd {folder}

# Switch to the next PR's branch (or create it for split PRs)
git checkout {next_branch}

# Rebase onto the updated base
git rebase {base_branch}
```

**If rebase succeeds:**

"**Rebase successful!** ✅

Next PR ready for testing and creation."

```bash
git push --force-with-lease
```

→ Route to {testCreateFile} (step-04) for the next PR.

**If rebase has conflicts:**

"**Rebase conflict detected.** ⚠️

Conflicting files:
```
{conflict_file_list}
```

Please resolve the conflicts. When done:

- **[D]** Done resolving - continue rebase
- **[A]** Abort rebase - I'll help troubleshoot"

- **If D:**
```bash
git add -A
git rebase --continue
git push --force-with-lease
```
→ Route to {testCreateFile} (step-04)

- **If A:**
```bash
git rebase --abort
```
Help user troubleshoot, then retry.

### 5. Update State File

Update state file with all status changes before any routing.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All PR statuses checked via gh CLI
- Merged PRs updated in state file
- Rebase performed correctly for sequential PRs
- Conflicts handled with user involvement
- Correct routing: more PRs → step-04, all done → step-06
- Continuable: user can exit and resume later

### ❌ SYSTEM FAILURE:

- Not checking merge status
- Force-merging PRs
- Rebasing wrong branch
- Not handling conflicts
- Not updating state file
- Losing track of PR sequence

**Master Rule:** Track merges patiently, rebase carefully, loop until all PRs are processed. User can exit and resume anytime.
