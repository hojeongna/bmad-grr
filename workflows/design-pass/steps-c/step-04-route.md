---
name: step-04-route
description: 'Final summary; route to dev-story chaining (Branch A or B-N/S), refine-story delegation (B-A), or save-only exit'
devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
refineStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
---

# Step 4 — Route

## Outcome

The user sees a clear final summary, then chooses what to do next. The routing options depend on the branch and (for Branch B) the chosen save target. On `D`, dev-story is loaded with the correct story file. On `R` (Branch B + append), refine-story is loaded with the staged improvement doc. On `S`, the workflow ends with clear guidance on how to resume later.

## Approach

### Final summary

**Branch A:**

```
🎨✨ Design Pass 완료 (Pre-dev)

대상 스토리: {story_ref}
적용된 스킬: {n}개 ({list of base inline + ui-ux-pro-max skills})
추가된 UX subsection: {n}개
스토리 파일: {story_path} ✓
```

**Branch B:**

```
🎨✨ Design Pass 완료 (Live-fix)

대상 URL: {url}
Critique Overall: {score}/10
적용된 스킬: {n}개 ({list})
개선 제안: {total}개 (P0: {p0}, P1: {p1}, P2: {p2})
Save target: {save_target_description}
저장 위치: {story_path or 'staged for refine-story'}
sprint-status: {updated ✓ / skipped / will be handled by refine-story}
```

### Offer routing

**Branch A:**

- `[D]` Run `dev-story` now — implement the enhanced story with TDD in this session (recommended; context is warm).
- `[S]` Stop — file is saved; future `dev-story` invocations auto-pick it up.

**Branch B with `save_target_type == 'N'` (new story):**

- `[D]` Run `dev-story` now — implement `dp-{N}-{slug}` (recommended).
- `[S]` Stop — file is saved and registered as `ready-for-dev`.

**Branch B with `save_target_type == 'A'` (append to existing):**

- `[R]` Run `refine-story` — delegate the staged improvement doc to refine-story for gap analysis and update of `{target_story_key}` (recommended).
- `[S]` Stop — improvement doc is in context only; nothing was written.

**Branch B with `save_target_type == 'S'` (file only):**

- `[D]` Run `dev-story` now — implement using the story path directly (sprint-status was skipped per the user's choice; pass the file path explicitly).
- `[S]` Stop — file is saved but not registered; later you can run `/bmad-grr-dev-story {story_key}` manually.

Halt for input.

### Execute the routing

- `D` → load and follow `{devStoryCommand}` with the explicit story path. End this workflow.
- `R` → load and follow `{refineStoryCommand}` passing the target story key, the staged improvement doc as context, and a note that this is a design-pass handoff (not a post-dev gap). End this workflow.
- `S` → tell the user what was saved and how to resume. End this workflow.
