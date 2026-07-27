---
title: 'DOM Spec Schema'
type: 'extraction-contract'
purpose: 'What the seven axes mean and why each one is shaped the way it is — the reference for reading a spec and judging a diff. The extractor script is what actually produces them.'
---

# DOM Spec Schema

> **`scripts/extract-dom-spec.js` is the extractor of record.** It emits every axis below, applies every normalization rule below, and runs identically on both sides of every comparison. This document explains what it produces and why; it is not a set of instructions for hand-extraction. Two sides extracted at different granularity produce a diff that is noise all the way down — that failure is worse than not diffing at all, because it looks like a result. Running one script on both sides is what makes that impossible.
>
> For capturing a *running app* rather than a static file, `live-capture-protocol.md` adds the rules this schema assumes: readiness gating, scroll sweeping, noise exclusion, data-volume normalization, permission level, and state reaching.

## Non-negotiables

1. **Render, never read.** Every value comes from a rendered page — `getComputedStyle`, live DOM, actual clicks. Reading the HTML source instead is the exact failure mode this workflow was rewritten to fix: the cascade, inherited tokens, and behavior are invisible in source.
2. **One script, both sides.** Inject `extract-dom-spec.js` and call it; never hand-author a spec. A hand-written spec looks right and diffs wrong. `meta.extractedBy` is how a later step tells the difference — verify it's present before diffing against anything.
3. **Same agent, both sides, back to back.** The script fixes granularity, but the agent still supplies navigation, interaction targets, and state-reaching — and it needs the mockup spec in hand to know which of those matter for this screen.
4. **Record absence explicitly.** `none`, `not present`, `not reachable` are data. Omitting an axis because it was empty makes the other side's entry look like an addition.
5. **Never invent.** If a value couldn't be obtained, record `UNKNOWN: {why}`. A guessed value that later reads as confirmed is the one error this workflow cannot recover from.

## Emit format

One JSON file per screen per side, at `{spec_dir}/{slug}.{mockup|live}.json`, with a `meta` block and the seven axes as `s1_structure` … `s7_responsive`. The sections below describe each axis's contents and the reasoning behind its shape.

---

### S1. Structure tree

The semantic skeleton, depth-first, indentation = nesting. One line per node. Include only nodes that carry structure or meaning — landmarks, headings, sections, lists, forms, interactive elements, and any element that is the sole labeled child of a container. Skip pure styling wrappers (a `div` whose only job is a flex box), but keep the box's layout role on the child line instead of dropping it.

```
{tag}[{role}] "{accessible name or ''}" {layout}
```

- `role` — explicit `role=`, or the implicit ARIA role. `-` if none.
- `layout` — `flex-row` / `flex-col` / `grid({cols})` / `block` / `inline`, plus `wrap` when set. This is the only place layout topology is recorded; S3 records the numbers.

Record document order, not visual order. Where CSS reorders (`order`, `grid-area`, `row-reverse`), append `⟂visual:{n}` to the line — mismatched visual vs DOM order is a real accessibility finding, and silently normalizing it away hides it.

### S2. Component inventory

A count-and-variant table. This catches "the mockup has three button styles, the build has one" without drowning in per-instance detail.

| Component | Variants | Count | Example accessible names |
|---|---|---|---|
| button | primary, ghost, icon-only | 7 | "저장", "취소", "필터 열기" |

Classify by rendered appearance and role, not by class name — class names diverge legitimately between a mockup and a real component library, and matching on them produces false gaps. Two buttons are the same variant when their fill, border, and text treatment match after normalization.

Cover at minimum: button, link, input (by `type`), select, checkbox, radio, textarea, table, list, card, badge/chip, avatar, icon, modal/dialog, drawer, tab, tooltip, toast, progress/spinner. Add whatever else the screen actually contains. Omit rows with count 0 only if that component type is absent on **both** sides — otherwise record `0` explicitly.

### S3. Design tokens (computed)

Per distinct rendered treatment, not per element. Group elements that resolve to identical values into one row and note how many share it.

**Typography**

| Applies to | font-family | size | weight | line-height | letter-spacing |
|---|---|---|---|---|---|

**Color**

| Applies to | color | background | border | shadow |
|---|---|---|---|---|

**Spacing**

