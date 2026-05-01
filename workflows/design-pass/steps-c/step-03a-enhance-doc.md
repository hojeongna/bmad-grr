---
name: step-03a-enhance-doc
description: 'Branch A — compose UX Considerations section from step-02a skill_findings; user-approve; insert into the story document preserving all existing content'
nextStepFile: './step-04-route.md'
uxChecklist: '~/.claude/workflows/design-pass/data/ux-checklist.md'
---

# Step 3a — Enhance Story Document

## Outcome

A `## 🎨 UX Considerations (from design-pass)` section is composed from step-02a's `skill_findings`, user-approved, and inserted into the story file before `## Dev Agent Record`. The section contains only subsections backed by real findings — no generic padding. Every guidance bullet cites a specific story location. All existing story sections are preserved exactly.

## Approach

### Compose the section

Use `{uxChecklist}` as a structural prompt for which subsections might apply. **Strictly include only subsections where a skill produced real, specific guidance** — skip anything that would only contain platitudes.

Target shape:

```markdown
## 🎨 UX Considerations (from design-pass)

**Enhancement date:** {{date}}
**Skills applied:** {{list including base inline framework + ui-ux-pro-max skills selected}}
**Reasoning source:** {{which AC/Tasks/Dev Notes/Risks/concern triggered the analysis}}

### {Subsection — only when relevant}
- {specific guidance citing the source — e.g., "AC #3에 '5MB 초과' 언급, 에러 메시지 정의 필요: '파일 크기는 5MB 이하여야 해요 (현재 {size}MB)' 형식 — 사용자가 바로 행동 가능"}

### {Another subsection — only when relevant}
- ...

### Reasoning Trail
- **Why {skill_X}**: {specific tie to story content}
- ...
```

Quality bar for every bullet:

- ❌ "Make error messages clear"
- ✅ "에러 메시지 (AC #3): '파일이 너무 커요'가 아니라 '파일 크기는 5MB 이하여야 해요 — 현재 {actual_size}MB' 형식으로 — 사용자가 바로 행동 가능"
- ❌ "Ensure responsive design"
- ✅ "모바일 < 640px (Dev Notes에 breakpoint 전략 없음): 드래그 앤 드롭 영역을 touch 친화적인 '파일 선택 버튼'으로 fallback, 업로드 진행률 표시는 full-width로"

Every bullet must reference a specific story location (AC #N / Tasks / Dev Notes / Risks), be concrete enough to act on, and trace back to a specific skill's finding.

### Present and approve

Show the composed section in `{communication_language}` with target story, insertion location (before `## Dev Agent Record`), subsection count, and skill list. Halt for input:

- `[Y]` Save
- `[E]` Edit specific parts (add/remove/modify subsections or bullets)
- `[R]` Regenerate with a different angle
- `[N]` Cancel — don't save

Apply edits or regenerate as requested, re-present until approved.

### Insert into the story

Re-read the story file in case it changed during the session. Use Edit tool for a targeted insertion: match `## Dev Agent Record` (the first occurrence — typically unique) as `old_string`, replace with `{composed UX Considerations}\n\n## Dev Agent Record`. If the story doesn't have that section, append the new section at the end.

If Edit can't match uniquely, fall back to reading the full file, constructing the updated content in memory, and writing it back with Write — but only if Edit fails. Preserve every existing section exactly.

Report briefly: file path and the subsection list added.

### Optional sprint-status update

Design-pass typically enriches, not status-changes. If the user explicitly requests `draft → ready-for-dev` after enhancement, update the matching entry in `{sprint_status}` while preserving all comments and structure.

## Next

Load and follow `{nextStepFile}`.
