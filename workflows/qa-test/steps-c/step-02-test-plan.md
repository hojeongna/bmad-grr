---
name: step-02-test-plan
description: 'Author a comprehensive QA Test Specification document for the current story before any browser testing'
nextStepFile: './step-03-execute-and-fix.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
qaTestSpecTemplate: '../data/qa-test-spec-template.md'
qaReportTemplate: '../data/qa-report-template.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 2 — Test Plan

## Outcome

A QA Test Specification document exists as a saved file. It enumerates every concrete test case the next step will execute — scenarios, edge cases, error paths, navigation flows, regressions, accessibility, responsive views, UI checks. Each case has exact steps a machine can follow without ambiguity. The user has reviewed and approved the spec. A QA Report file is also initialized and ready to receive results in step-03.

## Approach

### Load context

Read `{stateFile}` for the current story index, path, and app URL. Read the current story document completely — all ACs (exact wording), tasks/subtasks, referenced pages/components/routes, noted constraints, and related stories.

### Read the implementation (parallel sub-agent when available)

The story describes intent; the code reveals what's actually testable.

If `{parallel_agents_skill}` is available, dispatch a sub-agent that reads the affected pages/components and returns a compact JSON summary (route definitions, interactive elements, form validation rules, API endpoints called, shared state affected). This keeps the parent context lean.

If sub-agents aren't available, read the source code directly with focused scans — don't load entire files unless necessary.

### Map the blast radius

- **Direct impact** — pages/routes added or modified, components changed, API endpoints called.
- **Indirect impact** — other pages using the same components, features sharing the same data/state, navigation paths through affected pages, shared layouts/headers/sidebars.

### Author the QA spec

Read `{qaTestSpecTemplate}` for structure. Save the spec at `{implementation_artifacts}/qa/qa-spec-{story-or-epic-id}-{date}.md`. Fill every section concretely:

- **Test Scenarios (TS-NNN)** — for each AC, group functional cases (happy path + valid variations), edge cases (empty/min/max/special chars/double-click/paste/0-1-1000 items/no-permissions/expired-session), and error cases (invalid input, server error, network timeout, validation failure — verify error UI behavior on each).
- **Navigation (NAV-NN)** — back button / refresh / direct URL / breadcrumbs / new tab / forward button, at every distinct state.
- **Regression (REG-NN)** — for every existing feature in the affected area, confirm it still works.
- **Accessibility (A11Y-NN)** — keyboard reach, focus management, ARIA, color contrast, screen reader (alt text, form labels).
- **Responsive (RSP-NN)** — emulate mobile (375px), tablet (768px), desktop (1280px); overflow with long content.
- **UI/Visual (UI-NN)** — layout integrity, loading states, empty states, console clean, network clean, performance reasonable.

Every test case must specify exact steps (clicks, inputs, expected outcomes) — no "check if it works" wording. If a tester reads it and still wonders "but what if…?", a case is missing.

### Count and summarize

Run `python3 {installed_path}/scripts/qa-spec-stats.py {spec-file-path}` to get accurate counts. Fill the Test Case Summary table at the end of the spec (per category × priority).

### Present and approve

Show the spec summary: spec path, total cases, scenario groups, NAV/REG/UI counts. Halt for input:

- `[Y]` Approve — start testing
- `[+]` Add cases — user lists scenarios to add
- `[-]` Remove cases — user lists ones to skip
- `[M]` Modify — user describes the change

Update the spec on `+`/`-`/`M` and re-display until the user approves.

### Initialize the QA report

Read `{qaReportTemplate}` and create `{implementation_artifacts}/qa/qa-report-{story-or-epic-id}-{date}.md`. Link it to the spec. Step-03 fills it progressively.

### Persist

Run:

```
uv run {installed_path}/scripts/qa-state.py update --state-file "{stateFile}" \
  --updates '{"addStep":"step-02-test-plan","qaSpecPath":"{spec-file-path}","qaReportPath":"{report-file-path}","logEntry":"Test plan created with {N} test cases"}'
```

## Next

After approval, load and follow `{nextStepFile}` to begin browser testing.
