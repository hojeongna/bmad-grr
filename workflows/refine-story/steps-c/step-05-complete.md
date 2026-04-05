---
name: 'step-05-complete'
description: 'Summarize results and offer to chain into dev-story for immediate implementation'

devStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-dev-story.md'
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

### 2. Offer Next Steps

"**다음 어떻게 하시겠어요?**

**(D)** 바로 dev-story 실행 — 수정된 스토리를 이 세션에서 바로 구현 시작! 컨텍스트가 살아있어서 정확한 작업이 가능해요.
**(S)** 여기서 끝내기 — ���중에 별도로 dev-story를 실행할 수 있어요."

**HALT and wait for user response.**

### 3. Handle User Choice

**IF D (dev-story 실행):**

"**dev-story 워크플로우를 로드할게요!**

수정된 스토리 파일을 기반으로 바로 구현에 들어갑니다."

Load, read entire file, then execute {devStoryCommand} — pass the story file path as context so dev-story picks up the refined story directly.

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
