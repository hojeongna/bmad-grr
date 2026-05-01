---
name: step-04-execute
description: 'Apply approved story modifications and create new stories; update sprint-status; preserve format'
nextStepFile: './step-05-complete.md'
---

# Step 4 — Execute

## Outcome

Every approved modification from step-03 is applied: existing stories are edited (AC/Tasks/Dev Notes), new stories are created with the agreed scope, every refined or created story has `Status: ready-for-dev`, and `{sprint_status}` reflects the same. Document format and structure are preserved exactly where not modified. The user has seen and confirmed the final result.

## Approach

### For each story being modified

1. Read the current story file in full.
2. Apply the AC edits exactly as approved (modify, add, preserve unchanged ones).
3. Apply Task/Subtask edits — modify descriptions, add new tasks, **uncheck** modified tasks (`[ ]`), keep correctly-completed ones (`[x]`), preserve numbering.
4. Append a Dev Notes "Refinement" subsection:
   ```
   ### Refinement ({date})
   Reason: <why this refinement was needed>
   Changes: <summary of what was modified>
   Visual findings: <if any, from step-02>
   ```
5. Set `Status: ready-for-dev`.
6. Save, preserving every section that wasn't modified.

Tell the user briefly per story: "{story_key} 수정 완료 — AC {n}개 변경, Task {n}개 변경, Dev Notes 업데이트".

### For each new story being created

1. Use an existing story file as the format reference.
2. Write the new file with: title and description, AC (from approved plan), Tasks (all unchecked `[ ]`), Dev Notes with creation context, `Status: ready-for-dev`.
3. Place it in `{implementation_artifacts}` with the correct naming convention.

### Update sprint-status

Load `{sprint_status}`, set every modified story's status to `ready-for-dev`, add new stories with `ready-for-dev`, preserve all comments and structure, save.

### Final result checkpoint

Present a tight summary in `{communication_language}`:

- Modified stories: per-story changes (AC/Tasks/Status)
- New stories: per-story title and counts
- `sprint-status.yaml` updated

Halt for input. If the user wants adjustments, make them and re-present. On confirmation, advance.

## Next

Load and follow `{nextStepFile}`.
