---
name: step-03l-live-diff
description: 'Mode L — capture the running screen under the live-capture protocol with the same extractor, run a mechanical file diff behind a match-rate gate, adversarially re-verify surviving findings on the live page, classify, map to source'
nextStepFile: './step-04-route.md'
extractor: '~/.claude/workflows/design-pass/scripts/extract-dom-spec.js'
liveCaptureProtocol: '{live_capture_protocol}'
domSpecSchema: '{dom_spec_schema}'
fidelityRubric: '{fidelity_rubric}'
specDir: '{spec_dir}'
---

# Step 3L — Live Diff

## Outcome

Every mapped screen has `{specDir}/{slug}.live.tsv` + `.json` produced by the same extractor that
produced its mockup spec, captured under `{liveCaptureProtocol}` at the same asserted view state
and the same viewport. A **mechanical `diff`** of the two TSV files is the finding source —
nobody reads two specs and reports what they noticed. Findings survive an independent second look
at the live page, are classified per `{fidelityRubric}`, mapped to source, and grouped by root
cause. `[ADDED]` items and `mockup_defects` stay out of the main list.

## Approach

### Establish the capture conditions once, before dispatching

These are decisions about the whole run, and getting them wrong invalidates every screen's spec.

1. **Environment** — throwaway/test account and non-production if at all possible. Interaction
   tracing on a real app mutates state; the protocol's mitigations are damage control.
2. **Role** — which permission level the mockup depicts.
3. **View state** — carried in from step-01. Re-assert it, don't assume it survived.
4. **Noise selectors** — the app-specific injections (cookie banner, chat widget, in-house debug
   bar, A/B wrapper). The extractor filters common framework overlays and claude-in-chrome's own
   indicator DOM by default and nothing else. Anything missed resurfaces as a mystery `[ADDED]`.
5. **Data profile** — seeded, real, or empty. Placeholder-vs-real content is not a finding.

Ask the user for whatever you can't determine by looking. All five go into every spec's meta.

### Capture — same agent, same screen, back to back

Read `{liveCaptureProtocol}` and `{domSpecSchema}` in full. Dispatch via the **Workflow** tool,
one `agent()` per screen, `parallel()`.

The rule this step depends on: **each screen's agent captures the live side itself, having just
read that screen's mockup spec, in the same unit of work.** Both sides run the same extractor, so
granularity is identical by construction — but the agent still needs the mockup spec in hand to
know which interactions to trace, which states to chase, and which strings the mockup fixed.

Per screen, in its own tab:

```
navigate → assert view state → inject extractor → __grrSpec.ready() → check the report
→ __grrSpec.sweep() → __grrSpec.extract({ noiseSelectors, collapseRepeats: true })
→ upload {slug}.live.tsv and .json
→ S5 traces (reload + re-inject between each)
→ S6 state capture (fetch/XHR patch per protocol §6 — restore the patch after each)
→ __grrSpec.responsive([375,768,1440], { prepare: re-assert view state })
```

Halt the screen — don't extract anyway — when `ready()` reports `fontsReady: false` (every
typography row would be measuring a fallback) or `quiet: false` that can't be resolved by adding
the offending widget to `noiseSelectors`, or when `health.collapsed` is true on either side. A
spec captured over a moving, mis-rendered, or structureless target is worse than a missing one,
because it looks usable.

### Gate on the match rate before diffing

A diff of two files whose keys don't correspond is not a diff, it is two file dumps. Compute, per
screen:

- **Tier A** — how many `node.mkey` values (`role|accessible name`) appear on both sides
- **Tier B** — of the rest, how many pair by normalized own text
- **Tier C** — of the rest, how many pair by `node.path` ordinal under an already-matched parent

**Tier A below 70% is a halt for that screen.** Report the rate and the likely cause — wrong
route, wrong view state, a collapsed mockup — and skip it. Do not produce findings from an
unmatched pair; that is the failure that fills a report with fiction while looking thorough.

### Diff — mechanically

```
diff {slug}.mockup.tsv {slug}.live.tsv
```

That is the finding source. Both sides are sorted `key ⇥ field ⇥ value`, so `<` is the mockup and
`>` is the implementation, grouped by element automatically. A run against a fixture with eleven
planted drifts produced 219 diff lines and caught all eleven — including an alignment change, a
`:hover` color, a wrapper's `flex-direction`, a `float`, and a cell clipped on its left edge, none
of which any earlier version of this workflow could see.

Two extractions of an unchanged page produce **byte-identical** files — verified at 34,108 lines
on a production route. So every diff line is a real difference; there is no jitter to filter.

**A real screen is ~30,000 records per side, and a first diff can run to thousands of lines.**
Read it in this order and stop when a tier explains the rest:

1. `@components` and `@table:*` — one missing variant or `table-layout: fixed → auto` explains
   hundreds of downstream lines.
