---
name: step-05-complete
description: 'Run DoD checklist, mark story for review, update sprint status, summarize for user'
checklistFile: '~/.claude/workflows/dev-story/data/checklist.md'
finishingBranchSkill: '~/.claude/skills/finishing-a-development-branch/SKILL.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
---

# Step 5 — Complete

## Outcome

The Definition of Done checklist passes, the story's status is `review`, sprint tracking reflects the new status, and the user has a concise summary of what was built and what to do next.

## Approach

### Definition of Done

Load `{checklistFile}` and walk through every item. The checklist is the final gate — every item that doesn't pass is a blocker, not an exception. If something fails, return to whichever earlier step owns it (step-03 for missing tests, step-04 for regressions, etc.).

Before marking any DoD item as passed, follow `{verificationBeforeCompletion}` — actually run the verification command in this turn, read the output, and cite the evidence. Don't claim "tests pass" without `npm test` (or equivalent) just having returned exit 0 with the count of passes/failures visible.

### Branch hygiene

Before declaring the story ready for review, follow `{finishingBranchSkill}` to clean up the working branch: verify all tests pass, identify the base branch, surface uncommitted changes, remove temporary files / debug logs / `.skip` test markers / dead helpers introduced during development. Present the user with the standard finishing options (merge locally, create PR, keep as-is, or discard) and execute the chosen path.

### Status update

Set the story file's `Status` to `review`. If `{sprint_status}` exists, update the matching key from `in-progress` to `review`. Preserve all comments and structure when saving.

### Dev Agent Record finalization

Add a Completion Notes section summarizing:

- What was built (1–3 sentences)
- Key technical decisions and why
- Test counts: unit, scenario, integration
- Files touched (point at the File List)
- Any surprises or carryover items the next agent should know about

### Communicate to user

Tell the user, in `{communication_language}`:

- Story key and title
- Status now `review`
- BDD scenarios authored and passing (count)
- Files changed (count + summary)
- Recommended next actions: review the diff, run `code-review` (ideally with a different model), and if UI was touched, consider `bmad-grr-design-pass` on the live result

Tailor explanation depth to `{user_skill_level}`. Offer to walk through anything that needs explaining.

End the workflow.
