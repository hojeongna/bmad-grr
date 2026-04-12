---
name: 'step-04-story-wrapup'
description: 'Wrap up current story QA: update story doc with deferred issues, check for more stories in epic, loop or proceed to final report'

nextStepFile: './step-05-final-report.md'
testPlanStepFile: './step-02-test-plan.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
refine_story_command: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
learn_skill: '~/.claude/skills/gstack/learn/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 4: Story Wrapup

## STEP GOAL:

Finalize QA results for the current story. If there are deferred issues, write them into the story document so they're tracked for follow-up. If this is an epic QA session with more stories remaining, loop back to step-02 for the next story. If all stories are done, proceed to the final report.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 🤝 You facilitate DECISIONS (present options, wait for user choices). You execute TASKS autonomously within approved scope.
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a tool you do not have access to, achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You ensure nothing falls through the cracks between stories
- ✅ Deferred issues must be documented in the story doc — not just the QA report
- ✅ Each story gets a clean conclusion before moving to the next

### Step-Specific Rules:

- 🎯 Focus on wrapping up the current story and deciding what's next
- 📝 Deferred issues MUST be written into the story document
- 🔄 Epic mode: always check if more stories remain

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Context

Read `{stateFile}` to get:
- Current story info and test results
- Scope (story vs epic)
- Full stories list with statuses
- Deferred issues list
- Fixes applied list
- `qaSpecPath` and `qaReportPath` for current story

Read the QA Test Specification and QA Report documents to verify all test cases have results recorded.

### 2. Handle Deferred Issues

**IF deferred issues exist for current story:**

Read the current story document. Add a `## QA Feedback` section (or update existing) at the end of the story with:

```markdown
## QA Feedback

**QA Date:** {date}
**QA Report:** {qa-report-path}

### Issues Requiring Additional Development

| # | Issue | Severity | Suggested Fix |
|---|-------|----------|---------------|
| 1 | {issue description} | {P0/P1/P2} | {fix approach} |
| 2 | ... | ... | ... |

### Notes for Developer
{any context that would help the developer fixing these issues}
```

"**Story document updated** — {N} deferred issues written to {story path}.

These issues are now tracked in the story document for follow-up via `refine-story` or `dev-story`."

**IF no deferred issues:**

"**All tests passed or were fixed on the spot.** No deferred issues for this story."

### 3. Save QA Learnings (gstack/learn)

**IF `{learn_skill}` exists (gstack installed):**

Load the FULL `{learn_skill}` file via Read tool. Save notable learnings from this story's QA:

- Recurring bug patterns discovered
- Test approaches that revealed hidden issues
- Fix strategies that worked well
- Areas that needed more test coverage than expected

Only save insights that would be valuable for future QA sessions — not routine findings.

**IF skill missing:** Silently skip.

### 4. Update Story Status in State

```bash
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" \
  --updates '{"addStep":"step-04-story-wrapup","storyStatus":"completed","logEntry":"Story wrapup: {story title}"}'
```

### 5. Present Story Summary

"**Story QA Complete: {story title}**

| Metric | Value |
|--------|-------|
| Total test cases | {N} |
| ✅ Passed | {N} |
| 🔧 Fixed during QA | {N} |
| ⏸️ Deferred | {N} |
| 🚫 Blocked | {N} |
| **Pass Rate** | **{percentage}%** |

**QA Spec:** `{qaSpecPath}`
**QA Report:** `{qaReportPath}`

**Fixes applied:** {count}
{list of fixes with file names}

**Deferred issues:** {count}
{list of deferred issues — one line each}"

### 6. Route Decision

**IF epic mode AND more stories remain:**

```bash
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" --updates '{"nextStory":true,"logEntry":"Moving to next story"}'
```

"**Next story: {next story title}** ({remaining} stories left)

Proceeding to generate test plan for the next story..."

→ Load, read entire file, then execute `{testPlanStepFile}` (loop back to step-02 for next story)

**IF all stories complete (or single story mode):**

→ Load, read entire file, then execute `{nextStepFile}` (proceed to final report)

---

## SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Deferred issues written into story document (not just QA report)
- QA learnings saved for future sessions
- Story status correctly updated in state
- Clear summary presented with all metrics
- Correct routing: next story or final report

### ❌ SYSTEM FAILURE:

- Deferred issues not written to story document
- Skipping remaining stories in epic mode
- Not updating state file between stories
- Proceeding to final report with stories still pending
