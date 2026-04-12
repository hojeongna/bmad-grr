---
name: 'step-06-completion'
description: 'Run Definition of Done checklist and mark story for review'

nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-07-communicate.md'
checklistFile: '~/.claude/workflows/dev-story/data/checklist.md'
healthSkill: '~/.claude/skills/gstack/health/SKILL.md'
---

# Step 6: Story Completion and DoD Validation

## STEP GOAL:

Verify ALL tasks are complete, run the Definition of Done checklist, and update story status to "review".

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a quality gatekeeper ensuring story readiness for review
- ✅ The DoD checklist is the final authority on completeness

### Step-Specific Rules:

- 🎯 Focus ONLY on DoD validation and status update
- 🚫 FORBIDDEN to skip any DoD checklist item
- 🚫 FORBIDDEN to mark story "review" if DoD fails

## MANDATORY SEQUENCE

### 1. Final Task Verification

- Re-scan the ENTIRE story file Tasks/Subtasks section
- Verify ALL tasks and subtasks are marked [x]
- If any are unchecked: HALT — "Incomplete tasks found. Cannot proceed to completion."

### 2. Full Regression Suite

- Run the complete test suite one final time
- ALL tests must pass
- If failures: HALT — "Regression failures found. Fix before completing."

### 3. Run Definition of Done Checklist

Load {checklistFile} and validate every item:

**Implementation Completion:**
- [ ] All tasks/subtasks marked [x]
- [ ] All ACs satisfied
- [ ] No scope creep
- [ ] Edge cases handled

**TDD Compliance:**
- [ ] Every function has a test
- [ ] RED verified for each test
- [ ] GREEN minimal for each implementation
- [ ] All tests pass
- [ ] Output pristine
- [ ] Anti-patterns avoided

**Test Coverage:**
- [ ] Unit tests added
- [ ] Integration tests added (when required)
- [ ] E2E tests added (when required)
- [ ] No regressions

**Documentation:**
- [ ] File List complete
- [ ] Dev Agent Record updated
- [ ] Change Log updated
- [ ] Only permitted sections modified

### 4. Handle DoD Result

**If ALL DoD items pass:**

- Update story Status to: "review"
- Update {sprint_status} if it exists:
  - Load FULL file
  - Find story key
  - Update status to "review"
  - Save, preserving ALL comments and structure

"**Definition of Done: PASS**

Story {{story_key}} is ready for review."

**If ANY DoD items fail:**

- List specific failures
- HALT — "DoD validation failed. Address the following before completion:"
  - [List each failed item]

### 5. Code Health Check (gstack)

**IF {healthSkill} exists (gstack installed):**

Load {healthSkill} via Read tool and follow its directives to run a health check:
- Type checker, linter, test runner, dead code detector
- Compute weighted composite score (0-10)
- Report any degradation from previous baseline

"**Code Health Score:** {score}/10
- Types: {score}
- Linting: {score}
- Tests: {score}
- Dead Code: {score}

{if score < 7: ⚠️ Health score below threshold — consider addressing issues before review}"

**IF {healthSkill} does NOT exist:** Skip this section.

### 5b. Save Implementation Learnings (gstack/learn — OPTIONAL)

**IF `{learn_skill}` exists (gstack installed):** The implementation just completed — capture distinct lessons so future stories can benefit from what this one discovered.

Load the FULL `{learn_skill}` file via Read tool, then review the Dev Agent Record, File List, and Change Log to identify 1-3 distinct lessons worth persisting. Good candidates:

- **New architectural pattern established** (type `architecture`) — e.g., "Use the new EventBus for cross-module events instead of direct imports"
- **New reusable pattern crystallized** (type `pattern`) — e.g., "React Query wrapper for paginated endpoints with cursor-based pagination"
- **Non-obvious pitfall encountered** (type `pitfall`) — e.g., "Next.js 14 RSC boundary requires 'use client' directive for SWR hooks"
- **Operational learning** (type `operational`) — e.g., "This test suite requires DATABASE_URL env var set before running"
- **Team preference confirmed** (type `preference`) — e.g., "Result<T, E> style error handling in auth module"

Each entry:

- **key**: short kebab-case (e.g., `react-query-paginated-wrapper`)
- **insight**: one-sentence description of the lesson (the *why*/*how* principle, not the specific line)
- **confidence**: 6-10 based on how reusable/reproducible
- **files**: relevant files from this story's File List
- **source**: `dev-story`

Do NOT log obvious, one-off, or trivially documented learnings — only genuine reusable insights. **Bar**: "Would knowing this save 5+ minutes in a future session?" If yes, log it. If no, skip it.

"**Implementation learnings saved** ({n} entries)"

**IF `{learn_skill}` does NOT exist:** Silently skip.

### 6. Auto-Proceed to Communication

Display: "**Proceeding to completion summary...**"

#### Menu Handling Logic:

- After DoD passes and status updated, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed step
- HALT if DoD fails — do NOT proceed

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All tasks verified complete
- Full regression suite passed
- DoD checklist fully validated
- Story status updated to "review"
- Sprint status updated (if exists)

### FAILURE:

- Skipping DoD checklist items
- Marking story "review" with DoD failures
- Not running final regression suite
- Corrupting sprint-status.yaml

**Master Rule:** The DoD checklist is the FINAL GATE. No shortcuts.
