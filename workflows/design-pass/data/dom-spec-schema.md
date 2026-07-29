---
title: 'DOM Spec Schema'
type: 'extraction-contract'
purpose: 'What the extractor emits, what each field means, and what a diff line is saying — the reference for reading a spec and judging a diff'
---

# DOM Spec Schema

> **`scripts/extract-dom-spec.js` is the extractor of record.** It runs identically on both
> sides of every comparison and applies every normalization below at record time. This document
> explains what it produces; it is not instructions for hand-extraction. Two sides extracted at
> different granularity produce a diff that is noise all the way down — worse than not diffing,
> because it looks like a result.
>
> For capturing a *running app* rather than a static file, `live-capture-protocol.md` adds the
> rules this schema assumes.

## Non-negotiables

1. **Render, never read.** Every value comes from a rendered page. Reading HTML source cannot
   see the cascade, inherited tokens, or measured layout.
2. **One script, both sides.** Never hand-author a spec. `meta.extractedBy` is how a later step
   tells the difference — verify it before diffing against anything.
3. **The model does not perform the comparison.** Both sides go to disk as TSV and `diff` does
   the work. An agent reading two 400 KB JSON blobs skims, and skimming is the original defect.
4. **Record absence explicitly.** `none`, `not reached`, `not computable` are data.
5. **Never invent.** If a value couldn't be obtained it is `UNKNOWN: {why}` or absent, never
   guessed.

## What gets written per screen per side

| File | Contents |
|---|---|
| `{slug}.{mockup\|live}.tsv` | The diff surface — sorted `key ⇥ field ⇥ value` lines |
| `{slug}.{mockup\|live}.json` | The structured spec: `meta`, `health`, S1–S9 |
| `{slug}.w{375,768,1440}.tsv` | One responsive capture per viewport, same format |

Both come from one `extract()` call. The TSV is what you diff; the JSON is what you read when
a diff line needs context.

## The record format

```
key ⇥ field ⇥ value
```

Sorted lexically, so all of an element's fields sit together and `diff` output is grouped by
element without any post-processing.

**Every visible element gets records.** There is no "is this element structural enough" test.
Two earlier versions had one, and both lost findings the same way: keeping only semantic tags
collapsed a div-soup mockup to 66 nodes against an implementation's 283, and promoting only
flex/grid items then hid a wrapper `div` inside a plain `<td>` — the element whose
`flex-direction` decided whether two buttons sat side by side or stacked. Any rule that selects
which elements are worth recording keeps having this bug, because the axis nobody thought of is
attached to the element nobody selected. Volume is not the constraint: the dump goes to disk and
only differences are ever read.

**Repeated siblings collapse on a whole-subtree signature**, not on the sibling's own style.
Judging repetition from the row's own style plus its children's `tag:role` merged two table rows
whose cells differed several levels down, and the walk then never descended into the second one —
everything inside it became unreachable. The signature covers structure, roles, identity-bearing
names, colspan/rowspan, and the layout-deciding computed properties at every level, to depth 6.
Text content is deliberately excluded: 47 rows of different data *are* one row template, and
collapsing them is the point.

**Key** — the element's anchor: `{landmark scope}/{tag}[{role}]"{accessible name}"`, or
`…#{ordinal}{~iconhash}` when it has no name. Names survive a rewrite from Tailwind to CSS
modules; selectors do not. A duplicate anchor gets an occurrence ordinal appended (`…"1,234"§2`),
assigned in document order before any axis runs so both sides number the same elements the same
way. Two cells reading `1,234` in different rows are otherwise byte-identical lines and a diff
cannot tell which one moved.

**Document-level records** are prefixed `@`: `@doc`, `@components`, `@cssvar.declared`,
`@cssvar.applied`, `@table:{key}`.

### Field namespaces

