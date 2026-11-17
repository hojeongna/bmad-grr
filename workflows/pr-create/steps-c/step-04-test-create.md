---
name: step-04-test-create
description: 'Run local tests; on failure, recover via amend or new commit; create the PR auto (gh) or manual; optionally request post-PR code review'
nextStepFile: './step-05-merge-loop.md'
autoNextStepFile: './step-05a-auto-review-merge.md'
verificationBeforeCompletion: '~/.claude/skills/verification-before-completion/SKILL.md'
requestingCodeReview: '~/.claude/skills/requesting-code-review/SKILL.md'
---

# Step 4 — Test & Create PR

## Outcome

Tests pass and the PR exists on GitHub. Record status `OPEN` and its URL. A ticket-dev-loop call returns links after persistence and ends; it does not enter either merge path.

## Approach

### Detect the test command

Inside the repo folder, look for the project's actual test entry point — in this order:

- `package.json` `scripts.test` → `npm/pnpm/yarn test` (detect manager from lockfile)
- `Makefile` with a `test` target → `make test`
- `pytest.ini` / `pyproject.toml` pytest config → `pytest`
- `.github/workflows/*.yml` → if a clear test command lives in CI, surface it as a candidate

Tell the user briefly which command will run.

### Run tests

Use `{verificationBeforeCompletion}`'s valid same-session results, or run the configured checks (typecheck → unit → integration).

Cite each command and observed result in the PR; records/commits alone do not invalidate it. Changed or uncertain inputs require rerunning the affected checks.

### On failure — amend or new commit

If tests fail, show a tight failure summary and ask:

- `[A]` Amend the previous commit (`git commit --amend --no-edit` then `git push --force-with-lease`)
- `[N]` New commit (`git commit -m "fix: …"` then `git push`)

After the user fixes the issue, re-run tests. Repeat until they pass.

**Auto mode** — do not ask. Fix the failure, amend when it belongs to the commit just made, and re-run. Three consecutive failures on the same fix stop the run and hand the failure to the user rather than thrashing at it.

### Create the PR

Once tests pass, ask:

- `[A]` Auto — run `gh pr create --title "{title}" --body "{body}" --base {base}` and capture the PR URL.
- `[M]` Manual — show the exact command and wait for the user to confirm the PR was created.

Auto mode takes `[A]` without asking. The PR URL matters more there than in interactive mode — step-05a needs the number to poll reviews — so capture it from the `gh` output rather than reconstructing it.

PR title and body are generated from the branch name and the PR's role/responsibility from step-02. Make the body concise and specific — what changed, why, and how to test.

### Optional — request post-create code review

After the PR exists, optionally follow `{requestingCodeReview}` to dispatch a fresh code-reviewer sub-agent against the PR diff. Useful when: the PR is non-trivial, when the user wants a "second pair of eyes" pass before merge, or when the PR is the first in a chain (catching issues early prevents cascade through subsequent rebased PRs). The skill provides exact dispatch templates with `BASE_SHA` / `HEAD_SHA` / requirements context — use them.

Skip the request if the PR is small, mechanical, or already covered by the project's CI review automation. Auto mode always skips it: step-05a is about to collect the reviews the PR actually receives, and a local sub-agent review would only compete with them.

### Persist

Update the matching PR's status to `OPEN` in the state file and record `prUrl` if known. Add `step-04-test-create` to `stepsCompleted`.

### Menu

Ticket-dev-loop returns links and ends. Otherwise offer `[C]` Continue; auto skips the menu.

## Next

Ticket-dev-loop → return OPEN PR links and end. Otherwise load `{nextStepFile}`, or `{autoNextStepFile}` in auto mode.
