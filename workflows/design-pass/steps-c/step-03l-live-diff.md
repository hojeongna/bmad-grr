---
name: step-03l-live-diff
description: 'Mode L — capture the running screen under the live-capture protocol using the same deterministic extractor, diff 1:1 against the mockup spec, adversarially re-verify on the live page, classify by rubric, map findings to source'
nextStepFile: './step-04-route.md'
extractor: '~/.claude/workflows/design-pass/scripts/extract-dom-spec.js'
liveCaptureProtocol: '{live_capture_protocol}'
domSpecSchema: '{dom_spec_schema}'
fidelityRubric: '{fidelity_rubric}'
specDir: '{spec_dir}'
---

# Step 3L — Live Diff

## Outcome

Every mapped screen has a `{specDir}/{slug}.live.json` produced by the same extractor that produced its mockup spec, captured under `{liveCaptureProtocol}` (ready-gated, swept, noise-filtered, role-stated), a mechanical diff against the mockup spec, and findings that each survived an independent second look at the live page. Findings are classified per `{fidelityRubric}`, mapped to source files, and grouped by root cause. `[ADDED]` items and `mockup_defects` are kept out of the main findings list.

## Approach

### Establish the capture conditions once, before dispatching

These are decisions about the whole run, and getting them wrong invalidates every screen's spec. Settle them here, not inside each agent:

1. **Environment** — throwaway/test account and non-production if at all possible. Interaction tracing on a real app with real data mutates state; the protocol's mitigations are damage control, not a substitute.
2. **Role** — which permission level the mockup depicts. If the app renders differently per role, decide which levels get captured.
3. **Noise selectors** — look at the running page and list its app-specific injections (cookie banner, chat widget, in-house debug bar, A/B wrapper). The extractor filters common framework overlays by default and nothing else. Anything missed here resurfaces later as a mystery `[ADDED]` item.
4. **Data profile** — is the list seeded, real, or empty? Placeholder-vs-real content is not a finding and the diff needs to know which it's looking at.

Ask the user for whatever you can't determine by looking. Record all four; they go into every spec's meta.

### Capture — same agent, same screen, back to back

Read `{liveCaptureProtocol}` and `{domSpecSchema}` in full. Dispatch via the **Workflow** tool, one `agent()` per screen, `parallel()`.

The rule this step depends on: **each screen's agent captures the live side itself, having just read that screen's mockup spec, in the same unit of work.** Not a fresh agent that only sees the live page. Both sides run the same extractor, so the granularity is identical by construction — but the agent still needs the mockup spec in hand to know which interactions to trace, which states to chase, and which strings the mockup actually fixed.

Per screen, in its own `tabs_create_mcp` tab, everything through `javascript_tool` against that `tabId`:

```
navigate → paste {extractor} → __grrSpec.ready() → check the report → __grrSpec.sweep()
→ __grrSpec.extract({ noiseSelectors, collapseRepeats: true })
→ S5 traces (reload + re-paste between each)
→ S6 state capture (fetch/XHR patch per protocol §6 — restore the patch after each)
→ write {specDir}/{slug}.live.json
```

**S7 runs after the fan-out, sequentially**, exactly as in step-02 and for the same reason: `resize_window` hits the shared window, so a parallel responsive pass records every screen at some other agent's width.

Halt the screen — don't extract anyway — when `ready()` reports `fontsReady: false` (every typography row would be measuring a fallback) or `quiet: false` that can't be resolved by adding the offending widget to `noiseSelectors`. A spec captured over a moving or mis-rendered target is worse than a missing one, because it looks usable.

### Diff

Section by section, mockup as the left side, comparing the two JSON specs. Emit one line per difference:

```
[S{n}] {anchor} — mockup: {value} / live: {value}
```

Four mechanical rules before any judgment:

- **A difference the extractor's own normalization would have erased is an extraction bug, not a finding.** Both sides ran the same code; if one says `rgb(17,24,39)` and the other `#111827`, something didn't run. Fix it and re-capture.
- **Compare templates, not instances.** With `collapseRepeats` on, a list is one entry plus a count. `47 ≠ 3` never reaches the report; a row template with a missing column does.
- **Skip sample content in S4.** Compare only strings the mockup fixed — headings, labels, button text, errors, empty-state copy. Placeholder-vs-real data is not a copy mismatch.
- **S2 count-level differences come first.** "One button variant where the mockup has three" explains fifty downstream S3 rows; filing those fifty separately buries the real finding.

### Adversarially re-verify — a fresh look, on the live page

Do not present the diff as findings. A first pass over-reports: collapsed states read as missing elements, a component that hadn't finished rendering reads as absent, a value differs only because something was still settling.

Dispatch a second Workflow phase — one `agent()` per screen, or findings distributed across agents for a large diff — whose job is to **refute** each candidate directly on the live page. Each returns `CONFIRMED` (re-observed live, with what was seen), `REFUTED` (didn't reproduce, with why), or `UNCERTAIN`. Default to refuted when it won't reproduce.

Drop refuted. Keep confirmed. Surface uncertain as uncertain — never promote it to make the report cleaner. Same discipline `code-review` step-03 and `design-handoff` step-05b/07b apply, for the same reason: the context that produced a finding is the worst judge of whether it's real.

### Classify and map to source

Read `{fidelityRubric}` and apply it. Per surviving finding: severity, direction (`[ADDED]` when the live side has it and the mockup doesn't), proposed route, and the specific source file(s) for anything routed to **fix now**.

Do the source mapping **while the page is still open** — protocol section 10 gives the order: `data-testid` → devtools component name → CSS-module hash prefix → source map for the offending declaration → verbatim copy grep. A finding whose file couldn't be identified does not get routed to "fix now"; it goes to `quick-story` with the file marked unidentified. Editing something that looks close is worse than deferring.

Group by root cause before presenting. Nine spacing findings tracing to one wrong token are one finding with nine symptoms — and one fix.

### Present

```
🔍 {slug} — 목업 대비 충실도

캡처 조건: role={role} · data={profile} · env={env} · 제외={noise selectors}
{⚠️ fallback 폰트: {families}  — 있을 때만}
{⚠️ 가상 스크롤 목록 있음 — 개수 비교 제외  — 있을 때만}

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
```

Show every screen together, including clean ones — a screen that matched is a result worth stating, not an omission. Show the skipped-destructive list too; a control nobody traced is a hole in the coverage, and hiding it makes the pass look more complete than it was.

## Next

Load and follow `{nextStepFile}`.
