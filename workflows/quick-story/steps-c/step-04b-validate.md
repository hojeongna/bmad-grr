---
name: step-04b-validate
description: 'Dispatch grr-spec-validate against the freshly composed story in a fresh sub-agent context; branch on PROCEED / REVISE before routing'
nextStepFile: './step-05-route.md'
recomposeStepFile: './step-04-compose.md'
validatorSkill: '~/.claude/skills/grr-spec-validate/SKILL.md'
validatorInvocation: '~/.claude/skills/grr-spec-validate/invocation-template.md'
---

# Step 4b — Validate Story

## Outcome

The composed story has passed an independent quality gate before routing — checked in a **fresh sub-agent context** so the writing context cannot defend its own output. On `PROCEED`, the workflow advances to step-05. On `REVISE`, use the revision choices below.

## Approach

### 1. Resolve checklist input

Use the supplied `checklist_path` or `skip`. Ask only if neither is known. Read a supplied file; if missing/empty, report it and ask once for a valid path or `skip`.

### 2. Dispatch independent validation

Follow `{validatorInvocation}` with the story's absolute `artifact_path`, `prd_path` as a reference when present, and applicable rubrics: `ambiguity`, `ac-measurability`, `three-stage`, plus `checklist` unless skipped and `brownfield-grounding` for existing code (pass `project_root` and touchpoints). Small uses one fresh validator for the entire set; full uses one per rubric. No validator inherits the writing conversation. Merge every applicable score; a missing result is REVISE.

### 3. Present the verdict to the user

Render in `{communication_language}`:

```
🧪 스토리 검증 결과

Verdict: <PROCEED | REVISE>
{rubric}: <score> [✓ / ✗]
...

(when REVISE)
수정 포인터:
- {revision_pointer_1}
- {revision_pointer_2}
...
```

Show only requested rubrics. For `ambiguity_offenders`, list each with location. For `ac_measurability` NO entries, list with issue. For `three_stage`, name the `weakest` stage. For `checklist_violations`, list HIGH-severity violations and their quotes.

### 4. Branch on verdict

**`PROCEED`** — Tell the user briefly ("검증 통과 — step-05로 진행") and advance.

**`REVISE`** — Halt for user choice:

```
[R] 다시 작성 (step-04로 돌아가 revision pointers를 반영해 재작성)
[E] 여기서 직접 수정 (스토리 파일을 inline 편집 후 step-04b를 다시 돌림)
[O] 무시하고 진행 (override, sprint-status에 'validator_overridden: true' 기록)
```

#### Choice handling

- **`R`** — Load `{recomposeStepFile}` with the revision pointers attached as additional context. The user's previous Mini PRD answers can be reused; only the sections covered by the pointers need re-thinking. After re-compose, step-04 routes back here (idempotent).

- **`E`** — Tell the user the story file path. They edit directly with their editor (or via the main session's Edit tool on small fixes). When they confirm "done", re-dispatch the applicable set under the same small/full policy, in fresh contexts.

- **`O`** — Append to the story file's Dev Notes:

  ```
  ### Validator override
  - validator: grr-spec-validate
  - verdict: REVISE
  - overridden: true
  - reason: <ask user for one-line reason and record it>
  - pointers ignored:
    - {pointer_1}
    - {pointer_2}
  ```

  Also append `validator_overridden: true` to the story's entry in `{sprint_status}`. Then advance to step-05.

## Next

On `PROCEED` (or `O` override): load and follow `{nextStepFile}`.
On `R`: load and follow `{recomposeStepFile}` (which routes back here).
On `E`: re-run this step's section 2 after the user's edits.
