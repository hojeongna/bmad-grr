---
name: step-04-brownfield-prep
description: 'Normalize the existing screen capture into a usable HTML base — convert mhtml via the bundled script, pass html through, note image/url fallbacks'
nextStepFile: './step-05-mobbin-research.md'
mhtmlConverter: '{mhtml_converter}'
handoffOutputPath: '{handoff_output_path}'
---

# Step 4 — Brownfield Prep

## Outcome

`screen_capture_path` has been normalized into whichever of `converted_html_path` or `reference_image_path` actually applies, so step-06 has a concrete existing-screen artifact to hand to Claude Design rather than just a file reference.

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

### Skim the result

If `converted_html_path` exists, skim its structure (major sections, nav, repeated components) — just enough to describe "what exists today" in one or two sentences for step-06. This is not a UX audit; that judgment happens once Mobbin + the design-system context are loaded.

## Next

Load and follow `{nextStepFile}`.
