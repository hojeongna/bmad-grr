---
name: 'step-05-complete'
description: 'Summarize results and offer to chain into dev-story for immediate implementation, or into design-pass Branch A for UX enhancement'

devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
designPassCommand: '{project-root}/bmad-grr/commands/bmad-grr-design-pass.md'
---

# Step 5: Completion & Next Steps

## STEP GOAL:

Summarize the refinement results and offer the user the choice to immediately chain into dev-story for implementation or end the workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are wrapping up the refinement workflow
- ✅ Clear summary, actionable next steps

### Step-Specific Rules:

- 🎯 Focus on summarization and workflow chaining decision
- 🚫 FORBIDDEN to modify any documents in this step
- 💬 Present results clearly and offer next steps

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 This is the final step — no next step file

## CONTEXT BOUNDARIES:

- Available: All modifications from step-04, story paths, sprint_status state
- Focus: Summary and chaining decision
- Limits: No more modifications
- Dependencies: Completed modifications from step-04

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Present Final Summary

"**Refine Story 완료!**

**작업 요약:**

| 스토리 | 액션 | 변경 사항 | Status |
|--------|------|-----------|--------|
{for each story: | {story_key} | {modify/create} | {brief summary} | ready-for-dev ✓ |}

**sprint-status.yaml:** 업데이트 완료 ✓
**dev-story 픽업 준비:** 완료 ✓"

### 1b. Save Refinement Learnings (gstack/learn — OPTIONAL)

**IF `{learn_skill}` exists (gstack installed):** Refinement reveals gaps between what was planned and what actually happened — these gaps are rich learning material for future story cycles.

Load the FULL `{learn_skill}` file via Read tool, then save 1-3 entries based on what was learned during this refinement cycle. Each entry should capture a DISTINCT lesson:

- **If the gap was from architectural drift** (architecture was violated) → type `architecture`, insight describes the violated principle and how to catch it earlier
- **If the gap was from missed/ambiguous AC** → type `pattern`, insight describes the AC-writing lesson (e.g., "AC must specify error states explicitly when auth is involved")
- **If the gap was from a known anti-pattern** → type `pitfall`, insight describes the pattern and how to recognize it next time
- **If the gap was UI/UX consistency** → type `pattern`, insight describes the design consistency rule

Each entry:

- **key**: short kebab-case key (e.g., `auth-error-state-missing-from-ac`)
- **insight**: one-sentence lesson — the *why*, not the specific fix
- **confidence**: 5-10 based on how reproducible/well-understood the root cause is
- **files**: related story key + touched files
- **source**: `refine-story`

These entries become available to future story cycles (create-story, quick-story, dev-story, refine-story, bug-hunt, review-checklist) via `/learn search` and the learnings-based agents.

"**Refinement learnings saved** ({n} entries) — future story cycles will see these patterns."

**IF `{learn_skill}` does NOT exist:** Silently skip.

### 2. Offer Next Steps

"**다음 어떻게 하시겠어요?**

**(D)** 바로 dev-story 실행 — 수정된 스토리를 이 세션에서 바로 구현 시작! 컨텍스트가 살아있어서 정확한 작업이 가능해요.
**(U)** 🎨 design-pass Branch A 먼저 — 수정된 스토리에 UI/UX 관점을 추가 보강 (UI refine의 경우 추천)
**(S)** 여기서 끝내기 — 나중에 별도로 dev-story를 실행할 수 있어요."

**HALT and wait for user response.**

### 3. Handle User Choice

**IF D (dev-story 실행):**

"**dev-story 워크플로우를 로드할게요!**

수정된 스토리 파일을 기반으로 바로 구현에 들어갑니다."

Load, read entire file, then execute {devStoryCommand} — pass the story file path as context so dev-story picks up the refined story directly.

**IF U (design-pass Branch A):**

"**design-pass Branch A 로드할게요!** 🎨

수정된 스토리에 UI/UX 관점을 보강합니다. design-pass가 `plan-design-review` + `critique` + 관련 UX 스킬을 자동으로 선택해 스토리 문서에 UX Considerations 섹션을 추가합니다. 완료 후 돌아와서 D/S 다시 선택할 수 있어요."

Load, read entire file, then execute {designPassCommand} — pass the refined story key/path as context so design-pass Branch A picks it up directly.

After design-pass completes, **return to section 2** and re-offer **D / S** (U is consumed).

**IF S (끝내기):**

"**수고하셨어요!**

수정된 스토리는 sprint-status에 `ready-for-dev`로 표시되어 있으니, 새 세션에서 `grr-dev-story`를 실행���면 자동으로 픽업돼요.

**수정된 파일들:**
{list all modified/created file paths}

감사합니다!"

**END workflow.**

**IF Any other:**
Help user respond, then redisplay the D/S options.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Clear final summary presented
- User given meaningful choice between immediate dev-story and ending
- If D selected: dev-story workflow loaded with correct story context
- If S selected: clear guidance on how to resume later

### FAILURE:

- Not presenting summary
- Not offering dev-story chaining option
- Loading dev-story without user choosing D
- Not providing file paths when ending

**Master Rule:** Give the user a clear, informed choice. Both options are valid.
