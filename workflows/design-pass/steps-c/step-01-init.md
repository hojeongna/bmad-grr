---
name: step-01-init
description: 'Locate the mockup (design-handoff output first, then ask), decide mode P (vs story doc) or L (vs live screen), map mockup screens to targets, pick the browser MCP'
nextStepFile: './step-02-mockup-spec.md'
autoDraftDir: '{auto_draft_dir}'
convertedScreensDir: '{converted_screens_dir}'
redesignSpecGlob: '{redesign_spec_glob}'
designHandoffCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-handoff.md'
---

# Step 1 — Init / Mode Decision

## Outcome

The mockup file(s) are located and confirmed to exist, the mode is decided (`P` story-document comparison / `L` live-screen comparison), every mockup screen is mapped to what it will be compared against, and the browser MCP is chosen. Nothing proceeds on a mockup path that was assumed rather than verified.

## Approach

### Find the mockup before asking for it

Check design-handoff's own output locations first — the common case is that a handoff run just finished and its files are already on disk:

1. `{autoDraftDir}/*.html` — the `[A]` automated Claude Design path saved these itself.
2. `{convertedScreensDir}/*.html` — brownfield screens converted from `.mhtml`.
3. `{redesignSpecGlob}` — if a redesign spec exists, read it for the screen list and any file paths it names.

Show what was found and let the user confirm or override. Only ask for paths outright when nothing turned up. Parse `$ARGUMENTS` first if it's non-empty — a `.html` path, a URL, or a story key there short-circuits the corresponding question.

If no mockup exists anywhere and the user doesn't have one, this workflow has no spec to check against. Say so plainly and offer `{designHandoffCommand}` to produce one — don't fall back to auditing the screen on general design principles, that's a different job this workflow deliberately doesn't do anymore.

Read every mockup file that will be used. Confirm it's real markup and not a bundled/exported wrapper; if it's packaged (a `manifest`/`template` script-tag pair, minified loader code), note where the real markup lives — extraction still renders the file, but the fix targets in later steps need the editable source.

### Check the mockup can be compared at all

`design-handoff` output is not guaranteed to expose the structure this workflow pairs on. One
measured mockup had **zero `<table>` elements, zero `role=columnheader`, and no `main` landmark**,
and the extractor's key matching found **22 common keys out of 375** against the implementation.
The comparison was not weak; it was invalid.

Render each mockup and count, before deciding anything else:

| Signal | Why it matters |
|---|---|
| landmarks (`main`, `nav`, `header`, `section[aria-label]`) | anchors are scoped to them |
| semantic containers for the screen's repeating unit (`table`/`ul`/`[role=list]`) | the anchor type itself |
| `role` attributes and accessible names on controls | Tier-A key matching runs on these |
| `health.collapsed` from a quick `extract()` | structure found at all |

If a screen has none of them, present the branch rather than proceeding:

```
⚠️ 목업에 대조 가능한 구조가 없습니다 — {slug}
   랜드마크 {n} · 시맨틱 컨테이너 {n} · role 부여 요소 {n} · health ratio {n}

[A] 수동 앵커로 계속 (step-03a 에서 사람이 짝짓기 확인)
[H] design-handoff 로 되돌려 구조부터 고침
[S] 이 화면 제외
```

`[H]` loads `{designHandoffCommand}`. Record the choice; it goes in the report, because a screen
compared through manual anchors carries different confidence than one that matched automatically.

### Decide the mode

Ask once, in `{communication_language}`:

```
🎯 Design Pass — 목업 대비 검증

목업: {found mockup files}

[P] 아직 개발 전 — 스토리 문서가 목업을 다 담고 있는지 확인
    → 스토리 key 또는 경로
[L] 이미 개발됨 — 실행 화면이 목업대로 나왔는지 1:1 대조
    → 실행 URL
```

Halt for input. A story key/path → `P`. A URL → `L`. Explicit `[P]`/`[L]` → that mode. If both a story ref and a URL are supplied, that's `L` — a running screen supersedes the document, and step-03l reads the story anyway for context.

Don't guess on ambiguity; ask once more.

### Map screens to targets

A mockup rarely maps 1:1 onto one target. Resolve this now, not mid-extraction:

- **One file, one screen** — trivial, map it.
- **One file, multiple screens** (tabs, routes, or stacked sections in a single artifact) — identify each screen and what selects it (a tab click, a hash route, scroll position). Each becomes its own extraction unit.
- **Multiple files** — one screen each unless a file obviously holds several.

For mode `L`, ask which app route corresponds to each mockup screen. Guessing this wrong produces a diff of two unrelated pages that looks catastrophic and means nothing. If the user isn't sure for some screen, mark it unmapped and skip it rather than pairing it speculatively — say which ones were skipped.

