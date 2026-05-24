# Rubric — Three-stage coherence (Concept / Structure / Detail)

A specification is coherent when its three layers reinforce each other:
the **concept** identifies the right problem, the **structure** breaks
it into the right tasks, and the **detail** anticipates the messy
reality. This rubric scores each layer independently from 0.0 to 1.0.

**Pass threshold: all three stages ≥ 0.7.**

## Stage 1 — Concept (0.0–1.0)

Does the artifact identify a real problem, and does the proposed solution
address THAT problem?

| Score | Meaning |
|---|---|
| 1.0 | Problem stated in concrete user/business terms; solution explicitly ties to the problem; no scope drift. |
| 0.7 | Problem clear; solution direction clear; tie is implicit but derivable. |
| 0.5 | Problem fuzzy OR solution drifts to adjacent concerns. |
| 0.3 | Either side missing; "Problem: improve X" without why. |
| 0.0 | No problem stated, or solution unrelated to problem. |

**Red flags:**
- "to improve UX" / "for better performance" / "as part of refactor"
  without naming the specific gap or who feels the pain
- Solution introduced before problem is named
- Multiple problems claimed but only one addressed

## Stage 2 — Structure (0.0–1.0)

Is the task decomposition rational, with explicit dependencies and a
logical execution order?

| Score | Meaning |
|---|---|
| 1.0 | Tasks granular but not over-fragmented; each task has clear input and output; dependency graph readable; parallelizable parts marked. |
| 0.7 | Tasks present and roughly ordered; minor dependency gaps. |
| 0.5 | Tasks listed but order unclear; some tasks too big to estimate. |
| 0.3 | Bullet list of "things to do" with no order or dependencies. |
| 0.0 | No decomposition; just a wish list. |

**Red flags:**
- "Implement feature" as a single task — no decomposition
- Tasks that mix domains ("Build UI + write tests + deploy" as one)
- Tasks with hidden dependencies on un-listed prerequisite work
- No mention of test/verification tasks alongside implementation tasks

## Stage 3 — Detail (0.0–1.0)

Does the artifact specify concrete thresholds, edge cases, and failure
scenarios — or is it happy-path only?

| Score | Meaning |
|---|---|
| 1.0 | Every threshold has a number; edge cases enumerated; failure paths and recovery documented; error messages drafted; degraded modes considered. |
| 0.7 | Most thresholds numeric; main edge cases noted; failure paths acknowledged at high level. |
| 0.5 | Some thresholds numeric, others vague; edge cases as a trailing "consider X" without resolution. |
| 0.3 | Happy path only; no edge cases; no failure handling. |
| 0.0 | No specifics. Pure conceptual. |

**Red flags:**
- AC list has only happy path
- No mention of: empty input, large input, concurrent action, offline /
  network failure, partial failure, retry / idempotency
- "errors should be handled" without specifying how
- Performance / capacity claims without numbers

## Output

```json
{
  "three_stage": {
    "concept": 0.85,
    "structure": 0.62,
    "detail": 0.40,
    "weakest": "detail",
    "notes": "happy path only; no failure scenarios; tasks roughly ordered but Task 3 dependency on un-listed migration"
  }
}
```

The `weakest` field names the lowest-scoring stage. If multiple tie at
the lowest, name the one furthest from the threshold of 0.7.

`notes` is a short (≤ 200 char) free-text summary of the dominant issue
across the three stages — primarily explaining the `weakest` score.

## Verdict contribution

If any single stage < 0.7, this rubric's contribution to the overall
verdict is `REVISE`. The `weakest` stage is the primary revision target,
and a corresponding `revision_pointer` is added:

- weakest = concept → "Re-anchor the story to a concrete problem
  statement; remove scope drift."
- weakest = structure → "Decompose the implementation into ordered tasks
  with explicit inputs/outputs; surface hidden dependencies."
- weakest = detail → "Add edge cases (empty / large / concurrent /
  offline) and failure recovery paths; replace soft thresholds with
  numbers."
