---
name: step-02-mockup-spec
description: 'Render every mockup screen in a real browser and extract it into a normalized DOM spec artifact per the schema; parallel one agent per screen; route to mode P or L'
nextStepFileP: './step-03p-doc-diff.md'
nextStepFileL: './step-03l-live-diff.md'
extractor: '~/.claude/workflows/design-pass/scripts/extract-dom-spec.js'
domSpecSchema: '{dom_spec_schema}'
specDir: '{spec_dir}'
---

# Step 2 — Extract the Mockup Spec

## Outcome

Every screen in `screen_map` has a rendered-and-extracted spec artifact at `{specDir}/{slug}.mockup.json`, produced by `{extractor}` — the same code that will later extract the implementation side. Nothing in those files was read out of the HTML source; everything came from a live render. Screens that couldn't be rendered are named, not silently dropped.

## Approach

### Serve the mockups

A mockup opened over `file://` resolves relative assets and fetches inconsistently, which corrupts S3 (tokens loading late look like missing tokens) and S7 (a stylesheet that never arrived isn't a responsive finding). Serve the mockup directory over a plain local static server and render from `http://localhost:{port}/...` instead. Same discipline `design-handoff` step-07b applies to a scaffold, same reason.

### Dispatch one agent per screen — Workflow tool, parallel

Read `{domSpecSchema}` for what the output means, then call the **Workflow** tool with one `agent()` per entry in `screen_map`. Each agent gets its own tab via `tabs_create_mcp` and runs the same fixed sequence through `javascript_tool` against that `tabId`:

```
navigate → paste {extractor} → __grrSpec.ready() → __grrSpec.sweep()
→ __grrSpec.extract() → S5 traces → write {specDir}/{slug}.mockup.json
```

**S7 is deliberately not in that sequence.** `resize_window` resizes the whole window and every tab in the group shares it, so the responsive pass runs *after* the fan-out, one screen at a time. Folding it in here records each screen at whatever width some other agent last set.

Two mechanics that bite if ignored: paste the extractor's **contents** rather than adding a `<script src>` tag (`javascript_tool` is extension-injected and ignores page CSP; a page-context script tag doesn't), and remember `javascript_tool` has REPL semantics — end each call with the expression you want back, never a top-level `return`.

The extractor is the single source of granularity. Agents do not decide what counts as a structural node, how to group a token row, or how to name an anchor — the script already did. What an agent contributes is navigation (getting to the screen via `mockup_selector_or_route`), interaction tracing, and honest reporting of what didn't work.

Each returns: screen slug, spec path, the `ready()` report, per-axis status (`complete` / `partial: {what and why}`), and anything the contract couldn't express.

Re-paste after every navigation and every reload — `window.__grrSpec` does not survive a page load.

Parallel is safe here because this phase is read-only and every agent has its own tab. Keep it a `parallel()` fan-out rather than a pipeline: mode L's next step needs the whole mockup side present before it starts pairing.

### Then the responsive pass — sequential

Once the fan-out returns, walk the screens one at a time: `resize_window` to 375, re-run `ready()` → `sweep()` → `extract()`, repeat at 768 and 1440, and merge the result into that screen's `s7_responsive`. Never skip the gate after a resize — a resize retriggers media queries, re-lays out, and often refetches.

### The traps worth stating to every agent

- **Static mockups mostly don't work.** Most S5 traces will come back `none`. That is the expected result for a static draft, not a failure of the extraction and not a finding. Record it and move on.
- **A mockup can hold state the screen map didn't mention** — a modal already in the DOM at `display:none`, a second tab panel rendered but hidden. Trace into it via S5 and record it. Don't file it as a separate screen without saying so.
- **Fonts that didn't load silently change every S3 typography row.** Confirm the intended family actually resolved before recording it; if it fell back, record the fallback and flag it — a mockup rendering in a fallback font makes the implementation look wrong when it isn't.
- **Don't fix the mockup.** If it's broken (overflow at 375px, an unreachable control, a missing state), that's a recorded observation, not something to repair. The mockup is the spec even where the spec is imperfect; step-04 surfaces mockup defects separately.

### Verify the artifacts before moving on

Read back each written spec and confirm all seven axes are populated (including explicit `none` / `not reached` entries) and that `meta.extractedBy` is present — an agent that hand-wrote a spec instead of running the extractor produces something that looks right and diffs wrong. An under-filled spec silently makes the implementation side look like it added things. Re-dispatch any screen whose artifact is structurally incomplete rather than diffing against it.

### Present

```
📐 목업 스펙 추출 완료

{slug} — {spec path}  S1 {n}노드 / S2 {n}종 / S4 {n}문구 / S5 {n}트레이스
{slug} — ...

⚠️ fallback 폰트: {families}   (있을 때만 — S3 비교 신뢰도에 직결)
⚠️ 미완: {slug} — {reason}      (있을 때만)
⚠️ 목업 자체 문제: {what}        (있을 때만)
```

## Next

Mode `P` → load and follow `{nextStepFileP}`.
Mode `L` → load and follow `{nextStepFileL}`.

Route to exactly one. Never load both.
