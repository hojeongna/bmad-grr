---
name: step-04b-multiscreen-walkthrough
description: 'Walk every screen/tab of an existing multi-screen product live (parallel per-screen sub-agents), click into sub-views and states, aggregate into the guide, optionally capture each screen to an editable HTML base'
nextStepFile: './step-05-mobbin-research.md'
mhtmlConverter: '{mhtml_converter}'
handoffOutputPath: '{handoff_output_path}'
convertedScreensDir: '{converted_screens_dir}'
uxGuidePath: '{ux_guide_path}'
---

# Step 4b — Multi-Screen Live Walkthrough

## Outcome

Every screen/tab in the product (not just the one URL the user happened to give) has been opened live, clicked into, and described — purpose, key elements, primary/secondary actions, states, and any sub-views/modals discovered along the way, each with concrete UX/UI issues rather than generic complaints. Section 2 (Screens & Flows) of `{uxGuidePath}` is rewritten from this, and a cross-cutting issues list captures patterns that repeat across screens rather than letting each screen's findings sit in isolation. If the user wants an editable code base for later steps, each screen is also captured to `{convertedScreensDir}/{slug}.html`.

This step exists because a single `screen_capture_path` (step-04's model) doesn't fit a product with real navigation — a nav bar, a set of tabs, a sidebar of routes. Auditing the one screen the user happened to paste and calling it done misses the rest of the product entirely.

## Approach

### Enumerate the screens

Read the product's own navigation once (the nav bar, sidebar, or route list visible on the first screen) to build the actual screen list — don't assume the workflow's caller already knows it. Include screens that are only reachable conditionally (a tab that only appears for certain roles, a page reachable from a logo click rather than the main nav) if you spot them; note ones you can't reach so nothing silently gets skipped.

If `product_context_notes` from step-01 mentions role-gated or conditional screens, use that to expand the list rather than treating a missing tab as "doesn't exist."

### Dispatch one agent per screen (Workflow tool, parallel)

For each screen, an independent agent should: open its own browser tab, navigate to that screen, get it into a populated (non-empty) state if one is needed (e.g. picking a required filter/role/view-switcher value — this is normal use of the app, not a security bypass, and should be described to the sub-agent as such so it doesn't second-guess a benign precondition), then click 2–4 real interactive elements to reveal sub-views, modals, or expanded rows, screenshotting or reading structure as it goes. Have it return a structured result: purpose, key elements, primary/secondary actions, states (empty/loading/error/success — actually observed, not assumed), a list of sub-views discovered (trigger → what happened → issues), and top-level issues for the screen's landing state. Never let it invent what it didn't see.

Tell every screen's agent explicitly: **only describe what you actually did and saw. If a destructive-looking action exists (delete, deactivate, submit, approve/reject), don't click it to find out — note what it looks like it will do and move on.** A prior run of this step clicking a destructive action on one screen accidentally left permanent state changes; treat "is this reversible?" as the default assumption to make about any button before pressing it, not something to discover by pressing it.

### Test with more than one permission level if the product has any

If the product has visibly different views per role (an admin console, a confidential/restricted item, a "view as" switcher), re-check at least the screens where that matters with more than one permission level — a full-access account can make a real permission-dependent bug (a count that includes hidden items, a feature that's gated for lower roles) look like it isn't there at all. A single-permission pass is a known blind spot; don't let it stand as the final word on anything permission-sensitive.

### Synthesize

Dispatch one more agent to merge every screen's results into a single coherent Section 2 rewrite — this should read as one product's screens, not N independently-written reports stitched together. In the same pass, have it pull out **cross-cutting patterns**: the same root issue recurring across 3+ screens (one ambiguous global control doing three different jobs, one missing confirm-dialog pattern, one recurring "empty state has no call-to-action") deserves to be named once as a systemic finding, not repeated N times as N unrelated screen-level notes. Write both into `{uxGuidePath}` — the full per-screen detail in Section 2, the cross-cutting list as a short "Top Issues" addition near the top of that section.

### Optional: capture each screen to an editable HTML base

Only do this if the user wants a code-level starting point (e.g. to attach alongside the eventual handoff prompt). Prefer the same safe path as step-04's `url` branch: ask the user to Ctrl+S each screen as `.mhtml` and batch-convert with `{mhtmlConverter}` into `{convertedScreensDir}/{slug}.html` for each. If attempting a live in-browser capture instead, the same rule from step-04 applies without exception: never retry around a safety refusal, never construct a capture whose result is hidden from review — fall back to the manual per-screen save immediately if blocked.

## Next

Load and follow `{nextStepFile}`.
