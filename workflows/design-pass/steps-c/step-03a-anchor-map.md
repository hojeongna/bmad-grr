---
name: step-03a-anchor-map
description: 'Mode L gate — enumerate every repeating identity unit the mockup contains, pair each one with its counterpart in the implementation, and prove the pairing is right by printing human-readable fingerprints from both sides before any extraction happens'
nextStepFile: './step-03l-live-diff.md'
handoffCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-handoff.md'
domSpecSchema: '{dom_spec_schema}'
specDir: '{spec_dir}'
---

# Step 3A — Anchor Map and Fingerprint Gate

Mode L only. Step-02 routes here; this step routes on to step-03l. Mode P never runs it — there
is no second DOM to pair against.

## Outcome

Every repeating identity unit on each mockup screen is enumerated, paired with its counterpart in
the implementation, and **confirmed by a human reading both sides' fingerprints**. The anchor map
is written down. Screens whose anchors cannot be paired are halted here, before anyone spends an
extraction on them.

## Why this step exists

A run compared a mockup row against a build row, dumped 19 cells each, diffed every computed
property, and produced 4,319 drifts across 378 combinations and 76 elements. A work plan was
built from it. Then someone read the two fingerprints:

```
목업 TODO#1  @text  "1"
빌드 TODO#1  @text  "1✓IA 초안 정리 및 팀 리뷰월화수목금토일대기진행중완료보류%첨부 0개"
```

Different rows. All 4,319 findings were discarded.

**The asymmetry is the whole argument.** Get the anchor right and hundreds of descendants pair
themselves automatically, because every key below it is a relative path. Get it wrong and every
one of those hundreds is garbage that still looks exactly like a result — same format, same
volume, same confidence. Ten seconds of reading two strings is what separates the two outcomes.
Nothing downstream can detect the difference.

## Approach

### First try the extractor's own keys

Both mockup specs are already on disk from step-02. Compute the Tier-A overlap described in
`{domSpecSchema}` — how many `node.mkey` values (`role|accessible name`) appear on both sides —
after a light live-side pass (navigate, inject, `__grrSpec.extract()` is not needed; a
`querySelectorAll` + `matchKey` sweep is enough).

- **≥ 70% overlap** → the extractor's keys *are* the anchor map. Record the rate and go to
  `{nextStepFile}`. The manual work below is unnecessary.
- **Below 70%** → automatic matching does not hold for this pair. Continue.

Automatic matching failing is a normal outcome, not an error. One measured case: **22 common keys
out of 375**, because the mockup carried no table roles at all. When the two sides look like this,
nothing mechanical can bridge them:

| | 목업 | 구현 |
|---|---|---|
| 요소 | `div` 격자 | `<table>` |
| role | 없음 | `table` / `row` / `columnheader` |
| 클래스 | `scpa` (해시) | `planTodoRow` |
| 데이터 | `IA 초안 정리` | `투두1` |

Tag, class, role and sibling order are all unusable. What remains is meaning, and meaning is a
human judgment. That is what the rest of this step collects.

### Enumerate the anchor types — all of them

An anchor is the screen's repeating unit of identity. It is not always a row:

| Screen kind | Anchor |
|---|---|
| table | row |
| card list | card |
| form | field (label + input + error, as one unit) |
| navigation | item |
| modal | section |
| dashboard | widget |

**Enumerate every type the mockup contains, not the obvious one.** A table is at least five
anchor types — header row, data row, add row, empty-state row, summary row — and if the screen
has more than one table (a project table and a routine table), each is its own set.

This matters because an element that was never extracted cannot appear in a diff. One run dumped
the header, the parent row, and the first To-Do row. The `＋ 하위 To-Do 추가` row was clipped on
its left edge and its `Shift+Enter` hint was broken onto vertical lines — and neither showed up as
a difference, because that row was not in the dump. The empty-state row, the routine table and the
review table were absent for the same reason.

List the types, then pick **at least one instance of each**, on both sides.

### The fingerprint gate — mandatory, before any extraction

For every paired anchor, print a value a person can read, from both sides, next to each other:

| Anchor kind | Fingerprint |
|---|---|
| row | the row's full text content |
| card | the card title |
| field | the label |
| nav item | the item text |
| widget | the heading |

```
🔗 앵커 짝짓기 확인 — {slug}

[1] 데이터 행
    목업  "1  IA 초안 정리 및 팀 리뷰  월화수목금토일  대기 …"
    구현  "1  투두1  월화수목금토일  대기 …"
[2] 헤더 행
    목업  "순서 제목 요일 상태 완료일 첨부"
    구현  "순서 제목 요일 상태 완료일 첨부"
[3] 추가 행
    목업  "＋ 하위 To-Do 추가"
    구현  "＋ 하위 To-Do 추가"
...

이 짝들이 서로 같은 것입니까?
[Y] 맞음 — 추출 진행   [F] {n}번이 틀림 — 다시 고름   [S] 이 화면 건너뜀
```

Halt. This gate is not skippable and not inferable — the two strings can differ completely in
content (`IA 초안 정리` vs `투두1` is placeholder-vs-real data, which is fine) while still being
the same structural unit, and only a person can tell that apart from having grabbed the wrong
container.

On `F`, re-select that anchor and re-print. On `S`, record the screen as `앵커 확정 실패` and carry
it to the report as an uncompared screen — never as a clean one.

### Write the anchor map down

Per screen, per anchor type:

```
{ type, mockupSelector, liveSelector, fingerprintMockup, fingerprintLive, confirmedAt }
```

Save it to `{specDir}/{slug}.anchors.json`. Step-03l reads it, and a later run can re-verify the
same pairing instead of re-deriving it.

### Keys below an anchor are relative

Once an anchor is confirmed, everything under it is keyed by its path from the anchor —
`{anchor}/c02/00.button` — not by the extractor's landmark-scoped anchor. Two sides with
incompatible landmark structure still produce identical relative keys under a correctly paired
anchor, which is precisely what makes the manual path work at all.

### When the mockup itself is the blocker

If the fingerprint gate keeps failing because the mockup has no structure to grab — no `<table>`,
no `role=columnheader`, no `main` landmark — that is a `design-handoff` defect, not a design-pass
one. Record it in `mockup_defects`, and offer:

```
⚠️ 목업에 대조 가능한 구조가 없습니다 — {what is missing}

[A] 수동 앵커로 계속   [H] design-handoff 로 되돌려 구조부터 고침   [S] 이 화면 건너뜀
```

`[H]` loads `{handoffCommand}`. Do not quietly proceed on a mockup that cannot be paired.

## Present

```
🔗 앵커 맵 완료

{slug} — 자동 키 매칭 {n}%  →  {자동 사용 | 수동 앵커}
         앵커 타입 {n}종 확정: {list}
         지문 확인: 사용자 승인 {date}
{slug} — ⚠️ 앵커 확정 실패 → 이 화면 대조 제외
```

## Next

Load and follow `{nextStepFile}`.
