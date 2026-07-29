---
name: step-02-mockup-spec
description: 'Render every mockup screen in a real browser and extract it into a normalized spec, TSV plus JSON, uploaded straight to disk; parallel one agent per screen; route to mode P or L'
nextStepFileP: './step-03p-doc-diff.md'
nextStepFileL: './step-03l-live-diff.md'
extractor: '~/.claude/workflows/design-pass/scripts/extract-dom-spec.js'
specServer: '~/.claude/workflows/design-pass/scripts/spec-server.py'
domSpecSchema: '{dom_spec_schema}'
specDir: '{spec_dir}'
---

# Step 2 — Extract the Mockup Spec

## Outcome

Every screen in `screen_map` has `{specDir}/{slug}.mockup.tsv` and `{slug}.mockup.json` on disk,
plus one `{slug}.w{width}.tsv` per responsive breakpoint — all produced by `{extractor}`, the
same code that will later extract the implementation side. Nothing in those files was read out of
the HTML source. Screens that couldn't be rendered are named, not silently dropped.

## Approach

### Dispatch one agent per screen — Workflow tool, parallel

Read `{domSpecSchema}` for what the output means, then call the **Workflow** tool with one
`agent()` per entry in `screen_map`. Each agent gets its own tab via `tabs_create_mcp` and runs
the same fixed sequence through `javascript_tool` against that `tabId`:

```
navigate  →  inject the extractor  →  __grrSpec.ready()  →  check the report
→ __grrSpec.sweep()  →  __grrSpec.extract()
→ __grrSpec.upload(server, '{slug}.mockup.tsv', __grrSpec.tsv(spec))
→ upload the JSON too   →  S5 traces  →  __grrSpec.responsive([375,768,1440])
```

Inject by fetching from the spec server and evaluating:

```js
(0, eval)(await (await fetch('http://localhost:8973/extract-dom-spec.js')).text())
```

Fall back to pasting the file's contents only if that throws on CSP. Re-inject after every
navigation and every reload, and never put a navigation and an extraction in the same call.

**The responsive pass runs inside the fan-out now.** `__grrSpec.responsive()` loads each width
into a same-origin iframe and leaves the parent window alone, so there is nothing shared to
collide over. The old rule about walking S7 sequentially existed only because `resize_window`
resized the whole window — and it doesn't work anyway: it returns success and changes nothing on
a maximized window.

Capture the baseline through an iframe at the pinned width too, not at whatever the window
happens to be. Then the mockup and the implementation are measured at literally the same
viewport, and `@doc viewport` stops showing up as a difference in every diff.

The extractor is the single source of granularity. Agents do not decide what counts as a
structural node, how to group a token, or how to name a key — the script already did. What an
agent contributes is navigation (getting to the screen via `mockup_selector_or_route`),
interaction tracing, and honest reporting of what didn't work.

Each returns: screen slug, spec paths, the `ready()` report, the `health` block, per-axis status
(`complete` / `partial: {what and why}`), and anything the contract couldn't express. **Not the
spec contents** — those went to disk on purpose.

Parallel is safe here because this phase is read-only and every agent has its own tab. Keep it a
`parallel()` fan-out rather than a pipeline: mode L's next step needs the whole mockup side
present before it starts pairing.

### The traps worth stating to every agent

- **Check `health` before believing anything.** `collapsed: true` (structural nodes under ~15% of
  visible elements) means the extractor found almost no structure — the usual cause is a
  generated mockup built entirely from inline-styled `div`s. The extractor promotes flex/grid
  items to compensate, but if it still collapses, say so and stop. Diffing a collapsed spec
  against a semantic implementation produces hundreds of phantom findings that look like a
  result.
- **Static mockups mostly don't work.** Most S5 traces will come back `none`. That is the
  expected result for a static draft, not a failure of the extraction and not a finding.
- **A mockup can hold state the screen map didn't mention** — a modal already in the DOM at
  `display:none`, a second tab panel rendered but hidden. Trace into it via S5 and record it.
  Don't file it as a separate screen without saying so.
- **Fonts that didn't load silently change every typography row.** `ready()` reports
  `fallbackFonts`; a non-empty list makes the implementation look wrong when it isn't.
- **`rafFired: false` is normal**, not a failure. An agent-driven tab is backgrounded so
  `requestAnimationFrame` never fires; the gate falls through on a timer by design.
- **Don't fix the mockup.** If it's broken (overflow at 375px, an unreachable control, a missing
  state), that's a recorded observation. Step-04 surfaces mockup defects separately.

### Verify the artifacts before moving on

Read back each written spec — the JSON header and the TSV's line count, not the whole file — and
confirm `meta.extractedBy` is present, `health.collapsed` is false, and every axis is populated
including explicit `none` / `not reached` entries. An agent that hand-wrote a spec instead of
running the extractor produces something that looks right and diffs wrong. Re-dispatch any screen
whose artifact is structurally incomplete rather than diffing against it.

### Present

```
📐 목업 스펙 추출 완료

{slug} — {tsv path}  S1 {n}노드 / 레코드 {n} / S4 {n}문구 / S5 {n}트레이스 / pseudo {n}
         health ratio {n}  뷰포트 {w}  반응형 {375/768/1440 상태}
{slug} — ...

⚠️ 구조 붕괴: {slug} — health ratio {n} (대조 불가)   (있을 때만)
⚠️ fallback 폰트: {families}                          (있을 때만)
⚠️ 프레이밍 거부로 반응형 미측정: {slug}               (있을 때만)
⚠️ 미완: {slug} — {reason}                            (있을 때만)
⚠️ 목업 자체 문제: {what}                             (있을 때만)
```

## Next

Mode `P` → load and follow `{nextStepFileP}`.
Mode `L` → load and follow `{nextStepFileL}`.

Route to exactly one. Never load both.
