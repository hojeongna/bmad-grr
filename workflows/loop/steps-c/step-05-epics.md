---
name: step-05-epics
description: 'Invoke bmad-create-epics-and-stories to produce epics.md, then explicitly gate the whole document with a grr-spec-validate dispatch before sprint setup'
nextStepFile: './step-06-sprint-setup.md'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
planning_artifacts: '{config_source}:planning_artifacts'
implementation_artifacts: '{config_source}:implementation_artifacts'
epicsSkill: '{project-root}/.claude/skills/bmad-create-epics-and-stories/SKILL.md'
specValidateSkill: '~/.claude/skills/grr-spec-validate/SKILL.md'
---

# Step 5 — Epics

## Outcome

`{planning_artifacts}/epics.md` exists, produced by the native BMAD epics-and-stories workflow from `prd.md` and `architecture.md`, **and** has been explicitly reviewed as a whole document by a fresh `grr-spec-validate` dispatch. This step deliberately does not use `bmad-check-implementation-readiness` for that review.

## Approach

### Precondition

Read `{stateFile}`. Confirm `{planning_artifacts}/prd.md` and `{planning_artifacts}/architecture.md` both exist — if either is missing, this step was reached out of order; stop and route back to the appropriate earlier phase instead of proceeding.

### Invoke bmad-create-epics-and-stories

Load and follow `{epicsSkill}` in full, then wait for it to return control before continuing this step. It reads `prd.md` and `architecture.md` itself — grr-loop does not pass artifacts by hand or restate its internal steps here.

The native workflow's customization validates each story with one fresh validator by default. That does not replace the whole-document check of `epics.md` for cross-epic ambiguity and coherence below.

### Verify exit condition

Check the filesystem directly: does `{planning_artifacts}/epics.md` exist? Do not accept the invoked workflow's own completion message as sufficient. If the file is missing, halt and surface this to the user rather than advancing.

### Explicit whole-document grr-spec-validate dispatch

Use `{specValidateSkill}` and its invocation template: one fresh read-only validator for all criteria, a second only for contradicted code claims, scope expansion or increased risk. Pass:

- `artifact_path`: `{planning_artifacts}/epics.md`
- `rubrics`: `ambiguity`, `ac-measurability`, `three-stage`
- `reference_paths`: `{planning_artifacts}/prd.md`, `{planning_artifacts}/architecture.md`

Require every criterion's score/verdict row; return missing rows for completion, keeping REVISE. Present the result table and revision pointers. After edits, revalidate affected/new criteria only; unclear impact requires all criteria.

### Handle REVISE

There is no dedicated edit-epics workflow in this toolkit. Do not invent a recovery workflow. Offer:

```
[E] Edit epics.md by hand, then re-dispatch grr-spec-validate
[R] Re-invoke bmad-create-epics-and-stories, then re-dispatch grr-spec-validate
[O] Override and proceed anyway
```

Loop this section until `PROCEED` or `O`.

### Headless behavior

The `grr-spec-validate` dispatch needs no prompting. On `REVISE`, however, there is no sensible auto-default among `[E]`/`[R]`/`[O]` — halt and report the revision pointers rather than guessing on the user's behalf, even in headless mode.

### Update state file

Append a timestamped bullet to `## Phase Log` noting `epics.md` produced and the `grr-spec-validate` verdict (plus override note if `[O]` was taken). Set `current_phase: sprint-setup`.

## Next

Load and follow `{nextStepFile}`.
