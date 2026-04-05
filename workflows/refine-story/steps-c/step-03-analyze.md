---
name: 'step-03-analyze'
description: 'Analyze gaps between story documents and current state, determine refinement approach'

nextStepFile: './step-04-execute.md'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
brainstormingTask: '{project-root}/_bmad/core/tasks/brainstorming.xml'
---

# Step 3: Analysis & Decision

## STEP GOAL:

Analyze the gap between story documents and the current implementation/feedback state, determine whether to modify existing stories or create new ones, and get user confirmation on the refinement approach.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a senior development analyst performing gap analysis
- ✅ Analytical but collaborative — present findings clearly, seek user validation
- ✅ You bring systematic analysis expertise, the user brings domain context

### Step-Specific Rules:

- 🎯 Focus on analysis and decision-making — do NOT modify documents yet
- 🚫 FORBIDDEN to modify any story documents in this step
- 💬 Present analysis results clearly with evidence
- 🎯 Use sub-agents for parallel analysis when handling multiple stories (Pattern 2 & 4)
- 🎯 Use web search if error causes are unclear
- ⏸️ CHECKPOINT: Must get user confirmation before proceeding

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Document analysis findings and proposed changes
- 📖 Track decision: modify existing vs create new for each story
- 🚫 FORBIDDEN to proceed without user approval of proposed changes

## CONTEXT BOUNDARIES:

- Available: Story documents from step-01, visual findings from step-02 (if any), user's situation description
- Focus: Gap analysis and change proposal
- Limits: Analysis and proposal only — no execution
- Dependencies: Story documents and situation context from previous steps

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Analyze Current State

**For single story:**
- Compare story's AC and Tasks against the user's reported situation
- Check which tasks are marked complete [x] vs incomplete [ ]
- Identify what was implemented correctly vs what diverged
- Note any missing requirements not captured in the original story

**For multiple stories / epic:**
- DO NOT BE LAZY - For EACH story file, launch a sub-agent that:
  1. Loads the story document
  2. Analyzes AC satisfaction, task completion, and divergence from user's reported situation
  3. Returns structured findings: {story_key, gaps_found, tasks_affected, recommendation}
- If sub-agents unavailable: analyze each story sequentially in main thread
- Aggregate findings across all stories

**If error cause is unclear:**
- Use web search to investigate potential causes
- Search for related error messages, framework behaviors, or known issues
- Include findings in the analysis

### 2. Determine Refinement Approach

For each story, decide:

**A. Modify Existing Story** (most common case):
- The original intent is correct but implementation diverged
- AC needs adjustment to reflect corrected understanding
- Tasks need updating (new subtasks, modified acceptance criteria)
- Use when: result differs from expectation, bug fix, minor scope change

**B. Create New Story** (less common):
- Completely independent improvement or feature
- Original story is correctly implemented — this is additive work
- Use when: new feature request, independent enhancement, separate scope

Present the decision for each story:

"**분석 결과:**

**{story_key}:**
- **상태:** {current_state_summary}
- **갭:** {gaps_identified}
- **제안:** {modify_existing / create_new}
- **이유:** {rationale}

{repeat for each story if multiple}

**전체 접근 방향:**
- 기존 수정: {count}개 스토리
- 신규 생성: {count}개 스토리"

### 3. Propose Specific Changes

For each story being modified, outline specific changes:

"**{story_key} 수정 계획:**

**AC 변경:**
- [수정] AC-1: {original} → {proposed}
- [추가] AC-N: {new acceptance criteria}

**Tasks 변경:**
- [수정] Task 1.1: {original} → {proposed} (체크 해제 [ ])
- [추가] Task 1.N: {new task description}
- [유지] Task 2.1: {unchanged, stays [x]}

**Dev Notes 추가:**
- 수정 배경: {why this change is needed}
- 관련 발견: {visual findings if any}"

For new stories, outline:
- Story title and description
- Proposed AC
- Proposed tasks
- Relationship to existing stories

### 4. CHECKPOINT: User Confirmation

"**이 수정 방향이 맞나요?**

수정할 부분이 있으면 알려주세요. 확인되면 실행 단계로 넘어갈게요."

**HALT and wait for user response.**

**IF user wants changes:** Adjust the proposal, re-present, and ask again.
**IF user wants to explore alternatives:** Suggest using Party Mode or Advanced Elicitation.
**IF user confirms:** Proceed to menu.

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [B] Brainstorming [C] Continue to Execution

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF B: Execute {brainstormingTask}, and when finished redisplay the menu
- IF C: Load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the user has confirmed the refinement approach and selects 'C' will you proceed to step-04-execute.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Thorough gap analysis between stories and current state
- Clear decision for each story: modify vs create new
- Specific change proposals with evidence
- User explicitly confirmed the approach
- Visual findings (if any) incorporated into analysis
- Sub-agents used for parallel analysis when multiple stories (if available)

### FAILURE:

- Modifying documents before user confirmation
- Shallow analysis without checking AC and tasks
- Not presenting specific change proposals
- Proceeding without user checkpoint
- Not using web search when error cause is unclear
- Being lazy with multi-story analysis (not using sub-agents or sequential analysis)

**Master Rule:** ANALYZE and PROPOSE only. Never modify documents in this step. User confirmation is mandatory.
