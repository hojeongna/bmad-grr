---
name: step-06b-stakeholder-report
description: 'On-demand, plain-language HTML report for a non-technical stakeholder (exec, PM, client) — tables instead of prose prescriptions, Mobbin reference images embedded directly, no dev/tool boilerplate. Independent of the D/C/S delivery-path choice; callable any time the guide or redesign spec exists.'
redesignSpecPath: '{redesign_spec_path}'
uxGuidePath: '{ux_guide_path}'
handoffOutputPath: '{handoff_output_path}'
referenceImagesDir: '{reference_images_dir}'
referenceImagesAsideDir: '{reference_images_aside_dir}'
---

# Step 6b — Stakeholder Report (on demand)

## Outcome

One self-contained HTML file exists, written for a reader who will never open a code editor: tables instead of prescription prose, Mobbin reference images embedded directly (not linked out to), plain language throughout, and none of the tool-setup boilerplate (Claude Design paste instructions, design-token documentation) that means nothing to that audience. It opens standalone, with no server and no internet connection required.

This is not part of the default linear flow — it only runs when the user actually asks for it ("보고용으로", "대표님 보고", "정리해서 공유할 문서"), and it can be regenerated any time after `{redesignSpecPath}` or `{uxGuidePath}` exists, independent of whether the Claude Design / direct-implementation path has run yet.

## Approach

### Confirm the cut, once

If it's not already obvious who this is for, ask briefly: who reads this, and does anything need to stay in that a default cut would drop? Default cut: remove the Claude Design tool-setup section and the design-system/token documentation entirely (meaningless to this reader); keep the global direction, the per-screen findings, and any structural (not just cosmetic) proposal at full weight.

### Reformat prescriptions into table rows

For every screen, one row per prescription: 대상 (element) | 지금 (current, in plain language — no selectors, no aria, no px values) | 권장 개선 (recommended pattern, one line) | 참고 레퍼런스 (image). Collapse the build-detail spec text down to whatever a stakeholder needs to trust the recommendation — usually one clause, not the full buildable spec (that stays in the redesign spec for whoever actually builds it).

### Embed reference images directly — don't link out

For every reference cited, resolve it to an actual image and inline it:

1. Use the `local_path` the reference already carries — step-05/05b downloaded these when they were confirmed. Read the file from disk. Only fall back to a fresh `search_screens` when a reference has no `local_path` (its download failed, or the spec predates this behavior); Mobbin's `image_url` redirects to a signed CDN link, so re-fetching an old one is the case most likely to come back empty.
   **Read from both `{referenceImagesDir}` and `{referenceImagesAsideDir}`.** The `_do-not-attach` split exists to keep a generator's prompt from being diluted; it says nothing about this document. A stakeholder report illustrates every prescription it lists, and a row whose reference image was withheld because of a rule about prompt attachments is just a row with a hole in it.
2. Base64-encode the file directly into the HTML (`data:image/webp;base64,...`) — a report the reader has to click out of repeatedly to see what's being proposed reads as unfinished, and an offline-first document is worth more to a stakeholder who might read it on a plane or forward it around than one with live external links.
3. Add a click-to-enlarge lightbox for these images (a fixed-position overlay toggled by a small inline `<script>`, no external libraries) — a page full of tiny thumbnails is not actually more scannable than one clean central image, and a stakeholder document is exactly the place where polish on the deliverable itself matters.

### Lead with the direction, not the detail

Open with a short, plain-language statement of the biggest structural finding (if step-05b's global-direction paragraph named one) before the per-screen tables — a reader who stops after the first paragraph should still walk away with the one thing that matters most. If the audit surfaced an information-architecture-level proposal (e.g. "these N screens can become one") rather than a purely visual one, give it its own highlighted section, separate from the cosmetic tables — it's a different kind of claim (structural, not visual) and a stakeholder should be able to weigh it on its own terms rather than have it buried among paint-level fixes.

### Compose, save, deliver

Build one self-contained HTML file (inline CSS, inline `<script>`, no external requests of any kind so it survives being emailed or copied to a USB stick) and write it to `{handoffOutputPath}/{product_name}-개선보고-{date}.html` (or the equivalent in `{document_output_language}`). Hand the file to the user directly — a report is the deliverable itself, not something to describe and point at a path for.

### Iterate on request

If the user asks for something to be added, cut, or reframed after seeing it (a missing information-architecture proposal, a table that reads too dense, an image that needs re-picking), treat it the same as any other direct feedback — edit the same file and redeliver rather than starting a new one, unless the user is clearly asking for a distinct second document.

## Next

None prescribed — this is a standalone, callable-anytime deliverable. Return to whichever step invoked it (or, if invoked directly by the user mid-conversation, just resume whatever was happening before).
