---
name: step-01b-linear-issue
description: 'Create (or pick) a Linear issue before any branch is named, and derive the branch name from it so the branch links back to the issue'
nextStepFile: './step-02-execute.md'
parallel_agents_skill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 1b — Linear Issue → Branch Name

## Outcome

`linear_issue` is resolved (`key`, `title`, `url`, `gitBranchName`) and `branch_name` is derived from it, replacing the `{type}/{YYMMDD}-{description}` name step-01 would otherwise have generated. Every repo in the plan gets the same branch name — one issue, one change, however many repos it spans. Folder names are unaffected; they stay short per step-01.

## Why the branch comes from the issue

Linear links a branch to an issue by finding the issue identifier (`ENG-123`) inside the branch name. Get that wrong and the issue never picks up the PR, the status automations never fire, and the link has to be repaired by hand later. Taking the name from Linear instead of inventing one removes that whole failure class.

## Approach

### Confirm Linear MCP is available

Resolve the tools via ToolSearch with a query like `"linear issue"` before calling anything. If Linear isn't connected, say so plainly and offer to fall back to step-01's date-based naming rather than stalling the whole workspace setup — the issue is a nicety here, not a precondition for cloning repos.

### Pick the team

Call `list_teams`. One team → use it. Several → show them and ask. Remember the answer for the rest of the run; don't re-ask per repo.

### New issue, or one that already exists

Ask once, in `{communication_language}`:

```
리니어 이슈를 새로 만들까요, 이미 있는 걸 쓸까요?

[N] 새로 만들기 — 아까 말씀하신 작업 내용으로 초안 잡아드릴게요
[E] 기존 이슈 — 키(ENG-123)나 검색어를 알려주세요
```

Halt for input.

On `E`, resolve it with `get_issue` (a key) or `list_issues` with `query` (a search phrase); confirm the match before using it.

On `N`, draft from the problem description step-01 already collected — don't re-interview. Title: one line, what changes and where, in the user's own framing. Description: the problem context verbatim plus the repo list this workspace will span, so the issue explains itself to someone who finds it in two weeks. Show the draft and get approval before writing anything to Linear — issue creation is a write into a shared workspace other people read, not a scratch file.

Then `save_issue` with `team`, `title`, `description`, and `assignee: "me"`.

### Read the branch name back from Linear

Don't construct the branch name yourself. Call `get_issue` on the new or chosen issue and take its git branch name — `list_issues` exposes the same value as the `gitBranchName` field. Linear renders it under whatever branch format the workspace configured, which is the thing that has to match.

**Expect non-ASCII.** When issue titles are Korean, Linear's generated name carries the Korean through:

```
jane-doe/eng-123-목록-정렬이-가끔-초기화되는-문제
```

Git accepts that, and it stays linked. But it's long, and some CI runners, shell scripts, and Windows tooling handle non-ASCII refs badly. Offer both, defaulting to the short form:

```
🔗 ENG-123 — 목록 정렬이 가끔 초기화되는 문제
   https://linear.app/.../eng-123-...

브랜치 이름:
[S] jane-doe/eng-123                              (짧게 — 기본)
[L] jane-doe/eng-123-목록-정렬이-가끔-초기화되는-문제   (리니어 원본)
[M] 직접 입력

둘 다 이슈에 연결돼요 — 연결은 브랜치 이름 안의 ENG-123으로 잡히거든요.
```

Halt for input. Whichever is chosen must still contain the issue identifier; if the user hand-writes one in `M` that drops it, say so and ask again rather than silently accepting a branch that won't link.

### Move the issue to started

Linear's "move to started on git branch copy" automation fires on the copy action in Linear's own UI — it won't fire for an issue created through MCP. So the issue sits in Backlog while work begins on it unless this step moves it.

Ask as part of the confirmation above, and on yes call `save_issue` with the team's first started state. If the user declines, leave it; a wrong status is easier to live with than a status changed behind their back.

## Next

Carry `branch_name`, `linear_issue.key`, and `linear_issue.url` back into the plan table from step-01 and re-display it — repo, GitHub URL, base, branch, subfolder, plus the issue key — for a final `[Y]`/`[E]`. Then load `{parallel_agents_skill}` and follow `{nextStepFile}`.
