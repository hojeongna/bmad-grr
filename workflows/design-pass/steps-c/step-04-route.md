---
name: step-04-route
description: 'Single batch approval of the routing plan; apply fix-now edits sequentially with per-screen re-extraction as the regression gate; hand structural gaps to quick-story; write the report; final summary'
gapReportTemplate: '{gap_report_template}'
gapReportPath: '{gap_report_path}'
specDir: '{spec_dir}'
quickStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-quick-story.md'
devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
designHandoffCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-handoff.md'
---

# Step 4 — Approve, Fix, Route

## Outcome

The user approved the routing plan once for the whole batch. Fix-now findings were applied and each one re-verified by re-extracting its screen — not by asserting the edit was made. Structural gaps were handed to `quick-story` as a real story, not as a note. The report exists at `{gapReportPath}`. The user knows exactly what was changed, what was handed off, and what was deliberately left alone.

## Approach

### One approval gate for the whole plan

Present the routing plan — findings already classified in step-03l/03p — and take a single decision:

```
🎯 조치 계획

즉시 수정 ({n}건, {n}개 파일)
- {finding} → {file}
- ...

quick-story 로 이관 ({n}건)
- {finding} — {why it's not a quick fix}
- ...

보고만 ({n}건: F4 {n} / [ADDED] {n} / 목업 문제 {n} / 미확정 {n})

[Y] 이대로 진행   [M] 라우팅 조정   [R] 리포트만 쓰고 종료
```

Halt. On `M`, accept moves between buckets ("이건 즉시수정 말고 스토리로") and re-present. Don't ask per finding — a twenty-finding diff answered one at a time is how a user stops reading.

Mode P skips this gate; step-03p already took its own approval and there's nothing to fix in code.

### Apply fix-now edits — sequentially

One finding at a time, or one root-cause group at a time when several findings share a single fix. Never in parallel: these edits touch the same components and shared token files, and concurrent edits to shared styles collide in ways read-only extraction never does. Same rule `design-handoff` step-07b's Phase 2 states, same reason.

Edit the real source — the component, the token definition, the string. If a finding's file couldn't be identified in step-03l, it doesn't get fixed here; move it to the quick-story bucket and say why rather than editing something that looks close.

### Re-extract as the regression gate

After each screen's edits are done, re-extract that screen's live spec and re-diff it against its mockup spec. This is the only acceptable evidence that a fix landed:

- The targeted findings must be gone.
- Nothing new may appear. A token change made to fix one card can silently move every other component using that token — catching that now, while the change is fresh, is far cheaper than finding it later.

Write the re-extracted spec over `{specDir}/{slug}.live.md` so the artifacts on disk reflect current reality. If a fix didn't take, or introduced a new finding, say so and either fix it or move the original finding to quick-story. Don't record it as fixed.

### Hand off structural gaps

If the quick-story bucket is non-empty, load and follow `{quickStoryCommand}` with: the findings, their spec anchors, the mockup spec file paths, and the report path. Frame it as a mockup-fidelity gap, not as a new feature idea — `quick-story` should be filling a spec that already exists, not re-deriving one.

One story for the whole batch when the findings share a screen or a root cause; separate stories when they're genuinely unrelated. Record the resulting story key(s) in the report before continuing.

### Write the report

Render `{gapReportTemplate}` to `{gapReportPath}` in `{document_output_language}`. Fill every section — clean screens included, `[ADDED]` and mockup defects kept in their own sections rather than folded into findings, the re-verification column filled with what was actually re-extracted. An empty re-verification cell means the fix is unconfirmed, and the report should show that rather than leaving it blank and reading as done.

### Final summary

**Mode L:**

```
🎯✨ Design Pass 완료 (실행 화면 대조)

목업: {mockup source}
대상: {app URL} — 화면 {n}개
Findings: F0 {n} · F1 {n} · F2 {n} · F3 {n} · F4 {n}
즉시 수정: {n}건 ({n}개 파일) — 재검증 통과 {n} / 실패 {n}
quick-story 이관: {n}건 → {story keys}
보고만: [ADDED] {n} · 목업 문제 {n} · 미확정 {n}
리포트: {gap_report_path}
스펙: {spec_dir}/
```

**Mode P:**

```
🎯✨ Design Pass 완료 (스토리 문서 대조)

목업: {mockup source} — 화면 {n}개
스토리: {story path}
승격: AC {n}개 · Task {n}개 · Dev Notes {n}건
보고만: F4 {n} · 목업 문제 {n}
리포트: {gap_report_path}
```

### Offer routing

Mode P:

- `[D]` Run `dev-story` now — implement the story with its mockup coverage baked in.
- `[S]` Stop — the story is enriched and queued.

Mode L:

- `[D]` Run `dev-story` now — implement the handed-off `quick-story` output (only when the quick-story bucket produced one).
- `[H]` Run `design-handoff` — offered only when `mockup_defects` is non-empty; the mockup itself needs work before the implementation can be held to it.
- `[S]` Stop — everything is written; a later run re-extracts from the same `{specDir}`.

Halt for input. Execute by loading the corresponding command file. On `S`, state what's saved and end the workflow.
