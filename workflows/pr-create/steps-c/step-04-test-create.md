---
name: step-04-test-create
description: 'Run local tests; on failure, recover via amend or new commit; create the PR auto (gh) or manual; optionally request post-PR code review'
nextStepFile: './step-05-merge-loop.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
requestingCodeReview: '~/.claude/skills/requesting-code-review/SKILL.md'
---

# Step 4 — Test & Create PR

## Outcome

The current PR's local tests pass (after any number of amend/new-commit recovery rounds), and the PR exists on GitHub — either created automatically via `gh pr create` or via a copy-paste command the user runs themselves. The state file moves the matching PR to status `OPEN` and records the PR URL when known.

## Approach

### Detect the test command

Inside the repo folder, look for the project's actual test entry point — in this order:

- `package.json` `scripts.test` → `npm/pnpm/yarn test` (detect manager from lockfile)
- `Makefile` with a `test` target → `make test`
- `pytest.ini` / `pyproject.toml` pytest config → `pytest`
- `.github/workflows/*.yml` → if a clear test command lives in CI, surface it as a candidate

Tell the user briefly which command will run.

### Run tests

Execute the detected command. If multiple are detected and reasonable, run them in sequence (typecheck → unit → integration) — but only what the project actually exposes; don't fabricate.

Before claiming "tests pass" anywhere downstream (commit message, PR body, status update), follow `{verificationBeforeCompletion}` — read the actual exit code and pass/fail counts from this turn's output and cite the evidence. Don't echo "should pass" forward.

### On failure — amend or new commit

If tests fail, show a tight failure summary and ask:

- `[A]` Amend the previous commit (`git commit --amend --no-edit` then `git push --force-with-lease`)
- `[N]` New commit (`git commit -m "fix: …"` then `git push`)

After the user fixes the issue, re-run tests. Repeat until they pass.

### Create the PR

Once tests pass, ask:

- `[A]` Auto — run `gh pr create --title "{title}" --body "{body}" --base {base}` and capture the PR URL.
- `[M]` Manual — show the exact command and wait for the user to confirm the PR was created.

PR title and body are generated from the branch name and the PR's role/responsibility from step-02. Make the body concise and specific — what changed, why, and how to test.

### Optional — request post-create code review

After the PR exists, optionally follow `{requestingCodeReview}` to dispatch a fresh code-reviewer sub-agent against the PR diff. Useful when: the PR is non-trivial, when the user wants a "second pair of eyes" pass before merge, or when the PR is the first in a chain (catching issues early prevents cascade through subsequent rebased PRs). The skill provides exact dispatch templates with `BASE_SHA` / `HEAD_SHA` / requirements context — use them.

Skip the request if the PR is small, mechanical, or already covered by the project's CI review automation.

### Persist

Update the matching PR's status to `OPEN` in the state file and record `prUrl` if known. Add `step-04-test-create` to `stepsCompleted`.

### Menu

Offer `[C]` Continue. On `C`, advance.

## Next

Load and follow `{nextStepFile}`.
