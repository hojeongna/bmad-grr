---
name: step-02-code-analysis
description: 'Level 1 — code analysis with parallel sub-agents, hypothesis formation, minimal-change test'
nextStepFile: './step-03-debug-logs.md'
skipToFixFile: './step-05-fix.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
systematic_debugging_skill: '~/.claude/skills/systematic-debugging/SKILL.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
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

### Parallel multi-file analysis

For multi-file investigations, load `{parallel_agents_skill}` and dispatch one sub-agent per candidate file. Each sub-agent reads its file fully and returns structured findings: relevant code segments, suspicious patterns, data-flow notes. Aggregate results in the main thread.

If sub-agents are unavailable, read files sequentially.

### Pattern compare

Find similar working code in the codebase and compare against the broken path. List every difference, however small.

### Recent changes

Run `git log --oneline -10` and `git diff` on the candidate files. New dependencies, config drift, or recent refactors often surface here.

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

- **If hypothesis succeeded**: `[A]` Advanced Elicitation, `[P]` Party Mode, `[S]` Skip to Fix, `[C]` Continue to Level 2
- **If hypothesis failed**: `[A]` Advanced Elicitation, `[P]` Party Mode, `[C]` Continue to Level 2

Menu handling:
- `A` → execute `{advancedElicitationTask}`, then redisplay
- `P` → execute `{partyModeWorkflow}`, then redisplay
- `S` (success only) → load and follow `{skipToFixFile}`
- `C` → load and follow `{nextStepFile}`
