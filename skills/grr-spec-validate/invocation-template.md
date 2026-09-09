# Invocation template — grr-spec-validate

This is the prompt the **main session** uses when dispatching
grr-spec-validate to a sub-agent. The main session is responsible for:

1. Gathering inputs (especially asking the user for `checklist_path`).
2. Deciding which rubrics apply to this artifact.
3. Calling Task / Agent once per rubric, all in one message.
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

## Step 2 — Dispatch: one sub-agent per rubric

Settle the rubric set, then dispatch **all of it at once** — one Task /
Agent call per rubric, in a single message so they run concurrently.
Never fold several rubrics into one call: they share no state, score
against independent thresholds, and a sub-agent carrying four rubrics
skims the later ones and reports a clean verdict for a rubric it never
really ran.

For a story or PRD the set is the four artifact-only rubrics —
`ambiguity`, `ac-measurability`, `three-stage`, `checklist` — minus
`checklist` when the user said `skip`, plus `brownfield-grounding` when
the spec is brownfield. Architecture docs drop `ac-measurability` (no
ACs).

Use this prompt verbatim for each sub-agent, substituting the
placeholders:

```text
Load and follow the grr-spec-validate skill — rubric: <RUBRIC_NAME>.

Inputs:
- artifact_path: <ABSOLUTE_PATH_TO_ARTIFACT>
- rubrics: <RUBRIC_NAME>   # exactly one of: ambiguity, ac-measurability, three-stage, checklist, brownfield-grounding
- checklist_path: <ABSOLUTE_PATH — only when RUBRIC_NAME is checklist>
- project_root: <ABSOLUTE_PROJECT_ROOT — only when RUBRIC_NAME is brownfield-grounding>
- brownfield_areas: <comma-separated paths/folders/feature names — optional scope hint for brownfield-grounding>
- reference_paths: <comma-separated absolute paths or omit>

Constraints:
- Run ONLY the rubric named above, and load only that rubric file.
  Sibling sub-agents hold the others.
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

Return: a single fenced JSON block carrying `verdict`, `artifact`, this
rubric's own fields per the SKILL.md schema, and `revision_pointers`.
Derive `verdict` from this rubric alone. No preamble, no prose.
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

Use when validating an epic of N stories. The two axes cross: one
sub-agent per (artifact × rubric) pair — N stories against four rubrics
is 4N sub-agents, not N.

Past roughly a dozen pairs, dispatch through the **Workflow** tool rather
than by hand: write a script with one `agent()` per pair (never batch
pairs into one agent), using the Step-2 prompt as each agent's prompt.
The tool caps concurrency and accounts for every pair.

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
[R] Run refine-story to update the artifact (recommended — keeps revision in fresh-context shape)
[E] Edit the artifact directly in this session
    (acknowledges that same-context revision is weaker than fresh — use only for small fixes)
[O] Override and proceed anyway
    (for cases where the user disagrees with the validator's assessment)
```

After the user picks `R` or `E` and the artifact is updated, the main
session **re-dispatches the full rubric set** (every dispatch is a fresh
sub-agent — idempotent and side-effect-free).

For `O`, log the override decision in the artifact's metadata or
sprint-status for traceability, then proceed.

---

## Example — full quick-story integration

Inside `quick-story` step-04 (after composing the story file):

```text
1. Ask the user: "Provide the codebase-convention checklist path for
   this project, or 'skip'."
2. Save the response as $CHECKLIST_PATH.
3. Look for a PRD under _bmad-output/. If found, save as $PRD_PATH.
4. Dispatch four sub-agents in one message — Step 2's prompt each, one
   per rubric: ambiguity | ac-measurability | three-stage | checklist.
   All four get:
     artifact_path  = <new story path>
     reference_paths = $PRD_PATH (omit if none)
   The checklist agent also gets checklist_path = $CHECKLIST_PATH; drop
   that agent entirely if the user said 'skip' (three agents then).
5. Merge the returned blocks per Step 2's "Merge the results".
6. Branch on the merged verdict (Step 4 above).
```
