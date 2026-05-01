---
name: step-01-init
description: 'Initialize or resume a QA session; determine scope (story or epic), resolve story files, capture app URL, create the state file'
nextStepFile: './step-02-test-plan.md'
stateFile: '{output_folder}/qa-test-{date}.state.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
sprint_status: '{implementation_artifacts}/sprint-status.yaml'

# Resume routing — used when an active state file is found
nextStepOptions:
  step-02-test-plan: './step-02-test-plan.md'
  step-03-execute-and-fix: './step-03-execute-and-fix.md'
  step-04-story-wrapup: './step-04-story-wrapup.md'
  step-05-final-report: './step-05-final-report.md'
---

# Step 1 — Init / Resume

## Outcome

A QA session is set up (or resumed): scope decided (single story vs. full epic), every story file resolved and queued, the app URL captured, and the state file created. Browser testing has not started yet — that's step-03.

## Approach

### Resume detection (merged from old step-01b)

Run `uv run {installed_path}/scripts/qa-state.py find-active --directory {output_folder}`. If an active state file exists, load it completely. Welcome the user back, present current progress (last completed step, stories progress `{completed}/{total}`, current story title, paths to QA spec and report). Update `lastContinued`. Route based on `lastStep` to the matching file in `{nextStepOptions}` — `step-01-init` → step-02, `step-02-test-plan` → step-03, `step-03-execute-and-fix` → step-04, `step-04-story-wrapup` → step-02 (next story) or step-05 (all stories done). Skip the rest of this step.

### Scope decision

Parse `$ARGUMENTS` if provided. Otherwise ask the user, in `{communication_language}`:

- `[S]` Single story — provide story file path
- `[E]` Full epic — provide epic identifier or path

Also ask for the app URL (e.g., `http://localhost:3000`).

### Resolve story files

**Single story** — verify the file exists; read it to extract title, AC count, task count. Store as `stories: [{ path, title, status: 'pending' }]`.

**Epic** — read the epic doc or `{sprint_status}`. Identify every story in the epic. Sort by dependency order if specified, otherwise document order. Store all stories. Show the user the full list:

| # | Story | Status |
|---|-------|--------|
| 1 | … | pending |

Tell the user the queue size and that stories will be tested one at a time, completing each before moving to the next.

### Confirm setup

Present a tight session summary (scope, story count, app URL) and confirm before creating the state file.

### Create state file

Run:

```
uv run {installed_path}/scripts/qa-state.py create \
  --output "{stateFile}" \
  --scope [story|epic] \
  --app-url "{app_url}" \
  --epic-id "{epic_id_or_omit}" \
  --stories "path1|title1" "path2|title2" ...
```

## Next

Load and follow `{nextStepFile}` to generate the QA spec for the first story.
