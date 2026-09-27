---
title: 'Browser Operating Facts'
type: 'capture-discipline'
purpose: 'The claude-in-chrome facts both extraction sides depend on — the one place they are written down'
---

# Browser Operating Facts (claude-in-chrome)

Both sides — mockup and live — run on claude-in-chrome, which drives the user's real Chrome and so reaches an authenticated app without anyone handling credentials. Getting any of these wrong produces a spec that looks fine and diffs wrong:

1. **Load the tools via ToolSearch** (`tabs_context_mcp`, `tabs_create_mcp`, `navigate`, `javascript_tool`, `read_console_messages`). Call `tabs_context_mcp` once before anything else, then `tabs_create_mcp` per screen. Never reuse a tab id from a previous session.
2. **Inject the extractor by fetching it from the spec server and evaluating it:**
   `(0, eval)(await (await fetch('http://localhost:{port}/extract-dom-spec.js')).text())`.
   Works from an https production origin — Chrome exempts localhost from mixed-content blocking and the server sends permissive CORS. If a target's CSP omits `unsafe-eval`, that line throws; paste the file's contents instead, which page CSP does not apply to. Never add a `<script src>` tag — one created from page context *does* get blocked.
3. **`javascript_tool` has REPL semantics** — the last expression is the return value and a top-level `return` is a syntax error. Top-level `await` works.
4. **Never combine a navigation or reload with extraction in one call** (`live-capture-protocol.md` §1). Navigate, then inject, then extract, as separate calls.
5. **Parallel screens are fine, including the responsive pass.** Every tool takes a `tabId`, and `responsive()` never touches the shared window (`live-capture-protocol.md` §8).
6. **Screenshots are the one focus-bound operation.** Extraction is all JS and needs no focus. Take evidence screenshots serially at the end, not mid-fan-out.
7. **Tab ids die mid-run.** The whole MCP tab group disappears when the user closes the window or Chrome restarts, and every in-flight agent then fails with `Couldn't determine which page this action targets`. Paste this recovery rule into every dispatched agent's prompt:

   > On "Couldn't determine which page this action targets": call `tabs_context_mcp` again, find the tab whose URL matches your target (or `tabs_create_mcp` and navigate), re-inject the extractor, and resume from your last completed step.

   Agents that carry this instruction recover; agents that don't, die.
