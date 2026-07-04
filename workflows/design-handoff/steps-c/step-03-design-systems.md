---
name: step-03-design-systems
description: 'Ask the user directly whether a local design system exists (no file-hunting), check the Claude Design (claude.ai/design) design-system project, present both together, write the result into the UX/UI Guide document'
nextStepBrownfield: './step-04-brownfield-prep.md'
nextStepMobbin: './step-05-mobbin-research.md'
frontendDesignSkill: '{frontend_design_skill}'
uxGuideTemplate: '{ux_guide_template}'
uxGuidePath: '{ux_guide_path}'
---

# Step 3 — Design System Check (Local + Claude Design)

## Outcome

Both design-system questions are answered and shown to the user together: what this project already has locally, and what the target Claude Design project already has. `local_design_system` (source + summary, or `null`) and `claude_design_project` (`projectId`/`name`, or `null` if skipped) are resolved for step-06.

## Approach

### Local design system — ask, don't hunt for it

Don't go searching the project for `.impeccable.md`, `DESIGN.md`, or similar — ask the user directly, in `{communication_language}`:

```
이 프로젝트에 이미 쓰고 있는 로컬 디자인 시스템이 있나요? (스타일 가이드, 토큰, DESIGN.md, Figma 등 뭐든)
있으면 경로나 링크 알려주세요. 없으면 없다고 해주셔도 돼요.
```

Halt for input. If they point to something, read it (Read tool for a local path; take whatever they paste/describe otherwise) and summarize it as `local_design_system`. If they say there isn't one, set `local_design_system = null` — that's a legitimate answer, not a gap — and fall back to `{frontendDesignSkill}` for general aesthetic judgment, saying plainly that it's a generic default, not this project's own system.

### Claude Design project — check via DesignSync

Call the `DesignSync` tool with `method: list_projects`. (Its first call in a session may prompt to add design-system access — that's expected, not an error.)

- If one or more projects plausibly match this product, show them (name, `projectId`, `updatedAt`) and ask the user to confirm which one this handoff should target, or say none apply.
- If none match, ask whether to create one now (`create_project` with a sensible name derived from the project/PRD title) or skip entirely and produce a plain prompt with no persistent Claude Design project behind it.

Present both findings together in `{communication_language}`:

```
🧵 디자인 시스템 확인

로컬: {local design system summary, or "없음 — 일반 기준으로 진행"}
클로드 디자인: {matched project name + id, or "없음 — 새로 만들까요? / 그냥 진행할까요?"}

[Y] 이대로 진행   [C] 클로드 디자인 프로젝트 새로 만들기   [S] 클로드 디자인 연동 스킵   [N] 취소
```

Halt for input. On `C`, call `create_project`, store the returned `projectId`. On `S`, set `claude_design_project = null` and note in the eventual prompt that there's no persistent project to anchor to. On `N`, end the workflow.

### Write into the UX/UI Guide document

If `{uxGuidePath}` doesn't exist yet (improvement-only mode — step-02 was skipped, so nothing has created it), create it now from `{uxGuideTemplate}`: frontmatter `mode: improvement-only`, `prd_or_story_path: none`, sections 1–2 filled sparsely from the existing screen capture and `user_concern` (there's no PRD to draw from), section 3 marked N/A per the template's improvement-only note.

Either way, fill Section 4 (Design System) with the local summary and the Claude Design project result (name + `projectId`, or "skipped"). Set `updated: {date}` in the frontmatter.

## Next

If `has_existing_screen` → load and follow `{nextStepBrownfield}`.
Otherwise → load and follow `{nextStepMobbin}`.
