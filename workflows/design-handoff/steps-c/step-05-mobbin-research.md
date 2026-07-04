---
name: step-05-mobbin-research
description: 'Research relevant reference patterns via Mobbin MCP for the actual screens at hand, present a curated (not flooded) selection, get user confirmation, append to the UX/UI Guide document'
nextStepFile: './step-06-compose-prompt.md'
uxGuidePath: '{ux_guide_path}'
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

Store as `mobbin_references`: `{ screen, pattern_description, source, why }[]`.

### Append to the UX/UI Guide document

Fill Section 5 (Mobbin References) of `{uxGuidePath}` with the confirmed list (or its "none selected" placeholder if skipped). Update the frontmatter `updated: {date}`.

## Next

Load and follow `{nextStepFile}`.
