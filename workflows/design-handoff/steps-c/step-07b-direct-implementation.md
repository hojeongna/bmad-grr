---
name: step-07b-direct-implementation
description: 'No Claude Design round-trip — the user already has (or is building) their own code scaffold. Phase 1 (parallel, read-only): audit every screen against its prescriptions at once via one Workflow sub-agent per screen, each with its own tab, then adversarially re-verify. Phase 2 (sequential): implement confirmed gaps directly in the scaffold one screen at a time, re-running that screen''s checklist as a regression gate after each edit.'
redesignSpecPath: '{redesign_spec_path}'
uxGuidePath: '{ux_guide_path}'
---

# Step 7b — Direct Implementation Against an Existing Scaffold

## Outcome

The user's own implementation has been checked against every prescription in `{redesignSpecPath}` (or `{uxGuidePath}` if no redesign spec exists), across **every screen at once** — each item marked applied / partial / missing with concrete evidence from the **live** running app, not from reading the source alone and not from memory. Confirmed gaps have then been implemented directly in the scaffold, one screen at a time, with that screen's checklist re-run after its edits so a regression is caught immediately rather than discovered later.

This step exists because step-07/08's model (paste a prompt into Claude Design, get an HTML draft back, verify that draft) assumes an external tool produced the output. It doesn't fit a user who hand-built their own scaffold and wants it directly extended — that's not "receiving a draft," it's ongoing collaborative implementation, and it needs its own verification loop rather than being forced through the external-draft one.

Two phases, two different concurrency models — don't blur them: **auditing is read-only and safe to parallelize across every screen at once; implementation edits the same files and must stay sequential, one screen at a time, or two screens' edits can collide.**

## Approach

### Locate and prepare the scaffold

Ask for its path if not already known. If it's a bundled/exported single-file artifact (check for wrapper markers like a `manifest`/`template` script-tag pair, minified bundler loader code, or similar packaging) rather than plain source, decode the actual template/markup payload into a separate, directly-editable working file first — don't attempt to hand-edit the bundled wrapper itself; find where the real markup lives and work on that.

Serve it locally (a plain static file server is enough) so every check below happens against the live, running page — not a read of the source in isolation. A component can look complete in markup and still be broken live (a modal that exists in the DOM but never opens, a filter that renders but doesn't actually filter); source-reading alone will miss exactly the failures this step exists to catch.

## Phase 1 — Audit every screen in parallel

Don't audit one screen, present it, audit the next, present it — that's slower for no benefit, since read-only checking never conflicts across screens. Use the **Workflow** tool the same way step-04b does: one `agent()` per screen, dispatched together via `parallel()`, each opening its own browser tab against the same locally-served scaffold. Do this for every screen the redesign spec covers in one pass, not just the one screen currently being discussed — the whole point of doing this up front is to hand the user a complete picture before any editing starts.

### Per-screen agent: build the checklist

Each screen's agent turns every prescription in that screen's redesign-spec section into one checklist item:

1. Read the relevant source to see what's there.
2. Exercise it live — click the actual control, open the actual modal/drawer, trigger the actual state change. Don't infer behavior from markup that looks right; confirm it.
3. Mark **applied** (fully matches the prescription, live), **partial** (present but incomplete, wrong in some observable way, or only superficially resembling the pattern), or **missing** (not there at all).
4. Record the evidence — what was actually seen, specific enough that someone else could verify the same claim without re-doing the work ("clicking '+ 추가' opens a modal with title+department+DRI fields but no submit validation" beats "mostly done").
5. Where the prescription claims parity with a specific Mobbin reference, look at that reference image again while judging — a component that superficially resembles the target pattern but is missing its defining interaction (a "filter" that renders options but doesn't change the list) is `partial`, not `applied`, even though it would pass a glance-level check.

### Adversarially re-verify before trusting any verdict

Before presenting anything, re-attempt every item marked `applied` or `partial` a second time, independently, directly on the live page — a first pass tends to over-credit things that look right at a glance (a drawer that opens but renders empty, a toast that fires but with no visible text, a button that's present but silently does nothing on click). This re-check is also per-screen and parallelizable — dispatch it the same way (one re-verify `agent()` per screen, or fold it into a second Workflow phase) rather than doing it sequentially after the fact. Downgrade anything that doesn't hold up on the second look, and say why it was downgraded. This mirrors the same adversarial-correction discipline step-05b applies to findings — a single pass asserting its own work is fine is not verification.

### Present the full checklist, all screens together

```
✅/🟡/❌ {screen name} — 컨포먼스 체크
...
✅/🟡/❌ {next screen} — 컨포먼스 체크
...

이번엔 어떤 것부터 고칠까요?
```

Show every audited screen in one presentation, not screen-by-screen as each finishes — the user should be picking a priority from the whole picture, not reacting to whichever screen happened to come back first. Don't silently skip a screen just because everything on it came back applied — a clean bill of health is itself information worth showing, not something to omit.

## Phase 2 — Implement, one screen at a time (sequential)

Once the user picks what to close, edit the scaffold's actual editable source directly. Land one screen's changes before moving to the next — don't batch-rewrite the whole file in one pass, and don't parallelize this phase the way Phase 1 was parallelized: concurrent edits to the same source file (or to shared components/styles multiple screens depend on) can collide in ways read-only audits never do. A single screen's edit is easy to isolate, review, and revert if something breaks; simultaneous multi-screen edits are not, and it becomes much harder to tell which change caused a regression if one shows up.

### Re-run that screen's checklist after editing it

After editing a screen, re-run that screen's checklist items live before moving to the next screen. This is the regression gate — an edit made to close one gap can silently reintroduce or break something else on the same screen, and catching that immediately (while the change is still fresh in context) is far cheaper than catching it at the end of a multi-screen implementation pass.

## Next

No fixed next step — once Phase 1's full checklist exists, loop through Phase 2 for whichever screens the user wants to tackle, in whatever order they pick, or stop when they're satisfied. If the user later changes the scaffold enough that the audit might be stale (new screens added, an earlier screen restructured), re-run Phase 1 for the affected screens rather than trusting an old verdict. If a genuinely separate, out-of-scope engineering bug turns up along the way (not a UX/UI prescription gap — a real functional defect), don't fold it into this loop; flag it as its own item the way any other out-of-scope finding would be flagged, so it doesn't get lost inside a UX conformance pass it doesn't belong in.
