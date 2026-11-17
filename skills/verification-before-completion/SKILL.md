---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires command output supporting claims, with same-session reuse for unchanged inputs
---

# Verification Before Completion

## Verification

Support claims with command output: identify the required check, read its full output, exit code and failure count, and report the result and gaps. Failed, partial or missing checks are not passes.

At validation, DoD and PR, reuse a successful check from this session when the command/scope and its inputs (code, tests, configuration, dependencies and relevant environment) are unchanged. Cite the earlier command and result in one line; status records or commits alone do not require a rerun. Changed or uncertain inputs require rerunning the affected checks. This does not reuse results across sessions or replace TDD's observed RED→GREEN. Remote CI/review/merge state needs a current query.

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
