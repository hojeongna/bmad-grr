---
name: step-01-init
description: 'Greet, collect PRD ref and/or existing screen capture in one round, resolve has_prd / has_existing_screen flags, delegate to quick-story when neither exists, route'
nextStepGapScan: './step-02-gap-scan.md'
nextStepDesignSystems: './step-03-design-systems.md'
quickStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-quick-story.md'
prdGlob: '{prd_glob}'
implementationArtifacts: '{implementation_artifacts}'
---

# Step 1 — Init / Flags

## Outcome

`has_prd` and `has_existing_screen` are both resolved (each true/false), along with `prd_or_story_path` (if `has_prd`), `screen_capture_path` + `screen_capture_kind` (if `has_existing_screen`), `capture_scope` (`single`/`site`, if `has_existing_screen`), any free-form `user_concern`, and any `product_context_notes` the user flagged up front. When neither a PRD nor an existing screen is available, this step delegates to `quick-story` and continues rather than dead-ending. The workflow routes to exactly one next step.

## Approach

### Parse `$ARGUMENTS` or ask once

If `$ARGUMENTS` is non-empty, try to parse a mode letter (`A`/`B`/`C`), a PRD path/key, an existing-screen path/URL, and free-form concern text directly from it. Echo what was parsed and skip straight to resolution below for anything still missing.

Otherwise greet the user by `{user_name}` in `{communication_language}` and ask one warm, single-round question:

```
🎨🧩 Design Handoff — PRD를 HTML 시안으로

[A] 그린필드 — PRD는 있고, 화면은 새로 만들어요
    → PRD 경로 또는 키
[B] 브라운필드 — PRD도 있고, 기존 화면도 있어요
    → PRD 경로/키 + 기존 화면 캡처
[C] 개선만 — PRD는 아직 없고, 기존 화면만 다듬고 싶어요
    → 기존 화면 캡처만 있으면 돼요

기존 화면 캡처 참고: 브라우저에서 Ctrl+S 로 "웹페이지, 단일 파일" 저장하면 .mhtml로 받을 수 있어요
(Ctrl+C는 복사라서 화면 저장은 안 돼요 🙂). html 파일, 스크린샷, 그냥 URL도 다 괜찮아요.
B/C를 고르셨다면: 화면 하나만 다듬을 건가요, 아니면 사이트 전체(여러 탭/페이지)를 다 볼 건가요?

고민 있으시면 한 줄로 같이 알려주세요 (선택): "카드 레이아웃이 애매해" 같은 것도 OK.
혹시 일부러 그렇게 만든 특이사항(테스트용 스위처, 샘플/더미 데이터, 특정 인물 전용 기능 등)이 있다면
지금 미리 알려주시면 나중에 오판을 줄일 수 있어요 (선택).
```

Halt for input.

### Resolve flags

- `[A]` → `has_prd = true`, `has_existing_screen = false`.
- `[B]` → `has_prd = true`, `has_existing_screen = true`.
- `[C]` → `has_prd = false`, `has_existing_screen = true`.

`screen_capture_kind` from the supplied path/text: `.mhtml` extension → `mhtml`; `.html`/`.htm` → `html`; image extension or "스크린샷"/pasted image → `image`; starts with `http`/`/` → `url`.

### Resolve `capture_scope` (when `has_existing_screen`)

Default to `single` unless the user says otherwise — don't ask a second round-trip question for this alone; infer it from what they already said (e.g. "전체 사이트", "탭이 여러 개", a URL that's obviously one route among many) or take their direct answer to the bundled question above. If it's genuinely ambiguous and matters (the product clearly has multiple screens/routes but they only gave one), ask once before routing past step-03: "이 화면 하나만 다듬을까요, 사이트 전체(여러 탭)를 다 볼까요?"

`capture_scope = 'site'` changes what step-04 does — it hands off to a full multi-screen live walkthrough (step-04b) instead of converting a single capture. Don't default to `site` just because the product has more than one screen; default to what the user actually asked for, and only widen scope on an explicit signal (theirs, not an assumption you're making on their behalf).

### Capture `product_context_notes` (optional, when `has_existing_screen`)

If the user volunteered anything in response to the "일부러 그렇게 만든 특이사항" prompt, store it verbatim as `product_context_notes` and carry it forward — step-04b and step-05b must read this before calling anything a bug. If they said nothing, leave it empty; don't press for it a second time here (a live walkthrough will surface real intentional-design surprises anyway — this question just gives the user a chance to save everyone the round-trip).

### Resolve `prd_or_story_path` (when `has_prd`)

If the user gave an explicit path or a PRD key, use it directly — verify the file exists (Read or Glob check); if not, halt and ask them to correct it.

If they said "있어요" without a path, Glob `{prdGlob}` for candidates. Zero matches → tell them no PRD was found there and ask for the path directly. One match → confirm briefly and proceed. Multiple matches → list them (path + `status`/`updated` from frontmatter if readable) and ask which one.

### Nothing to work with → delegate to quick-story

If `has_prd = false` and `has_existing_screen = false` (mode `C` picked but no capture actually supplied, or genuinely nothing on hand), there's no anchor yet — but that's fixable, not a dead end. Tell the user briefly that this needs a lightweight story first, then load and follow `{quickStoryCommand}` with the user's intent (mirrors `design-pass`'s own quick-story delegation for the same situation).

After quick-story completes, if a new story key is available, set `prd_or_story_path = {implementationArtifacts}/{story_key}.md`, `has_prd = true`, and continue here as if `[A]` (greenfield) had been picked from the start — quick-story's mini-PRD stands in for a full PRD; step-02's gap-scan is exactly where its thinner spots surface. If the session ends before quick-story finishes, tell the user how to re-run `design-handoff` pointing at the new story key, and end this workflow.

### Route

If `has_prd` → load and follow `{nextStepGapScan}` with `prd_or_story_path`, `has_existing_screen`, `screen_capture_path`, `screen_capture_kind`, `capture_scope`, `product_context_notes`, and `user_concern` in context.

Otherwise → load and follow `{nextStepDesignSystems}` with the same context (PRD-related fields absent), noting explicitly that this is improvement-only mode so step-03 onward must not assume a PRD exists.

Route to exactly one next step. Never load both.
