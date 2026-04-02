---
name: 'step-05-validate'
description: 'Validate implementation, mark task complete, and loop or proceed to completion'

nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-06-completion.md'
loopStepFile: '~/.claude/workflows/dev-story/steps-c/step-03-analyze.md'
---

# Step 5: Validate and Mark Task Complete

## STEP GOAL:

Validate that the implemented task(s) pass all verification gates, mark completed tasks, and determine whether to loop back for more tasks or proceed to story completion.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a strict quality gatekeeper
- ✅ NEVER mark a task complete unless ALL validation gates pass
- ✅ NO LYING OR CHEATING about test results

### Step-Specific Rules:

- 🎯 Focus ONLY on validation and task completion marking
- 🚫 FORBIDDEN to mark a task [x] if any validation gate fails
- 🚫 FORBIDDEN to skip any validation gate
- 💬 This is an auto-proceed step with loop logic

## MANDATORY SEQUENCE

### 1. Validation Gates (ALL must pass)

For each task just implemented:

**Gate 1: Tests Exist**
- Verify that tests for this task ACTUALLY EXIST
- Count the test files and test cases added/modified

**Gate 2: Tests Pass**
- Run the tests for this specific task
- ALL must pass — no partial passes

**Gate 3: No Regressions**
- Run the FULL test suite
- ALL existing tests must still pass
- If regressions found: STOP and fix before continuing

**Gate 4: AC Satisfaction**
- Check each Acceptance Criterion related to this task
- Verify implementation matches EXACTLY what the task specifies
- No extra features, no missing features

**Gate 5: Code Quality**
- Run linting and code quality checks (if configured in project)
- Verify code follows patterns from project-context.md and Dev Notes

### 2. Mark Task Complete (ONLY if ALL gates pass)

**If ALL validation gates pass:**
- Mark the task checkbox [x] in Tasks/Subtasks
- Mark all subtask checkboxes [x] if applicable
- Update File List with ALL new/modified/deleted files (paths relative to repo root)
- Add completion notes to Dev Agent Record
- Add Change Log entry

**If ANY validation gate fails:**
- DO NOT mark task complete
- Document which gate(s) failed
- Return to step-04 to fix the issue
- If 3 consecutive failures: HALT and request user guidance

### 3. Check for Remaining Tasks

Re-read the story file Tasks/Subtasks section:

**If more incomplete tasks remain:**

"**Task {{task_name}} validated and complete**
**Progress:** {{completed}}/{{total}} tasks done
**Next:** Returning to task analysis for remaining tasks...

**Looping back to step-03...**"

→ Load, read entire file, then execute {loopStepFile}

**If ALL tasks are complete:**

"**All tasks validated and complete!**
**Progress:** {{total}}/{{total}} tasks done

**Proceeding to story completion...**"

→ Load, read entire file, then execute {nextStepFile}

### 4. Route

#### Menu Handling Logic:

- If more tasks remain: immediately load, read entire file, then execute {loopStepFile} (step-03-analyze)
- If all tasks complete: immediately load, read entire file, then execute {nextStepFile} (step-06-completion)

#### EXECUTION RULES:

- This is an auto-proceed step with conditional routing
- Do NOT stop between tasks — continuous execution

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All 5 validation gates checked for each task
- Tasks only marked [x] when ALL gates pass
- File List updated accurately
- Correct routing: loop to step-03 or proceed to step-06
- Continuous execution without unnecessary pauses

### FAILURE:

- Marking task complete with failing tests
- Skipping validation gates
- Not running full regression suite
- Lying about test results
- Stopping execution between tasks unnecessarily

**Master Rule:** NEVER mark a task complete unless ALL validation gates pass. Cheating on validation is SYSTEM FAILURE.
