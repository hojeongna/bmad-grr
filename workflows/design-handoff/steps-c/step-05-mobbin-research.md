---
name: step-05-mobbin-research
description: 'Research relevant reference patterns via Mobbin MCP for the actual screens at hand, present a curated (not flooded) selection, get user confirmation, download every confirmed reference image locally, append to the UX/UI Guide document'
nextStepFile: './step-06-compose-prompt.md'
nextStepPrescribe: './step-05b-reference-reaudit-and-prescribe.md'
uxGuidePath: '{ux_guide_path}'
referenceImagesDir: '{reference_images_dir}'
referenceImagesAsideDir: '{reference_images_aside_dir}'
---

# Step 5 — Mobbin Reference Research

## Outcome

Mobbin MCP has been used to find reference patterns for the specific screens/flows this handoff covers (not generic inspiration), the user has confirmed which references to carry forward, and the result is stored as `mobbin_references` (possibly empty, if genuinely skipped).

## Approach

### Confirm Mobbin MCP is available

Mobbin MCP tool names weren't verified against a live connection when this workflow was authored — use ToolSearch with a query like `"mobbin"` to discover its actual tools before calling anything. If nothing turns up, halt and tell the user plainly that Mobbin MCP needs to be connected for this step — don't silently skip reference research; that's a different, worse workflow than the one being run.

### Decide what to search for

Pull the screen/flow list from `{prd_or_story_path}` (Branch A/B, from step-02's read) or from the brownfield skim (step-04, when there's no PRD). Infer platform (mobile/web) and product category if the PRD or existing screen makes it obvious. Batch similar screen types together — one search for "list/table view" covers every CRUD-list screen in the PRD; don't fire one search per screen mechanically.

### Search and curate

For each search target, pull a small number of genuinely relevant references — not a flood. For every reference kept, write one line tying it to a specific PRD location, `ux_gaps` entry, or `user_concern` — never "screen mentions X → here's an X pattern" with no reasoning.

### Present and confirm

```
🔎 Mobbin 레퍼런스 ({n}개)

- {screen/flow} — {pattern description}, 참고: {source app/reference}
  이유: {reasoning tied to PRD location / gap / concern}
- ...

[Y] 진행   [M] 일부 조정   [+] 더 찾아줘   [S] 이번엔 스킵 (레퍼런스 없이 진행)
```

Halt for input. `M`/`+` re-search and re-present. `S` proceeds with `mobbin_references = []`, noted plainly so step-06 knows to lean on the design system and general UX judgment instead. `Y` proceeds with the confirmed set.

Store as `mobbin_references`: `{ screen, pattern_description, source, why, mobbin_url, local_path }[]`.

### Download every confirmed reference image, now

Each search result carries an `image_url` alongside its `mobbin_url`. That URL redirects to a CDN link carrying a signed `enc=` token — treat it as short-lived. A reference confirmed here gets cited in the guide, re-checked in step-05b, rendered into the prompt, and embedded in a stakeholder report that may be generated days later; none of that should depend on a signed URL still resolving. Pull the bytes once, at the moment the user says yes.

Everything lands in `{referenceImagesAsideDir}` first. That folder is named `_do-not-attach` because its contents are exactly that — background material for reading and citing, never for pasting into a generator. Only images that earn it get promoted up into `{referenceImagesDir}` later, in step-05b, once prescriptions exist and it's actually knowable which reference a builder needs to *see* rather than read about.

Defaulting the other way — attach unless demoted — is how a paste ends up carrying a dozen screenshots, of which two mattered and ten pulled the generator toward whatever they happened to have in common. Under-attaching costs one follow-up message; over-attaching quietly steers the whole output.

For each confirmed reference:

```bash
mkdir -p {reference_images_aside_dir}
curl -sL "{image_url}" -o "{reference_images_aside_dir}/{screen-slug}-{app_name}.webp"
```

`-L` is required — the short URL is a redirect, and without it you save the redirect body instead of the image. Slugify `app_name` (lowercase, ASCII, hyphens); on collision append `-2`, `-3`. Record the resulting path as `local_path` on the reference.

Verify each file is actually an image before moving on — a redirect that failed still writes a 200-byte HTML body with a `.webp` name, and that failure is invisible until a report renders a broken image weeks later. Check the size is plausible (a real screen capture runs tens of KB) and that the file starts with `RIFF`. Anything that fails: report it as a named miss on that reference, keep `mobbin_url` so the reference is still usable by hand, and leave `local_path` empty rather than pointing at a corrupt file.

Tell the user where they landed — these are real files they can open, not just workflow plumbing.

### Append to the UX/UI Guide document

Fill Section 5 (Mobbin References) of `{uxGuidePath}` with the confirmed list, each entry carrying both its `mobbin_url` and its `local_path` (or its "none selected" placeholder if skipped). Update the frontmatter `updated: {date}`.

## Next

If `mobbin_references` is non-empty and there are findings to prescribe against (any `ux_gaps`, brownfield screen issues from step-04/04b, or `user_concern` items) — which is the common case, especially in brownfield/improvement-only mode — load and follow `{nextStepPrescribe}`. A confirmed reference that never gets re-checked against the live screen or turned into a concrete fix is a citation, not a spec; step-05b is what turns "here's a similar pattern" into "here's exactly what to build."

Skip straight to `{nextStepFile}` only when `mobbin_references` is empty (the `S` skip above) or this is a from-scratch greenfield PRD with no existing screen to re-audit against — there's nothing live to re-verify findings on yet.
