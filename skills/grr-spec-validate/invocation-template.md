# Invocation template — grr-spec-validate

This is the prompt the **main session** uses when dispatching
grr-spec-validate to a sub-agent. The main session is responsible for:

1. Resolving inputs from arguments, asking only for missing decisions.
2. Deciding which rubrics apply to this artifact.
3. Dispatching one fresh validator for small, one per rubric for full.
4. Merging the returned JSON blocks and deciding the next step.

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

**Brownfield mode.** If the spec is brownfield (extends existing code),
the main session adds `brownfield-grounding` to the rubric list and passes
`project_root` (and optionally `brownfield_areas` to narrow scope). That
rubric makes the validator read the real source to confirm the spec's
current-state claims are true — it catches "spec describes the codebase as
imagined, not as it is." Omit it for greenfield specs (nothing to ground
against).

---

## Step 2 — Dispatch

Small stories use one fresh `Agent` call for all applicable rubrics; full uses one per rubric, with at most five concurrent agents. Do not pass the drafting conversation.

For a story or PRD the set is the four artifact-only rubrics —
`ambiguity`, `ac-measurability`, `three-stage`, `checklist` — minus
`checklist` when the user said `skip`, plus `brownfield-grounding` when
the spec is brownfield. Architecture docs drop `ac-measurability` (no
ACs).

The dispatch payload for one sub-agent:

| Key | Required | Notes |
|---|---|---|
| `artifact_path` | yes | Absolute path to the spec / story file under evaluation |
| `rubrics` | yes | Assigned set from {`ambiguity`, `ac-measurability`, `three-stage`, `checklist`, `brownfield-grounding`}; full assigns one per agent. |
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

Return: a single fenced JSON block carrying `verdict`, `artifact`, every assigned rubric's fields per SKILL.md, and `revision_pointers`.
Any failed or missing rubric yields REVISE. No preamble, no prose.
```

### Merge the results

When every sub-agent has returned:

- `verdict` = worst across sub-agents (any `REVISE` → overall `REVISE`)
- Concatenate the per-rubric fields into one block matching the SKILL.md
  schema
- Union `revision_pointers`

A sub-agent that returns nothing parseable counts as `REVISE` for its
rubric, never as a silent pass — name the rubric that failed to report
when presenting the verdict.

---

## Step 3 — Batch dispatch (N artifacts × M rubrics)

For N artifacts, apply the same small/full policy per artifact. Limit concurrent validators to five; do not create a dispatch script.

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

After the user picks `R` or `E` and the artifact is updated, the caller re-dispatches the applicable set under the same small/full policy in fresh contexts.

For `O`, log the override decision in the artifact's metadata or
sprint-status for traceability, then proceed.
