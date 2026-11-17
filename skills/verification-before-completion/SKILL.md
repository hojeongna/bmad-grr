---
name: verification-before-completion
description: Use before claiming completion or passing checks, committing or creating PRs; require command output, with unchanged-input reuse only in grr validation/DoD/PR
---

# Verification Before Completion

## Verification

Support claims with command output: identify the required check, read its full output, exit code and failure count, and report the result and gaps. Failed, partial or missing checks are not passes.

Only in grr validation/DoD/PR, cite a same-session success when command/scope, code/tests/config/dependencies and relevant environment are unchanged. If `git status`/`git diff` cannot establish that related paths stayed unchanged since that run, treat inputs as uncertain and rerun affected checks. Status records/commits alone need no rerun. No cross-session reuse or substitute for observed TDD RED→GREEN; query remote CI/review/merge state afresh.

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Unmatched/stale run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |

## Reporting

Cite the command and observed result. An agent's success report needs confirmation against the diff and relevant checks; tests alone do not prove every requirement. Distinguish execution evidence from assumptions.
