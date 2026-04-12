---
name: 'step-03a-enhance-doc'
description: 'Branch A: Compose UX Considerations section from step-02a skill findings, present to user for approval, insert into story document preserving existing content'

nextStepFile: './step-04-route.md'

# Reference
uxChecklist: '~/.claude/workflows/design-pass/data/ux-checklist.md'
---

# Step 3a: Enhance Story Document with UX Considerations

## STEP GOAL:

Take the `skill_findings` from step-02a (base + auto-dispatched UX skills applied to the story) and write them into the story document as a "UX Considerations" section. Preserve all existing content, get user approval, save the enhanced story.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a precise document editor — preserve what works, add what's needed
- ✅ The UX Considerations section must be ACTIONABLE, not generic platitudes
- ✅ Every added guidance must tie back to a specific skill finding AND a specific story reference
- ✅ Less is more — only include subsections where the findings produced real guidance

### Step-Specific Rules:

- 🎯 Focus ONLY on composing and writing the UX Considerations section
- 🚫 FORBIDDEN to modify existing story sections (Mini PRD, Architecture, AC, Tasks) except to append the new UX section
- 🚫 FORBIDDEN to write the section without user approval
- 🚫 FORBIDDEN to include generic advice — every bullet must cite a specific source in the story
- 💬 Present the composed section to user before writing to disk
- 📝 Use `{uxChecklist}` as a structural guide for subsections

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `ux_considerations_section`, `story_path`
- 📖 Compose → present → confirm → write
- 🚫 FORBIDDEN to proceed without user approval

## CONTEXT BOUNDARIES:

- Available: `story_content` and `skill_findings` from step-02a, `{uxChecklist}` reference
- Focus: Compose + write the UX Considerations section
- Limits: Only append new content — do NOT edit existing sections
- Dependencies: step-02a findings

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Compose UX Considerations Section

Based on the `skill_findings` from step-02a, compose the UX Considerations section following the `{uxChecklist}` structure, BUT only include subsections that are RELEVANT to this story.

**Subsection selection rule (strict):**

- If a skill didn't produce findings for a dimension → SKIP that subsection
- If a dimension doesn't apply to this story → SKIP (e.g., no error handling concerns → skip "Error States")
- If a subsection would only contain generic platitudes → SKIP
- Only include subsections where the skill findings produced REAL, SPECIFIC, actionable guidance

**Target format:**

```markdown
## 🎨 UX Considerations (from design-pass)

**Enhancement date:** {{date}}
**Skills applied:** {{list of skill names applied, including base}}
**Reasoning source:** {{which AC/Tasks/Dev Notes/Risks/concern triggered the analysis}}

### {Subsection 1 — only if relevant}

- {specific guidance, citing the source in the story — e.g., "AC #3에 '5MB 초과' 언급, 에러 메시지 문구 정의 필요: '파일 크기는 5MB 이하여야 해요 (현재 {size}MB)' 같은 specific + actionable 형식"}
- {another specific guidance}

### {Subsection 2 — only if relevant}

- {specific guidance}

... (only include relevant subsections — NO generic padding)

### Reasoning Trail

- **Why `plan-design-review`**: base skill (always loaded for Branch A)
- **Why `critique`**: base skill (always loaded for Branch A)
- **Why `{skill_N}`**: {specific reference tying this skill to story content — e.g., "AC #3 'upload failure' + Dev Notes missing error UX → loaded to define error recovery"}
- ... (one line per additional skill selected in step-02a)
```

**Quality bar for each guidance bullet:**

❌ BAD: "Make error messages clear"
✅ GOOD: "에러 메시지 (AC #3): '파일이 너무 커요'가 아니라 '파일 크기는 5MB 이하여야 해요 — 현재 {actual_size}MB' 형식으로 — 사용자가 바로 행동 가능"

