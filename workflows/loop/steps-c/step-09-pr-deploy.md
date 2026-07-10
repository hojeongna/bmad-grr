---
name: step-09-pr-deploy
description: 'Create (and, per deploy_option, merge and/or deploy) PRs for the finished story loop; mark grr-loop COMPLETE and present the final summary'
stateFile: '{implementation_artifacts}/grr-loop-state-{date}.md'
prCreateCommand: '~/.claude/commands/bmad-grr-pr-create.md'
landAndDeploySkill: '~/.claude/skills/land-and-deploy/SKILL.md'
nextStepFile: null  # terminal step — grr-loop ends here
---

# Step 9 — PR & Deploy

## Outcome

Reached only when `deploy_option` (set at step-01) is not `none`. One or more PRs exist for the work completed in the story loop; depending on `deploy_option`, they are also merged and/or deployed with canary verification. The state file's `status` is set to `COMPLETE` and the user sees a final summary — PR links, and deploy/canary result if that path was taken.

## Approach

### Resume check

Read `{stateFile}`. If `current_phase` is already `complete` and `status: COMPLETE`, tell the user this loop already finished and show the existing summary instead of re-running anything. Otherwise set `current_phase: pr-deploy`, append a `## Phase Log` entry, and proceed on the recorded `deploy_option`.

### Branch on `deploy_option`

**`pr-only`** — Load and follow `{prCreateCommand}` in full, then wait for it to return control before continuing this step. Instruct it explicitly to stop once every PR reaches `OPEN` (its own step-04-test-create) and to skip its step-05-merge-loop entirely — this option never merges.

**`pr-wait-then-deploy`** — Load and follow `{prCreateCommand}` in full, this time letting it run all the way through its own step-05-merge-loop (it only polls for an externally-performed merge; it never merges anything itself) until every PR shows `MERGED`. Once merged, load and follow `{landAndDeploySkill}` in full for the deploy-only portion of its flow. Note explicitly: land-and-deploy's own Step 1 will see the PR already `MERGED` and normally suggests running `/canary` instead of a fresh merge — that is the expected continuation here, not a failure. Let it proceed straight to its deploy + canary steps rather than treating this as a redundant merge attempt.

**`pr-immediate-deploy`** — Load and follow `{prCreateCommand}` in full, but only through PR creation (its step-04-test-create, PRs `OPEN`) — skip its step-05-merge-loop entirely. Then hand off directly to `{landAndDeploySkill}` in full, which performs its own merge-decision gate (readiness checks, CI wait, Step 3.5 gate), merges, deploys, and runs canary verification end to end.

### Headless

`deploy_option` was already resolved at step-01, so this step never asks which branch to take. `bmad-grr-pr-create` and `land-and-deploy` remain interactive workflows with their own gates (PR splitting confirmation, the pre-merge readiness gate, canary approval) — headless grr-loop may still pause inside one of them; that is expected, not a bug in this step.

### Persist

Once the invoked workflow(s) return control with every PR in the expected final state for the chosen `deploy_option` (`OPEN` for pr-only, `MERGED` for pr-wait-then-deploy, `MERGED`+deployed for pr-immediate-deploy), update `{stateFile}`:

```yaml
status: COMPLETE
current_phase: complete
```

Append a final `## Phase Log` entry and a closing `## Deploy Result` section: PR URLs per repo, merge status, and — if a deploy path was taken — the production URL and canary verdict.

### Final summary

Present in `{communication_language}`: total PRs and their final status, PR URLs grouped by repo, deploy/canary result if applicable, and the path to `{stateFile}` for the record.

## Next

None — this is the terminal step of grr-loop. The workflow ends here.