| Prefix | What it answers |
|---|---|
| `node.*` | identity — tag, role, name, depth, DOM path, repeat count, visual-order mismatch |
| `geom.*` | measured box — `w`, `h`, and `dx`/`dy` **relative to the enclosing landmark** |
| `box.*` | declared sizing — display, width/height, min/max, box-sizing, aspect-ratio |
| `align.*` | the *cause* of a geometry difference — text/vertical align, justify/align, order, flex grow/shrink/basis, grid column/row/template |
| `type.*` | family, size, weight, line-height, letter-spacing, style, transform, decoration, numeric variant, white-space, text-overflow, line-clamp |
| `color.*` | fg, bg, **four-sided** border, shadow, text-shadow, outline + offset |
| `space.*` | padding, margin, gap, **four-corner** radius |
| `vis.*` | background image/size/position, transform, opacity, filter, backdrop-filter, blend, position + inset, z-index, overflow, cursor, transition, animation |
| `meas.*` | facts no declaration states — actual clipping, rendered line count, **three kinds of overflow**, image scaling, contrast ratio |
| `attr.*` | semantics that change behavior — type, href, disabled, required, colspan/rowspan, aria-expanded/checked/selected/current |
| `text.own` | the element's own text, verbatim |
| `copy.{kind}` | the copy axis, keyed by the same anchor |
| `ps.{state}` | the declaration block that applies on `:hover`, `:focus-visible`, `:disabled`, `:checked`, … |
| `options` | a `<select>` / listbox option set, joined with ` \| ` |
| **`css.{property}`** | **every remaining computed property.** The catch-all — see below |

### `css.*` — why a catch-all exists

The namespaces above are curated, because `align.textAlign right → left` names an edit and
`text-align` buried in an alphabetical dump does not. But curation is a filter, and a filter is
how an axis becomes permanently invisible: a property nobody listed is a property no diff can
ever surface. `float` was exactly that — absent entirely. `flex-direction` was worse, reachable
only as `flex-row` vs `flex-col`, so `row-reverse` read as plain `row`.

So after the curated fields, every remaining computed property is swept — 479 of them in Chrome —
suppressing values equal to the CSS initial. Suppression uses a probe element reset with
`all: initial`, **not** a value sampled from the page: a page-sampled baseline would let each
side suppress its own differing default and the difference would vanish from both files.

