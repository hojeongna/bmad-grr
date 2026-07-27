---
name: step-03p-doc-diff
description: 'Mode P — check the story document against the mockup spec, promote uncovered mockup elements and interactions into concrete AC and Tasks, user-approve, write back preserving everything else'
nextStepFile: './step-04-route.md'
fidelityRubric: '{fidelity_rubric}'
specDir: '{spec_dir}'
---

# Step 3P — Story Document Coverage

## Outcome

Every element, interaction, state, and copy string in the mockup spec has been checked against the story's Acceptance Criteria, Tasks, and Dev Notes. What the story doesn't cover has been turned into verifiable AC (Given/When/Then) and matching Tasks — not into a separate advisory section that `dev-story` can skip. The user approved the additions before anything was written, and every pre-existing section of the story survived unchanged.

## Approach

### Read both sides completely

Read the story file named by `story_ref` in full — frontmatter, Mini PRD, Mini Architecture, Acceptance Criteria, Tasks/Subtasks, Dev Notes, everything. If it's a story key, resolve it to `{implementation_artifacts}/{story_ref}.md`. Halt if it doesn't exist.

Read every `{specDir}/{slug}.mockup.md` produced by step-02. Read `project-context.md` (per `{project_context}`) if present — a convention already established project-wide doesn't need to be restated as a new AC.

### Walk the spec, not the story

Direction matters. Iterate over the mockup spec and ask of each item "does the story cover this?" — not over the story asking "is this in the mockup?". Reading story-first produces a comfortable-looking result because the story's own contents anchor the search, and the whole point of this mode is to find what nobody wrote down.

Per section:

- **S1 / S2** — is each structural region and component type accounted for by some AC or Task? A story that says "프로필 편집 화면 구현" does not cover a mockup's three distinct button variants.
- **S5** — every non-`none` interaction trace. This is where the biggest gaps live: a modal the mockup opens, a row that expands, a toast that fires. Static mockups whose traces are all `none` still carry affordances worth checking — a control that visibly exists needs a behavior specified somewhere.
- **S6** — each state the mockup renders. Unspecified empty/error/loading states are the single most reliable predictor of an implementation that diverges.
- **S4** — exact strings the mockup fixes. Copy the mockup pins down and the story leaves to the implementer will be invented.
- **S3 / S7** — token values and breakpoint behavior.

### Classify with the rubric's Mode P rules

Read `{fidelityRubric}` and apply its Mode P section. The split it enforces matters:

- Uncovered element or interaction → **new AC + new Task** (both halves, always).
- Covered by one but not the other → add the missing half.
- A concrete value the mockup fixes → **Dev Notes**, not AC. An acceptance criterion asserting an exact hex is brittle and adds nothing a spec reference doesn't already give.

Every proposed addition cites its spec anchor (`S5 / 필터 버튼 → modal-open`), and every new AC is written as Given/When/Then that someone could actually run. "업로드 UX를 개선한다" is not an acceptance criterion.

### Present and approve

```
📋 {story_ref} — 목업 커버리지

목업 스펙: {n}개 화면 / S5 인터랙션 {n}개 / S6 상태 {n}개

미커버 → AC + Task 승격 ({n}건)
- {item} ({spec anchor})
  AC: Given … When … Then …
  Task: …

반쪽만 커버 → 보완 ({n}건)
- {item} ({spec anchor}) — AC는 있는데 Task 없음 → Task 추가: …

Dev Notes 추가 ({n}건)
- {value} ({spec anchor})

보고만: F4 {n} · 목업 자체 문제 {n}

[Y] 반영   [E] 일부 수정   [R] 다시 뽑기   [N] 취소
```

Halt. Apply `E` / `R` and re-present until `Y`. On `N`, write nothing and go to step-04 with an empty result.

### Write back

Re-read the story file — it may have changed during the session. Then insert with targeted `Edit` calls, never a whole-file rewrite:

- New AC appended to the existing Acceptance Criteria section, continuing its numbering and matching its format exactly.
- New Tasks appended to Tasks/Subtasks as unchecked `[ ]`, each referencing its AC number the way the existing entries do.
- Dev Notes additions under a `### 목업 스펙 (design-pass {{date}})` subsection, each line citing its spec anchor and the spec file path.

Match the story's existing conventions rather than importing this workflow's formatting. Fall back to `Write` only if `Edit` genuinely cannot match, and only after reading the full current content.

Report the file path and a count of what was added to each section.

### Sprint status

Leave it alone unless the user asks. This step enriches a story; it doesn't change its readiness. If they do ask for `draft → ready-for-dev`, update the matching entry in `{sprint_status}` preserving all comments and structure.

## Next

Load and follow `{nextStepFile}`.
