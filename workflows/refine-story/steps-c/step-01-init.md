---
name: 'step-01-init'
description: 'Collect situation context, discover and load relevant story documents'

nextStepFile: './step-02-verify.md'

# Story and sprint references (from workflow.md config)
# implementation_artifacts, sprint_status, project_context are available from workflow config
---

# Step 1: Initialize & Situation Assessment

## STEP GOAL:

Collect the user's situation description (what went wrong, what needs improvement), discover and load all relevant story documents, and prepare the context for analysis.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior development analyst specializing in gap analysis between story docs and implementation
- ✅ You bring analytical expertise, the user brings their domain knowledge and feedback
- ✅ Collaborative dialogue — understand the situation before acting

### Step-Specific Rules:

- 🎯 Focus ONLY on collecting situation context and loading story documents
- 🚫 FORBIDDEN to start analyzing or modifying documents in this step
- 🚫 FORBIDDEN to skip user situation input
- 💬 Ask clarifying questions if the situation description is unclear
- 🎯 Use sub-agents for parallel story loading when handling epic-level input (Pattern 4)
- 🎯 Use grep/search across files to discover relevant stories (Pattern 1)

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track all discovered story paths and their current status
- 📖 Load all context before proceeding
- 🚫 FORBIDDEN to proceed without at least one story document loaded

## CONTEXT BOUNDARIES:

- Available: sprint-status.yaml, project-context.md, story files in {implementation_artifacts}
- Focus: Situation understanding and document discovery
- Limits: Do NOT analyze or modify anything yet
- Dependencies: None — this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Collect Situation Context

Greet the user and ask for their situation:

"**Story Refinement 워크플로우를 시작할게요!**

어떤 상황인지 알려주세요:
- 어떤 문제가 있었나요? / 어떤 개선이 필요한가요?
- 관련 스토리 파일 경로나 에픽 번호가 있으면 함께 알려주세요.
- 확인할 URL이 있으면 그것도요."

**HALT and wait for user response.**

### 2. Parse User Input

From the user's response, extract:

- **Situation description**: What went wrong or what needs improvement
- **Story references** (if provided): File paths, story keys, or epic numbers
- **URLs** (if provided): For visual verification later
- **Scope**: Single story, multiple stories, or epic-level

### 3. Discover Story Documents

**IF user provided specific story file path(s):**
- Read COMPLETE story file(s) directly
- Extract story_key from filename or metadata
- Note current status from frontmatter

**IF user provided an epic number:**
- Load {sprint_status} (sprint-status.yaml)
- Find all story keys belonging to the specified epic
- Launch sub-agents in parallel to load each story file (Pattern 4: Parallel Execution)
  - Each sub-agent loads one story file and returns: story_key, status, tasks summary, AC summary
  - If sub-agents unavailable: load stories sequentially in main thread
- Collect all story documents for the epic

**IF user described situation without specific references:**
- Load {sprint_status} to see all stories and their status
- Search {implementation_artifacts} for story files matching the user's description
- Launch a subprocess to grep across story files for relevant keywords (Pattern 1: Grep)
  - Returns: matching file paths and relevant lines
  - If subprocess unavailable: search sequentially in main thread
- Present discovered stories to user for confirmation:

"이런 스토리들을 찾았어요:
[1] {story_key_1} - {title} (status: {status})
[2] {story_key_2} - {title} (status: {status})
...

어떤 스토리가 관련이 있나요? (번호로 선택, 쉼표로 구분)"

**HALT and wait for user selection if presenting choices.**

### 4. Load Project Context

- Load {project_context} for coding standards and project patterns (if exists)
- Note any relevant architectural context that may affect the refinement

### 5. Present Context Summary and Proceed

"**컨텍스트 로딩 완료!**

**상황:** {situation_summary}
**대상 스토리:** {story_count}개
{for each story: - {story_key}: {title} (status: {status}, tasks: {complete}/{total})}
**스코프:** {single_story/multi_story/epic}

**다음 단계: 시각적 검증으로 넘어갈게요...**"

### 6. Auto-Proceed

Display: "**Proceeding to visual verification...**"

#### Menu Handling Logic:

- After situation context is collected and story documents are loaded, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed init step
- Proceed directly to next step after context is loaded
- ONLY halt if user input is needed (story selection, clarification)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN situation context is collected and at least one story document is loaded will you proceed to step-02-verify.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- User's situation clearly understood and documented
- All relevant story documents discovered and loaded
- Story status and task completion state noted for each
- Project context loaded (if exists)
- Context summary communicated to user
- Auto-proceeded to step-02

### FAILURE:

- Proceeding without user's situation description
- Not loading complete story files
- Skipping story discovery when no direct path provided
- Starting analysis or modification in this step
- Not presenting choices when multiple stories discovered

**Master Rule:** Understand the situation and load ALL relevant context. Skipping this is SYSTEM FAILURE.
