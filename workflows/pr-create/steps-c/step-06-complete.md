---
name: 'step-06-complete'
description: 'Verify all PRs merged, run post-merge health check, save PR learnings to gstack/learn, present completion summary'

healthSkill: '~/.claude/skills/gstack/health/SKILL.md'
learnSkill: '~/.claude/skills/gstack/learn/SKILL.md'
---

# Step 6: Completion

## STEP GOAL:

To verify all PRs are merged, finalize the state file, and present a completion summary.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Step-Specific Rules:

- 🎯 Focus ONLY on verification and summary
- 🚫 FORBIDDEN to create new PRs or modify code
- 💬 Present clear completion summary

## MANDATORY SEQUENCE

### 1. Verify All PRs Merged

Double-check each PR via gh CLI:

```bash
gh pr view {pr_number} --json state,mergedAt
```

"**Final Verification:**

| # | Repo | PR | Role | Status | Merged At |
|---|------|----|------|--------|-----------|
| 1 | {repo-1} | #{num} | {role} | ✅ MERGED | {date} |
| ... | ... | ... | ... | ... | ... |

**{total}/{total} PRs merged!**"

### 2. Update State File

Update state file:

```yaml
status: COMPLETE
completedDate: '{date}'
```

Mark all PRs as MERGED with timestamps.

### 3. Post-Merge Health Check (gstack)

**IF {healthSkill} exists (gstack installed):**

Load {healthSkill} via Read tool and run a health check on each merged repo:
- Type checker, linter, test runner, dead code detector
- Compute weighted composite score (0-10)
- Compare against pre-PR baseline if available

"**Post-Merge Health:**

| Repo | Score | Types | Lint | Tests | Dead Code |
|------|-------|-------|------|-------|-----------|
| {repo} | {score}/10 | {s} | {s} | {s} | {s} |

{if any score < 7: ⚠️ Health degradation detected}"

**IF {healthSkill} does NOT exist:** Skip to next section.

### 3b. Save PR Learnings (gstack/learn — OPTIONAL)

**IF `{learnSkill}` exists (gstack installed):** PR lifecycles reveal reusable patterns and pitfalls — save them so future `pr-create` runs benefit.

Load the FULL `{learnSkill}` file via Read tool, then save 1-3 distinct learning entries based on what this PR cycle revealed:

**Candidates for learning entries:**

- **PR splitting pattern** (type `pattern`) — e.g., "Schema migrations should be their own PR separate from code changes that depend on them, to allow independent rollback"
- **Test failure pattern** (type `pitfall`) — e.g., "Local tests pass but CI fails due to missing env var X — always verify CI env before pushing"
- **Merge timing learning** (type `preference`) — e.g., "This project prefers squash-merges for feature PRs, merge commits for release PRs"
- **Review friction** (type `pitfall`) — e.g., "PRs over 500 lines consistently get bounced — split more aggressively"
- **Operational learning** (type `operational`) — e.g., "CI takes ~8min — batch related PRs to avoid wasted CI runs"

Each entry:

- **key**: short kebab-case (e.g., `schema-migration-separate-pr`)
- **insight**: one-sentence lesson (the *why*, not the specific fix)
- **confidence**: 6-10 based on how reproducible the pattern is
- **files**: relevant state file or mapping document path
- **source**: `pr-create`

Do NOT log obvious, one-off, or trivially documented learnings — only genuine reusable insights. Bar: "Would knowing this save 5+ minutes on the next PR cycle?"

"**PR learnings saved** ({n} entries) — future PR cycles will see these patterns."

**IF `{learnSkill}` does NOT exist:** Silently skip.

### 4. Present Completion Summary

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**

# PR Create Complete!

**Total PRs:** {count}
**All Merged:** ✅

| Repo | PRs | Status |
|------|-----|--------|
| {repo-1} | {count} | ✅ All merged |
| ... | ... | ... |

**PR Links:**
- {repo-1}: {pr_url_1}, {pr_url_2}
- ...

**State file:** `{state_file_path}`

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 5. Workflow Complete

This is the final step. No next step to load.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All PRs verified as merged
- State file finalized with COMPLETE status
- Clear summary with PR links presented

### ❌ SYSTEM FAILURE:

- Not verifying merge status
- Marking complete when PRs are still open
- Not presenting summary

**Master Rule:** Verify everything is merged, present a clean summary, done.
