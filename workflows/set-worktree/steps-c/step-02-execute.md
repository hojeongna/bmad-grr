---
name: 'step-02-execute'
description: 'Clone repos and create branches in parallel using sub-agents'

nextStepFile: './step-03-document-complete.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 2: Parallel Clone & Branch Creation

## STEP GOAL:

To execute all git operations in parallel: clone each repository, set up worktrees, and create feature branches based on the configuration gathered in step-01.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If sub-agents are unavailable, execute git operations sequentially in main thread

### Role Reinforcement:

- ✅ You are a workspace setup partner executing the plan
- ✅ Efficiency matters - use parallel execution where possible
- ✅ Report progress clearly and handle errors gracefully

### Step-Specific Rules:

- 🎯 Execute git operations ONLY - no gathering, no document generation
- 🚫 FORBIDDEN to ask the user for more information - all info was gathered in step-01
- 🚫 FORBIDDEN to modify the plan from step-01
- 💬 Report progress and results clearly
- ⚙️ Use sub-agents for parallel repo setup (Pattern 4: Parallel Execution)

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Track success/failure for each repo
- 📖 Load parallel agents skill before execution
- 🚫 Do not generate mapping document - that's step-03

## CONTEXT BOUNDARIES:

- Step-01 gathered: project root, repo links, branch bases, branch names, folder names
- All info is in memory from step-01
- This step ONLY executes git operations
- Document generation happens in step-03

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Parallel Agents Skill

Load and read `{parallel_agents_skill}` completely. This skill governs how to dispatch sub-agents for parallel work.

### 2. Execute Parallel Clone & Branch Setup

**For EACH repo from step-01's confirmed plan, launch a sub-agent that performs:**

```bash
# 1. Clone the repo into the designated folder
git clone {repo_url} {folder_name}

# 2. Enter the folder
cd {folder_name}

# 3. Checkout the branch base (if not default)
git checkout {branch_base}

# 4. Create and switch to the new branch
git checkout -b {branch_name}
```

**Sub-agent return:** Each sub-agent must return a structured result:
```
repo: {repo_name}
status: SUCCESS | FAILURE
folder: {folder_path}
branch: {branch_name}
base: {branch_base}
error: {error_message if failed, empty if success}
```

**If sub-agents are unavailable:** Execute the same git commands sequentially for each repo in the main thread. Report progress after each repo completes.

### 3. Aggregate Results

Collect all sub-agent results and build a results table:

"**Execution Results:**

| # | Repo | Status | Folder | Branch |
|---|------|--------|--------|--------|
| 1 | {repo-1} | {SUCCESS/FAILURE} | {folder-1} | {branch-1} |
| 2 | {repo-2} | {SUCCESS/FAILURE} | {folder-2} | {branch-2} |
| ... | ... | ... | ... | ... |

**{success_count}/{total_count} repos set up successfully.**"

### 4. Handle Failures (If Any)

**If all succeeded:** Skip to step 5.

**If any failed:**

"**Some repos failed to set up:**

| Repo | Error |
|------|-------|
| {failed-repo} | {error-message} |

**Options:**
- **[R]** Retry failed repos
- **[S]** Skip failed repos and continue with successful ones
- **[A]** Abort - clean up and exit"

- **If R:** Re-run git commands for failed repos only
- **If S:** Continue with successful repos only
- **If A:** Remove all created folders and end workflow

### 5. Auto-Proceed to Documentation

Display: "**All worktrees ready! Generating mapping document...**"

#### Menu Handling Logic:

- After results are aggregated and any failures are handled, immediately load, read entire file, then execute {nextStepFile} to generate mapping documentation.

#### EXECUTION RULES:

- This is an auto-proceed execution step
- Proceed directly to next step after execution is complete and user is informed of results
- Always halt if there are failures and user needs to make a decision

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Parallel agents skill loaded
- All repos cloned in parallel (or sequentially as fallback)
- All branches created on correct base
- Results clearly reported to user
- Failures handled with user input
- Ready for documentation step

### ❌ SYSTEM FAILURE:

- Asking user for additional information
- Running git operations sequentially when sub-agents are available
- Not reporting individual repo results
- Skipping failure handling
- Generating mapping document in this step

**Master Rule:** This step ONLY executes git operations and reports results. Documentation happens in step-03.
