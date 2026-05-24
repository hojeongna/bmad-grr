---
name: step-04-compose
description: 'Collect 4-question Mini PRD inline; run a lightweight inline Premise Challenge; compose the unified story; register in sprint-status'
nextStepFile: './step-04b-validate.md'
storyTemplate: '~/.claude/workflows/quick-story/data/story-template.md'
tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
---

# Step 4 — Compose Story

## Outcome

A unified story document is rendered from the template (Mini PRD + Mini Architecture + Architecture Impact + Conditional Review subsection if applicable + Story / AC / Tasks / Dev Notes), saved to `{implementation_artifacts}/{story_key}.md`, registered in `{sprint_status}` as `ready-for-dev`. The user has approved the rendered document before any file write happens.

## Approach

### Inline Mini PRD (4 questions in one round)

Ask all four in a single message:

1. **문제/동기** — 이 변경이 왜 필요한가요?
2. **대상 사용자** — 누가 혜택을 보나요?
3. **성공 기준** — 관찰 가능한 결과로 어떻게 성공을 판단하나요?
4. **비범위** — 이번에 절대 건드리지 않을 것은?

Halt for input. For "모르겠어요" / skip / empty answers, fill in a reasonable default from step-01 intent + step-02 patterns + step-03 architecture + the upstream PRD (if `prd_path` was set in step-02), and note which were auto-filled so the user can correct them later.

If step-02 surfaced a `prd_path`, the upstream PRD is a strong reference but **never** overrides the user's answers — it just informs defaults and provides cross-check material for step-04b.

### Lightweight Premise Challenge (inline pressure test)

Apply directly — no external skill load. Four short questions to pressure-test the PRD:

- **Premise** — Is the stated problem the real problem? Is there a simpler cut?
- **Existing leverage** — Is there code, feature, or story that already (half-)solves this? Cross-check step-02 touchpoints.
- **10x check** — What would the same change look like at 10x ambition? Just note — do not expand scope without user approval.
- **Hidden scope** — Are there obvious follow-ups the user didn't mention that should be bundled cheaply, or explicitly deferred?

If the challenge surfaces a meaningful concern, present it briefly:

```
💡 Premise Challenge
- {concern_1}
- {concern_2}

(A) 원래 방향대로 진행 (염두에 두고 계속)
(B) PRD 수정 (concern을 반영해서 다시 작성)
(C) 스코프 확장 ({hidden_scope}도 포함)
(D) 취소 — 처음부터 다시 생각할래요
```

Halt for input. On `A`, note the concerns in Dev Notes (`Premise Challenge Notes`) and continue. On `B`, accept PRD edits and re-run sections 1–2. On `C`, expand touchpoints — may loop back to step-03 for an architecture update. On `D`, exit cleanly with a message that nothing was saved.

If the challenge surfaces no significant concerns, simply note "Premise Challenge: 문제없음" and continue silently.

### Generate the story key

Quick-story uses the dedicated `q-` prefix so quick stories stay visually distinct from epic-scoped stories.

- Format: `q-{N}-{slug}`
- `N` — scan `{sprint_status}` for existing `q-*` keys, take the highest `N` and use `N+1` (start at `q-1` if none).
- `slug` — lowercase kebab-case from the intent; strip articles/stopwords; aim for 3–4 meaningful words.

### Render the story from the template

Read `{storyTemplate}` and substitute:

- `{{story_key}}`, `{{title}}` (5–8 word title from intent), `{{date}}`, `{{user_name}}`.
- `{{complexity}}` — `S` / `M` / `L` judgment call weighing touchpoint count, blast radius, risk level, test work. No formula.
- **Mini PRD fields** — the user's four answers (or auto-filled defaults), incorporating any Premise Challenge subtext.
- **Mini Architecture** — five fields from step-03.
- **Architecture Impact** — four points from step-03.
- **Conditional Review subsection** (Fix-Specific / UI / DX) — from step-03 if applicable; otherwise omit cleanly (don't leave an empty placeholder).
- **Story** — generate `As a / I want / So that` from intent + PRD answers.
- **Acceptance Criteria** — BDD-style (`Given / When / Then`) covering the main success path + key edge cases from Risks. Judgment decides count.
- **Tasks / Subtasks** — atomic, dependency-ordered, each referencing an AC number (`Task 1 (AC: #1)`). Sub-tasks for complex tasks.
- **Dev Notes**:
  - `refs_project_context` — relevant sections from step-02
  - `refs_related` — related story keys from step-03 Cross-Story Impact
  - `testing_unit` / `testing_integration` — load `{tddSkill}` in full and reference its RED-GREEN-REFACTOR discipline + testing-anti-patterns guide. If the skill isn't installed, derive testing standards from project patterns alone.
  - `premise_notes` — concerns from the Premise Challenge if `A` was selected.

### Approve and write

Present the full rendered story for explicit user approval:

```
✨ 스토리 문서 초안 준비 완료
Story Key: q-…
저장 예정: {implementation_artifacts}/q-….md
Complexity: …

[full rendered document in code block]

(Y) 저장하고 sprint-status에 등록
(E) 수정할 부분이 있어요
(R) AC나 Tasks 다시 생성
```

Halt for input. On `E`, accept edits and re-present. On `R`, regenerate AC/Tasks and re-present. On `Y`, write the story file with Write tool.

### Register in sprint-status

Load `{sprint_status}`, append a new entry:

- `key` — generated story key
- `title` — generated title
- `status` — `ready-for-dev`
- `created_by` — `quick-story`
- `created` — today's date

**Preserve every existing entry, comment, and structural element exactly.** Use Edit for targeted insertion when possible; only use Write if Edit can't preserve structure.

## Next

Load and follow `{nextStepFile}`.
