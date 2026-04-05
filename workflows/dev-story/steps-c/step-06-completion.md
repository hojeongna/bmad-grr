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
