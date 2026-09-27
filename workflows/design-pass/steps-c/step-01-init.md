---
name: step-01-init
description: 'Locate the mockup (design-handoff output first, then ask), decide mode P (vs story doc) or L (vs live screen), map mockup screens to targets, pick the browser MCP'
nextStepFile: './step-02-mockup-spec.md'
autoDraftDir: '{auto_draft_dir}'
convertedScreensDir: '{converted_screens_dir}'
redesignSpecGlob: '{redesign_spec_glob}'
designHandoffCommand: '~/.claude/commands/bmad-grr-design-handoff.md'
browserFacts: '{browser_facts}'
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

`design-handoff` output is not guaranteed to expose the structure this workflow pairs on. Render each mockup and count, before deciding anything else:

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

Read `{browserFacts}` and follow it: load the claude-in-chrome tools via ToolSearch, call `tabs_context_mcp` first, then `tabs_create_mcp` per screen. Viewport work goes through `__grrSpec.responsive()` (live-capture-protocol §8), never `resize_window`. Carry its tab-recovery rule verbatim into every agent prompt later steps dispatch.

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
