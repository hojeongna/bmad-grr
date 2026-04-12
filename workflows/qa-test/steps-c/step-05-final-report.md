---
name: 'step-05-final-report'
description: 'Generate final QA report, present decision: stop here, chain to refine-story, or chain to dev-story'

stateFile: '{output_folder}/qa-test-{date}.state.md'
refine_story_command: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
dev_story_command: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Final Report & Decision

## STEP GOAL:

Finalize the QA report document with complete results across all tested stories. Present a clear decision gate: stop here, chain to refine-story for deferred issues, or chain directly to dev-story for immediate fixes.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🤝 You facilitate DECISIONS (present options, wait for user choices). You execute TASKS autonomously within approved scope.
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a tool you do not have access to, achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You deliver a clear, actionable QA report
- ✅ The user decides what happens next — you present options with context
- ✅ Nothing is ambiguous in the final report

### Step-Specific Rules:

- 📝 QA report must be complete and saved to file before presenting options
- 🎯 Decision options must be clear with trade-offs explained
- ⏹️ ALWAYS halt at the decision menu — never auto-proceed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Context

Read `{stateFile}` to get:
- All story results
- All fixes applied across the session
- All deferred issues across all stories
- Session metadata

Read the QA report document to verify it's up to date.

### 2. Finalize QA Report

Update the QA report document with the final summary section:

**For single story mode:** Report covers one story.
**For epic mode:** Report covers all stories with per-story breakdowns and epic-level summary.

Ensure the report includes:
- **Header**: QA session metadata (date, scope, app URL)
- **Per-Story Results**: test case table with pass/fail/fixed/deferred per case
- **Fixes Applied**: complete list with file changes
- **Deferred Issues**: complete list with severity and suggested fixes
- **Overall Summary**: aggregate pass rate, health assessment

### 3. Present Final Summary

**For single story:**

"**QA Report Complete: {story title}**
📄 Report saved: `{report-path}`

| Metric | Value |
|--------|-------|
| Total test cases | {N} |
| ✅ Passed | {N} |
| 🔧 Fixed during QA | {N} |
| ⏸️ Deferred | {N} |
| 🚫 Blocked | {N} |
| **Overall Pass Rate** | **{percentage}%** |

**Fixes applied during this session:** {count}
**Deferred issues written to story:** {count}"

**For epic:**

"**QA Report Complete: Epic {epic-id}**
📄 Report saved: `{report-path}`

### Per-Story Results

| Story | Pass | Fixed | Deferred | Blocked | Rate |
|-------|------|-------|----------|---------|------|
| {story 1} | {N} | {N} | {N} | {N} | {%} |
| {story 2} | {N} | {N} | {N} | {N} | {%} |
| ... | ... | ... | ... | ... | ... |

### Epic Summary

| Metric | Value |
|--------|-------|
| Stories tested | {N} |
| Total test cases | {N} |
| ✅ Passed | {N} |
| 🔧 Fixed during QA | {N} |
| ⏸️ Deferred | {N} |
| 🚫 Blocked | {N} |
| **Overall Pass Rate** | **{percentage}%** |

**Total fixes applied:** {count}
**Total deferred issues:** {count}"

### 4. Save Session Learnings (gstack/learn)

**IF `{learn_skill}` exists (gstack installed):**

Load the FULL `{learn_skill}` file via Read tool. Save session-level learnings:

- Overall QA patterns for this project (common failure areas, reliable components)
- Test plan strategies that provided good coverage
- Areas that consistently need more attention

**IF skill missing:** Silently skip.

### 5. Present Decision Menu

**IF deferred issues exist:**

"**Deferred issues need resolution. What would you like to do?**

- **[R]** Refine Story → Chain to `grr-refine-story` with the deferred issues documented in the story file. The story doc already has the QA feedback section — refine-story will process it.
- **[D]** Dev Story → Chain directly to `grr-dev-story` for the story with deferred issues. Use when the issues are well-defined enough to implement without further refinement.
- **[S]** Stop here → End QA session. Deferred issues are saved in the story doc and QA report for later action.
- **[A]** Advanced Elicitation → Deeper analysis before deciding
- **[P]** Party Mode → Get multiple agent perspectives"

**IF no deferred issues (all passed or fixed):**

"**All tests passed! What would you like to do?**

- **[S]** Stop here → QA session complete. Report saved.
- **[A]** Advanced Elicitation → Explore additional testing ideas
- **[P]** Party Mode → Get multiple agent perspectives"

**HALT and wait for user input.**

### 6. Execute Decision

#### Menu Handling Logic:

- **IF R:** Update state file status to `COMPLETED-REFINE`. Load and execute `{refine_story_command}` with the story path that has deferred issues. If epic mode with multiple stories having deferred issues, process them in order.

- **IF D:** Update state file status to `COMPLETED-DEV`. Load and execute `{dev_story_command}` with the story path that has deferred issues.

- **IF S:** Update state file status to `COMPLETED`.

  "**QA session complete.**
  📄 Report: `{report-path}`
  All results are saved. Deferred issues (if any) are documented in the story files for future action."

- **IF A:** Execute `{advancedElicitationTask}`, when finished redisplay the decision menu.

- **IF P:** Execute `{partyModeWorkflow}`, when finished redisplay the decision menu.

- **IF any other:** Help user understand options, then redisplay menu.

---

## SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- QA report finalized with all results
- Report saved to file with correct naming (story/epic ID + date)
- Clear summary presented with actionable metrics
- Decision menu presented with context-appropriate options
- User choice executed correctly
- State file marked as completed

### ❌ SYSTEM FAILURE:

- Report not saved to file
- Missing test results in final report
- Auto-proceeding without user decision
- Not chaining correctly to refine-story or dev-story
- Deferred issues not reflected in decision options
