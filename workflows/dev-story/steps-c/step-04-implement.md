---
name: 'step-04-implement'
description: 'Execute task implementation using TDD skill (sequential) or dispatch parallel agents'

nextStepFile: '~/.claude/workflows/dev-story/steps-c/step-05-validate.md'
tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
tddAntiPatterns: '~/.claude/skills/test-driven-development/testing-anti-patterns.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 4: Implement Task(s)

## STEP GOAL:

Execute the current task(s) following strict TDD discipline. For sequential mode, implement one task at a time with RED-GREEN-REFACTOR. For parallel mode, dispatch agents following the parallel agents skill.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior developer agent implementing with strict TDD
- ✅ The TDD skill was loaded in step-01 — its rules are ACTIVE and BINDING
- ✅ You follow the story file Tasks/Subtasks EXACTLY as written

### Step-Specific Rules:

- 🎯 Implement ONLY the current task/subtask — nothing extra
- 🚫 FORBIDDEN to write production code without a failing test first (TDD Iron Law)
- 🚫 FORBIDDEN to skip the RED phase — you MUST watch the test fail
- 🚫 FORBIDDEN to implement anything not in the story Tasks/Subtasks
- 💬 Continuous execution — do NOT stop for milestones or session boundaries
- ⚙️ If mocking is needed, Read {tddAntiPatterns} first to avoid anti-patterns

## EXECUTION PROTOCOLS:

- 🎯 Follow TDD skill's RED-GREEN-REFACTOR cycle exactly
- 💾 Update Dev Agent Record with implementation decisions
- 📖 Only permitted story sections: Tasks/Subtasks checkboxes, Dev Agent Record, File List, Change Log, Status
- 🚫 HALT if: additional dependencies needed, 3 consecutive failures, missing configuration

## MANDATORY SEQUENCE

### 1. Determine Execution Path

**If execution_mode == "parallel" (from step-03):**
- Go to Section A: Parallel Execution

**If execution_mode == "sequential" (from step-03):**
- Go to Section B: Sequential Execution

---

### Section A: Parallel Execution

#### A1. Prepare Agent Dispatch

Read {parallelAgentsSkill} to refresh the dispatch pattern.

For each independent task group, prepare an agent prompt containing:

1. **Task scope:** The exact task/subtask description from the story file
2. **Story context:** Relevant acceptance criteria and Dev Notes
3. **Project context:** Path to project-context.md for coding standards
4. **TDD enforcement:** "You MUST Read {tddSkill} and follow its TDD process exactly. NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST."
5. **Anti-patterns reference:** "When writing tests with mocks, Read ~/.claude/skills/test-driven-development/testing-anti-patterns.md first."
6. **Scope constraint:** "Implement ONLY the assigned task. Do NOT modify code outside your task scope."
7. **Expected output:** "Return: implementation summary, list of all files created/modified/deleted, test results (pass/fail counts), any issues encountered."

#### A2. Dispatch Agents

Dispatch one agent per independent task group using the Agent tool with:
- Focused, self-contained prompts (from A1)
- Each agent runs in isolation

#### A3. Collect and Review Results

When all agents return:
- Read each agent's summary
- Check for file conflicts (did agents modify the same files?)
- If conflicts exist: resolve manually, then re-run affected tests
- If no conflicts: proceed to integration verification

#### A4. Integration Verification

- Run the FULL test suite to verify all parallel implementations work together
- If tests fail: identify which agent's changes caused the failure, fix, re-test
- If tests pass: proceed to step-05 for validation

---

### Section B: Sequential Execution

#### B1. Identify Current Task

- Read the story file Tasks/Subtasks section
- Find the first incomplete task (unchecked [ ])
- Read the task description completely
- Understand what needs to be implemented

#### B2. RED Phase — Write Failing Test

Following the TDD skill's Iron Law:

- Write ONE minimal test showing what the task should do
- The test name must clearly describe the expected behavior
- Use real code, not mocks (unless unavoidable)
- Test ONE behavior only

**Run the test and VERIFY it fails:**
- Confirm it FAILS (not errors)
- Confirm the failure message is expected
- Confirm it fails because the feature is missing (not typos)

**If test passes immediately:** You're testing existing behavior. Fix the test.
**If test errors:** Fix the error, re-run until it fails correctly.

#### B3. GREEN Phase — Minimal Implementation

- Write the SIMPLEST code to make the test pass
- Do NOT add features beyond what the test requires
- Do NOT refactor other code
- Do NOT "improve" beyond the test

**Run the test and VERIFY it passes:**
- Confirm the new test passes
- Confirm ALL existing tests still pass
- Confirm output is pristine (no errors, warnings)

**If test fails:** Fix the code, not the test.
**If other tests fail:** Fix the regression NOW.

#### B4. REFACTOR Phase — Clean Up

- Remove duplication
- Improve names
- Extract helpers if needed
- Keep ALL tests green throughout refactoring

#### B5. Repeat for Subtasks

If the current task has subtasks:
- Apply B2-B4 for each subtask
- Do NOT skip any subtask

#### B6. Document Progress

- Update Dev Agent Record → Implementation Plan with technical approach
- Update File List with all new/modified/deleted files
- Add Change Log entry

---

### 2. Proceed to Validation

Display: "**Implementation complete for current task(s). Proceeding to validation...**"

#### Menu Handling Logic:

- After implementation complete, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed step
- Do NOT stop for milestones — proceed directly to validation
- HALT only if: additional dependencies needed, 3 consecutive failures, missing configuration

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the current task(s) implementation is complete AND tests pass will you proceed to step-05-validate.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- TDD RED-GREEN-REFACTOR followed for every task
- Each test watched failing before implementation
- Minimal code written to pass tests
- All tests pass after implementation
- Parallel agents (if used) each followed TDD
- No file conflicts from parallel execution
- Dev Agent Record updated

### FAILURE:

- Writing production code before a failing test
- Skipping the RED phase (not watching test fail)
- Over-engineering beyond test requirements
- Testing mock behavior instead of real behavior
- Not loading TDD anti-patterns when using mocks
- Parallel agents not given TDD skill path
- Implementing things not in the story Tasks/Subtasks

**Master Rule:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST. This is the TDD Iron Law from the loaded skill. Violating it is SYSTEM FAILURE.
