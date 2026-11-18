# Invocation template — grr-spec-validate

This is the prompt the **main session** uses when dispatching
grr-spec-validate to a sub-agent. The main session is responsible for:

1. Resolving inputs from arguments, asking only for missing decisions.
2. Deciding which rubrics apply to this artifact.
3. Dispatching one fresh validator per artifact for small/full.
4. Checking the complete result table and deciding the next step.

The sub-agent NEVER inherits the main session's chat history.

---

## Step 1 — Gather inputs

Before dispatching, the main session asks the user (only if not already
known in this session):

> Provide the absolute path to the codebase-convention checklist file
> for this project, or type `skip` to omit the checklist rubric.

If the user provides a path:
- Save as `checklist_path`.
- Verify the file exists (read first 10 lines as a sanity check). If
  missing, ask again.

If `skip`, omit the `checklist` rubric from the dispatch.

When validating a **story**, the main session also looks for a PRD file
(typically under `_bmad-output/`) and includes it as `reference_paths`.
**Architecture files are intentionally NOT included** — they drift too
much during development to be reliable validation input.

For existing-code specs, add `brownfield-grounding` and `project_root`; optional `brownfield_areas` narrows source reads. Check current-state claims against actual code. Omit for greenfield.

---

## Step 2 — Dispatch

Small/full use one fresh `Agent` call per artifact for all applicable rubrics. Add a second only for contradicted code claims, scope expansion or increased risk; assign affected criteria. Pass no drafting conversation.

For a story or PRD the set is the four artifact-only rubrics —
`ambiguity`, `ac-measurability`, `three-stage`, `checklist` — minus
`checklist` when the user said `skip`, plus `brownfield-grounding` when
the spec is brownfield. Architecture docs drop `ac-measurability` (no
ACs).

The dispatch payload for one sub-agent:

| Key | Required | Notes |
|---|---|---|
| `artifact_path` | yes | Absolute path to the spec / story file under evaluation |
| `rubrics` | yes | All applicable criteria from {`ambiguity`, `ac-measurability`, `three-stage`, `checklist`, `brownfield-grounding`}. |
| `checklist_path` | conditional | Required if `rubrics` includes `checklist`. Use a supplied path; ask only when absent. |
| `project_root` | conditional | Required if `rubrics` includes `brownfield-grounding` — the directory the validator reads source from. |
| `brownfield_areas` | optional | Glob/Grep seeds for `brownfield-grounding` (file paths, folders, feature names the spec targets). Narrows the verification scope. |
| `reference_paths` | optional | Additional context files (e.g. PRD path when validating a story, or a prior code-analysis artifact — used as a hint, never as ground truth) |

Use this prompt with the assigned rubric names:

```text
Load and follow the grr-spec-validate skill — rubric: <ASSIGNED_RUBRICS>.

Inputs:
- artifact_path: <ABSOLUTE_PATH_TO_ARTIFACT>
- rubrics: <ASSIGNED_RUBRICS>   # assigned set
- checklist_path: <ABSOLUTE_PATH — when checklist is assigned>
- project_root: <ABSOLUTE_PROJECT_ROOT — when brownfield-grounding is assigned>
- brownfield_areas: <comma-separated paths/folders/feature names — optional scope hint for brownfield-grounding>
- reference_paths: <comma-separated absolute paths or omit>

Constraints:
- Apply each assigned rubric and load its file; omit unassigned rubrics.
- For the artifact-only rubrics you see ONLY the artifact, your rubric
  file, the checklist (if provided), and reference files (if provided).
- For the brownfield-grounding rubric ONLY, you may additionally
  Read/Glob/Grep the project source under project_root — to VERIFY the
  spec's claims about existing code, never to edit.
- You do NOT have access to the main conversation that produced this
  artifact.
- You do NOT modify the artifact or any source file. Return validation
  output only.
- If your rubric cannot be applied (missing input, malformed artifact),
  return verdict REVISE with a revision_pointer naming the issue — do
  not return PROCEED for a rubric you could not run.

Return one fenced JSON block: `verdict`, `artifact`, complete `rubric_results` table, each assigned rubric's detailed fields, and `revision_pointers` per SKILL.md.
Any failed or missing rubric yields REVISE. No preamble, no prose.
```

### Check results

Require a score and verdict row for every assigned criterion, matching detailed fields. Return incomplete tables to the same validator; missing/unparseable results remain REVISE. Render all rows as `rubric | score | verdict` in the existing response. A second validator's failures cannot be overwritten by a pass; combine pointers and resolve disputes before PROCEED.

---

## Step 3 — Batch dispatch (N artifacts × M rubrics)

For N artifacts, use one validator per artifact, a second only under Step 2's conditions. Limit concurrency to five; no dispatch script.

Merge per artifact first (worst verdict across that artifact's rubrics),
then present a per-story summary sorted by verdict (REVISE first).

---

## Step 4 — Process the result

The main session branches on the merged `verdict`:

### `"PROCEED"`
Continue the calling workflow. Example: `quick-story` step-05 routes
to dev-story; `bmad-create-story` proceeds to the next AC.

### `"REVISE"`
Show the `revision_pointers` to the user verbatim. Offer:

```
[R] Revise through the calling workflow's own revise path — quick-story
    re-composes in its step-04; everywhere else, run refine-story
[E] Edit the artifact directly in this session
    (acknowledges that same-context revision is weaker than fresh — use only for small fixes)
[O] Override and proceed anyway
    (for cases where the user disagrees with the validator's assessment)
```

After R/E edits, revalidate only affected/newly applicable criteria in a fresh context. Retain unaffected scores in the existing result; require complete coverage before PROCEED. If impact is unclear, revalidate all criteria. Use Step 2's policy for a second validator.

For `O`, log the override decision in the artifact's metadata or
sprint-status for traceability, then proceed.