❌ BAD: "Ensure responsive design"
✅ GOOD: "모바일 < 640px (Dev Notes에 breakpoint 전략 없음): 드래그 앤 드롭 영역을 touch 친화적인 '파일 선택 버튼'으로 fallback, 업로드 진행률 표시는 full-width로"

Every bullet must:
1. Reference a specific location in the story (AC #N, Tasks 2.1, Dev Notes, Risks)
2. Be concrete enough to act on in implementation
3. Come from a specific skill's finding, not generic knowledge

### 2. Present Composed Section to User

"**UX Considerations 섹션 초안이 준비됐어요!** ✨

**대상 스토리:** `{story_ref}`
**추가될 위치:** 스토리 문서의 `## Dev Agent Record` 직전 (새 최상위 섹션으로)
**포함된 subsection 수:** {n}개
**적용된 스킬 수:** {n}개 ({list})

---

{full composed UX Considerations section in a code block}

---

**이 내용으로 스토리 문서에 추가할까요?**

- **(Y)** 네, 저장할게요
- **(E)** 수정할 부분이 있어요 — 알려드릴게요 (subsection 추가/제거/수정)
- **(R)** 다시 써주세요 (다른 각도로)
- **(N)** 취소 (저장 안 함)"

**HALT and wait for user response.**

**IF E:** Apply specific edits (add/remove/modify subsections or bullets), re-present.
**IF R:** Regenerate with different emphasis, re-present.
**IF N:** "저장하지 않고 종료합니다." END workflow.
**IF Y:** Proceed to section 3.

### 3. Insert into Story Document

Re-read the full story file at `{story_path}` (in case it changed during this session).

**Insertion rule:**

- Use Edit tool to insert the composed `## 🎨 UX Considerations (from design-pass)` section BEFORE `## Dev Agent Record`
- The old_string should match a unique marker near the insertion point
- Preserve ALL existing content EXACTLY — do not modify any existing sections
- If the story doesn't have `## Dev Agent Record` section, append the new section at the end of the file

**Safe insertion pattern:**

- old_string: `## Dev Agent Record` (the first occurrence — should be unique)
- new_string: `{composed UX Considerations section}\n\n## Dev Agent Record`

Use Edit tool for this targeted insertion. If Edit cannot match uniquely, fall back to reading the full file, constructing the updated content in memory, and writing it back with Write tool — but ONLY if Edit fails.

Report: "**UX Considerations 섹션 추가 완료** ✓
📄 `{story_path}`
**추가된 subsection:** {list}"

### 4. Update sprint-status.yaml (only if status changed)

Design-pass doesn't typically change story status — it enriches it. But if the story was in `draft` and the user explicitly requests the status to become `ready-for-dev` after enhancement, load `{sprint_status}` and update the corresponding entry while preserving all existing entries.

Usually this section is a no-op. Skip unless the user explicitly requests it.

### 5. Auto-Proceed to Routing

Display: "**스토리 문서 강화 완료! 다음 단계로 넘어갈게요...** 🚀"

#### Menu Handling Logic:

- After story is written (and sprint-status updated if applicable), immediately load, read entire file, then execute `{nextStepFile}`

#### EXECUTION RULES:

- Halt at section 2 (user approval gate)
- Do NOT proceed without explicit Y
- After Y, auto-proceed through sections 3-5

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the UX Considerations section is composed AND user approves AND the story is written will you proceed to step-04-route.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- UX Considerations section composed using skill findings with SPECIFIC story references
- Only RELEVANT subsections included (no generic padding)
- Every guidance bullet is actionable and cited
- User approved the section
- Story file updated with the new section — existing content preserved exactly
- Reasoning trail included at the end
- Auto-proceeded to step-04

### FAILURE:

- Generic platitudes in the UX Considerations section
- Not citing specific story references (AC/Tasks/Dev Notes)
- Modifying existing story sections beyond the insertion
- Writing without user approval
- Breaking existing story structure
- Including subsections with no real findings

**Master Rule:** Additive enhancement, never destructive edit. Cite every bullet. Skip irrelevant subsections. Quality over quantity.
