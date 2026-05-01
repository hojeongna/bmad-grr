---
name: step-04-web-search
description: 'Level 3 — web search for known issues; combine with Levels 1-2 evidence; trigger architecture review at 3+ failures'
nextStepFile: './step-04b-architecture.md'
skipToFixFile: './step-05-fix.md'
stateFile: '{output_folder}/bug-hunt-{date}.state.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4 — Web Search (Level 3)

## Outcome

External knowledge is consulted: relevant error messages, library issues, and known patterns are searched on the web; results are combined with prior evidence from Levels 1-2 to form a final hypothesis; the hypothesis is tested. If three or more total hypothesis failures have accumulated across all levels, architecture review is triggered.

## Approach

### Build a search strategy from evidence

Read `{stateFile}` for accumulated findings (Level 1 code analysis, Level 2 runtime evidence, all failed hypotheses). Derive search queries from concrete evidence — exact error strings, library + symptom combinations, observed patterns. Present the planned queries to the user; adjust on their input.

### Search

Use WebSearch and WebFetch. For each useful result, capture the source URL and the relevant insight. Evaluate whether each external finding aligns with internal evidence — discount results that contradict observed behavior.

### Synthesize and form final hypothesis

Combine the three layers (code analysis + runtime + external) into a single coherent hypothesis. Present it with all evidence cited (including URLs) and a minimal test method. Adjust on user input, then run the test.

### Failure count

After the test, count total failures across all levels (read `hypotheses` from state). At three or more failures, architecture review is needed — the next routing branch handles this.

### Persist progress

Update `{stateFile}`:
- Append to `hypotheses` with `level: 3` and external sources
- Set `lastEscalationLevel: 3`
- Add `step-04-web-search` to `stepsCompleted`
- Append findings to the Investigation Log

## Routing

Present a menu (halt for input):

- **Hypothesis succeeded**: `[A]` `[P]` `[S]` Skip to Fix, `[C]` Continue
- **Failed and total failures ≥ 3**: `[A]` `[P]` `[C]` Proceed to Architecture Review
- **Failed and total failures < 3**: `[A]` `[P]` `[R]` Retry this level, `[C]` Proceed to Architecture Review

Menu handling: `A`/`P` as standard; `S` → `{skipToFixFile}`; `R` (retry) returns to the search-strategy step within this file with refined queries; `C` → `{nextStepFile}` (architecture review).
