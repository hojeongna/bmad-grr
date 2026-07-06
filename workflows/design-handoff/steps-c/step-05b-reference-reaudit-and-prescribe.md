---
name: step-05b-reference-reaudit-and-prescribe
description: 'Re-verify every finding live against its confirmed Mobbin reference (keep/revise/delete/add), judge whether each screen is even using the right layout paradigm, then rewrite every surviving finding as a concrete buildable prescription. Produces the redesign spec that step-06 renders from.'
nextStepFile: './step-06-compose-prompt.md'
redesignSpecTemplate: '{redesign_spec_template}'
redesignSpecPath: '{redesign_spec_path}'
uxGuidePath: '{ux_guide_path}'
---

# Step 5b — Reference Re-Audit & Prescriptive Rewrite

## Outcome

Two things have happened, in order. First, every existing finding has been re-verified **live**, screen by screen, against the specific reference(s) confirmed for that screen — not re-asserted from memory, actually re-opened and re-checked. Findings that don't hold up are dropped (with the reason recorded), findings that were directionally right but wrong in detail are corrected, and anything the reference standard exposes that wasn't caught the first time is added. Second, every surviving finding is rewritten from a diagnosis ("this is awkward") into a prescription: current pattern → a *named* recommended pattern → the reference backing it → a spec detailed enough to build without asking a follow-up question. The result is `{redesignSpecPath}`, which step-06 renders the handoff prompt from whenever it exists — it supersedes a flat "here are some references" list because it's the difference between citing good design and specifying it.

Skipping this step and going straight to step-06 from a raw findings list is the single biggest reason a downstream builder (an external tool or your own hand editing code) ends up guessing — "make this feel more modern" gives nothing to disagree with or build against. This step exists to remove the guessing.

## Approach

### Phase 1 — Live re-audit (adversarial correction pass)

For each screen that has findings, dispatch an agent (via the Workflow tool, one per screen, in parallel) that:

1. Takes that screen's confirmed reference(s) as the standard to measure against — not a vague "does this look nice" judgment, the actual pattern the reference demonstrates.
2. Re-opens the **live** screen (not the earlier written description of it) and re-checks each existing finding one at a time: **keep** (reproduces exactly as stated), **revise** (real, but the detail was wrong — replace it with what's actually observed now), **delete** (doesn't reproduce — state plainly why, e.g. "measured contrast is 6.6:1, passes AA" or "re-tested and the toggle does update the count"), or **add** (a new issue visible specifically because the reference standard makes it obvious, that the first pass missed).
3. If the product has role-gated or permission-dependent views (per `product_context_notes` or what's visible in nav), re-test with more than one permission level before deleting anything permission-shaped — a finding that looks false under a full-access account can be entirely real under a restricted one. Treat single-permission testing as a known blind spot, not a clean bill of health.
4. Rewrites its evidence, not just its verdict — every surviving or added finding needs an "observed" field describing exactly what was seen this time, and a "reference_gap" field naming precisely how the live screen differs from what the reference demonstrates.

### Surface deletions before finalizing

Findings marked for deletion get one batch presentation before they're actually dropped — a finding the agent couldn't reproduce might still be something the user has first-hand knowledge of (they use this screen daily; a sub-agent clicking through it once doesn't). Present:

```
🔍 재검증 결과 — 오탐으로 판단된 항목

- {finding} — 이유: {why it didn't reproduce}
- ...

[Y] 이대로 삭제   [R] {n}번은 다시 살려주세요 (제가 확인한 사실: ...)
```

Halt for input. Honor any `R` corrections by restoring the finding with the user's stated reason attached — don't re-litigate it a third time. This exact scenario happened in a prior run: a permission-dependent count mismatch and an ambiguous static-label finding were both wrongly deleted because the re-audit only tested with a full-permission account; the user's own daily use caught what the agent's single-pass testing missed.

### Phase 2 — Judge the layout paradigm before prescribing anything

For each screen, before writing any individual prescription, make one explicit call: **is this screen using the right kind of container for what it actually does?** A table is the right tool for dense side-by-side comparison or bulk data entry; it's the wrong tool for "browse a list, click into one, read detail" (that wants a list/card + detail-drawer instead), and it's often present anyway simply because the underlying data started life in a spreadsheet. Name the verdict explicitly — `table_overused: yes/no` plus the reasoning — and let it drive the rest of that screen's prescriptions. Getting this call right up front (spotting an "excel-port" problem, if the product has one) is what separates a genuinely useful redesign spec from a coat of paint on the wrong structure; getting it wrong wastes every prescription written under it.

Search Mobbin for what a well-made version of *this kind of screen* actually uses as its layout, don't assume — look at the images, not just metadata, before deciding a table should become cards/list+drawer or should stay a table with the density problem fixed instead (tighter columns, read/edit view split, hidden-until-relevant fields).

### Phase 3 — Rewrite every surviving finding as a prescription

For each finding, in this exact shape:

- **Current pattern** — what's actually there right now, specific enough that someone unfamiliar with the screen could find it (an element, a location, an observed behavior — not "the filter is confusing").
- **Recommended pattern** — a *name* for what it should become (e.g. "요약 리스트 로우 + 우측 상세 드로어", "상태 멀티셀렉 드롭다운", "확인 모달 + 사후 undo 토스트"), not a description of the problem restated positively.
- **Reference** — the actual Mobbin screen backing this specific recommendation, found via `search_screens` and looked at (not guessed at from the app's reputation). Cite its `mobbin_url`.
- **Concrete spec** — layout, fields, triggers, states, and interactions detailed enough to build without a follow-up question. If the recommendation implies a component (a modal, a drawer, a multiselect), spec its structure, not just its existence.

### Fold in the user's own findings at equal weight

If the user reports issues from their own direct use of the product — and they often will, because they know the product's actual behavior better than a single click-through — put those through the exact same Mobbin-search-and-prescribe treatment as agent-discovered findings, not a lighter or separate pass. Keep their origin visible in the write-up (a short "사용자 직접 조사 반영" marker per screen is enough) so it's clear which findings came from hands-on use versus a walkthrough, but don't treat them as second-class input requiring less rigor — if anything, a user-reported issue that seemed initially odd (a button that silently duplicates data on repeated clicks, a default value nobody explained) is worth *more* scrutiny, because it's coming from someone who's felt the actual cost of it.

Where a user's finding surfaces a genuine open decision the workflow can't resolve on its own (a business rule, a calculation formula, a content/copy choice, a policy about what's allowed) — record it as an open question with a reasonable default rather than inventing an answer or leaving it unspecified. Collect these across all screens into one short list at the end of the spec so the user can resolve them in one pass instead of hunting through prose.

### Cross-cutting patterns

Once every screen's prescriptions exist, scan for the same recommended pattern recurring on 3+ screens (a shared "how to add an item" pattern, a shared "how confirmation dialogs work" pattern, a shared empty-state treatment). Write each of these **once**, fully specified, in a dedicated section, and have every screen section reference it by name instead of repeating the full spec — this keeps the document navigable instead of turning into a wall of near-duplicate text, and it's usually where the actual product-wide direction (not just per-screen polish) lives.

### Render the redesign spec

Fill `{redesignSpecPath}` from `{redesignSpecTemplate}`: global direction (including the layout-paradigm verdicts, summarized), cross-cutting patterns, then per-screen sections (layout paradigm call + prescriptions high-to-low priority), then the open-questions list. Tell the user where it landed.

## Next

Load and follow `{nextStepFile}`.
