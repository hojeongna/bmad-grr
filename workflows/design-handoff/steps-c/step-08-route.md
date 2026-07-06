---
name: step-08-route
description: 'Produce standalone fix-prompts for surviving findings, offer a Design Sync push of the approved draft, log the outcome into the UX/UI Guide document, present final summary + routing menu'
quickStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-quick-story.md'
devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
designPassCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-pass.md'
uxGuidePath: '{ux_guide_path}'
---

# Step 8 — Fix-Prompts, Design Sync, Route

This is the tail end of the `[D]` (Claude Design) path from step-06/07. The `[C]` (direct implementation) path doesn't route here — step-07b's checklist-and-edit loop is its own closing point, since there's no external draft to Design-Sync-push and no separate fix-prompt to hand to a tool that already has the code in hand.

## Outcome

Every surviving `conformance_findings` entry has a standalone, independently-pasteable fix-prompt. If a Claude Design project is attached, the user has been offered a Design Sync push of the approved draft. The user sees a final summary and picks what happens next.

## Approach

### Fix-prompts (only if `conformance_findings` is non-empty)

For each finding (or small cluster of findings on the same screen), write a fix-prompt that stands alone — restate the requirement it violates and the concrete change needed, without assuming the reader has the rest of this conversation. These get pasted straight back into the same Claude Design chat.

Present them as separate fenced blocks, one per fix, labeled by screen.

### Design Sync push (only if `claude_design_project` was set in step-03)

Ask whether to push the approved draft into that Claude Design project so it's saved as reusable design-system content:

```
[Y] {claude_design_project.name}에 저장   [N] 저장 안 함
```

On `Y`: call `DesignSync` — `get_project` to confirm it's still `type: PROJECT_TYPE_DESIGN_SYSTEM`, then `finalize_plan` with the approved screen file(s) as `writes` and the local directory they live in as `localDir`, then `write_files`. If the screens are meant to show up as cards in the Design System pane, add `@dsCard group="..."` as the first line of each preview file, or fall back to `register_assets` for hand-authored previews without that marker. Report what was written.

### Log the outcome into the UX/UI Guide document

Append one entry to `{uxGuidePath}` section 6 (Handoff Log): date, verification result summary (`conformance_findings` count and what they were), fix-prompts issued (count), Design Sync push result (pushed / skipped, with `projectId` if pushed). Set the frontmatter `status: final` if the user is stopping here with an approved draft, or leave it `draft` if fix-prompts are still outstanding — a later `design-handoff` run can resume from this same guide.

### Final summary

```
🎨✨ Design Handoff 완료

모드: {greenfield/brownfield/개선만}
PRD/스토리: {prd_or_story_path or "없음 (개선 전용)"}
갭 스캔: {n}개 [ASSUMPTION]
Mobbin 레퍼런스: {n}개
디자인 시스템: 로컬 {summary} / 클로드 디자인 {project name or "미연동"}
검증 결과: {n}개 이슈 → 수정 프롬프트 {n}개 생성 / Design Sync: {저장함 / 안 함}
UX/UI 가이드: {ux_guide_path}
프롬프트 파일: {handoff_output_path}/prompt-{date}.md
```

### Offer routing

- `[Q]` Run `quick-story` now — wrap this UI work into a lightweight story before implementation (recommended when there's no PRD-derived story yet).
- `[D]` Run `dev-story` now — implement directly, if a story already exists that this handoff was meant to inform.
- `[U]` Note that `design-pass` is the right next stop once this is actually built and running (live-screen audit) — not something to chain into immediately from a static HTML draft.
- `[S]` Stop — everything is saved; resume anytime by pointing a future `design-handoff` run at the same `{handoff_output_path}` folder.

Halt for input. Execute the choice by loading the corresponding command file (`{quickStoryCommand}` / `{devStoryCommand}`), passing the draft screens and any staged story context. On `U` or `S`, just tell the user what's saved and end the workflow.
