---
name: 'step-04-test-create'
description: 'Run local tests, optional health check, optional ship metadata assist, pre-PR review gate, and create or display PR commands'

nextStepFile: './step-05-merge-loop.md'
reviewSkill: '~/.claude/skills/gstack/review/SKILL.md'
healthSkill: '~/.claude/skills/gstack/health/SKILL.md'
shipSkill: '~/.claude/skills/gstack/ship/SKILL.md'
---

# Step 4: Test & Create PR

## STEP GOAL:

To run local tests for the current PR, handle test failures with amend/new-commit options, and create the PR automatically or provide the manual command.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a PR management partner ensuring quality before submission
- ✅ Tests must pass before PR creation
- ✅ User chooses auto or manual PR creation

### Step-Specific Rules:

- 🎯 Test first, create PR second
- 🚫 FORBIDDEN to create PR if tests haven't passed
- 💬 On test failure: help fix, then ask amend or new commit
- 📋 Respect user's auto/manual preference

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Update state file after PR creation
- 📖 Test results determine next action
- 🚫 No PR without passing tests

## CONTEXT BOUNDARIES:

- Step-03 committed and pushed changes
- State file has current PR details
- Need to run repo's test suite
- User chooses how to create PR

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Identify Test Commands

For the current PR's repo:

```bash
cd {folder}
```

Look for test configuration:
- `package.json` → `npm test` or `npm run test`
- `Makefile` → `make test`
- `pytest.ini` / `setup.cfg` → `pytest`
- `.github/workflows/` → extract test commands from CI config

"**Running tests for {repo-name}...**

Detected test command: `{test_command}`"

### 2. Run Tests

```bash
{test_command}
```

### 3. Handle Test Results

**If tests PASS:**

"**Tests passed!** ✅

Ready to create PR."

→ Skip to step 5.

**If tests FAIL:**

"**Tests failed.** ❌

```
{test_output_summary}
```

Let's fix this. After fixing:

- **[A]** Amend the previous commit (`git commit --amend`)
- **[N]** Create a new commit

Which do you prefer?"

**Wait for user selection.**

### 4. Fix and Re-test Loop

After user fixes the issue:

**If Amend:**
```bash
git add -A
git commit --amend --no-edit
git push --force-with-lease
```

**If New commit:**
```bash
git add -A
git commit -m "fix: {description of fix}"
git push
```

Re-run tests. Repeat until tests pass.

### 4b. Code Health Check (gstack/health — OPTIONAL)

**IF `{healthSkill}` exists (gstack installed):** Load the FULL file via Read tool and run its health check pipeline on the current PR's changed files/module:

- Type checker pass
- Linter pass
- Test runner pass (already done above, but included in composite score)
- Dead code detector
- Shell linting (if applicable)

Report the composite score:

"**Code Health:** {score}/10
- Types: {score}
- Linting: {score}
- Dead Code: {score}
- Shell: {score}

{if score < 7: ⚠️ Health score below threshold — consider addressing before opening PR}"

**IF score < 7**: Surface issues to user and ask whether to fix before PR or proceed as-is (user decision).

**IF `{healthSkill}` does NOT exist:** Skip silently.

### 4c. Ship Metadata Assist (gstack/ship — OPTIONAL)

**IF `{shipSkill}` exists (gstack installed):** Load the FULL file via Read tool. Use its CHANGELOG/VERSION logic to prepare PR metadata — we only borrow the metadata formatting, NOT the full ship workflow (grr pr-create remains the primary PR management):

- Detect if the repo has a CHANGELOG.md
- Compose a CHANGELOG entry for this PR's changes (following the repo's existing format)
- Suggest VERSION bump if applicable (patch/minor/major based on change nature — additive feature = minor, bug fix = patch, breaking = major)
- Propose conventional commit message format for the PR body if the repo uses conventional commits

Present to user:

"**Ship metadata prepared:** 📦
- **CHANGELOG entry:** {entry}
- **Version bump suggestion:** {patch/minor/major/none}
- **PR body draft:** {draft}

**Include this in the PR?**
- **[Y]** Yes — use this for PR body and update CHANGELOG
- **[N]** No — use manual PR body only"

**IF Y**: Store as `pr_metadata` for section 6 (Create PR) to use.

**IF `{shipSkill}` does NOT exist:** Skip silently.

### 5. Pre-PR Quality Gate (gstack)

**IF {reviewSkill} exists (gstack installed):**

Load {reviewSkill} via Read tool and follow its pre-landing review directives on the diff:
- Scope drift detection: does the diff match the intended PR responsibility?
- Critical checks: SQL safety, race conditions, shell injection
- Plan completion audit: if story-based, verify AC coverage in the diff

"**Pre-PR Review:**
- **Scope drift:** {none/detected}
- **Critical findings:** {count}
- **Plan completion:** {complete/gaps found}

{if critical findings: ⚠️ Address findings before creating PR?}"

**IF {reviewSkill} does NOT exist:** Skip to PR creation.

### 6. Create PR

"**How would you like to create the PR?**

- **[A]** Auto - I'll create it with `gh pr create`
- **[M]** Manual - I'll show you the command

PR details:
- **Title:** {generated from branch/role}
- **Base:** {branch_base}
- **Head:** {branch_name}
- **Body:** {generated description based on PR role}"

**Wait for user selection.**

**If Auto:**
```bash
gh pr create --title "{title}" --body "{body}" --base {base}
```

Report PR URL:
"**PR created!** {pr_url} ✅"

**If Manual:**
"**Run this command when ready:**
```bash
gh pr create --title \"{title}\" --body \"{body}\" --base {base}
```

Let me know when you've created it."

### 7. Update State File

Update current PR status to OPEN. Record PR URL if available.

### 8. Present MENU OPTIONS

Display: **[C] Continue to Merge Tracking**

#### Menu Handling Logic:

- IF C: Update state file stepsCompleted, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#7-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Tests run before PR creation
- Test failures handled with amend/new-commit choice
- User chose auto/manual PR creation
- PR created or command provided
- State file updated (OPEN)

### ❌ SYSTEM FAILURE:

- Creating PR without running tests
- Not offering amend/new-commit choice on failure
- Force-creating without user consent
- Not updating state file

**Master Rule:** Tests must pass before PR. User controls how to fix failures and how to create the PR.
