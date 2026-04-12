---
name: 'step-01-init'
description: 'Collect user intent in one round, detect existing stories in sprint-status, delegate to refine-story if a match is found'

nextStepFile: './step-02-analyze.md'
refineStoryCommand: '{project-root}/bmad-grr/commands/bmad-grr-refine-story.md'
---

# Step 1: Intent Collection & Existing Story Detection

## STEP GOAL:

Collect what the user wants to build or change in one concise round, scan `sprint-status.yaml` for any existing story that matches the described work, and delegate cleanly to `refine-story` when a match is found. Otherwise capture context for the analysis step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a pragmatic dev analyst helping scope a small, shippable change fast
- ✅ Warm and fast — collect intent in ONE round, do not over-interrogate
- ✅ Check for existing work BEFORE drafting anything new
- ✅ When an existing story is found, hand off cleanly without asking the user twice

### Step-Specific Rules:

- 🎯 Focus ONLY on intent collection and existing story detection
- 🚫 FORBIDDEN to start drafting PRD, architecture, or story in this step
- 🚫 FORBIDDEN to skip existing story detection
- 💬 Ask ONE concise question (or use `$ARGUMENTS` if provided) — not a multi-step interview
- 🔀 If an existing story clearly matches, delegate to refine-story immediately after user Y confirmation

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `intent`, `touchpoint_hints`, `change_type`, `existing_story_found`, `existing_story_path`
- 📖 Load sprint-status.yaml before deciding on existing-story detection
- 🚫 FORBIDDEN to proceed past section 3 without checking sprint-status

## CONTEXT BOUNDARIES:

- Available: `sprint-status.yaml`, story files in `{implementation_artifacts}`, user input, `$ARGUMENTS`
- Focus: Intent capture and existing work detection
- Limits: No drafting, no analysis, no design
- Dependencies: None — this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Collect User Intent

**IF `$ARGUMENTS` contains a clear intent description:**
Skip the question below and parse `$ARGUMENTS` directly as the user's intent. Confirm with a one-line echo:

"**Quick Story 시작합니다! ⚡**

입력받은 내용: `{intent_from_args}`"

**ELSE:**
Greet the user and ask for intent in a single round:

"**Quick Story 워크플로우를 시작할게요! ⚡**

어떤 걸 빠르게 만들고 싶으세요? 한 문장으로 알려주시면 돼요.

- 어떤 기능/수정인지 (예: '사용자 프로필 페이지에 이미지 업로드 추가')
- 관련 모듈/파일 경로가 있으면 함께요 (선택)
- 기존 스토리 키나 에픽 번호 알고 계시면 알려주세요 (선택)"

**HALT and wait for user response.**

### 2. Parse Intent Into Structured Fields

From the user's response (or `$ARGUMENTS`), extract:

- **`intent`**: One-sentence description of the change
- **`touchpoint_hints`**: Module/file paths or feature areas mentioned (if any)
- **`existing_story_ref`**: Explicit story key or file path (if mentioned)
- **`change_type`**: Infer one of `feature | fix | refactor | chore | ui | devex` from wording and touchpoints

**CRITICAL — `change_type` is consumed downstream:** step-03-architect reads this field to decide which CONDITIONAL skills to load:

| `change_type` | CONDITIONAL skill loaded in step-03 |
|---|---|
| `fix` | `systematic-debugging` (superpowers) — root cause framework |
| `ui` | `plan-design-review` (gstack) — design/UX gap check |
| `devex` | `plan-devex-review` (gstack) — DX friction analysis |
| `feature` / `refactor` / `chore` | none (only REQUIRED skills run) |

Be precise when inferring — err on the more specific category (e.g., a UI-touching feature is `ui`, not `feature`). If genuinely ambiguous, ask the user once.

### 3. Detect Existing Stories

**Branch A — user provided explicit story reference:**

- Read the referenced story file directly
- IF file exists → set `existing_story_found = true`, `existing_story_path = <path>`
- Skip to section 4

**Branch B — no explicit reference:**

- Load `{sprint_status}` (sprint-status.yaml) — read the full file
- Extract all story entries with their `key`, `title`, and `status`
- Match user `intent` against story titles and keys using semantic overlap — use your judgment on what "meaningfully matches" the intent (ignore generic verbs and articles naturally)

**IF at least one match found:**
Present the top 1-3 candidates to the user:

"**이런 기존 스토리가 발견됐어요:**

[1] `{story_key_1}` - {title_1} (status: {status_1})
[2] `{story_key_2}` - {title_2} (status: {status_2})

- **(Y)** 네, 이 중 하나를 수정할게요 → **refine-story로 넘어갈게요** 🔀
- **(N)** 아니요, 새로 만들게요 → quick-story 계속 진행
- **(번호)** 특정 스토리 지정 (예: '1') → 그 스토리로 refine-story 위임"

**HALT and wait for user response.**

- **IF Y or number**: Set `existing_story_found = true`, note the chosen `existing_story_path`, proceed to section 4
- **IF N**: Set `existing_story_found = false`, proceed to section 5

**IF no matches found:**
Set `existing_story_found = false`, proceed to section 5 silently (no need to tell user "no match" — that's the happy path for quick-story).

### 4. Delegate to refine-story (IF existing story found)

"**기존 스토리가 있으니 refine-story로 넘어갈게요! 🔀**

현재 상황과 스토리 경로를 그대로 넘겨드릴게요. refine-story에서 gap 분석 후 바로 수정에 들어갑니다."

Load, read entire file, then execute `{refineStoryCommand}` — pass the user's intent and `existing_story_path` as context so refine-story can pick up without re-asking.

**END this workflow.** (refine-story takes over from here.)

### 5. Present Context Summary and Proceed

**(Only reached when `existing_story_found = false`.)**

"**컨텍스트 정리 완료!** ✓

- **의도:** {intent_summary}
- **변경 타입:** {change_type}
- **힌트:** {touchpoint_hints or '없음 — 코드 스캔으로 탐색'}
- **기존 스토리:** 없음 (신규 생성)

**다음 단계: 코드 패턴 분석 & 학습 조회로 넘어갈게요...**"

### 6. Auto-Proceed

#### Menu Handling Logic:

- After context is captured and no existing story is found, immediately load, read entire file, then execute `{nextStepFile}`

#### EXECUTION RULES:

- This is an auto-proceed init step
- Only halt when: (a) user must provide intent, or (b) existing story match needs user confirmation
- After section 5 runs, proceed directly to next step

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN intent is captured AND existing story detection completed will you proceed to step-02-analyze (or delegate to refine-story in section 4).

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- User intent clearly captured in one round (or from `$ARGUMENTS`)
- `sprint-status.yaml` loaded and scanned for matches
- Existing story detected and delegated (IF match with Y confirmation), OR no match confirmed
- Context summary communicated
- Auto-proceeded to next step OR cleanly delegated to refine-story

### FAILURE:

- Skipping existing story detection
- Asking multiple rounds of questions in this step
- Starting analysis or drafting here
- Not delegating to refine-story when user confirms a clear match
- Delegating to refine-story WITHOUT user confirmation

**Master Rule:** One question, one sprint-status scan, one decision. Fast path only.
