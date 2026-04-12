---
name: 'step-01-init'
description: 'Greet user, collect input (story ref or URL + optional concern), determine branch (A=pre-dev / B=live-fix / C=no-story), route to next step'

nextStepFileA: './step-02a-plan-audit.md'
nextStepFileB: './step-02b-live-audit.md'
quickStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-quick-story.md'
---

# Step 1: Initialize & Branch Decision

## STEP GOAL:

Greet the user, collect minimal input (story reference or URL + optional concern in one round), determine which branch to enter (A=Pre-dev / B=Live-fix / C=No-story), and route to the appropriate next step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a UX-minded design partner starting a design pass
- ✅ Collect minimal input — ONE round, not an interview
- ✅ Route to the right branch quickly
- ✅ If branch is ambiguous, ask ONE clarifying question — do not guess

### Step-Specific Rules:

- 🎯 Focus ONLY on input collection and branch decision
- 🚫 FORBIDDEN to start analyzing content or dispatching skills in this step
- 🚫 FORBIDDEN to make skill selections here (that's step-02a/02b's job)
- 💬 Ask ONE concise question (or parse `$ARGUMENTS` if provided)
- 🔀 Route cleanly to step-02a / step-02b / quick-story delegate

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `branch` (A/B/C), `story_ref`, `url`, `user_concern`
- 🚫 FORBIDDEN to proceed past section 4 without a clear branch decision

## CONTEXT BOUNDARIES:

- Available: `sprint-status.yaml`, story files in `{implementation_artifacts}`, user input, `$ARGUMENTS`
- Focus: Input + branch decision only
- Limits: No content analysis, no skill dispatch
- Dependencies: None — first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Parse $ARGUMENTS (if provided)

**IF `$ARGUMENTS` is non-empty:**

Parse it for one of these patterns:
- **Story key / file path**: matches `q-*`, `dp-*`, `*-*-*.md`, or an explicit path ending in `.md` → likely Branch A
- **URL / route**: starts with `http`, `/`, or looks like a domain → likely Branch B
- **Vague description**: no clear story ref or URL → likely Branch C (or needs clarification)
- **Free-form concern text**: usually in quotes or after the main reference → `user_concern`

Confirm with a one-line echo:

"**Design Pass 시작! 🎨**

입력받은 내용: `{initial_input}`"

Skip to section 3.

**ELSE:** Proceed to section 2.

### 2. Collect Input

Greet and ask a single question:

"**Design Pass 시작해요! 🎨**

무엇을 봐드릴까요?

**[A] 개발 전** — 스토리 문서가 있고, UI/UX 관점을 미리 반영하고 싶으세요?
  → 스토리 key나 파일 경로를 알려주세요 (예: `q-1-profile-upload`)

**[B] 개발 중/후** — 실제 돌아가는 화면을 보고 개선안을 만들고 싶으세요?
  → URL 또는 경로를 알려주세요 (예: `/products`, `https://...`)

**[C] 스토리도 없어요** — 막연한 아이디어만 있어요
  → quick-story로 먼저 스토리를 만든 후 돌아올게요

**고민 사항이 있으시면 함께 말씀해주세요** (선택):
'뭔가 복잡해', '밋밋해', '완성도 부족해' 같은 한 줄도 OK. 없으면 제가 직접 보고 알아서 판단할게요."

**HALT and wait for user response.**

### 3. Parse Input Into Branch + Fields

From the user's response (or parsed `$ARGUMENTS`), extract:

- **`branch`**: `A`, `B`, or `C` — inferred from input patterns:
  - Story key/path → Branch A
  - URL / route → Branch B
  - Explicit "[A]", "[B]", "[C]" → that branch
  - Vague description with no ref → Branch C
- **`story_ref`**: extracted story key or file path (Branch A only)
- **`url`**: extracted URL or route (Branch B only)
- **`user_concern`**: any free-form concern text (all branches, optional)

**IF branch is ambiguous** (e.g., user gave a vague sentence without indicating type):

Ask ONE clarifying question:

"**확인해드릴게요** — 어느 쪽이에요?

- **[A]** 개발 전 문서에 UX 관점 추가 (스토리 파일 경로 알려주세요)
- **[B]** 이미 돌아가는 화면 개선 (URL 알려주세요)
- **[C]** 스토리부터 만들어야 해요"

**HALT and wait for user response.**

### 4. Handle Branch C — Delegate to quick-story

**IF `branch == 'C'`:**

"**먼저 스토리를 만들게요!** 📝

quick-story로 간단한 스토리를 만든 후, 바로 이 design-pass로 돌아와서 UX 관점을 추가할게요. 세션이 살아있으면 자동 체이닝, 그렇지 않으면 스토리 생성 후 호출 방법을 알려드릴게요."

Load, read entire file, then execute `{quickStoryCommand}` — pass the user's vague idea as the intent argument so quick-story can use it.

**After quick-story completes:**
- If the session is still active and the newly-created story_key is available, continue here as Branch A with that story_key
- Otherwise, inform the user: "quick-story 완료! `/bmad-grr-design-pass {new_story_key}` 로 다시 호출해주세요." and **END this workflow**

### 5. Route to Branch A or B

**IF `branch == 'A'`:**

"**Pre-dev Design Pass로 진행할게요.** 📄

- **대상 스토리:** `{story_ref}`
- **고민 사항:** {user_concern or '없음 — 문서만 보고 판단할게요'}

다음 단계에서 스토리 문서를 깊이 읽고 UX 리스크를 평가한 후 필요한 UX 스킬을 자동으로 선택할게요..."

Load, read entire file, then execute `{nextStepFileA}` — passing `story_ref` and `user_concern` in context.

**IF `branch == 'B'`:**

"**Live-fix Design Pass로 진행할게요.** 👁️

- **대상 URL:** `{url}`
- **고민 사항:** {user_concern or '없음 — 화면만 보고 판단할게요'}

다음 단계에서 실제 화면을 감사한 후 필요한 개선 스킬을 자동으로 선택할게요..."

Load, read entire file, then execute `{nextStepFileB}` — passing `url` and `user_concern` in context.

### 6. Auto-Proceed

#### Menu Handling Logic:

- Branch A → load, read entire file, then execute `{nextStepFileA}`
- Branch B → load, read entire file, then execute `{nextStepFileB}`
- Branch C → delegate to `{quickStoryCommand}` and END (or continue as A after return)

#### EXECUTION RULES:

- This is an auto-proceed init + branch step
- Only halt when: (a) user must provide input (section 2), or (b) branch is ambiguous (section 3 clarification)
- Do NOT load multiple next-step files — route to exactly one

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN input is collected AND branch decision is made will you proceed (or delegate to quick-story).

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- User input collected in ONE round (or parsed from `$ARGUMENTS`)
- Branch correctly inferred (A / B / C)
- `user_concern` captured if provided
- Clean routing to the appropriate next step (or quick-story delegate)

### FAILURE:

- Asking multiple rounds of questions
- Starting content analysis or skill dispatch in this step
- Failing to handle Branch C delegation
- Proceeding with ambiguous branch without clarifying
- Loading multiple next-step files

**Master Rule:** One question, one branch decision, one handoff. Fast path.
