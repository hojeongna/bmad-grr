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

Note: this native workflow's own `grr-spec-validate` customization (installed via `bmad-grr-customize`, presence checked in step-01) already dispatches one validator sub-agent **per (story × rubric) pair** as part of its `on_complete`. That per-story gate is not a substitute for the whole-document check below — it never evaluates `epics.md` itself for cross-epic ambiguity or structural coherence, only the individual story files it produces.

### Verify exit condition

Check the filesystem directly: does `{planning_artifacts}/epics.md` exist? Do not accept the invoked workflow's own completion message as sufficient. If the file is missing, halt and surface this to the user rather than advancing.

### Explicit whole-document grr-spec-validate dispatch

Dispatch three fresh sub-agents per `{specValidateSkill}` — one per rubric, all in a single message so they run concurrently. Do not inline the rubrics here; reference the skill and its documented dispatch payload (see that skill's own `invocation-template.md`, Step 2). Each agent gets:

- `artifact_path`: `{planning_artifacts}/epics.md`
- `rubrics`: exactly one of `ambiguity` / `ac-measurability` / `three-stage`
- `reference_paths`: `{planning_artifacts}/prd.md`, `{planning_artifacts}/architecture.md`

Merge the three returned blocks — worst verdict wins, `revision_pointers` union; a rubric whose agent returns nothing parseable is a `REVISE` for that rubric, not a pass. Present the verdict and, if `REVISE`, every `revision_pointer` to the user verbatim.

### Handle REVISE

There is no dedicated edit-epics workflow in this toolkit. Do not invent a recovery workflow. Offer:

```
[E] Edit epics.md by hand, then re-dispatch grr-spec-validate
[R] Re-invoke bmad-create-epics-and-stories, then re-dispatch grr-spec-validate
[O] Override and proceed anyway
```

Loop this section until `PROCEED` or `O`.

### Headless behavior

The `bmad-create-epics-and-stories` invocation may still pause for its own elicitation/approval prompts even when grr-loop is running `--headless` — that's expected. The `grr-spec-validate` dispatch itself needs no prompting. On `REVISE`, however, there is no sensible auto-default among `[E]`/`[R]`/`[O]` — halt and report the revision pointers rather than guessing on the user's behalf, even in headless mode.

### Update state file

Append a timestamped bullet to `## Phase Log` noting `epics.md` produced and the `grr-spec-validate` verdict (plus override note if `[O]` was taken). Set `current_phase: sprint-setup`.

## Next

Load and follow `{nextStepFile}`.
