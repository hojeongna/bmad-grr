---
name: step-04-brownfield-prep
description: 'Normalize the existing screen capture into a usable HTML base — convert mhtml via the bundled script, pass html through, note image/url fallbacks. Hands off to step-04b entirely when capture_scope is "site".'
nextStepFile: './step-05-mobbin-research.md'
nextStepMultiscreen: './step-04b-multiscreen-walkthrough.md'
mhtmlConverter: '{mhtml_converter}'
handoffOutputPath: '{handoff_output_path}'
---

# Step 4 — Brownfield Prep

## Outcome

`screen_capture_path` has been normalized into whichever of `converted_html_path` or `reference_image_path` actually applies, so step-06 has a concrete existing-screen artifact to hand to Claude Design rather than just a file reference.

## Scope check first

This step (and everything below) assumes exactly one screen. If `capture_scope == 'site'` from step-01, don't try to force a multi-tab product through the single-file branches below — load and follow `{nextStepMultiscreen}` instead and skip the rest of this file entirely. A single-screen capture and a whole-site walkthrough are different enough jobs that bending one into the other produces worse output than just routing to the step built for it.

## Approach

### `.mhtml` → convert

Run:

```
uv run {mhtmlConverter} --input "{screen_capture_path}" --output "{handoffOutputPath}/converted/{slug}.html"
```

Parse the JSON result. On success, set `converted_html_path` to the `output` path and note `assetsInlined`/`warnings` briefly to the user. On `{"error": ...}`, tell the user plainly what failed and offer to accept an `.html` export or a screenshot instead — don't retry blindly.

### `.html` → pass through

Copy `screen_capture_path` to `{handoffOutputPath}/converted/{slug}.html` unchanged and set `converted_html_path` to that path. No conversion needed.

### `image` → keep as reference only

Set `reference_image_path` to `screen_capture_path`, `converted_html_path` to none. This screen has no HTML base to revise from — the handoff prompt will describe it as a visual reference rather than an editable starting point.

### `url` → best-effort screenshot, else describe only

If a browser tool is available in this session, navigate to the URL and capture a screenshot for `reference_image_path`. If not, just carry the URL forward as context text — don't block waiting for tooling that may not be there.

If a real editable HTML base (not just a screenshot) would genuinely help — e.g. the user explicitly wants it, or step-06 will need something to attach — a live capture via the browser tool's JS execution is fine to attempt (select any obviously-required state like a role/view switcher, capture `document.documentElement.outerHTML`, save to `{handoffOutputPath}/converted/{slug}.html`). **If that capture attempt is blocked by a safety refusal (e.g. content flagged as looking like cookies/tokens, or a classifier declining to return the result), stop there — do not retry with base64, chunking, alternate encodings, or any other route around the block, and do not construct the capture so its own output is hidden from review.** That combination (route around a stated block + hide the result from inspection) is indistinguishable from data exfiltration regardless of intent, and a fresh agent asked to do it has no way to tell the difference either — expect it to (correctly) refuse. Fall back immediately and plainly: ask the user to save the page themselves (Ctrl+S → "웹페이지, 단일 파일" → `.mhtml`) and hand the file(s) back for the `.mhtml` branch above. This is not a downgrade — it's the intended path per step-01's own capture instructions, and it's the only one that keeps the captured content visibly reviewable the whole way through.

### Skim the result

If `converted_html_path` exists, skim its structure (major sections, nav, repeated components) — just enough to describe "what exists today" in one or two sentences for step-06. This is not a UX audit; that judgment happens once Mobbin + the design-system context are loaded.

## Next

Load and follow `{nextStepFile}`.
