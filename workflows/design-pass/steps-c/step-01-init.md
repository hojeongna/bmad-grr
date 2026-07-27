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

### Set up the browser — claude-in-chrome

This workflow runs on **claude-in-chrome** for both sides. It drives the user's real Chrome, which is what makes an authenticated app reachable without anyone handling credentials. Load the tools via ToolSearch before calling anything:

```
ToolSearch "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__resize_window,mcp__claude-in-chrome__read_console_messages"
```

Call `tabs_context_mcp` once before anything else — the other tools need a valid tab id and the group has to exist. Then `tabs_create_mcp` per screen; never reuse a tab id from a previous session.

Four operating facts this workflow depends on. Getting any of them wrong produces a spec that looks fine and diffs wrong:

1. **Inject the extractor by pasting its contents, not with a `<script src>` tag.** `javascript_tool` runs extension-injected script, which the page's CSP does not block; a script tag added from page context does get blocked on any app with a strict `script-src`. Paste the file.
2. **`javascript_tool` has REPL semantics** — the last expression is the return value and a top-level `return` is a syntax error. Top-level `await` works. The extractor file is an IIFE, so pasting it whole returns its own result object; subsequent calls should end in the expression you want back (`await window.__grrSpec.extract({...})`).
3. **Parallel screens are fine; parallel resizing is not.** Every tool takes a `tabId`, so per-screen agents don't collide during extraction or tracing. But `resize_window` resizes the *window*, and tabs created by `tabs_create_mcp` share one — so the S7 responsive pass must run **sequentially across screens**, not inside the parallel fan-out. Do S1–S6 in parallel, then walk S7 one screen at a time.
4. **Screenshots are the one focus-bound operation.** Extraction is all JS and needs no focus. If evidence screenshots are wanted, take them serially at the end rather than mid-fan-out.

Ask about auth once, up front: does the target URL require login? If yes, tell the user they need to be signed in already in that Chrome profile — browser automation must not attempt credentials.

For mode `L`, confirm the server is running: `[R]` already running / `[S]` give me the start command / `[U]` I'll start it, wait for me. Halt until the URL actually loads.

### Confirm and route

Echo mode, screen map, tab ids created, and where specs will be written (`{spec_dir}`). Then load and follow `{nextStepFile}`.