Only properties that restate something already recorded are excluded, because none of them can
hold a fact of their own: logical properties (`inline-size`, `padding-block-*`, `overflow-inline`),
`perspective-origin` (resolves to the element's own box centre), the `currentcolor` family
(`caret-color`, `text-emphasis-color`, `column-rule-color`, `-webkit-text-stroke-color`), and
`border-collapse` (recorded once per table in `@table:*`, not once per cell). On a fixture this
leaves 23 `css.*` lines out of 939 — and one of them was the `float` drift.

### Defaults are omitted

A field is written only when it differs from the CSS initial (or otherwise uninteresting)
value. Without this every element carries ~50 identical lines and the file is unreadable.

**A one-sided diff line therefore means "this side declares it, the other side is at the
default."** The defaults that are suppressed:

| Field | Suppressed when |
|---|---|
| `node.role` | `-` |
| `box.display` | `block` |
| `box.width` / `box.height` | `auto` |
| `box.minWidth` / `minHeight` | `0px` |
| `box.maxWidth` / `maxHeight` | `none` |
| `align.textAlign` | `start` |
| `align.verticalAlign` | `baseline` |
| `align.justifyContent` / `alignItems` / `alignContent` | `normal` |
| `align.alignSelf` / `justifySelf` | `auto` |
| `align.order` | `0` |
| `align.flexGrow` | `0` · `flexShrink` `1` · `flexBasis` `auto` |
| `align.gridColumn` / `gridRow` | `auto / auto` |
| `type.weight` | `400` |
| `type.lineHeight` | `normal` · `letterSpacing` `0.00` |
| `type.style` / `transform` / `decoration` | `normal` / `none` / `none` |
| `color.bg` | `transparent` |
| `color.border` | `none / none / none / none` |
| `color.shadow` / `textShadow` / `outline` | `none` |
| `space.padding` / `margin` | `0 0 0 0` · `gap` `0` · `radius` `0 0 0 0` |
| `vis.*` | each property's own initial (`none`, `1`, `static`, `visible`, `auto`, `normal`) |

### Overflow takes three checks, not one

`scrollWidth > clientWidth` only sees content overflowing to the **right** of its own scroll box.
Content pushed off the **left** edge, or a child sticking out of a parent that clips it, produces
no scroll extent at all and reads as perfectly fine.

| Field | Catches |
|---|---|
| `meas.overflowX` / `meas.overflowY` | the element's own content exceeding its scroll box |
| `meas.escapesParent` | the element's box extending past its parent's, per side, with `(clipped)` when the parent isn't `overflow: visible` — this is the only field that says "왼쪽이 잘린다" |
| `meas.lines` / `meas.tallerThanOneLine` | text wrapping to more lines than the other side, which changes every row height below it. `meas.lines` uses a `Range` over the contents, because `Element.getClientRects()` returns one rect for a block no matter what the text does inside it |

## Normalization

Applied while recording, so identical rendering produces byte-identical values. A difference
these rules would have erased is an extraction bug, not a finding.

| Value | Rule |
|---|---|
| Color | painted through a 1×1 canvas, so `rgb()`, `hsl()`, `lab()`, `oklch()`, `color(srgb …)` and `color-mix()` all collapse to lowercase sRGB hex; 8 digits when alpha < 1; `transparent` stays `transparent`; unparseable becomes `UNPARSED:{raw}` |
| Length | integer px |
| font-family | resolved first family, quotes stripped, lowercase |
| font-weight | numeric |
| line-height | unitless to 2 decimals against the element's own font-size; **`{n}px` when font-size is 0** — dividing by it produced `NaN` and bucketed every such node into one phantom group |
| letter-spacing | px to 2 decimals; `normal` → `0.00` |
| Shorthand | always four values, `{top} {right} {bottom} {left}` |
| border | **all four sides**, `{w}px {style} {color}` each, joined ` / `. Rows carry only `border-bottom` and cells only `border-right`; reading `border-top` recorded every table rule as `none` |
| radius | **all four corners** |
| shadow | color functions inside normalized the same way as any other color |
| Accessible name | approximation — see below |
| Counts | exact integers |

Two things deliberately **not** normalized, because normalizing them destroys the finding: DOM
order vs visual order (`node.visualOrder`), and the distinction between `none` and
`not-reachable` in a trace.

### The accessible name is an approximation

Verified: page script has no accessible-name API — `getComputedAccessibleNode` is undefined and
`computedName` is not on the element. The extractor walks the spec's fallback order
(`aria-label` → `aria-labelledby` → `label` → alt/value → own content for name-from-content
roles → `title` → `placeholder`) and stops at the first hit. A name that matters and looks
wrong is worth confirming by hand.

Containers do **not** take a name from their subtree. Letting `<main>` name itself from every
string on the page means one word of copy drift renames it and the sides stop matching.

## The structured axes

| Axis | Contents |
|---|---|
| `s1_structure` | the tree — depth, tag, role, name, layout, key, match key, DOM path, repeat, visual order |
| `s2_components` | count-and-variant inventory by rendered appearance, never by class name |
| `s3_cssVars` | `declared` (every declaration, with its selector) and `applied` (the cascade winner per scope) |
| `s4_copy` | every user-visible string, verbatim, with its key and kind |
| `s5_interactives` | the interaction target list, with `destructive` precomputed |
| `s6_states` | filled by the caller per `live-capture-protocol.md` §6 |
| `s7_responsive` | filled by `responsive()` |
| `s8_tables` | table-layout, border-collapse, colgroup widths, **measured column x/width/align**, colspan/rowspan, sticky cell count |
| `s9_options` | option sets, extracted separately so they reach both sides the same way |

### `health` — read this before diffing

```json
{ "structuralNodes": 183, "visibleElements": 382, "ratio": 0.48,
  "collapsed": false, "pseudoRules": 245, "cssVarNames": 253 }
```

`ratio` below ~0.15 sets `collapsed: true`: the extractor found almost no structure. A generated
mockup that is inline-styled `div` soup can collapse this way, and diffing a collapsed spec
against a semantic implementation produces hundreds of phantom findings. **Do not diff a
collapsed spec** — say so and fix the mockup side or fall back to the named-element tiers.

### `s3_cssVars` — declared is not applied

`declared` is every `--x: y` in every stylesheet, including inside `@layer`, `@scope`, `@media`
and `@supports`. `applied` is `getComputedStyle(el).getPropertyValue(name)` at each scope — the
cascade winner. Compare `applied`. Reading the last declaration in file order reported a cell
font of `17px` on a page rendering it at `12px`.

## Cross-side matching

Keys pair the two sides. When they don't, fall through in this order and **report the rate at
each tier**:

1. **Tier A — `node.mkey`** (`role|accessible name`), scope-free. The elements that matter.
2. **Tier B — normalized own text.** For unnamed elements carrying copy.
3. **Tier C — `node.path` ordinal** within an already-matched parent.
4. **Unmatched.** Reported as missing/added with a confidence marker, never as a confirmed gap.

A Tier-A match rate below 70% means the two sides are not comparable at the element level. That
is a halt, not a report.
