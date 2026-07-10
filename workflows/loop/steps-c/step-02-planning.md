---
name: step-02-planning
description: 'Produce a validated prd.md for the fresh-idea entry point: optional brainstorming/product-brief warm-up, then create → validate → edit loop until it passes'
nextStepFile: './step-03-design.md'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
config_source: "{project-root}/_bmad/bmm/config.yaml"
planning_artifacts: '{config_source}:planning_artifacts'
implementation_artifacts: '{config_source}:implementation_artifacts'
brainstorming_skill: '{project-root}/.claude/skills/bmad-brainstorming/SKILL.md'
product_brief_skill: '{project-root}/.claude/skills/bmad-product-brief/SKILL.md'
create_prd_skill: '{project-root}/.claude/skills/bmad-create-prd/SKILL.md'
validate_prd_skill: '{project-root}/.claude/skills/bmad-validate-prd/SKILL.md'
edit_prd_skill: '{project-root}/.claude/skills/bmad-edit-prd/SKILL.md'
max_validate_edit_cycles: 3
---

# Step 2 — Planning

## Outcome

`{planning_artifacts}/prd.md` exists and has passed `bmad-validate-prd`, with the verdict recorded in `{stateFile}`. Only reached when step-01 resolved `entry_point: fresh-idea`.

## Approach

### Warm-up — interactive

Ask the user, in `{communication_language}`, whether their idea is ready for a PRD or needs shaping first:

```
[P] Ready — go straight to PRD creation
[B] Rough idea — brainstorm directions first
[S] Clear idea, no one-pager yet — draft a product brief first
```

`[B]` → Load and follow `{brainstorming_skill}` in full, then carry its output into PRD creation below. `[S]` → Load and follow `{product_brief_skill}` in full, then carry its output into PRD creation below. `[P]` → skip straight to PRD creation.

### Warm-up — headless

Skip straight to PRD creation unless the supplied input is clearly just a topic or keyword rather than a real product idea (no named user, problem, or outcome — e.g. "a dog-walking app" vs. a paragraph describing who it's for and what problem it solves). In that narrow case only, load and follow `{brainstorming_skill}` in full first (the sensible default warm-up when headless — do not also run product-brief); then proceed to PRD creation.

### Create the PRD

Load and follow `{create_prd_skill}` in full. Once it returns, confirm `{planning_artifacts}/prd.md` (or wherever it reports saving) exists on disk before continuing.

### Validate → edit loop (bounded at `{max_validate_edit_cycles}`)

Repeat up to `{max_validate_edit_cycles}` times:

1. Load and follow `{validate_prd_skill}` in full against the current `prd.md`.
2. Append its verdict and cycle number to `{stateFile}`'s `## Phase Log`.
3. Verdict passes → stop the loop.
4. Verdict has issues → load and follow `{edit_prd_skill}` in full to address them, then return to 1.

If `{max_validate_edit_cycles}` cycles pass without a clean verdict, stop looping regardless. Interactive: surface the remaining issues verbatim and ask whether to proceed to design anyway or keep iterating manually before re-running this step. Headless: proceed to design anyway, but record the unresolved verdict plainly in the `## Phase Log` entry rather than marking it clean.

### Update state file

Set `current_phase: design`. Append a `## Phase Log` entry with the final PRD path, cycles run, and final verdict.

## Next

Load and follow `{nextStepFile}`.
