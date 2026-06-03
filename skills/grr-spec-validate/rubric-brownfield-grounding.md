# Rubric — Brownfield grounding

A brownfield spec (PRD / architecture / epic / story written against an
EXISTING codebase) is **grounded** when every claim it makes about the
current code is true — verified by reading the actual source, not by
trusting the drafting author.

This is the one rubric where the validator **reads the project's real
source code**. Every other rubric works from the artifact alone; this one
must open files. The fresh-context invariant still holds: the validator
has NO access to the drafting conversation — it goes straight to source.

**Pass threshold: zero contradicted claims, and ungrounded current-state
claims at or below the flag line (see below).** Apply only in brownfield
mode (the dispatch sets `brownfield_areas` / `project_root`). If the
dispatch did not request this rubric, skip it entirely.

## Why this rubric exists

The most common brownfield failure: the spec describes the codebase as the
author *imagines* it, not as it *is*. "Users currently can't bulk-edit"
(but a bulk-edit hook already exists). "We'll add a new Button component"
(but a shared Button already exists). "The scheduler has no caching" (but
it uses React Query). These survive every artifact-only rubric because the
text is internally coherent — only reading the code catches them.

## Inputs

| Input | Use |
|---|---|
| `artifact_path` | the spec under evaluation |
| `project_root` | where to read source from (required for this rubric) |
| `brownfield_areas` | optional Glob/Grep seeds — file paths, folders, or feature names the spec targets |
| `reference_paths` | optional prior analysis artifact (e.g. the drafting survey) — use as a hint, NOT as ground truth; verify against real files |

## Scoring procedure

1. **Extract current-state claims** from the artifact. These are
   statements about what the code/system does TODAY, not about what the
   spec proposes to build. Categories:
   - Capability claims: "users can X", "the system does Y today"
   - Absence claims: "there is no X", "currently no way to Y", "X is not handled"
   - Structural claims: "file/module F does G", "X is implemented in Y"
   - File-change claims (architecture/story): "we will modify F", "add to folder D"

2. **For each claim, verify against real source:**
   - **Cited claim** (names a file/function/component) → Read that file.
     - Matches reality → `grounded`.
     - File says otherwise → `contradicted` (record claim, location, what the file actually shows, the file path).
     - File/symbol does not exist → `contradicted` (record as "cited target not found").
   - **Uncited current-state claim** → try to verify via Glob/Grep within
     `brownfield_areas` (or whole project if no areas given).
     - Confirmed true → `grounded` but note missing citation.
     - Confirmed false → `contradicted`.
     - Cannot confirm either way → `ungrounded` (record claim + what you searched).
   - **Absence claim** ("no existing X") → Grep for X across the project.
     - Nothing found → `grounded`.
     - Found → `contradicted` (the spec wrongly claims absence; cite the file that proves existence). **Absence claims are the highest-value catch — check every one.**

3. **Count** grounded / ungrounded / contradicted.

4. **Flag line:** more than 2 ungrounded current-state claims, OR any
   `contradicted` claim → this rubric contributes `REVISE`.

## Output

Add to the JSON output:

```json
{
  "brownfield_grounding": {
    "claims_checked": 9,
    "grounded": 6,
    "ungrounded": [
      { "claim": "the scheduler reloads on every keystroke", "location": "NFR-2", "searched": "src/features/scheduler/** for input handlers + debounce" }
    ],
    "contradicted": [
      {
        "claim": "there is no shared confirmation modal",
        "location": "FR-4",
        "reality": "ConfirmModal exists and is exported",
        "file": "packages/shared/src/modal/ConfirmModal.tsx"
      }
    ],
    "verdict": "REVISE"
  }
}
```

For every `contradicted` entry, also append a concrete `revision_pointer`,
e.g. `"FR-4 claims no confirmation modal exists, but packages/shared/src/modal/ConfirmModal.tsx provides one — reuse it or state why it doesn't fit."`

## Constraints specific to this rubric

- **Read source, never the conversation.** You may Read/Glob/Grep the
  project. You may NOT use anything from the drafting session — it is not
  available to you anyway.
- **Verify, don't redesign.** Your job is "is this claim about the code
  true?" — not "is this good architecture?" Architectural judgment belongs
  to the three-stage rubric.
- **Bound the work.** Verify the spec's claims; do not audit the whole
  codebase. If `brownfield_areas` is given, stay within it plus one hop of
  imports. Cap reads at ~15 files; if more claims remain unverifiable
  within the cap, list them as `ungrounded` rather than reading endlessly.
- **A reference analysis artifact is a hint, not proof.** If a prior
  survey was passed in `reference_paths`, you may use it to find files
  faster — but the verdict must come from reading the real files, because
  the survey could itself be stale or wrong.

## Worked example

Artifact (brownfield story) excerpt:
> FR-4: 삭제 시 확인 모달이 없어 실수 삭제가 발생한다. 새 ConfirmModal 컴포넌트를 만든다.
> Task 2: src/features/roster/RosterRow.tsx 에 onDelete 핸들러 추가.

Verification:
- "확인 모달이 없어" (absence claim) → Grep `ConfirmModal|confirm.*modal` →
  found `packages/shared/src/modal/ConfirmModal.tsx`. → **contradicted.**
- "src/features/roster/RosterRow.tsx" (file-change claim) → Read →
  file exists, has a row with no delete handler. → **grounded.**

Output:

```json
{
  "brownfield_grounding": {
    "claims_checked": 2,
    "grounded": 1,
    "ungrounded": [],
    "contradicted": [
      {
        "claim": "삭제 확인 모달이 없다 / 새로 만든다",
        "location": "FR-4",
        "reality": "shared ConfirmModal already exists and is exported",
        "file": "packages/shared/src/modal/ConfirmModal.tsx"
      }
    ],
    "verdict": "REVISE"
  },
  "revision_pointers": [
    "FR-4 plans a new ConfirmModal, but packages/shared/src/modal/ConfirmModal.tsx already provides one — reuse it, or state the specific reason it doesn't fit."
  ]
}
```

One contradicted absence claim → REVISE. This is exactly the class of error
that artifact-only rubrics cannot catch.
