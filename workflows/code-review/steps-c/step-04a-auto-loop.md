---
name: step-04a-auto-loop
description: 'Auto mode only — decide whether another review round is worth spending, then fix everything at Full scope and go again'
fixStepFile: '~/.claude/workflows/code-review/steps-c/step-05-fix.md'
completeStepFile: '~/.claude/workflows/code-review/steps-c/step-06-complete.md'
maxRounds: 5
---

# Step 4a — Auto Round Gate

## Outcome

The loop either spends another round — fix every finding at Full scope, re-collect, re-review — or stops with a named reason and the findings it could not clear. Rounds are bounded, and a loop that stopped is reported as stopped, never as clean.

## When this step runs

Auto mode only, and only when the report carried at least one finding. A clean report never arrives here — step-04 routes zero findings straight to `{completeStepFile}`, and that is how this loop is supposed to end.

## Round state

Carried in context across rounds; there is no state file, because the whole loop lives inside one session.

- `round` — review rounds completed so far; the report that just arrived is round `round`, and the first report to reach this step is round 1.
- `findings[round]` — each round's surviving findings, identified by **file path + checklist item + what is wrong**. Never by line number: fixes shift line numbers, and matching on them would make every recurring finding look new.
- `fixed[round]` — what step-05's agents reported as actually applied, keyed the same way.

## Stop conditions

Check all four before spending another round. Any one of them ends the loop → `{completeStepFile}`.

1. **Recurrence** — a finding step-05 reported as fixed last round is on this round's list again. The fix did not take, and another round applies the same fix to the same line for the same result. Stop and name the finding: this is the one thing in the loop a human has to look at.
2. **Unfixable finding** — step-05 returned a concrete technical blocker for any finding in scope. Auto mode cannot clear it by repeating itself.
3. **Red tests** — step-05's three test-retry rounds ended with tests still failing. Reviewing broken code against a checklist produces findings nobody can act on; stop while the failure is still legible.
4. **Round budget** — `round` has reached `{maxRounds}`. Not converging within five rounds means the fixes keep opening new violations, and the loop is now generating work rather than finishing it.

A round that produced *new* findings without any recurrence is not stalled — the fixes were real and the reviewers found something else. That is the loop working, and it keeps going until the budget says otherwise.

## Otherwise — another round

Set `fixScope = ALL` and hand off. Full is the only scope auto mode uses: passing `auto` is the user saying "fix everything and review it again", so there is no scope menu to show and no priority to filter on.

## Communicate

One line before handing off, in `{communication_language}`: round number, findings carried into it, and the budget remaining — `round 2/5 — 7 findings, fixing all`. On a stop, say which condition fired and what is left unfixed. A stopped loop that reads like a finished one is the only genuinely bad outcome here.

## Next

Stop condition fired → load and follow `{completeStepFile}`.
Otherwise → load and follow `{fixStepFile}`.
