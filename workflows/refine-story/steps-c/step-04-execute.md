---
name: 'step-04-execute'
description: 'Execute approved story modifications and sprint_status updates'

nextStepFile: './step-05-complete.md'
---

# Step 4: Execute Modifications

## STEP GOAL:

Execute the approved modifications from step-03 — update existing story documents, create new stories if needed, and update sprint_status.yaml so dev-story can pick up the refined work.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a precise document editor following approved specifications
- ✅ Prescriptive execution — follow the approved plan exactly
- ✅ Double-check every modification against the approved proposal

### Step-Specific Rules:

- 🎯 Execute ONLY the approved modifications from step-03
- 🚫 FORBIDDEN to add changes not approved by the user
- 🚫 FORBIDDEN to skip the sprint_status update
- 💬 Report each modification as it's made
- 🎯 Preserve existing document format and structure when modifying

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Modify story files in place, preserving format
- 📖 Update sprint_status.yaml after story modifications
- 🚫 FORBIDDEN to proceed without showing user the final result

## CONTEXT BOUNDARIES:

- Available: Approved modification plan from step-03, story documents, sprint_status.yaml
- Focus: Precise document modification and status updates
- Limits: ONLY execute what was approved — no improvisation
- Dependencies: Approved change plan from step-03

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Confirm Execution Plan

Briefly recap the approved changes:

"**승인된 수정 사항을 실행할게요:**

{for each story:}
- **{story_key}:** {action: modify/create} — {brief summary of changes}

**시작할게요!**"

### 2. Execute Story Modifications

**For each story being MODIFIED:**

1. **Read the current story file** (full content)
2. **Update Acceptance Criteria:**
   - Modify existing ACs as approved
   - Add new ACs as approved
   - Preserve unchanged ACs exactly
3. **Update Tasks/Subtasks:**
   - Modify task descriptions as approved
   - Add new tasks/subtasks as approved
   - Reset modified tasks to unchecked: `[ ]`
   - Keep correctly completed tasks as: `[x]`
   - Preserve task numbering consistency
4. **Update Dev Notes:**
   - Append refinement context:
     ```
     ### Refinement ({date})
     **Reason:** {why this refinement was needed}
     **Changes:** {summary of what was modified}
     **Visual Findings:** {if any from step-02}
     ```
5. **Update Status:**
   - Set status to `ready-for-dev` (so dev-story can pick it up)
6. **Write the modified file** — preserve all existing formatting and sections not being modified

Report: "**{story_key} 수정 완료** — AC {n}개 변경, Task {n}개 변경, Dev Notes 업데이트"

**For each NEW story being CREATED:**

1. **Use existing story file format** as reference (from the loaded stories)
2. **Create story document** with:
   - Story title and description
   - Acceptance Criteria (from approved plan)
   - Tasks/Subtasks (all unchecked `[ ]`)
   - Dev Notes with creation context
   - Status: `ready-for-dev`
3. **Place in {implementation_artifacts}** with appropriate naming convention

Report: "**{new_story_key} 생성 완료** — AC {n}개, Task {n}개"

### 3. Update Sprint Status

Load and update {sprint_status}:

1. **For modified stories:**
   - Set status to `ready-for-dev`
2. **For new stories:**
   - Add new story entry with status `ready-for-dev`
3. **Preserve ALL existing comments, structure, and other entries**
4. **Write the updated sprint-status.yaml**

Report: "**sprint-status.yaml 업데이트 완료**"

### 4. CHECKPOINT: Show Final Result

Present a summary of all modifications:

"**실행 결과:**

**수정된 스토리:**
{for each modified story:}
- **{story_key}:**
  - AC 변경: {changes summary}
  - Tasks 변경: {n}개 수정, {n}개 추가, {n}개 체크 해제
  - Status: ready-for-dev ✓

**생성된 스토리:**
{for each new story:}
- **{story_key}:** {title}
  - AC: {n}개, Tasks: {n}개
  - Status: ready-for-dev ✓

**sprint-status.yaml:** 업데이트 완료 ✓

**확인해 주세요. 수정할 부분이 있으면 알려주세요.**"

**HALT and wait for user response.**

**IF user wants adjustments:** Make the specific adjustment and re-present.
**IF user confirms:** Proceed to menu.

### 5. Present MENU OPTIONS

Display: **[C] Continue to Completion**

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN all approved modifications are executed, sprint_status is updated, and user confirms the results will you proceed to step-05-complete.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All approved AC changes applied correctly
- All approved task changes applied with proper checkbox states
- Dev Notes updated with refinement context
- Story status set to ready-for-dev
- Sprint_status.yaml updated
- Existing document format and structure preserved
- User confirmed final results

### FAILURE:

- Adding unapproved changes
- Not resetting modified tasks to [ ]
- Breaking existing document format
- Not updating sprint_status.yaml
- Not preserving unchanged sections
- Proceeding without user confirmation of results

**Master Rule:** Execute EXACTLY what was approved. Preserve document integrity. sprint_status update is non-negotiable.