| Applies to | padding | margin | gap | radius |
|---|---|---|---|---|

`Applies to` is a short human description keyed to S1 lines ("page heading", "card body", "primary button"), not a CSS selector — selectors don't survive the crossing between a mockup and a component-based implementation.

### S4. Copy

Every user-visible string, verbatim, with its S1 anchor. This is a transcription task — do not fix typos, do not translate, do not collapse a two-line label into one.

| Anchor | Kind | Text |
|---|---|---|
| page heading | heading | 프로필 설정 |
| upload button | label | 파일 선택 |
| size error | error | 파일 크기는 5MB 이하여야 해요 |

Kinds: `heading`, `label`, `body`, `placeholder`, `helper`, `error`, `empty`, `tooltip`, `alt`. Include text that only appears in a state reached during S5 — that's usually where the copy that matters most lives.

### S5. Interaction traces

For every interactive element in S1: click it, record what changed. This section is what separates a real fidelity check from a screenshot comparison.

```
{anchor} → {outcome}
  delta: {what appeared / disappeared / changed}
  new copy: {any strings that became visible — cross-listed into S4}
  reachable: {what the result is, as its own mini-structure, when it's a modal/drawer/panel}
```

Outcomes: `modal-open`, `drawer-open`, `expand`, `navigate({where})`, `state-change`, `toast`, `none`, `not-reachable({why})`.

Three rules that are not optional:

- **Never click destructive-looking actions** — delete, deactivate, submit, approve/reject, pay. Record what it appears it will do and move on. A prior run of the sibling `design-handoff` step-04b left permanent state changes this way; assume irreversible until proven otherwise rather than discovering by pressing.
- **`none` on a mockup is expected, not a finding.** A static HTML draft frequently has non-functional controls. The asymmetry that matters runs one direction: mockup shows a modal opening → implementation must too. Mockup does nothing → implementation navigating somewhere sensible is fine.
- **Restore state between traces.** Close the modal, collapse the row, navigate back. A trace run against the residue of the previous trace records the wrong delta.

### S6. States

Per state-bearing region (a list, a form, an async panel), what each state actually renders. Only record states you reached; write `not reached: {why}` for the rest rather than assuming.

| Region | empty | loading | error | success |
|---|---|---|---|---|

Reach them however the page allows — an empty filter result, a throttled network, a deliberately invalid input. Don't fabricate a state by editing the DOM to see what it would look like; a state that only exists because you injected it is not a state the implementation has.

### S7. Responsive

Re-render at 375 / 768 / 1440 and record only what *changes* from the 1440 baseline.

| Viewport | Layout change | Elements hidden/shown | Nav pattern | Overflow issues |
|---|---|---|---|---|

Overflow issues (horizontal scroll, clipped text, touch targets under 44px) are recorded on both sides — a mockup that breaks at 375px is a mockup bug worth naming, not something to quietly hold the implementation to.

---

## Normalization rules

The extractor applies these while recording, so identical rendering produces byte-identical spec values. They're documented here because judging a diff means knowing what was already collapsed — a difference these rules would have erased is an extraction bug, not a finding.

| Value | Rule |
|---|---|
| Color | lowercase 6-digit hex; keep alpha as 8-digit hex when < 1; `transparent` stays `transparent` |
| Length | integer px, rounded; `0` for any zero regardless of unit |
| font-family | resolved first family only, quotes stripped, lowercase |
| font-weight | numeric (`400`, not `normal`) |
| line-height | unitless to 2 decimals; convert px to ratio against that element's font-size |
| letter-spacing | px to 2 decimals; `normal` → `0` |
| Shorthand | expand to `{top} {right} {bottom} {left}`, always four values |
| border | `{width}px {style} {color}`; `none` when width is 0 |
| shadow | `{x} {y} {blur} {spread} {color}`; multiple shadows comma-joined in declared order |
| Text | trim, collapse internal whitespace runs to one space, preserve case and punctuation exactly |
| Accessible name | computed accessible name, not `textContent` — falls back through `aria-label`, `aria-labelledby`, label, then content |
| Counts | exact integers, never "several" or "~10" |

Two things deliberately **not** normalized, because normalizing them destroys the finding: DOM order vs visual order (S1), and the distinction between `none` and `not-reachable` (S5).
