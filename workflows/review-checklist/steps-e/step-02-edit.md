---
name: step-02-edit
description: 'Apply user-requested edits to the checklist interactively; only what the user asks for; preserve code-review compatibility'
nextStepFile: './step-03-complete.md'
checklistFile: ''
---

# Step 2 — Edit

## Outcome

Every edit the user requested is applied to the in-memory checklist; nothing the user didn't ask for is changed. Each edit is shown back to the user before continuing. After the user signals "done", the user explicitly chooses Save or Undo, and the action is taken.

## Approach

### Edit session

Based on the intent captured in step-01:

- **Add** — ask which category, what items.
- **Remove** — present numbered items; ask which to remove.
- **Modify** — present items; ask which to change and how.
- **Categories** — add/rename/remove at the category level.
- **Free** — accept any of the above intermixed.

Apply each requested change immediately. Show the change back briefly. Ask: "Anything else? If done, say 'done'." Loop until the user signals done.

Do not invent improvements. Each edited item must remain specific and verifiable (`code-review` compatibility).

### Summary and save/undo

Show the totals: items added, removed, modified. Halt for input:

- `[S]` Save — write the edited checklist to its file.
- `[U]` Undo — discard all changes; the file on disk stays as it was.

## Next

Load and follow `{nextStepFile}`.
