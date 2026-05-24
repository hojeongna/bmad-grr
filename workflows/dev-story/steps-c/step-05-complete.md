---
name: step-05-complete
description: 'Gather evidence, dispatch a fresh sub-agent to verify Definition of Done, then mark story for review, update sprint status, summarize for user'
checklistFile: '~/.claude/workflows/dev-story/data/checklist.md'
finishingBranchSkill: '~/.claude/skills/finishing-a-development-branch/SKILL.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
---

# Step 5 — Complete

## Outcome

The Definition of Done checklist passes — verified by a **fresh sub-agent** that did not write any of this code — the story's status is `review`, sprint tracking reflects the new status, and the user has a concise summary of what was built and what to do next.

## Approach

### Definition of Done — fresh-context verification

The DoD checklist is the final gate. To break the writer-judges-own-work loop, the main session **gathers evidence**, then **dispatches a sub-agent** to judge that evidence against the checklist. The main session does the executing; the sub-agent does the judging. Neither role does both.

#### Step 5.1 — Main session gathers evidence

Before dispatching, the main session runs the verification commands itself (following `{verificationBeforeCompletion}`) and captures actual outputs. The evidence packet contains, at minimum:

- BDD runner command + last N lines of output (exit code, scenario count, pass/fail tally)
- Unit/integration test command + last N lines of output
- Typecheck command + output (`tsc --noEmit` or equivalent)
- Lint command + output
- File list (added / modified / removed paths from the story's Dev Notes)
- Story file absolute path
- DoD checklist absolute path (`{checklistFile}`)

The commands are run in **this** session — that's the execution side. If any command fails, do NOT proceed to dispatch; route back to whichever earlier step owns the failure (step-03 for failing scenarios, step-04 for regressions).

#### Step 5.2 — Dispatch the DoD verifier sub-agent

Invoke `Task` / `Agent` with the prompt below. The sub-agent inherits no context.

```text
Verify the Definition of Done for a just-completed story. You are a
fresh context — you did NOT write any of this code.

Inputs:
- story_path: <absolute path>
- dod_checklist_path: <absolute path>
- evidence_packet:
    bdd: { command: "<cmd>", exit_code: <n>, output_tail: "<last N lines>" }
    tests: { command: "<cmd>", exit_code: <n>, output_tail: "<last N lines>" }
    typecheck: { command: "<cmd>", exit_code: <n>, output: "<output>" }
    lint: { command: "<cmd>", exit_code: <n>, output: "<output>" }
    file_list: ["<path1>", "<path2>", ...]

Constraints:
- You see ONLY the story file, the checklist, the evidence packet, and
  the changed files (you may read them for spot-check verification).
- You do NOT have access to the main conversation that produced this work.
- You do NOT modify any file.
- For each DoD item, your verdict is one of:
    PASS  — evidence in the packet (or in a file you read) demonstrates
            compliance, citation provided.
    FAIL  — evidence shows the item is not met; cite which evidence
            contradicts it.
    INSUFFICIENT_EVIDENCE — the evidence packet does not allow a
            verdict either way; specify what additional check would
            close the gap.

Output: a single fenced JSON block, no prose around it:

{
  "verdict": "PASS" | "FAIL" | "INSUFFICIENT_EVIDENCE",
  "items": [
    {
      "item": "<verbatim DoD item text>",
      "status": "PASS" | "FAIL" | "INSUFFICIENT_EVIDENCE",
      "evidence": "<cited line / output excerpt / file:line reference>"
    }
  ],
  "blockers": ["<short reason per FAIL/INSUFFICIENT item>"]
}

Overall verdict is the worst per-item status: any FAIL → FAIL,
any INSUFFICIENT_EVIDENCE (and no FAIL) → INSUFFICIENT_EVIDENCE,
all PASS → PASS.
```

Parse the returned JSON.

#### Step 5.3 — Branch on the verdict

- **PASS** — proceed to "Branch hygiene".
- **FAIL** — route back. For each FAIL item, identify which earlier step owns it (step-03 for missing/broken tests, step-04 for regressions / validation gaps, step-01 for AC issues). Re-enter that step with the blockers as additional context. After re-completion, restart step 5.1.
- **INSUFFICIENT_EVIDENCE** — the main session runs the missing checks the sub-agent specified, appends to the evidence packet, and re-dispatches Step 5.2. Idempotent — fresh sub-agent each dispatch, no state shared between calls.

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
- **DoD verifier verdict** — overall `PASS` (or the per-item JSON if any was overridden by the user)

### Communicate to user

Tell the user, in `{communication_language}`:

- Story key and title
- Status now `review`
- BDD scenarios authored and passing (count)
- Files changed (count + summary)
- Recommended next actions: review the diff, run `code-review` (ideally with a different model), and if UI was touched, consider `bmad-grr-design-pass` on the live result

Tailor explanation depth to `{user_skill_level}`. Offer to walk through anything that needs explaining.

End the workflow.
