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

The composed story has passed an independent quality gate before routing — checked in a **fresh sub-agent context** so the writing context cannot defend its own output. On `PROCEED`, the workflow advances to step-05. On `REVISE`, the user chooses to re-compose, edit inline, or override.

## Why a separate step

The story drafted in step-04 was authored in this session's context. Asking the same context to validate it would mask sycophancy and anchoring. The `grr-spec-validate` skill is read-only and **dispatched via Agent / Task** so the validator only sees the artifact, the rubrics, the checklist (user-provided), and the upstream PRD (if found in step-02). Nothing else.

## Approach

### 1. Ask the user for the checklist path

In `{communication_language}`:

```
스토리 검증을 위해 코드베이스 컨벤션 체크리스트가 있다면 절대 경로를 알려주세요.
없으면 `skip`이라고 입력하시면 됩니다 — 체크리스트 rubric만 빠지고 나머지 3개는 그대로 돌립니다.
```

Halt for input. Save as `checklist_path` (or `null` if `skip`).

If the path was given but the file does not exist or is empty, tell the user briefly and re-ask once. After one retry, default to `skip`.

### 2. Dispatch grr-spec-validate (single sub-agent, all rubrics)

Load `{validatorInvocation}` for the canonical dispatch prompt. Then invoke `Task` / `Agent` with:

```text
Load and follow the grr-spec-validate skill.

Inputs:
- artifact_path: <absolute path to {story_path} composed in step-04>
- rubrics: ambiguity, ac-measurability, three-stage, checklist
- checklist_path: <checklist_path, OR omit this line entirely if 'skip'>
- reference_paths: <prd_path from step-02, OR omit if null>

Constraints:
- You see ONLY the artifact, the rubric files in this skill, the
  checklist (if provided), and the reference PRD (if provided).
- You do NOT have access to the main conversation that produced this
  artifact.
- You do NOT modify the artifact. Return validation output only.

Return: a single fenced JSON block matching the schema in SKILL.md.
No preamble, no markdown prose around the block.
```

The sub-agent returns one fenced JSON block per `{validatorSkill}` schema. Parse it.

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

- **`E`** — Tell the user the story file path. They edit directly with their editor (or via the main session's Edit tool on small fixes). When they confirm "done", **re-dispatch step 2 above** — fresh sub-agent each time, no shared state across dispatches.

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

### 5. (Optional) Parallel-rubric mode

For a long story (> 500 lines) or when iteration speed matters, the main session may dispatch four sub-agents in parallel — one per rubric — using the Step-3 prompt template in `{validatorInvocation}`. The verdict is the worst across the four; `revision_pointers` are the union. This is a performance optimization; behavior is identical.

## Next

On `PROCEED` (or `O` override): load and follow `{nextStepFile}`.
On `R`: load and follow `{recomposeStepFile}` (which routes back here).
On `E`: re-run this step's section 2 after the user's edits.
