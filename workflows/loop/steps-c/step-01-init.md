---
name: step-01-init
description: 'Resolve entry point (fresh-idea / has-prd / has-epics-sprint / resume), capture deploy_option / design_automation / retro choices, verify the grr-spec-validate customization precondition, and create or reload grr-loop-state-{date}.md'
config_source: '{project-root}/_bmad/bmm/config.yaml'
communication_language: '{config_source}:communication_language'
planning_artifacts: '{config_source}:planning_artifacts'
implementation_artifacts: '{config_source}:implementation_artifacts'
sprint_status: '{implementation_artifacts}/sprint-status.yaml'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
customizeCommand: '~/.claude/commands/bmad-grr-customize.md'

# current_phase → next step file. Same map routes a freshly-detected entry
# point and a resumed IN_PROGRESS state file — both land on a phase name.
nextStepOptions:
  planning: './step-02-planning.md'
  design: './step-03-design.md'
  architecture: './step-04-architecture.md'
  epics: './step-05-epics.md'
  sprint-setup: './step-06-sprint-setup.md'
  story-loop: './step-07-story-loop.md'
  report: './step-08-report.md'
  pr-deploy: './step-09-pr-deploy.md'
---

# Step 1 — Init / Resume

## Outcome

The entry point is resolved to exactly one of `fresh-idea` / `has-prd` / `has-epics-sprint` / `resume`. `deploy_option`, `design_automation`, and (optionally) the per-epic retrospective choice are captured. The `grr-spec-validate` customization precondition has been checked, with `bmad-grr-customize` offered or auto-run if missing. `{stateFile}` is created (or, for `resume`, loaded) and the workflow routes to exactly one next step via `{nextStepOptions}`.

## Approach

### Resume detection (highest priority)

Search `{implementation_artifacts}` for any `grr-loop-state-*.md` with `status: IN_PROGRESS`. If found, this is a `resume` regardless of what planning/epic artifacts also exist — load the file completely, re-extract `current_phase`, `entry_point`, `deploy_option`, `design_automation`, `checklist_path`, the Story Ladder table, and any Escalated Stories. Welcome the user back, show the current phase and story ladder summary, append a `## Phase Log` entry ("resumed at {current_phase}"), then route to `{nextStepOptions}[current_phase]`. Skip the rest of this step.

Exception: if `current_phase` is still `init` (a crash before the first phase transition), don't treat it as a routable resume — fall through to entry-point detection below, reusing this same state file instead of creating a new one.

Headless: identical detection, no prompt either way.

### Entry-point detection (fresh session only)

Check in this order — first match wins:

1. **has-epics-sprint** — `{planning_artifacts}/epics.md` AND `{sprint_status}` both exist → `entry_point: has-epics-sprint`, `current_phase: sprint-setup`.
2. **has-prd** — `{planning_artifacts}/prd.md` exists and `{planning_artifacts}/architecture.md` does not → `entry_point: has-prd`, `current_phase: design`. Edge case: if `prd.md` AND `architecture.md` both exist but `epics.md` doesn't yet, still `has-prd`, but set `current_phase: epics` (design/architecture is already done — routing through `step-03-design.md` again would redo settled work).
3. **fresh-idea** (fallback) — none of the above → `entry_point: fresh-idea`, `current_phase: planning`.

Show which of the four artifacts were found/missing in one short line.

### grr-spec-validate customization precondition

Check for `{project-root}/_bmad/custom/bmad-create-prd.toml` and its siblings (`bmad-create-architecture.toml`, `bmad-create-epics-and-stories.toml`, `bmad-create-story.toml`). If any are missing:

- Interactive → warn that the native BMAD creation workflows this loop calls won't be gated by `grr-spec-validate`, and ask `[Y]` run `{customizeCommand}` now / `[N]` continue without the gate.
- Headless → auto-run `{customizeCommand}` without asking, then continue.

### Capture deploy_option / design_automation / retro choice

Interactive — ask once, in `{communication_language}`:

```
Deploy option when the story loop finishes:
  [1] none                    — stop after the story loop + report
  [2] pr-only                 — also open PRs, stop there
  [3] pr-wait-then-deploy     — open PRs, wait for external merge, then deploy
  [4] pr-immediate-deploy     — open PRs, hand off straight to land-and-deploy

Design automation when a UI-bearing project reaches design-handoff's delivery-path choice:
  [A] auto — prefer the automated Claude Design path
  [ask] let design-handoff ask you live each time

Run a retrospective after each epic's stories are clean-or-escalated? [y/N]
```

Halt for input. Headless — these must come from the caller's supplied args (`deploy_option`, `design_automation`); if either is absent, halt with an error naming the missing arg rather than guessing. The retro choice is the one exception: default to **skip** in headless unless explicitly passed as enabled.

### Create or update the state file

Write `{stateFile}`:

```yaml
---
name: grr-loop-state
started: '{date}'
status: IN_PROGRESS
entry_point: fresh-idea | has-prd | has-epics-sprint
deploy_option: none | pr-only | pr-wait-then-deploy | pr-immediate-deploy
design_automation: ask | auto
checklist_path: null
current_phase: planning | design | epics | sprint-setup
---

# grr-loop State: {date}

## Phase Log
- {timestamp} — initialized, entry_point={entry_point}, current_phase={current_phase}

## Story Ladder

| Story | Attempts | Status | Notes |
|-------|----------|--------|-------|

## Escalated Stories
```

### Route

Load and follow `{nextStepOptions}[current_phase]`. Route to exactly one file — never fall through to a second.

## Next

Load and follow the step file resolved above, carrying `entry_point`, `deploy_option`, `design_automation`, and `{stateFile}`'s path forward in context.
