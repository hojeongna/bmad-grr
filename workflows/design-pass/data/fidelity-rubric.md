---
title: 'Fidelity Rubric'
type: 'classification-rules'
purpose: 'Turn a raw spec diff into severities and a routing decision, with thresholds concrete enough that two runs on the same diff classify it the same way'
---

# Fidelity Rubric

Every diff line gets exactly one severity and exactly one route. Classify mechanically first, override with judgment second — and when you override, say so and why.

## Severity

| | Name | What it is | Typical source |
|---|---|---|---|
| **F0** | Missing capability | The implementation cannot do something the mockup shows it doing. A control that isn't there, a modal that never opens, a flow that dead-ends, a state that has no rendering at all. | S1, S5, S6 |
| **F1** | Structural divergence | It's all there but assembled differently. Wrong hierarchy or order, a different component type doing the job, a state that renders but wrongly, a layout that collapses at a breakpoint. | S1, S2, S6, S7 |
| **F2** | Token drift | Same structure, wrong numbers. Color, type, or spacing outside the tolerances below. | S3 |
| **F3** | Copy mismatch | Same element, different words. | S4 |
| **F4** | Within tolerance | A measured difference that falls inside the tolerances below. | S3 |

F4 is reported and never fixed. It exists so that "we checked and it's fine" is visible in the report instead of looking like something nobody looked at.

## Tolerances (F2 vs F4)

| Property | Within tolerance (F4) | Otherwise |
|---|---|---|
| Color (any) | exact match only | F2 |
| font-family | exact match after normalization | F2 |
| font-weight | exact match | F2 |
| font-size | ±1px | F2 |
| line-height | ±0.10 ratio | F2 |
| letter-spacing | ±0.20px | F2 |
| padding / margin / gap | ±2px, or ±10% of the mockup value, whichever is larger | F2 |
| border-radius | ±2px | F2 |
| border-width | exact match | F2 |
| shadow | any difference in blur/spread over 2px, or any color difference | F2 |

Percentage tolerance exists so a 4px drift on a 64px gutter isn't ranked alongside a 4px drift on an 8px gap. Apply whichever bound is larger; never both.

## Direction matters

The two sides are not symmetric, and treating them as symmetric generates a report full of non-findings.

- **In mockup, absent from implementation** → classify normally. This is the main axis.
- **In implementation, absent from mockup** → classify one level *below* the normal severity, and label it `[ADDED]`. Real implementations legitimately carry things a static draft never showed: loading spinners, validation messages, keyboard shortcuts, focus rings. Never auto-remove an `[ADDED]` item — surface it and let the user decide.
- **S5 `none` on the mockup side** → not a finding at any severity. A static draft's dead buttons say nothing about the implementation.
- **S1 visual-vs-DOM order mismatch** (`⟂visual`) → F1 regardless of which side has it, because it's an accessibility defect in its own right rather than a fidelity question.
- **A mockup defect** (broken at 375px, unreachable control, missing state on the mockup side) → not a finding against the implementation. Collect these separately as `mockup_defects`; they route back to `design-handoff`, not to a fix here.

## Routing (Mode L)

Route each finding. Present the classification, then get one approval for the whole batch — per-finding prompting on a 20-finding diff is worse than useless.

**→ Fix now** (immediate, in this session)

- Severity F2 or F3, and
- the change is confined to ≤ 2 source files, and
- no new component, no new state, no new interaction, no data-layer change.

Typically: a hex value, a spacing token, a font weight, a string.

**→ quick-story** (hand off as a story)

- Any F0 or F1, or
- F2/F3 spanning 3+ source files, or
- anything that needs a component that doesn't exist yet, a new state to be rendered, or an interaction to be wired.

Also route here when a cluster of individually-small findings share one root cause (a design token that's wrong everywhere) — fixing that at the token definition is one coherent change, not nine scattered edits.

**→ report only**

- All F4.
- All `[ADDED]` items, unless the user explicitly asks to remove one.
- All `mockup_defects`.
- Anything the user declines at the approval gate.

## Routing (Mode P)

Different mechanics, because there is no implementation to compare against — only a story document that either covers a mockup element or doesn't.

- **F0 equivalent** — mockup element or interaction with no AC and no Task covering it → promote to a new AC (Given/When/Then) **and** a Task.
- **F1 equivalent** — a Task mentions it but no AC makes it verifiable, or an AC exists but no Task builds it → add the missing half.
- **F2/F3 equivalent** — the mockup fixes a concrete value (a color token, an exact string, a breakpoint) that the story leaves open → add it to Dev Notes, not to AC. Locking an exact hex into an acceptance criterion makes the story brittle for no gain.
- **F4 / `[ADDED]` / `mockup_defects`** — report only. A pre-dev story has nothing to have added yet.

## An AC passing is not visual fidelity

**The axis an acceptance criterion measures and the axis a user sees are different axes. AC is a
minimum condition, not a completion condition.** Never let a passing AC close a finding, and never
let it narrow what gets compared.

This has already happened. A story's AC read *"하위 행의 첨부 열 좌측 x좌표가 부모 행과 ±1px 이내로
일치한다"*. The measurement came back 0px, the run reported "AC3 충족" — and the inside of those
cells looked nothing like the mockup. The AC measured column alignment; it was read as meaning the
row matched. It never said that.

Two consequences for classification:

- A finding whose AC passes is still a finding. Classify it on the diff, not on the AC.
- Do not scope the diff to what the AC mentions. The AC is one assertion someone wrote in advance;
  the mockup is the spec.

## When the rubric doesn't fit

Say so explicitly in the report rather than forcing a severity. Two cases come up in practice: a difference that is technically F2 but obviously intentional (the implementation uses the real design system where the mockup used a placeholder), and a difference that is technically F4 but visibly wrong (four separate sub-tolerance drifts stacking into one clearly misaligned row). Reclassify both, name the override, and give the reason.
