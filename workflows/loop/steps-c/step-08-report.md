---
name: step-08-report
description: 'Consolidate story-loop results into clean/escalated counts and detail; gate on any escalation before PR/deploy; terminal step when deploy_option is none'
nextStepFile: './step-09-pr-deploy.md'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
---

# Step 8 — Report

## Outcome

A consolidated report exists summarizing the story loop: clean vs escalated counts, and — for every escalated story — what was tried across the 3-attempt ladder and what the blocker looks like, pulled straight from `{stateFile}`'s `## Escalated Stories` section. The user has seen this report. If any stories are escalated, the workflow does not proceed to PR/deploy without an explicit human go-ahead. If `deploy_option` is `none`, the loop ends here entirely.

## Approach

### Load context

Read `{stateFile}` in full: the `## Story Ladder` table (story key / attempts / status / notes) and the `## Escalated Stories` section. Read `deploy_option` from the frontmatter.

### Build the report

Count clean vs escalated from the Story Ladder table:

| Metric | Value |
|---|---|
| Stories in loop | … |
| ✅ Clean | … |
| 🚫 Escalated | … |

For each escalated story, pull its block from `## Escalated Stories` verbatim — do not re-summarize or soften what's recorded there:

**{story key} — escalated**
- Attempt 1 (dev-story): …
- Attempt 2 (bug-hunt → dev-story): …
- Attempt 3 (refine-story → dev-story): …
- Blocker: …

If a story is marked `escalated` in the Story Ladder but has no matching detail block, say so plainly rather than inventing one.

### Route on deploy_option

- **`deploy_option: none`** — regardless of escalation count, this is the terminal step. Update `{stateFile}`: `status: COMPLETE`, append a `## Phase Log` entry noting completion. Tell the user the loop is done and where the report and state file live. Stop — do not describe or route to any step beyond this one.
- **Any other `deploy_option`** — continue to the escalation gate below.

### Escalation gate (deploy_option != none)

- **Zero escalated stories** — proceed automatically. Append a `## Phase Log` entry ("0 escalated, proceeding to PR/deploy"), set `current_phase: pr-deploy`, and load and follow `{nextStepFile}`.
- **One or more escalated stories** — this is a human gate, always, even in `--headless` mode. Present the report above and halt for input:
  - `[P]` Proceed to PR/deploy anyway — escalated stories stay marked `escalated`; record in the Phase Log that the user chose to proceed with known escalations.
  - `[S]` Stop here — leave `status: IN_PROGRESS`, `current_phase: report`, so the escalated stories can be addressed (manually, or via a fresh `bmad-grr-refine-story` / `bmad-grr-bug-hunt` pass) before resuming.

  In `--headless` mode, do NOT auto-select `[P]`. Default to `[S]` — pause and surface the report. Deploying with known-broken stories has hard-to-reverse consequences, so it requires an explicit human go-ahead even in an otherwise autonomous run.

### Persist

Update `{stateFile}` with the chosen disposition and the Phase Log entry before routing (or before stopping).

## Next

- `deploy_option: none` → stop. This file is terminal; nothing follows it.
- Zero escalations, or user chose `[P]` on the gate → load and follow `{nextStepFile}`.
- User chose `[S]` on the gate → end the session here. State stays `IN_PROGRESS` at `current_phase: report`; a later `resume` entry point routes back into this file, which re-presents the same gate until the escalations are cleared or the user proceeds.
