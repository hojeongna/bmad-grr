---
name: grr-spec-validate
description: Use when validating a story document or spec artifact in a fresh sub-agent context — checks ambiguity (score), AC measurability (Gherkin convertibility), three-stage coherence (concept/structure/detail), and codebase-convention violations against a user-supplied checklist. Dispatched independently without the drafting conversation; small stories use one validator for all applicable rubrics.
---

# grr-spec-validate

## Overview

Evaluate the artifact in a fresh, read-only context. Use only the artifact, assigned rubrics, supplied checklist/references, and (for brownfield grounding) current source. Do not inherit the drafting conversation. Return scores and revision pointers so the caller can proceed or revise.

## When to use

Use when:

- A story file has just been composed and needs a quality gate before
  implementation (`quick-story`, `bmad-create-story`).
- A PRD or epic list needs verification before downstream workflows
  consume it (`bmad-create-prd`, `bmad-create-epics-and-stories`).
- A planned implementation needs convention-conformance check against a
  project checklist before coding starts.

Do NOT use when:

- The main session can verify by running a command (use
  `verification-before-completion` instead — that skill is for execution
  evidence, this one is for spec quality).
- The artifact has not been written yet (this skill validates, it does
  not draft).
- You'd be running it inline in the context that wrote the artifact —
  same context, no value. Sub-agent dispatch only.
- The work is code review on existing code (use the `code-review`
  workflow) or generating a checklist (use `review-checklist`).

## Dispatching this skill

The caller reads `invocation-template.md`. For a small story, one independent validator applies every assigned rubric and reports each result; full uses one validator per rubric. Small eligibility comes from quick-story's risk policy, not document length. Load only assigned rubric files. Independence from the author is required in both modes.

## The rubrics

| Rubric | File | Score | Pass threshold |
|---|---|---|---|
| Ambiguity | `rubric-ambiguity.md` | 0.0–1.0 (lower = clearer) | ≤ 0.2 |
| AC measurability | `rubric-ac-measurability.md` | YES per AC | All YES |
| Three-stage coherence | `rubric-three-stage.md` | Stage 1/2/3 each 0.0–1.0 | All ≥ 0.7 |
| Checklist conformance | `rubric-checklist.md` (consumes user-supplied file) | Violation count | 0 hard violations |
| Brownfield grounding | `rubric-brownfield-grounding.md` (reads project source) | grounded / ungrounded / contradicted claim counts | 0 contradicted, ≤ 2 ungrounded |

The first four work from the artifact alone. **Brownfield grounding is
different** — it reads the real codebase to verify the spec's claims about
existing code, and is requested only for brownfield specs (it needs
`project_root`).

Each rubric file contains: scoring procedure, heuristics, and worked
examples. Load the rubric files named in the payload.

## Output schema

The sub-agent **must** return a single fenced JSON block (no prose around it):

```json
{
  "verdict": "PROCEED",
  "artifact": "<path that was evaluated>",
  "ambiguity_score": 0.13,
  "ambiguity_offenders": [
    {
      "phrase": "appropriately",
      "location": "AC-2",
      "suggestion": "specify measurable threshold"
    }
  ],
  "ac_measurability": [
    { "id": "AC-1", "measurable": "YES" },
    { "id": "AC-2", "measurable": "NO", "issue": "uses 'appropriately' without measurable criterion" }
  ],
  "three_stage": {
    "concept": 0.85,
    "structure": 0.62,
    "detail": 0.40,
    "weakest": "detail",
    "notes": "no failure scenarios listed; happy path only"
  },
  "checklist_violations": [
    {
      "rule": "queryFn 안에서 응답 데이터를 변환하지 않았는가",
      "location": "Task 3",
      "quote": "데이터 가공 훅을 만들어 queryFn에서 변환",
      "severity": "HIGH"
    }
  ],
  "brownfield_grounding": {
    "claims_checked": 9,
    "grounded": 6,
    "ungrounded": [
      { "claim": "the scheduler reloads on every keystroke", "location": "NFR-2", "searched": "src/features/scheduler/** input handlers" }
    ],
    "contradicted": [
      { "claim": "there is no shared confirmation modal", "location": "FR-4", "reality": "ConfirmModal exists and is exported", "file": "packages/shared/src/modal/ConfirmModal.tsx" }
    ],
    "verdict": "REVISE"
  },
  "revision_pointers": [
    "AC-2 needs a measurable threshold (e.g. 'within 200ms')",
    "Detail stage missing — no failure scenarios listed",
    "Task 3 contradicts checklist rule about queryFn"
  ]
}
```

The block above is the **full field catalogue** — the merged shape the
main session builds. A validator returns `verdict`, `artifact`, the fields for every assigned rubric, and `revision_pointers`; unassigned fields are absent. Any failed or unassessable rubric yields `"REVISE"`; otherwise `"PROCEED"`.
`revision_pointers` is always present when `"REVISE"`. Array fields use
`[]` when the rubric ran but found nothing to report.

The main session merges the blocks and handles `PROCEED` / `REVISE` as
`invocation-template.md` Step 4 describes.

## Common mistakes

**❌ Reading the main session's chat history.** The sub-agent works from
the artifact alone. If you find yourself reasoning from "the user said …",
stop — that information must come from the artifact or not be used.

**❌ Soft-pedaling failures.** If any score is below threshold, the
verdict is `REVISE`, period. Do not write "mostly fine, just polish."
The whole point of fresh-context validation is honest scoring.

**❌ Inventing rubrics.** Use only the rubrics in this skill. If a
new dimension is needed, the main session must add a rubric file
explicitly — not the sub-agent inline.

**Unassigned rubrics:** do not score them; the caller owns coverage.

**❌ Modifying the artifact OR any source file.** This skill is read-only —
including the brownfield-grounding rubric, which reads source only to
verify, never to edit. Validation output drives revision; the main session
(or `refine-story`) does the revision.

**❌ Reading source for the artifact-only rubrics.** Only
brownfield-grounding touches the codebase. Ambiguity / AC / three-stage /
checklist work from the artifact (and checklist file) alone — do not go
reading project files for those.

**❌ Asking the user clarifying questions.** The sub-agent is
non-interactive. If a rubric cannot be applied (missing input, malformed
artifact), record that as a `revision_pointer` and return — do not block
on input.

## Verification (sub-agent self-check before returning)

Before returning, the sub-agent must:

1. Confirm the artifact was actually read — cite at least one line range
   from the artifact in the output (in `notes` or `revision_pointers`).
2. Confirm every assigned rubric produced a score.
3. Confirm the output is a single fenced JSON block matching the schema.
4. Confirm all assigned scores meet their thresholds before PROCEED.

If the artifact path does not exist or cannot be read, return a single
block with `verdict: REVISE` and `revision_pointers: ["artifact_path
unreachable: <path>"]`. Do not invent content.
