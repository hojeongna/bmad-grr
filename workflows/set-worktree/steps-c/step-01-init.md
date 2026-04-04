---
name: 'step-01-init'
description: 'Gather workspace context: project root, problem description, repo links, branch configuration'

nextStepFile: './step-02-execute.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 1: Initialize & Gather Context

## STEP GOAL:

To gather all information needed for worktree setup: confirm project root, understand the problem being solved, collect GitHub repo links, and configure branch naming for each repo.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a workspace setup partner
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring git workflow expertise, user brings project context and repo links
- ✅ Together we set up an efficient multi-repo workspace

### Step-Specific Rules:

- 🎯 Focus ONLY on gathering information - no git operations yet
- 🚫 FORBIDDEN to clone, checkout, or run any git commands
- 🚫 FORBIDDEN to create any files or folders yet
- 💬 Ask conversationally, collect all info before proceeding

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Keep all gathered info in memory for step-02
- 📖 Load parallel agents skill for reference in step-02
- 🚫 This is the init step - gather everything, execute nothing

## CONTEXT BOUNDARIES:

- This is the first step - no prior context exists
- User may provide partial or complete info upfront
- Must determine: project root, problem description, repo links, branch config
- No git operations happen here - that's step-02

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Confirm Project Root

Detect the current working directory (where Claude Code is running).

"**Workspace Setup starting!**

Current project root detected: `{current_working_directory}`

Is this the correct root for your monorepo workspace? [Y/N]"

- **If Y:** Continue
- **If N:** Ask for the correct path

### 2. Gather Problem Context

"**What are you working on?**

Tell me about the problem or feature you're tackling. This will be used for branch naming.

For example: 'Adding student roadmap feature' or 'Fixing auth token refresh bug'"

**Wait for user response.** Accept whatever level of detail they provide.

### 3. Collect GitHub Repository Links

"**Which repos do you need?**

Paste your GitHub repository links (one per line or comma-separated).

Example:
```
https://github.com/org/repo-one
https://github.com/org/repo-two
https://github.com/org/repo-three
```"

**Wait for user response.**

Parse and validate each link:
- Extract repo name from URL (e.g., `repo-one` from `https://github.com/org/repo-one`)
- Confirm the list back to the user

### 4. Configure Branch Base Per Repo

For each repo, ask what branch to base off of:

"**What branch should each repo start from?**

| # | Repo | Base Branch |
|---|------|-------------|
| 1 | {repo-1} | main (default) |
| 2 | {repo-2} | main (default) |
| ... | ... | ... |

Press Enter to accept all as `main`, or specify different bases:
e.g., '2: develop, 3: staging'"

**Wait for user response.** Apply defaults for unspecified repos.

### 5. Configure Branch Type and Name

"**Branch type?**

- **[F]** feature
- **[X]** fix
- **[R]** refactor
- **[C]** chore"

**Wait for user selection.**

Auto-generate branch name based on:
- Type: `{selected_type}`
- Date: `{YYMMDD}` (today's date)
- Description: derived from problem context in step 2, written in user's `{communication_language}`

Format: `{type}/{YYMMDD}-{description}`

"**Suggested branch name:** `{generated_branch_name}`

Apply this to all repos? [Y/N]
Or specify different names per repo."

**Wait for user response.**

### 6. Generate Folder Names

For each repo, generate folder name:
- Format: `{repo-name}-{branch-type}-{YYMMDD}-{description}`

### 7. Present Summary for Confirmation

"**Here's the complete setup plan:**

| # | Repo | GitHub Link | Base | Branch | Folder |
|---|------|-------------|------|--------|--------|
| 1 | {repo-1} | {link-1} | {base-1} | {branch-1} | {folder-1} |
| 2 | {repo-2} | {link-2} | {base-2} | {branch-2} | {folder-2} |
| ... | ... | ... | ... | ... | ... |

**Project Root:** `{project_root}`

**Ready to execute?** [Y] Proceed / [E] Edit something"

- **If Y:** Proceed to step-02
- **If E:** Ask what to change, update, and re-display summary

### 8. Auto-Proceed to Execution

Display: "**Setting up worktrees...**"

#### Menu Handling Logic:

- After user confirms the setup plan with 'Y', load {parallel_agents_skill} for reference, then immediately load, read entire file, then execute {nextStepFile} to begin parallel execution.

#### EXECUTION RULES:

- This is an auto-proceed init step after user confirmation
- Proceed directly to next step after setup plan is confirmed
- Always halt if user wants to edit the plan

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Project root confirmed
- Problem context gathered
- All repo links collected and validated
- Branch base configured per repo
- Branch type and name determined
- Folder names generated
- Complete summary presented and confirmed by user

### ❌ SYSTEM FAILURE:

- Running any git commands in this step
- Creating any files or folders
- Proceeding without user confirmation of the summary
- Skipping branch configuration
- Not validating repo links

**Master Rule:** This step ONLY gathers information. All git operations happen in step-02.
