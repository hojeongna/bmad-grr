---
name: 'step-06-complete'
description: 'Verify all PRs merged and complete the workflow'
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

### 3. Present Completion Summary

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

### 4. Workflow Complete

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
