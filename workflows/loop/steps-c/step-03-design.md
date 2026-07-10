---
name: step-03-design
description: 'For a UI-bearing project, hand off to design-handoff for a UX/UI guide + redesign spec and record the chosen delivery path; for a non-UI project, pass through untouched'
nextStepFile: './step-04-architecture.md'
designHandoffCommand: '~/.claude/commands/bmad-grr-design-handoff.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
---

# Step 3 — Design

## Outcome

For a UI-bearing project: design-handoff has produced a UX/UI guide (and, where applicable, a redesign spec), and a delivery path has been chosen — live by the user, or by the state file's `design_automation` setting when headless. For a non-UI project: this step is a no-op passthrough. Either way, `current_phase` is set to `architecture` in the state file before routing on.

This step uses `bmad-grr-design-handoff` per the shared spec's Design stage section — `bmad-create-ux-design` is not used anywhere in this workflow.

## Approach

### Detect UI-bearing-ness (once)

Check `{stateFile}`'s body for an existing `## Design Decision` section. If present (a resumed run landing back on this phase), reuse its recorded `ui_bearing` value and skip straight to routing below — never re-ask.

If absent, this is the first pass through this phase:

- **Interactive**: ask the user directly whether the project has a user-facing UI (screens, pages, a frontend) or is backend/API/infra-only.
- **Headless**: infer from the PRD (or, on `fresh-idea`/`has-prd` entry, whatever planning doc exists so far) — look for end-user-facing language (screens, pages, components, flows, "화면"/"UI"). Default to UI-bearing when the PRD describes user interaction; default to non-UI only when it's clearly backend/API/infra with no user-facing surface.

Immediately append a `## Design Decision` section to `{stateFile}` recording `ui_bearing: yes|no` — do this before invoking anything else, so a session that ends mid-handoff still resumes without re-asking.

### UI-bearing path

Load and follow `{designHandoffCommand}` in full, then wait for it to return control before continuing this step.

When design-handoff reaches its own step-06 delivery-path choice: if `{stateFile}`'s `design_automation` field is `auto`, prefer its `[A]` automated Claude Design path; if `ask`, let design-handoff ask the user live exactly as it already does. Do not pre-empt or auto-answer any of design-handoff's *other* interactive choices (design directions, redesign specs) — it remains a mostly interactive workflow, and grr-loop's headless mode may still pause here. That is expected, not a bug.

After design-handoff returns control, verify on disk (not by its self-report) that it actually produced the UX/UI guide and, if a redesign spec path was generated, that file too. Record both paths plus the chosen delivery path in `{stateFile}`'s `## Design Decision` section.

### Non-UI path

No-op passthrough: nothing to invoke, nothing further to verify. Proceed straight to updating state.

### Update state file

Set `current_phase: architecture` in `{stateFile}`'s frontmatter. Append a timestamped `## Phase Log` bullet noting the `ui_bearing` decision and, if the UI-bearing path ran, the delivery path chosen and artifact paths produced.

## Next

Load and follow `{nextStepFile}`.
