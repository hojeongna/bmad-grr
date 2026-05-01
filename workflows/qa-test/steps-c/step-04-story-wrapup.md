---
name: step-04-story-wrapup
description: 'Wrap the current story — write deferred issues into the story doc, present the story summary, route to next story or final report'
nextStepFile: './step-05-final-report.md'
testPlanStepFile: './step-02-test-plan.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 4 — Story Wrap-up

## Outcome

The current story has a clean conclusion: deferred issues are written into the story document so they're tracked for follow-up via `refine-story` or `dev-story`, the story status is updated in state, and the user sees per-story metrics (total cases, pass/fixed/deferred/blocked, fixes applied with files, deferred issues with severity). If more stories remain in an epic queue, the workflow loops back to step-02 for the next story; otherwise it advances to the final report.

## Approach

### Load context

Read `{stateFile}` for current story info, scope, full story queue with statuses, deferred issues, fixes applied, `qaSpecPath`, and `qaReportPath`. Read the QA spec and report to verify every test case has a recorded result.

### Write deferred issues into the story

If the current story has any deferred issues, append (or update) a `## QA Feedback` section in the story document:

```
## QA Feedback

**QA Date:** {date}
**QA Report:** {qa-report-path}

### Issues Requiring Additional Development

| # | Issue | Severity | Suggested Fix |
|---|-------|----------|---------------|
| 1 | … | P0/P1/P2 | … |

### Notes for Developer
{anything the developer needs to know}
```

Tell the user briefly: `Story document updated — {N} deferred issues written`. If there are no deferred issues, say so.

### Update state

```
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" \
  --updates '{"addStep":"step-04-story-wrapup","storyStatus":"completed","logEntry":"Story wrapup: {story title}"}'
```

### Story summary

Present:

| Metric | Value |
|--------|-------|
| Total test cases | … |
| ✅ Passed | … |
| 🔧 Fixed during QA | … |
| ⏸️ Deferred | … |
| 🚫 Blocked | … |
| **Pass Rate** | … % |

Plus paths (spec, report), the list of fixes applied (with files), and the list of deferred issues (one line each).

### Route

- **Epic mode AND more stories remain** — update state with `nextStory:true`, tell the user the next story title and how many remain, and route to `{testPlanStepFile}` (loop back to step-02).
- **All stories done (or single-story mode)** — route to `{nextStepFile}`.
