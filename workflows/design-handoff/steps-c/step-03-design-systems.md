---
name: step-03-design-systems
description: 'Resolve which Claude Design (claude.ai/design) project this handoff targets, and offer SEED norm mode; the design system itself is never described here — the prompt tells Claude Design to read and use its own'
nextStepSeed: './step-03b-seed-design.md'
nextStepBrownfield: './step-04-brownfield-prep.md'
nextStepMobbin: './step-05-mobbin-research.md'
uxGuideTemplate: '{ux_guide_template}'
uxGuidePath: '{ux_guide_path}'
---

# Step 3 — Target Project & Norm Mode

## Outcome

`claude_design_project` (`projectId`/`name`, or `null` if skipped) and `seed_design_mode` (true/false) are resolved for step-06.

## Why this step no longer asks about a design system

It used to interview the user for their project's design system and paste a summary of it into the prompt. That's redundant work: section 0 of the handoff prompt already instructs Claude Design to check whatever design system its own project holds and use it. Describing a second design system alongside that instruction sets up a conflict the prompt then has to arbitrate — and the tool reading its own project always knows that system better than a summary written from the outside.

So this step resolves *which project* the work targets and nothing about its contents. The workflow never reads the design system (`list_files`/`get_file` are not called here); Claude Design reads its own.

### Claude Design project — check via DesignSync

Call the `DesignSync` tool with `method: list_projects`. (Its first call in a session may prompt to add design-system access — that's expected, not an error.)

- If one or more projects plausibly match this product, show them (name, `projectId`, `updatedAt`) and ask the user to confirm which one this handoff should target, or say none apply.
- If none match, ask whether to create one now (`create_project` with a sensible name derived from the project/PRD title) or skip entirely and produce a plain prompt with no persistent Claude Design project behind it.

### SEED norm mode — offer it, don't assume it

A design system — whichever one Claude Design ends up using — names components and colors. It is usually silent on how far apart two buttons sit, how long a sheet takes to open, when a spinner should become a skeleton, whether error copy may say "불가능합니다". SEED (daangn's design system) wrote that layer down with numbers, and step-03b can supply it. It doesn't compete with the design system in the target project: it never names a component, and where the two disagree the project's own system wins.

Fold the offer into the same round as the project question; it's a mode switch, not a separate interview.

Present both together in `{communication_language}`:

```
🧵 대상 프로젝트 확인

클로드 디자인: {matched project name + id, or "없음 — 새로 만들까요? / 그냥 진행할까요?"}
             (디자인 시스템은 클로드 디자인이 자기 프로젝트 걸 읽어서 씁니다)

SEED 규범 모드: 디자인 시스템이 보통 안 정해두는 부분(간격 수치, 모션 시간, 로딩 임계값,
               UX 라이팅 Do/Don't)을 당근 SEED 규범으로 채워요. 컴포넌트는 안 건드립니다.

[Y] 이대로 진행 (SEED 끄고)   [D] SEED 규범 모드로 진행
[C] 클로드 디자인 프로젝트 새로 만들기   [S] 클로드 디자인 연동 스킵   [N] 취소
```

Halt for input. On `C`, call `create_project`, store the returned `projectId`. On `S`, set `claude_design_project = null` and note in the eventual prompt that there's no persistent project to anchor to. On `N`, end the workflow. Set `seed_design_mode = true` on `D`, `false` otherwise.

### Write into the UX/UI Guide document

If `{uxGuidePath}` doesn't exist yet (improvement-only mode — step-02 was skipped, so nothing has created it), create it now from `{uxGuideTemplate}`: frontmatter `mode: improvement-only`, `prd_or_story_path: none`, sections 1–2 filled sparsely from the existing screen capture and `user_concern` (there's no PRD to draw from), section 3 marked N/A per the template's improvement-only note.

Either way, fill Section 4 with the Claude Design project result (name + `projectId`, or "skipped"). Set `updated: {date}` in the frontmatter. Leave the SEED subsection alone — step-03b fills it when the mode is on, and the template's own "off" note stands when it isn't.

## Next

If `seed_design_mode` → load and follow `{nextStepSeed}`; it routes onward to brownfield/Mobbin itself.
Otherwise if `has_existing_screen` → load and follow `{nextStepBrownfield}`.
Otherwise → load and follow `{nextStepMobbin}`.
