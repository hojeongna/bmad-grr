---
name: step-07-story-loop
description: 'Drive every story in sprint-status.yaml through dev-story -> code-review -> qa-test under a shared 3-attempt retry ladder, marking each clean or escalated, without ever stopping the loop for a single bad story'
nextStepFile: './step-08-report.md'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
sprintStatusSkill: '{project-root}/.claude/skills/bmad-sprint-status/SKILL.md'
retrospectiveSkill: '{project-root}/.claude/skills/bmad-retrospective/SKILL.md'
devStoryCmd: '~/.claude/commands/bmad-grr-dev-story.md'
bugHuntCmd: '~/.claude/commands/bmad-grr-bug-hunt.md'
refineStoryCmd: '~/.claude/commands/bmad-grr-refine-story.md'
codeReviewCmd: '~/.claude/commands/bmad-grr-code-review.md'
qaTestCmd: '~/.claude/commands/bmad-grr-qa-test.md'
---

# Step 7 — Story Loop

## Outcome

Every story in `sprint-status.yaml` has been driven to either `clean` or `escalated` — none skipped, none silently dropped. `{stateFile}`'s Story Ladder table has one row per story reflecting its final attempt count and status, and the Escalated Stories section has one detail block per escalated story. When no epic has any story left to pick up, `current_phase` is set to `report` and control passes to step-08.

## Approach

### Load context

Read `{stateFile}` for `checklist_path` (resolved by the prior step — reuse as-is, never re-resolve here) and the per-epic-retrospective choice from step-01. Locate `sprint-status.yaml` (`_bmad-output/` or `docs/`, whichever the sprint-setup step wrote it to) and read it directly — it is the source of truth for story status; this step reads it, and only invokes bmad-sprint-status read-only when a next-story recommendation is wanted.

### Pick the next story

Iterate `sprint-status.yaml` entries in order. Take the first `ready-for-dev` or `in-progress` story not yet marked `clean` or `escalated` in this loop. If none remain in the current epic but later epics have pickable stories, advance to the next epic. If no epic has any pickable story left, stop looping — go to "Loop exit" below.

### Run the retry ladder

One shared budget of 3 attempts per story — not per verification stage. Add a row to the Story Ladder table for the story before attempt 1, and update it after every attempt.

1. **Attempt 1** — Load and follow `{devStoryCmd}` in full for the story, then wait for it to return control.
2. If it did not reach `Status: review`: **Attempt 2** — load and follow `{bugHuntCmd}` in full, passing the observed failure as the bug description (root-cause investigation), then re-invoke `{devStoryCmd}` on the same story.
3. If still unresolved: **Attempt 3** — load and follow `{refineStoryCmd}` in full to revise the story's AC/Tasks based on what attempts 1-2 learned, then re-invoke `{devStoryCmd}`.
4. If still unresolved after attempt 3 — mark the story `escalated` in the Story Ladder table, append a detail block to Escalated Stories (what was tried, what the blocker looks like), and go pick the next story. Do not stop the loop for a single escalated story.

Once dev-story reaches `Status: review`: load and follow `{codeReviewCmd}` in full using `checklist_path`. If code-review's own fix-and-retest still leaves failing tests or unresolved HIGH findings after its own internal retry, that counts as one attempt against the same ladder — return to whichever of step 2/3 above is next for this story (do not reset the counter). Then load and follow `{qaTestCmd}` in full. qa-test fixes small issues itself; for anything it defers as large, load and follow `{refineStoryCmd}` to fold that feedback into the story (or spin a follow-up story), then re-invoke `{devStoryCmd}` — this also consumes one ladder attempt.

A story that clears dev-story + code-review + qa-test with no deferred issues is marked `clean` in the Story Ladder table.

### Persist continuously

Update `{stateFile}`'s Story Ladder table and Escalated Stories section after every attempt and every stage transition — not batched at the end. Append a `## Phase Log` bullet (timestamped) whenever a story's outcome (clean/escalated) is finalized.

### Per-epic retrospective

When every story in an epic is clean-or-escalated, check step-01's per-epic-retrospective choice. If enabled, load and follow `{retrospectiveSkill}` in full for that epic before moving to the next epic's stories. Skip by default when headless unless explicitly enabled.

### Loop exit

When `sprint-status.yaml` has no pickable story left in any epic, set `current_phase: report` in `{stateFile}` and append a closing `## Phase Log` bullet summarizing total clean vs. escalated counts.

## Headless behavior

Fully automated — no interactive prompts of its own. Each invoked workflow's own headless behavior (or lack thereof) applies as documented in that workflow; this step never substitutes its own judgment for a stage that has no headless mode.

## Next

Load and follow `{nextStepFile}`.
