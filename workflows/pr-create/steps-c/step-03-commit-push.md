---
name: 'step-03-commit-push'
description: 'Stage, commit, and push changes for the current PR unit'

nextStepFile: './step-04-test-create.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 3: Commit & Push

## STEP GOAL:

To stage the appropriate changes for the current PR, create a meaningful commit, and push to the remote branch.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If sub-agents are unavailable, execute sequentially in main thread

### Role Reinforcement:

- ✅ You are a PR management partner executing the plan
- ✅ Commit messages should be clear and descriptive

### Step-Specific Rules:

- 🎯 Execute commit and push ONLY for the current PR unit
- 🚫 FORBIDDEN to create PRs - that's step-04
- 🚫 FORBIDDEN to modify the PR plan
- 💬 Show exactly what's being committed

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Update state file after push
- 📖 Load parallel agents skill for multi-repo parallel push
- 🚫 Do not create PRs - that's next step

## CONTEXT BOUNDARIES:

- Step-02 created the PR plan with file groupings
- State file has which PRs to process
- For split PRs: only stage files belonging to current PR
- For single PRs: stage all changes

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Parallel Agents Skill

Load and read `{parallel_agents_skill}` for potential parallel execution across repos.

### 2. Determine Current PR(s) to Process

From state file, identify PRs with status PLANNED (not yet pushed).

If multiple repos each have a single PR: process in parallel.
If a repo has multiple sequential PRs: process first unpushed PR only.

### 3. Stage and Commit

**For each PR to process:**

```bash
cd {folder}

# For split PRs: stage specific files
git add {file1} {file2} ...

# For single PRs: stage all changes
git add -A

# Show what's staged
git diff --cached --stat
```

Generate commit message based on PR role/responsibility:

"**Commit preview for {repo-name} - {pr_role}:**

```
{generated_commit_message}
```

Files staged: {count}
Lines: +{added} -{removed}

[Y] Commit / [E] Edit message"

**Wait for user confirmation.**

```bash
git commit -m "{commit_message}"
```

### 4. Push to Remote

```bash
git push -u origin {branch_name}
```

Report result:

"**Pushed:** {repo-name} → `origin/{branch_name}` ✅"

### 5. Update State File

Update each processed PR status to PUSHED.

### 6. Auto-Proceed to Test & Create

Display: "**Changes pushed. Running tests and creating PR...**"

#### Menu Handling Logic:

- After all current PRs are pushed, immediately load, read entire file, then execute {nextStepFile}.

#### EXECUTION RULES:

- This is an auto-proceed step after push
- Proceed directly to next step after successful push
- Halt if push fails - report error and wait for user

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Correct files staged per PR plan
- Meaningful commit message generated
- User confirmed commit
- Push successful
- State file updated (PUSHED)

### ❌ SYSTEM FAILURE:

- Staging wrong files for a split PR
- Committing without user confirmation
- Creating PRs in this step
- Not updating state file

**Master Rule:** Stage exactly the right files, commit with user approval, push, update state. No PR creation yet.
