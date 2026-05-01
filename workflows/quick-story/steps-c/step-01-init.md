---
name: step-01-init
description: 'Collect intent in one round; detect existing stories in sprint-status; delegate to refine-story when a match is found'
nextStepFile: './step-02-analyze.md'
refineStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
---

# Step 1 — Intent & Existing-Story Detection

## Outcome

The user's intent is captured in a single round, the sprint status is scanned for any existing story that matches, and the workflow either delegates to `refine-story` (when a match is confirmed) or proceeds to context analysis with the intent + change_type recorded.

## Approach

### Capture intent

If `$ARGUMENTS` already contains a clear intent description, use it directly and echo a one-line confirmation in `{communication_language}`. Otherwise, ask one warm, concise question:

- What you want to build/change in one sentence (e.g., "사용자 프로필 페이지에 이미지 업로드 추가").
- Optional: module/file paths or feature areas.
- Optional: an existing story key or epic number, if known.

Do not run a multi-step interview here — one round.

### Parse intent into structured fields

From the response (or `$ARGUMENTS`), extract:

- `intent` — one-sentence description.
- `touchpoint_hints` — module/file paths or feature areas mentioned.
- `existing_story_ref` — explicit story key or path, if mentioned.
- `change_type` — infer one of `feature | fix | refactor | chore | ui | devex` from wording and touchpoints. Be precise: a UI-touching feature is `ui`, not `feature`. If genuinely ambiguous, ask once.

The `change_type` is consumed in step-03 to decide whether the systematic-debugging superpower is loaded (when `change_type == 'fix'`).

### Detect existing stories

**If the user provided an explicit story reference** — read the file directly. If it exists, set `existing_story_found = true` and `existing_story_path`. Skip ahead to delegation.

**Otherwise** — load `{sprint_status}` fully, list every story entry with `key`, `title`, `status`. Match the user's `intent` against story titles/keys by semantic overlap (use judgment — not literal string match).

If at least one candidate matches, present the top 1–3 to the user:

```
이런 기존 스토리가 발견됐어요:
[1] q-3-profile-image-upload — 프로필 이미지 업로드 (status: ready-for-dev)
[2] …

(Y) 네, 이 중 하나 수정할게요 → refine-story
(N) 아니요, 새로 만들게요 → quick-story 계속
(번호) 특정 스토리 지정
```

Halt for input.

If no candidates, proceed silently to the next step (no need to announce "no match" — that's the happy path here).

### Delegate to refine-story

When `existing_story_found = true` (after explicit ref or after the user selected `Y`/번호):

```
기존 스토리가 있으니 refine-story로 넘어갈게요.
현재 의도와 스토리 경로를 그대로 넘겨드립니다.
```

Load and follow `{refineStoryCommand}` — pass the intent and `existing_story_path` as context. End this workflow there.

### Continue when no existing story found

Tell the user briefly: intent / change_type / hints / "기존 스토리 없음 (신규 생성)". Then advance.

## Next

Load and follow `{nextStepFile}`.