2. `@cssvar.applied` — one wrong token explains every color and spacing line that follows it.
3. `node.*` — elements present on one side only. Structure before appearance.
4. `align.*`, `box.*`, `css.*` — the causes.
5. `meas.*` — clipping, wrapping, escaping a parent. Real defects regardless of the mockup.
6. `geom.*` — **last, and usually not a finding of its own.** Geometry is the symptom of 4.
   Filing "this moved 24px" without its cause is unactionable.

Then, before any judgment:

- **A difference the extractor's own normalization would have erased is an extraction bug, not a
  finding.** Both sides ran the same code; if one says `rgb(17,24,39)` and the other `#111827`,
  something didn't run. Fix it and re-capture.
- **Compare templates, not instances.** With `collapseRepeats` on, repeated rows are one entry
  plus a count. `47 ≠ 3` never reaches the report; a row template with a missing column does.
  Cells inside a row are never collapsed — each column is its own identity.
- **Skip sample content.** Compare only strings the mockup fixed — headings, labels, button text,
  errors, empty-state copy.
- **Read `@components` first.** "One button variant where the mockup has three" explains fifty
  downstream token rows; filing those fifty separately buries the real finding.
- **Read `align.*` and `box.*` before `geom.*`.** Geometry is the symptom; alignment, sizing and
  `@table:*.layout` are the cause. A finding that says a column moved 24px is unactionable; one
  that says `align.textAlign right → left` names the edit.
- **A one-sided line means the other side is at the documented default** — the schema's default
  table says which. It is a real difference, not a missing record.

### Adversarially re-verify — a fresh look, on the live page

Do not present the diff as findings. Even a mechanical diff over-reports: a collapsed state reads
as a missing element, a component that hadn't finished rendering reads as absent.

Dispatch a second Workflow phase — one `agent()` per screen, or findings distributed across
agents for a large diff — whose job is to **refute** each candidate directly on the live page.
Each returns `CONFIRMED` (re-observed live, with what was seen), `REFUTED` (didn't reproduce, with
why), or `UNCERTAIN`. Default to refuted when it won't reproduce.

Drop refuted. Keep confirmed. Surface uncertain as uncertain — never promote it to make the report
cleaner. Same discipline `code-review` step-03 applies, for the same reason: the context that
produced a finding is the worst judge of whether it's real.

### Classify and map to source

Read `{fidelityRubric}` and apply it. Per surviving finding: severity, direction (`[ADDED]` when
the live side has it and the mockup doesn't), proposed route, and the specific source file(s) for
anything routed to **fix now**.

Do the source mapping **while the page is still open** — protocol section 10 gives the order:
`data-testid` → devtools component name → CSS-module hash prefix → source map for the offending
declaration → verbatim copy grep. A finding whose file couldn't be identified does not get routed
to "fix now"; it goes to `quick-story` with the file marked unidentified.

Group by root cause before presenting. Nine spacing findings tracing to one wrong token are one
finding with nine symptoms — and one fix. `@cssvar.applied` is where that token is named.

### Present

```
🔍 {slug} — 목업 대비 충실도

캡처 조건: role={role} · view={asserted state} · data={profile} · env={env} · 뷰포트={w} · 제외={noise selectors}
매칭률: A {n}% · B {n}% · C {n}% · 미매칭 {n}건
diff {n}줄 → 후보 {n}건 → 반증 통과 {n}건
{⚠️ fallback 폰트: {families}                  — 있을 때만}
{⚠️ 반응형 미측정: 프레이밍 거부                — 있을 때만}
{⚠️ 가상 스크롤 목록 있음 — 개수 비교 제외      — 있을 때만}

F0 {n} · F1 {n} · F2 {n} · F3 {n} · F4 {n}

❌ F0 {finding} — {evidence} → quick-story
⚠️ F1 {finding} — {evidence} → quick-story
🎨 F2 {finding} — mockup {value} / live {value} → 즉시수정 ({file})
💬 F3 {finding} — mockup "{text}" / live "{text}" → 즉시수정 ({file})
✅ F4 {finding} — 허용범위 내, 보고만

➕ [ADDED] {finding} — 목업에 없지만 구현에 있음 (판단 필요)
🔧 목업 자체 문제: {finding} → design-handoff 쪽 이슈
🚫 미추적: {destructive control} — 파괴적 액션이라 클릭 안 함
❓ 미확정: {finding} — {why}
🛑 대조 불가: {slug} — 매칭률 {n}% ({cause})
```

Show every screen together, including clean ones — a screen that matched is a result worth
stating. Show the skipped-destructive list and the halted screens too; a control nobody traced
and a screen nobody diffed are holes in the coverage, and hiding them makes the pass look more
complete than it was.

## Next

Load and follow `{nextStepFile}`.
