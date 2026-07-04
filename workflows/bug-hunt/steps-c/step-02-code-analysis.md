---
name: step-02-code-analysis
description: 'Level 1 — code analysis with parallel sub-agents, hypothesis formation, minimal-change test'
nextStepFile: './step-03-debug-logs.md'
skipToFixFile: './step-05-fix.md'
branchToStoryFile: './step-05b-branch-to-story.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2 — Code Analysis (Level 1)

## Outcome

Level 1 investigation is complete: the bug's likely root cause area is identified through code analysis (no instrumentation yet), a hypothesis is formed collaboratively with the user, the hypothesis is tested with the smallest possible change, and the result is documented in the state file. If the hypothesis succeeds, the user can skip directly to fix; if it fails, escalation to Level 2 is queued.

## Approach

Follow the loaded systematic-debugging skill's Phase 1 (root cause) and Phase 2 (pattern analysis). Code analysis only — no debug logs, no web search yet.

### Read what's there

Load `{stateFile}` for the bug description and prior context. Re-read error messages and stack traces carefully (line numbers, file paths, exact wording). Identify candidate files based on the bug description.

### Analyze candidates via the Workflow tool

Call the **Workflow** tool for this — every investigation, regardless of file count. Write a script that:

- **Discover** — one `agent()` per candidate file, each reading its file fully and returning structured findings (relevant code segments, suspicious patterns, data-flow notes).
- **Verify** — a fresh `agent()` per candidate to confirm or refute it against the code; drop refuted candidates.
- **Loop** — when a confirmed candidate implicates a new file (a caller, a shared util), pipeline another discover-and-verify round over just that file; repeat until a round surfaces nothing new (cap at 3 rounds).
- **Return** the surviving candidates.

Stay inside Level 1 inside the script — do not pull in runtime evidence or web sources, and do not escalate; that is what the escalation levels and their menus are for.

The survivors are **candidate root causes for the user to confirm**, not a settled hypothesis. They feed the next sections — they do not bypass them.

### Pattern compare

Find similar working code in the codebase and compare the survivors against the broken path. List every difference, however small.

### Recent changes

Run `git log --oneline -10` and `git diff` on the surviving candidate files. New dependencies, config drift, or recent refactors often surface here.

### Hypothesis

Present the analysis findings to the user, propose one specific hypothesis with its evidence and a minimal test method, and adjust based on the user's domain knowledge.

### Test it

Make the smallest possible change to verify the hypothesis. One variable at a time. Record the result honestly.

### Persist progress

Update `{stateFile}`:
- Append to `hypotheses`: `{ hypothesis, result, evidence, level: 1 }`
- Set `lastEscalationLevel: 1`
- Add `step-02-code-analysis` to `stepsCompleted`
- Append the analysis summary to the Investigation Log

## Routing

After the test, present a menu (halt for input):

- **If hypothesis succeeded**: `[A]` Advanced Elicitation, `[P]` Party Mode, `[S]` Skip to Fix, `[Q]` Document as story (quick-story → dev-story), `[C]` Continue to Level 2
- **If hypothesis failed**: `[A]` Advanced Elicitation, `[P]` Party Mode, `[C]` Continue to Level 2

Menu handling:
- `A` → execute `{advancedElicitationTask}`, then redisplay
- `P` → execute `{partyModeWorkflow}`, then redisplay
- `S` (success only) → load and follow `{skipToFixFile}`
- `Q` (success only) → load and follow `{branchToStoryFile}`. Best for multi-file or recurrence-prone bugs; for a single-file, low-complexity fix, `[S]` is the lighter choice.
- `C` → load and follow `{nextStepFile}`
