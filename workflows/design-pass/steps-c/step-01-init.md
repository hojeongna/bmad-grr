---
name: step-01-init
description: 'Greet, collect input (story ref or URL + optional concern) in one round, decide branch (A pre-dev / B live-fix / C no-story → quick-story delegate), route'
nextStepFileA: './step-02a-plan-audit.md'
nextStepFileB: './step-02b-live-audit.md'
quickStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-quick-story.md'
---

# Step 1 — Init / Branch Decision

## Outcome

The user's input is captured in a single round (or parsed from `$ARGUMENTS`), the branch is decided (A pre-dev story enhancement / B live screen audit / C no story yet → delegate to `quick-story`), and the workflow routes to exactly one next step or delegate.

## Approach

### Parse `$ARGUMENTS` or ask once

If `$ARGUMENTS` is non-empty, parse it for one of:

- Story key / file path (`q-*`, `dp-*`, `*-*-*.md`, or a `.md` path) → Branch A.
- URL / route (starts with `http`, `/`, or looks like a domain) → Branch B.
- Vague description (no story ref or URL) → Branch C.
- Free-form concern text → `user_concern` (works on any branch).

Echo what was parsed and proceed.

Otherwise greet and ask one warm, single-round question in `{communication_language}`:

```
🎨 Design Pass

[A] 개발 전 — 스토리 문서가 있고 UI/UX 관점을 미리 반영하고 싶어요
    → 스토리 key 또는 파일 경로 (예: q-1-profile-upload)
[B] 개발 중/후 — 실제 돌아가는 화면 보고 개선안 만들고 싶어요
    → URL 또는 경로 (예: /products, https://...)
[C] 스토리도 없어요 — 막연한 아이디어만 있어요
    → quick-story로 먼저 스토리 만들고 돌아올게요

고민 있으시면 같이 알려주세요 (선택): "밋밋해" "복잡해" 같은 한 줄도 OK.
```

Halt for input.

### Parse into branch + fields

From the answer (or parsed `$ARGUMENTS`), extract:

- `branch` — `A`, `B`, or `C`. Story key/path → A; URL/route → B; explicit "[A]"/"[B]"/"[C]" → that branch; vague → C.
- `story_ref` — story key or path (Branch A only).
- `url` — URL or route (Branch B only).
- `user_concern` — any free-form concern text.

If the branch is genuinely ambiguous, ask one clarifying question with `[A]`/`[B]`/`[C]`. Halt. Don't guess.

### Branch C — delegate to quick-story

Tell the user briefly that this needs a story first, then load and follow `{quickStoryCommand}` with the user's vague idea as intent. After quick-story completes, if the session is still active and a new story key is available, continue here as Branch A with that key. Otherwise tell the user how to call design-pass again with the new story key, and end this workflow.

### Branch A or B — route

For Branch A, briefly confirm target (`story_ref`) and concern, then load and follow `{nextStepFileA}` with `story_ref` and `user_concern` in context.

For Branch B, briefly confirm target (`url`) and concern, then load and follow `{nextStepFileB}` with `url` and `user_concern` in context.

Route to exactly one next step. Never load multiple.
