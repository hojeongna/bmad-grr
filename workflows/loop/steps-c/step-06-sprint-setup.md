---
name: step-06-sprint-setup
description: 'Generate sprint-status.yaml via bmad-sprint-planning and resolve the code-review checklist path shared by every story in the loop'
nextStepFile: './step-07-story-loop.md'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
implementation_artifacts: '{config_source}:implementation_artifacts'
sprintPlanningSkill: '{project-root}/.claude/skills/bmad-sprint-planning/SKILL.md'
reviewChecklistCommand: '~/.claude/commands/bmad-grr-review-checklist.md'
---

# Step 6 — Sprint Setup

## Outcome

`{implementation_artifacts}/sprint-status.yaml` exists, generated from the epics produced in the prior phase. `checklist_path` is resolved and recorded in `{stateFile}`'s frontmatter, ready for every story's code-review stage in the loop. `current_phase` is updated to `story-loop`.

## Approach

### Resume-safety: skip what's already done

If `{implementation_artifacts}/sprint-status.yaml` already exists (a resumed session that got partway through this step, or `checklist_path` in `{stateFile}` is already non-null), skip the corresponding sub-section below rather than redoing it. `sprint-status.yaml` is native BMAD's own source of truth for per-story status — grr-loop only reads it from here on; it never rewrites story statuses itself.

### Generate sprint-status.yaml

Load and follow `{sprintPlanningSkill}` in full, then wait for it to return control before continuing this step. It reads `epics.md` and produces `{implementation_artifacts}/sprint-status.yaml`. Its own interactive choices apply as-is — this step does not restate them.

After it returns, verify `{implementation_artifacts}/sprint-status.yaml` exists on disk and contains at least one story entry. If missing or empty, HALT and report the gap — do not fabricate a sprint file or advance to `step-07` without one.

### Resolve checklist_path

Per the shared spec's Checklist resolution rules, in order:

1. If a checklist path was already supplied at kickoff (recorded in `{stateFile}` from step-01), use it as-is.
2. Else search the project for an existing `checklist-*.md` (review-checklist's own output naming) and reuse it if found.
3. Else load and follow `{reviewChecklistCommand}` in full — Project Analysis mode, skipping its other interactive modes when running headless — then wait for it to return control, and take the checklist path it produced.

Store whichever path was resolved in `checklist_path` in `{stateFile}`'s frontmatter. This is resolved once here and reused for every story's code-review stage in step-07 — do not re-resolve per story.

### Headless behavior

Steps 1-2 of checklist resolution need no prompting either way. For step 3, headless mode auto-selects review-checklist's Project Analysis mode rather than asking the user which mode to run.

### Update state file

Set `current_phase: story-loop` in `{stateFile}`. Append to `## Phase Log`:

```
- {timestamp} sprint-setup complete — sprint-status.yaml ready, checklist_path={path}
```

## Next

Load and follow `{nextStepFile}` to begin the story loop.
