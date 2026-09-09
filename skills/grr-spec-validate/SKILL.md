---
name: grr-spec-validate
description: Use when validating a story document or spec artifact in a fresh sub-agent context — checks ambiguity (score), AC measurability (Gherkin convertibility), three-stage coherence (concept/structure/detail), and codebase-convention violations against a user-supplied checklist. Always dispatched from the main session, one sub-agent per rubric; never inherits its context.
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
2. The one rubric file it was assigned.
3. (Optional) a user-supplied checklist file path.
4. (Optional) reference files such as a PRD.
5. (Brownfield-grounding rubric ONLY) the project's real source code, read
   via Read/Glob/Grep to verify the artifact's claims about existing code.

Nothing else. No prior conversation, no plan, no answer to "why did you
write it this way." The artifact must stand on its own.

The one deliberate exception is the **brownfield-grounding** rubric: it
reads project source to confirm the spec's claims about the existing
codebase are true. Even there, the invariant holds — the validator reads
*code*, never the *drafting conversation*.

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

The main session calls Task / Agent once per rubric, each with a prompt
that loads this skill and supplies inputs. See `invocation-template.md`
in this folder for the copy-paste prompt.

The dispatch payload for one sub-agent:

| Key | Required | Notes |
|---|---|---|
| `artifact_path` | yes | Absolute path to the spec / story file under evaluation |
| `rubrics` | yes | **Exactly one** of {`ambiguity`, `ac-measurability`, `three-stage`, `checklist`, `brownfield-grounding`} — one rubric per sub-agent, see below. |
| `checklist_path` | conditional | Required if `rubrics` includes `checklist`. Main session **must ask the user** for this path — do not infer. |
| `project_root` | conditional | Required if `rubrics` includes `brownfield-grounding` — the directory the validator reads source from. |
| `brownfield_areas` | optional | Glob/Grep seeds for `brownfield-grounding` (file paths, folders, feature names the spec targets). Narrows the verification scope. |
| `reference_paths` | optional | Additional context files (e.g. PRD path when validating a story, or a prior code-analysis artifact — used as a hint, never as ground truth) |

## One rubric, one sub-agent

Each dispatch carries **exactly one** rubric. The main session dispatches
every applicable rubric at once, concurrently, and merges what comes back.
Never hand several rubrics to a single sub-agent — they share no state,
score against independent thresholds, and write disjoint output fields, so
batching buys nothing and costs the honest scoring this skill exists for:
a validator holding four rubrics skims the later ones and returns a clean
verdict for a rubric it never really ran.

The default set for a spec artifact is the four artifact-only rubrics —
`ambiguity`, `ac-measurability`, `three-stage`, `checklist` — so a normal
gate is four concurrent sub-agents, five when the spec is brownfield. Drop
`checklist` when the user supplied no checklist path, and
`ac-measurability` for artifacts that have no ACs (architecture docs).

Validating N artifacts — an epic of stories — crosses both axes: one
sub-agent per (artifact × rubric) pair. Past roughly a dozen pairs,
dispatch through the Workflow tool instead of by hand, so concurrency is
capped and every pair is accounted for in the run.

The main session merges the returned blocks: `verdict` is the worst across
sub-agents (any `REVISE` → overall `REVISE`), per-rubric fields
concatenate, `revision_pointers` union.

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
examples. **Load only the one rubric file the dispatch payload names** —
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
main session builds. A single sub-agent returns only `verdict`,
`artifact`, the fields belonging to its own rubric, and
`revision_pointers`; every other field is absent. `verdict` is derived
from that one rubric alone and must be exactly `"PROCEED"` or `"REVISE"`.
`revision_pointers` is always present when `"REVISE"`. Array fields use
`[]` when the rubric ran but found nothing to report.

The main session merges the blocks to decide the next step. If the merged
`verdict` is `PROCEED`, the downstream workflow continues. If `REVISE`,
the main session shows the union of `revision_pointers` and either
re-prompts the user or routes to `refine-story`.

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

**❌ Running a rubric you were not assigned.** One dispatch, one rubric.
Sibling sub-agents hold the others; scoring them here duplicates their
work and produces a verdict the main session cannot attribute.

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
2. Confirm the assigned rubric produced a score.
3. Confirm the output is a single fenced JSON block matching the schema.
4. Confirm the verdict is consistent with that rubric's score (no
   `PROCEED` when the score fails its threshold).

If the artifact path does not exist or cannot be read, return a single
block with `verdict: REVISE` and `revision_pointers: ["artifact_path
unreachable: <path>"]`. Do not invent content.
