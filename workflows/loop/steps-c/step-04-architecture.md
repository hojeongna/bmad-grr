---
name: step-04-architecture
description: 'Invoke bmad-create-architecture to produce architecture.md from the PRD and, if step-03 produced one, the UX/UI guide'
nextStepFile: './step-05-epics.md'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
planning_artifacts: '{config_source}:planning_artifacts'
implementation_artifacts: '{config_source}:implementation_artifacts'
architectureSkill: '{project-root}/.claude/skills/bmad-create-architecture/SKILL.md'
---

# Step 4 — Architecture

## Outcome

`{planning_artifacts}/architecture.md` exists, produced by the native BMAD architecture workflow from the current `prd.md` (and the UX/UI guide from step-03, if the project was UI-bearing and design-handoff produced one).

## Approach

### Precondition

Read `{stateFile}`. Confirm `{planning_artifacts}/prd.md` exists — if it doesn't, this step was reached out of order; stop and route back to the planning phase instead of proceeding.

### Invoke bmad-create-architecture

Load and follow `{architectureSkill}` in full, then wait for it to return control before continuing this step. It reads `prd.md` itself and will pick up the UX/UI guide from step-03 if one was produced — grr-loop does not pass artifacts by hand or restate its internal steps here.

No separate validation call belongs in this step: bmad-create-architecture's own `grr-spec-validate` customization gate (installed via `bmad-grr-customize`, presence checked back in step-01) already quality-gates `architecture.md` as part of that workflow. Adding an explicit validation call here would be redundant.

### Headless behavior

bmad-create-architecture is a native BMAD workflow and may still pause for its own elicitation/approval prompts even when grr-loop is running `--headless`. That's expected — this step does not attempt to auto-answer on its behalf.

### Verify exit condition

Check the filesystem directly: does `{planning_artifacts}/architecture.md` exist? Do not accept the invoked workflow's own completion message as sufficient. If the file is missing, halt and surface this to the user rather than advancing.

### Update state file

Append a timestamped bullet to `## Phase Log` noting `architecture.md` produced. Set `current_phase: epics`.

## Next

Load and follow `{nextStepFile}`.
