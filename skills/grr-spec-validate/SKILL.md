---
name: grr-spec-validate
description: Use when validating a story document or spec artifact in a fresh sub-agent context — checks ambiguity (score), AC measurability (Gherkin convertibility), three-stage coherence (concept/structure/detail), and codebase-convention violations against a user-supplied checklist. Always dispatched from the main session; never inherits its context.
---

# grr-spec-validate

## Overview

This skill runs **inside a dispatched sub-agent** to evaluate a
specification artifact (story / PRD / AC list / completion state) without
inheriting the main session's context. The point is to break the
"writer judges own work" loop — sycophancy and anchoring degrade
self-validation enough that it is effectively useless against the same
drafting context.

The skill produces a structured pass/fail with quantitative scores plus
specific revision pointers. The main session reads the result and decides
the next step (proceed / revise / re-dispatch).

**Core principle:** the sub-agent sees ONLY:

1. The artifact file to evaluate.
2. The rubric files in this skill.
3. (Optional) a user-supplied checklist file path.
4. (Optional) reference files such as a PRD.

Nothing else. No prior conversation, no plan, no answer to "why did you
write it this way." The artifact must stand on its own.

## When to use

Use when:

- A story file has just been composed and needs a quality gate before
  implementation (`quick-story`, `bmad-create-story`).
- A PRD or epic list needs verification before downstream workflows
  consume it (`bmad-create-prd`, `bmad-create-epics-and-stories`).
- A DoD checklist needs evaluation against actual completion state
  (`dev-story` step-05).
- A planned implementation needs convention-conformance check against a
  project checklist before coding starts.

Do NOT use when:

- The main session can verify by running a command (use
  `verification-before-completion` instead — that skill is for execution
  evidence, this one is for spec quality).
- The artifact has not been written yet (this skill validates, it does
  not draft).
- The work is purely about code style / naming conformance on existing
  code (use `code-review` for post-implementation review).

## Dispatching this skill

The main session calls Task / Agent with a prompt that loads this skill
and supplies inputs. See `invocation-template.md` in this folder for the
copy-paste prompt.

The minimum dispatch payload:

| Key | Required | Notes |
|---|---|---|
| `artifact_path` | yes | Absolute path to the spec / story file under evaluation |
| `rubrics` | yes | Comma-separated subset of {`ambiguity`, `ac-measurability`, `three-stage`, `checklist`}. Default: all four. |
| `checklist_path` | conditional | Required if `rubrics` includes `checklist`. Main session **must ask the user** for this path — do not infer. |
| `reference_paths` | optional | Additional context files (e.g. PRD path when validating a story) |

**Parallel invocation is the norm.** Two patterns:

1. **One sub-agent, multiple rubrics.** The dispatched agent runs all
   requested rubrics in sequence and returns one combined block. Use this
   when the rubrics share context.
2. **Multiple sub-agents in parallel.** One sub-agent per rubric (or per
   artifact in batch validation). They share no state and complete
   concurrently. Use this when validating an epic of N stories or when
   running independent rubrics against the same artifact for speed.

The main session aggregates the results and presents them to the user.

## The four rubrics

| Rubric | File | Score | Pass threshold |
|---|---|---|---|
| Ambiguity | `rubric-ambiguity.md` | 0.0–1.0 (lower = clearer) | ≤ 0.2 |
| AC measurability | `rubric-ac-measurability.md` | YES per AC | All YES |
| Three-stage coherence | `rubric-three-stage.md` | Stage 1/2/3 each 0.0–1.0 | All ≥ 0.7 |
| Checklist conformance | `rubric-checklist.md` (consumes user-supplied file) | Violation count | 0 hard violations |

Each rubric file contains: scoring procedure, heuristics, and worked
examples. **Load only the rubric files the dispatch payload requests** —
do not load the others.

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
  "revision_pointers": [
    "AC-2 needs a measurable threshold (e.g. 'within 200ms')",
    "Detail stage missing — no failure scenarios listed",
    "Task 3 contradicts checklist rule about queryFn"
  ]
}
```

Fields are **omitted** when the corresponding rubric was not requested
(e.g. `ambiguity_score` is absent when `rubrics` does not include
`ambiguity`). `revision_pointers` is always present when
`verdict == "REVISE"`. `verdict` must be exactly `"PROCEED"` or
`"REVISE"`. Array fields use `[]` when the rubric ran but found nothing
to report.

The main session parses this block to decide the next step. If
`verdict == "PROCEED"`, the downstream workflow continues. If
`"REVISE"`, the main session shows `revision_pointers` and either
re-prompts the user or routes to `refine-story`.

## Common mistakes

**❌ Reading the main session's chat history.** The sub-agent works from
the artifact alone. If you find yourself reasoning from "the user said …",
stop — that information must come from the artifact or not be used.

**❌ Soft-pedaling failures.** If any score is below threshold, the
verdict is `REVISE`, period. Do not write "mostly fine, just polish."
The whole point of fresh-context validation is honest scoring.

**❌ Inventing rubrics.** Use only the four rubrics in this skill. If a
new dimension is needed, the main session must add a rubric file
explicitly — not the sub-agent inline.

**❌ Modifying the artifact.** This skill is read-only. Validation output
drives revision; the main session (or `refine-story`) does the revision.

**❌ Asking the user clarifying questions.** The sub-agent is
non-interactive. If a rubric cannot be applied (missing input, malformed
artifact), record that as a `revision_pointer` and return — do not block
on input.

## When NOT to use this skill

- **Inline self-check after writing.** Same context = no value. Use
  this skill via sub-agent dispatch only.
- **Code review on existing code.** Use `code-review` workflow.
- **Verifying that a command ran successfully.** Use
  `verification-before-completion`.
- **Generating a checklist.** Use `review-checklist`.

## Verification (sub-agent self-check before returning)

Before returning, the sub-agent must:

1. Confirm the artifact was actually read — cite at least one line range
   from the artifact in the output (in `notes` or `revision_pointers`).
2. Confirm each requested rubric produced a score.
3. Confirm the output is a single fenced JSON block matching the schema.
4. Confirm the verdict is consistent with the scores (no `PROCEED` when
   any score fails its threshold).

If the artifact path does not exist or cannot be read, return a single
block with `verdict: REVISE` and `revision_pointers: ["artifact_path
unreachable: <path>"]`. Do not invent content.