Store as `screen_map`: `[{ slug, mockup_path, mockup_selector_or_route, target_route (L only) }]`.

### Start the spec server

One process serves the mockups and receives the extracted specs:

```
python {installed_path}/scripts/spec-server.py --serve {mockup dir} --out {spec_dir} --port 8973
```

Both jobs matter. Serving over `http://` rather than `file://` keeps relative assets and fetches
resolving, which `file://` does inconsistently — a stylesheet that never arrived is not a
responsive finding. And the POST endpoint is what keeps half a megabyte of records out of the
agent's context: pages upload their own specs straight to disk, and `diff` does the comparison.

Confirm it responds before going further. If the port is taken, pick another and carry it
through every later step.

### Set up the browser — claude-in-chrome

This workflow runs on **claude-in-chrome** for both sides. It drives the user's real Chrome, which is what makes an authenticated app reachable without anyone handling credentials. Load the tools via ToolSearch before calling anything:

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__read_console_messages"
```

Call `tabs_context_mcp` once before anything else — the other tools need a valid tab id and the group has to exist. Then `tabs_create_mcp` per screen; never reuse a tab id from a previous session.

`resize_window` is deliberately not in that list. It reports success and changes nothing when the
window is maximized — verified twice, at 1024×800 and 700×600, with `innerWidth` staying at 1920
both times. Viewport work goes through `__grrSpec.responsive()`, which uses same-origin iframes.

Operating facts this workflow depends on. Getting any of them wrong produces a spec that looks fine and diffs wrong:

1. **Inject the extractor by fetching it from the spec server and evaluating it:**
   `(0, eval)(await (await fetch('http://localhost:8973/extract-dom-spec.js')).text())`.
   Verified working from an https production origin — Chrome exempts localhost from
   mixed-content blocking and the server sends permissive CORS. If a target's CSP omits
   `unsafe-eval` that line throws; then paste the file's contents instead, which page CSP does
   not apply to. Never add a `<script src>` tag — one created from page context *does* get
   blocked.
2. **`javascript_tool` has REPL semantics** — the last expression is the return value and a top-level `return` is a syntax error. Top-level `await` works.
3. **Never combine a navigation or reload with extraction in one call.** The evaluation context
   dies mid-call and the tool returns "Inspected target navigated or closed". Navigate, then
   inject, then extract, as separate calls.
4. **Parallel screens are fine, including the responsive pass.** Every tool takes a `tabId` and
   `responsive()` never touches the shared window, so per-screen agents don't collide anywhere.
5. **Screenshots are the one focus-bound operation.** Extraction is all JS and needs no focus. If evidence screenshots are wanted, take them serially at the end rather than mid-fan-out.
6. **Tab ids die mid-run.** The whole MCP tab group disappears when the user closes the window or
   Chrome restarts, and every in-flight agent then fails with `Couldn't determine which page this
   action targets`. **Pass this recovery rule into every dispatched agent's prompt:** on that
   error, call `tabs_context_mcp` again, find the tab whose URL matches the target (or
   `tabs_create_mcp` and navigate), re-inject the extractor, and resume from the last completed
   step. Agents that carry this instruction recover; agents that don't, die.

Ask about auth once, up front: does the target URL require login? If yes, tell the user they need to be signed in already in that Chrome profile — browser automation must not attempt credentials.

For mode `L`, confirm the server is running: `[R]` already running / `[S]` give me the start command / `[U]` I'll start it, wait for me. Halt until the URL actually loads.

### Pin the capture conditions — the two that have already gone wrong

A route is not a screen, and a screen is not a screen at an arbitrary viewport. Settle both here.

**App view state.** Apps persist a table/card toggle, a density step, a collapsed sidebar, a
saved filter — in `localStorage`, surviving reloads and new tabs. For each mapped screen, read
the toggles (`[role=radio]` / `[role=tab]` / `aria-checked` / `aria-selected`, plus any
view-shaped `localStorage` key), state which state the mockup depicts, and set the app to it
through its own controls. Record the asserted state; it goes into every spec's meta and gets
re-asserted inside each responsive iframe.

This is the difference between a report and a fiction: a table-view mockup diffed against a route
sitting in card view produces a screen-sized wall of phantom gaps, and nothing in the output says
that's what happened.

**Baseline viewport.** Both sides get captured through an iframe at the same fixed width (1440
unless the mockup says otherwise), so the viewport is identical by construction rather than by
luck. Any user-adjustable density or font-size step is set to the product default first — a
capture taken at step 2/5 turned a 1px typography difference into 2px.

### Confirm and route

Echo mode, screen map, tab ids created, spec-server port, asserted view state per screen, baseline viewport, and where specs will be written (`{spec_dir}`). Then load and follow `{nextStepFile}`.
