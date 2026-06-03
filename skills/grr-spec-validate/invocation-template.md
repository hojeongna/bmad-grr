# Invocation template — grr-spec-validate

This is the prompt the **main session** uses when dispatching
grr-spec-validate to a sub-agent. The main session is responsible for:

1. Gathering inputs (especially asking the user for `checklist_path`).
2. Deciding which rubric(s) to run and whether to parallelize.
3. Calling Task / Agent with the prompt below.
4. Parsing the returned JSON block and deciding the next step.

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

## Step 2 — Dispatch prompt (single sub-agent, all rubrics)

Use this prompt verbatim, substituting the placeholders. This is the
default mode — fastest to author, sub-agent runs the four rubrics
sequentially.

```text
Load and follow the grr-spec-validate skill.

Inputs:
- artifact_path: <ABSOLUTE_PATH_TO_ARTIFACT>
- rubrics: ambiguity, ac-measurability, three-stage, checklist
           # brownfield specs: also add `brownfield-grounding`
- checklist_path: <ABSOLUTE_PATH or omit if user said 'skip'>
- project_root: <ABSOLUTE_PROJECT_ROOT — required only if brownfield-grounding is in rubrics>
- brownfield_areas: <comma-separated paths/folders/feature names — optional scope hint for brownfield-grounding>
- reference_paths: <comma-separated absolute paths or omit>

Constraints:
- For the artifact-only rubrics you see ONLY the artifact, the rubric
  files in this skill, the checklist (if provided), and reference files
  (if provided).
- For the brownfield-grounding rubric ONLY, you may additionally
  Read/Glob/Grep the project source under project_root — to VERIFY the
  spec's claims about existing code, never to edit.
- You do NOT have access to the main conversation that produced this
  artifact.
- You do NOT modify the artifact or any source file. Return validation
  output only.
- If a rubric cannot be applied (missing input, malformed artifact),
  add a revision_pointer noting the issue and continue with remaining
  rubrics.

Return: a single fenced JSON block matching the schema in SKILL.md.
No preamble, no markdown prose around the block.
```

---

## Step 3 — Parallel dispatch (one sub-agent per rubric)

Use when speed matters and the artifact is large. Dispatch N sub-agents
concurrently, each running a single rubric:

```text
Load and follow the grr-spec-validate skill — rubric: <RUBRIC_NAME>.

Inputs:
- artifact_path: <ABSOLUTE_PATH>
- rubrics: <RUBRIC_NAME>          # one of: ambiguity, ac-measurability, three-stage, checklist, brownfield-grounding
- checklist_path: <PATH>          # required if RUBRIC_NAME == checklist
- project_root: <PATH>            # required if RUBRIC_NAME == brownfield-grounding
- reference_paths: <PATHS>        # optional

Return only the JSON fields for the requested rubric, with `verdict`
derived from that one rubric alone. The main session aggregates.
```

After all N sub-agents return, the main session merges:
- `verdict` = worst across sub-agents (any `REVISE` → overall `REVISE`)
- Concatenate per-rubric fields
- Union `revision_pointers`

---

## Step 4 — Batch dispatch (multiple artifacts in parallel)

Use when validating an epic of N stories. Dispatch N sub-agents, each
with the full rubric set on one story:

```text
Load and follow the grr-spec-validate skill.

Inputs:
- artifact_path: <STORY_N_PATH>
- rubrics: <as decided, default all four>
- checklist_path: <SHARED_PATH>
- reference_paths: <SHARED_PRD_PATH>

Return the single JSON block per the SKILL.md schema.
```

The main session collects N results and presents a per-story summary
to the user, sorted by verdict (REVISE first).

---

## Step 5 — Process the result

The main session parses the JSON. Branch on `verdict`:

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
session **re-dispatches the validator** (each dispatch is a fresh
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
4. Dispatch the validator (Step 2 prompt above) with:
     artifact_path = <new story path>
     rubrics = ambiguity, ac-measurability, three-stage, checklist
     checklist_path = $CHECKLIST_PATH (omit if 'skip')
     reference_paths = $PRD_PATH (omit if none)
5. Parse the returned JSON.
6. Branch on verdict (Step 5 above).
```
