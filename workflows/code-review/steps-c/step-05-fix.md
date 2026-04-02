---
name: 'step-05-fix'
description: 'Fix checklist violations using parallel agents, no deferral allowed'

nextStepFile: '~/.claude/workflows/code-review/steps-c/step-06-complete.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 5: Fix — Resolve Checklist Violations (Parallel)

## STEP GOAL:

Fix checklist violations identified in the report using parallel agents (one agent per file). Filter findings by the fixScope selected in step-04, then fix ALL items in that scope without exception.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step, ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review agent performing checklist-based fixes
- You fix ONLY what the checklist flagged — nothing more
- Every fix MUST correspond to a specific finding from the report

### Step-Specific Rules:

- Fix ONLY what the checklist flagged — no extra "improvements"
- FORBIDDEN to refactor or change code beyond the violation fix
- FORBIDDEN to add features or make "improvements" not in findings
- FORBIDDEN to re-organize code that was not flagged
- 🛑 **NO DEFERRAL**: NEVER skip, defer, or reserve a fix for any reason
- 🛑 **NO EXCUSES**: "scope is large", "refactoring target", "complex change" are NOT valid reasons to skip fixes
- 🛑 ALL items within the selected fixScope MUST be fixed

## EXECUTION PROTOCOLS:

- Filter findings by fixScope, then dispatch parallel fix agents
- Collect and verify all agent results before proceeding
- After fixes, auto-detect and run available tests (type check, build, test)
- Auto-fix test failures up to 3 retries
- FORBIDDEN to proceed without all agents completing

## CONTEXT BOUNDARIES:

- Available: Findings report from step-04, fixScope selection, parallel agents skill
- Focus: Fix ONLY flagged violations, then verify with tests
- Limits: One agent per file, no feature additions, no refactoring beyond findings
- Dependencies: step-04 report (findings + priorities + scope)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Filter Findings by Scope

Apply the fixScope from step-04:

- **fixScope='ALL'**: Include ALL findings (HIGH + MEDIUM + LOW, SMALL + LARGE)
- **fixScope='SMALL'**: Include only SMALL scope findings (any priority)
- **fixScope='HIGH'**: Include only HIGH priority findings (any scope)

Group filtered findings by file.

Present fix plan:

"**Fix plan (scope: {{fixScope}}):**
🔴 High: {{high_count}}
🟡 Medium: {{med_count}}
🟢 Low: {{low_count}}
📁 Target files: {{file_count}}
**Starting parallel fixes...**"

### 2. Load Parallel Agents Skill

- Use Read tool to load the FULL content of {parallelAgentsSkill}
- Read the skill completely — do not skim or skip sections
- Follow the skill's dispatch pattern for agent creation

"**Parallel agents skill loaded. Preparing fix agents...**"

### 3. Prepare Agent Prompts

For each file with filtered findings, prepare an agent prompt containing:

1. **File path:** The specific file this agent must fix
2. **Findings list:** ALL filtered findings for this file — checklist category, item, line number, description, how to fix
3. **Fix instruction:** "Read the file completely using the Read tool. Apply ALL fixes listed below. For each fix: (1) locate the violation, (2) apply the minimum change to resolve it, (3) verify the fix does not break surrounding code. Do NOT skip any fix. Do NOT defer any fix regardless of scope or complexity."
4. **Scope constraint:** "Fix ONLY the assigned file. Do NOT modify other files. Do NOT add improvements beyond what is listed."
5. **No-deferral rule:** "You MUST fix every item assigned to you. Reporting a fix as 'too complex' or 'requires refactoring' is FORBIDDEN. Apply the fix now."
6. **Expected output format:** "Return a list of fixes applied: (1) checklist item reference, (2) what was changed, (3) line numbers affected. If a fix truly cannot be applied (e.g., file deleted, syntax conflict), report the specific technical reason — but 'too large' or 'too complex' is NOT a valid reason."

### 4. Dispatch Agents

- Dispatch one agent per file using the Agent tool
- Each agent fixes its file independently and in isolation
- Do NOT batch multiple files into a single agent

"**{{agent_count}} fix agents dispatched. Parallel fixes in progress...**"

### 5. Collect Results and Verify

When all agents return:

- Collect all fix results from every agent
- Verify each finding was addressed
- Flag any items reported as unfixed with their reason
- If any agent deferred a fix without valid technical reason: report as SYSTEM FAILURE

### 6. Report Fix Results

"**Fixes complete**
- Fixed: {{fixed_count}}
- Unable to fix: {{unfixed_count}} (list with reasons if any)

**Proceeding to completion step...**"

### 7. Auto-Detect and Run Tests

After fixes are applied, automatically detect and run available tests.

**Detection sequence:**

1. **Type check:** check if `tsconfig.json` exists → if present, run `tsc --noEmit`
2. **Build test:** check `package.json` `scripts.build` → if present, run with appropriate package manager (npm/pnpm/yarn run build)
3. **Test execution:** detect in the following order
   - `package.json` `scripts.test` → npm/pnpm/yarn test
   - `behave` config file exists → `behave`
   - `pytest.ini` / `pyproject.toml` pytest config → `pytest`

**Package manager detection:** `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, otherwise → npm

**Execution rules:**
- Run only detected tests — skip if not detected
- Mark each test result as "**✅ PASS**" or "**❌ FAIL**"

**IF ANY TEST FAILS:**

"**❌ Test failures detected:**
{{failure_output}}

**Auto-fixing and re-running...**"

- Analyze failure cause and fix immediately
- Re-run only failed tests after fix
- Repeat until passing (max 3 retries)
- After 3 failures: output "**⚠️ Auto-fix limit reached. Manual verification required.**" then proceed

**IF ALL TESTS PASS:**

"**✅ All tests passed!**
{{list of tests run and their status}}"

### 8. Auto-Proceed

Immediately load, read entire file, then execute {nextStepFile}

#### Menu Handling Logic:

- After fixes reported, run auto-detected tests, auto-fix failures, then proceed to {nextStepFile} (step-06-complete)

#### EXECUTION RULES:

- This is an auto-proceed step — do not wait for user input
- Wait for ALL agents to complete before proceeding
- Do NOT proceed with partial results
- Proceed to completion step after reporting results

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Findings correctly filtered by fixScope
- Parallel agents skill loaded via Read tool
- One fix agent dispatched per file
- All agents completed their fixes
- ALL items in selected scope were fixed — zero deferrals
- Each fix corresponds to a specific checklist finding
- Fix results reported clearly
- Available tests auto-detected and executed
- Failed tests triggered auto-fix and re-run
- All tests passed before proceeding
- Auto-proceeded to step-06-complete

### FAILURE:

- Fixing things not in the findings
- Over-engineering fixes beyond what is needed
- Adding features or refactoring during fixes
- Skipping or deferring ANY fix in the selected scope
- Reporting a fix as "too complex" or "too large" without a concrete technical blocker
- Not loading parallel agents skill
- Not dispatching agents in parallel
- Proceeding before all agents complete
- Not verifying fixes after applying

- Skipping test execution when tests are detected
- Not attempting auto-fix on test failure
- Proceeding with failing tests without reporting

**Master Rule:** Fix ONLY checklist violations. Fix ALL of them in the selected scope. No deferral. No excuses. Any skipped fix is SYSTEM FAILURE. After fixes, run all detected tests and auto-fix failures.
