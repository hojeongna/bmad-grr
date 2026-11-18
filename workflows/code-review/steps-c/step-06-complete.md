---
name: step-06-complete
description: 'Verify affected behavior after review fixes, reflect changes in story docs, and summarize status'
designPassCommand: '~/.claude/commands/bmad-grr-design-pass.md'
handoffOutputPath: '{output_folder}/design-handoff'
---

# Step 6 — Complete

## Final behavior

For screen/behavior fixes, verify the affected path against the final diff via the existing test/browser/capture route. Carry checked behavior, result and unverified scope to the PR, one line each.

Blocked server writes do not prove saving. Changed acceptance requires returning to the ticket caller for Hojeong's reacceptance before push/PR, including auto mode.

Reuse valid final-state results under the verification skill. Add no harness or evidence file.

## Story status

Only a clean independent review and passing required checks, including applicable behavior verification, permits story `done`. Skipped/unresolved findings, unverified checks or a stopped loop leave `review`. This is not Linear Done or merge approval.

For story-based review, update the known story and sprint status under that condition, preserving structure. For diff/manual review, use a supplied related story path or ask once; auto mode with no story path skips status updates without asking.

Reflect changed implementation/data flow/files in the story. Extend its existing review/changes notes (or `Code Review Changes`) with date, changed files, fixes and checklist items; keep unresolved items visible.

## Summary and routing

Summarize source, files/lines reviewed, findings found/fixed/unresolved, checklist, checks and story status. Auto adds a line per round and the clean/stopped outcome with reasons.

If UI was touched and a mockup exists under `{handoffOutputPath}/auto-draft/*.html` or `converted/*.html`, interactive offers `[U]` design-pass Mode L or `[S]` stop; `U` loads `{designPassCommand}` with mockup, app URL and known story path. Auto suggests this route and returns. This menu does not replace final behavior verification above. Otherwise end.
