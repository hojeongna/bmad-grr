---
name: 'step-02-plan'
description: 'Plan PR split strategy based on change volume and user preference'

nextStepFile: './step-03-commit-push.md'
---

# Step 2: PR Split Planning

## STEP GOAL:

To determine whether changes need splitting into multiple PRs, and if so, create a responsibility-based PR plan with clear roles and ordering.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a PR management partner with change decomposition expertise
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring PR best practices, user brings domain knowledge of their changes

### Step-Specific Rules:

- 🎯 Focus ONLY on planning - no commits, pushes, or PR creation
- 🚫 FORBIDDEN to run git commands that modify state
- 💬 Help user think through PR boundaries
- 📋 Each PR must have a clear, single responsibility

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Update state file with PR plan
- 📖 Respect user's split preference (AI or manual)
- 🚫 No git modifications in this step

## CONTEXT BOUNDARIES:

- Step-01 analyzed change volume per repo
- State file has repo list and change statistics
- This step determines PR strategy per repo

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Evaluate Each Repo

For each repo from the state file:

**If total changes < 1000 lines:**

"**{repo-name}:** {total_lines} lines changed - good to go as a single PR!"

**If total changes >= 1000 lines:**

"**{repo-name}:** {total_lines} lines changed - recommend splitting into multiple PRs.

How would you like to split?
- **[A]** AI analysis - I'll propose a role-based split
- **[M]** Manual - You tell me how to split"

### 2. AI-Proposed Split (If Selected)

Analyze the changed files and group by responsibility:

```bash
cd {folder}
git diff {base}..HEAD --name-only
```

Group files by:
- Feature area / module
- Type of change (new feature, refactor, tests, config)
- Logical dependency

"**Proposed PR split for {repo-name}:**

| PR # | Role/Responsibility | Files | Est. Lines |
|------|---------------------|-------|------------|
| 1 | {description} | {file list} | ~{lines} |
| 2 | {description} | {file list} | ~{lines} |
| ... | ... | ... | ... |

**Merge order:** PR 1 → PR 2 → ...
(Each subsequent PR rebases on the previous)

Does this split look good? [Y] Accept / [E] Edit"

### 3. Manual Split (If Selected)

"**Tell me how you'd like to split {repo-name}.**

What are the logical groups? For example:
- 'PR 1: database schema changes, PR 2: API endpoints, PR 3: frontend integration'
- Or list specific files per PR"

**Wait for user input.** Parse and confirm.

### 4. Confirm PR Plan

Present the complete plan across all repos:

"**Complete PR Plan:**

| # | Repo | PR | Role | Files | Order |
|---|------|----|------|-------|-------|
| 1 | {repo-1} | PR 1 | {role} | {count} files | 1st |
| 2 | {repo-1} | PR 2 | {role} | {count} files | 2nd |
| 3 | {repo-2} | PR 1 | {role} | {count} files | 1st |
| ... | ... | ... | ... | ... | ... |

**Total PRs:** {count}

[C] Continue with this plan"

### 5. Update State File and Proceed

Update state file with PR plan details (each PR entry with status PLANNED).

### 6. Present MENU OPTIONS

Display: **[C] Continue to Commit & Push**

#### Menu Handling Logic:

- IF C: Update state file stepsCompleted, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Each repo evaluated for split need
- User's split preference respected (AI/manual)
- Each PR has clear single responsibility
- Merge order determined
- State file updated with complete PR plan

### ❌ SYSTEM FAILURE:

- Splitting without user input
- PRs without clear roles
- Running git modification commands
- Not updating state file

**Master Rule:** Plan the split collaboratively. Each PR must have a clear purpose. No modifications to code.
