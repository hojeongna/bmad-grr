---
name: 'step-04-compose'
description: 'Collect 4-Q Mini PRD inline, run plan-ceo-review Premise Challenge, compose unified story (TDD-aware testing standards), register in sprint-status.yaml'

nextStepFile: './step-05-route.md'
storyTemplate: '~/.claude/workflows/quick-story/data/story-template.md'

# REQUIRED skills (load FULL when installed)
ceoReviewSkill: '~/.claude/skills/gstack/plan-ceo-review/SKILL.md'
tddSkill: '~/.claude/skills/test-driven-development/SKILL.md'
---

# Step 4: Compose Unified Story Document

## STEP GOAL:

Collect the 4-field Mini PRD in a single inline question round, combine it with the Mini Architecture and Impact Analysis from step-03, render the unified story from the template, and register it in `sprint-status.yaml` as `ready-for-dev`.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a precise document composer — minimal interrogation, maximum clarity
- ✅ Inline 4-Q approach: 4 quick questions in ONE message, not a 20-step interview
- ✅ After PRD collection, run plan-ceo-review Premise Challenge (REQUIRED) to pressure-test the "why"
- ✅ Produce dev-story-compatible output so chaining works without any transformation
- ✅ Preserve existing sprint-status.yaml structure exactly when registering
- ✅ Let judgment decide AC count, task count, and complexity rating — no hardcoded formulas

### Step-Specific Rules:

- 🎯 Focus on PRD collection, Premise Challenge, story composition, sprint-status registration
- 🚫 FORBIDDEN to skip any of the 4 PRD questions
- 🚫 FORBIDDEN to skip the plan-ceo-review Premise Challenge when the skill is installed
- 🚫 FORBIDDEN to skip the sprint-status.yaml update
- 🚫 FORBIDDEN to use a different story format than the template
- 🚫 FORBIDDEN to write the file before user approval
- 🔧 ALWAYS load `plan-ceo-review` + `test-driven-development` in FULL when installed
- 💬 Present the final rendered story for user approval before writing to disk

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track all template substitutions; track `story_key`, `story_path`, `story_content`
- 📖 Load the template before composing
- 🚫 FORBIDDEN to proceed without user approval of the final story

## CONTEXT BOUNDARIES:

- Available: Intent (step-01), context (step-02), mini architecture + impact (step-03), story template
- Focus: Mini PRD collection + story composition + registration
- Limits: 4 PRD questions max, one story file output, one sprint-status update
- Dependencies: Confirmed draft from step-03

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Inline Mini PRD Collection (4 Questions)

Ask all 4 questions in ONE message:

"**Mini PRD 질문 4개만 빠르게 물어볼게요!** 📝

모르시는 게 있으면 '모르겠어요'라고 답해주시면 제가 합리적인 기본값으로 채울게요.

1. **문제/동기:** 이 변경이 왜 필요한가요? (무엇을 해결하거나 개선하는지)
2. **대상 사용자:** 누가 이 변경으로 혜택을 보나요?
3. **성공 기준:** 어떻게 성공을 판단할 수 있나요? (관찰 가능한 결과)
4. **비범위:** 이번엔 절대 건드리지 않을 것은 무엇인가요?"

**HALT and wait for user response.**

Parse all 4 answers. For any `모르겠어요` / `skip` / empty responses, derive a reasonable default from context (step-01 intent, step-02 patterns, step-03 architecture). Note which were auto-filled so the user can correct later.

### 1b. Premise Challenge (REQUIRED — plan-ceo-review)

**IF `{ceoReviewSkill}` exists:** Load the **FULL** file via Read tool. Yes, all ~29K tokens. Read the entire plan-ceo-review skill end to end — internalize its Premise Challenge framework, Existing Code Leverage pattern, Dream State Mapping, Temporal Interrogation, CEO/founder judgment, and engineering preferences.

Apply a **lightweight Premise Challenge** to the 4-field Mini PRD the user just provided — not a full CEO review, just a pressure test:

1. **Premise Challenge**: Is the stated problem the real problem? Is there a simpler cut?
2. **Existing Leverage**: Is there existing code, feature, or story that already solves (or half-solves) this? Cross-check with step-02 prior learnings and touchpoints.
3. **10x Check**: What would the same change look like at 10x ambition? (Just note — do not expand scope without user approval.)
4. **Hidden Scope**: Are there obvious follow-ups the user didn't mention that should be bundled cheaply, or explicitly deferred?

**IF the challenge surfaces a significant concern**, present it to the user:

"**Premise Challenge 결과 💡**

- **{concern_1}**
- **{concern_2}**

**어떻게 할까요?**

- **(A)** 원래 방향대로 진행 (염두에만 두고 계속)
- **(B)** PRD 수정 (concern을 반영해서 다시 작성)
- **(C)** 스코프 확장 ({hidden_scope}도 포함)
- **(D)** 취소하고 처음부터 다시 생각할래요"

**HALT and wait for user response.**

- **IF A**: Note concerns in Dev Notes under `Premise Challenge Notes`. Proceed to section 2.
- **IF B**: Accept PRD edits, re-run sections 1 → 1b with updated PRD.
- **IF C**: Expand touchpoints + may loop back to step-03 for architecture update.
- **IF D**: Exit workflow cleanly with a message explaining nothing was saved.

**IF the challenge surfaces NO significant concerns**, briefly note "Premise Challenge: no issues surfaced — 원래 방향대로 진행" and proceed silently to section 2.

**IF `{ceoReviewSkill}` does NOT exist:** Emit warning:

> ⚠️ `gstack/plan-ceo-review` not installed — Premise Challenge skipped. Story will proceed without CEO-mode pressure test. Install gstack to enable full quality.

Continue to section 2.

### 2. Generate Story Key

Quick-story uses a dedicated `q-` prefix so its stories stay visually distinct from epic-scoped stories in `sprint-status.yaml`.

- **Format**: `q-{next_num}-{slug}`
- **Numbering**: Scan `{sprint_status}` for existing keys that start with `q-`. Find the highest `N` and use `N + 1`. If no `q-*` keys exist yet, start at `q-1`.
- **Slug**: lowercase kebab-case derived from the user's intent — strip articles and stopwords, aim for 3-4 meaningful words.

Example: intent `"프로필 이미지 업로드 추가"` → slug `profile-image-upload` → key `q-1-profile-image-upload`.

### 3. Load Story Template

Read `{storyTemplate}` via Read tool. Keep the full template in context for substitution.

### 4. Compose the Story Document

Substitute all template variables:

- `{{story_key}}` → generated story key
- `{{title}}` → short title derived from intent (5-8 words)
- `{{date}}` → today's date (YYYY-MM-DD)
- `{{user_name}}` → config `user_name`
- `{{complexity}}` → `S` / `M` / `L` judgment call weighing touchpoint count, blast radius, risk level, and test work required (no hardcoded formula — use judgment)
- **Mini PRD fields** → user's 4 answers (or auto-filled defaults), incorporating any Premise Challenge concerns as subtext
- **Mini Architecture fields** → step-03 draft (5 fields)
- **Architecture Impact** → step-03 impact analysis if available; **IF NOT available, REMOVE the entire "## 🔍 Architecture Impact" section from the rendered output** (do not leave empty placeholders)
- **Conditional Review subsection** (Fix-Specific / UI-UX / DX) → from step-03 section 2b if change_type matched and skill was loaded; otherwise omit cleanly
- **Story section** → generate `As a` / `I want` / `So that` from intent + PRD answers
- **Acceptance Criteria** → BDD-style ACs (`Given / When / Then`) covering the main success path + key edge cases from Risks. Judgment decides how many (typically a handful — not one, not fifteen)
- **Tasks / Subtasks** → atomic, dependency-ordered tasks, each referencing an AC number (`Task 1 (AC: #1)`). Sub-tasks optional for complex tasks. Judgment decides the count.
- **Dev Notes**:
  - `refs_project_context` → relevant sections from step-02
  - `refs_learnings` → prior learnings from step-02 `/learn` query (however many are genuinely relevant)
  - `refs_related` → related story keys from step-03 Cross-Story Impact
  - `testing_unit` / `testing_integration` → **IF `{tddSkill}` exists**, load it in FULL via Read and reference its RED-GREEN-REFACTOR discipline + testing-anti-patterns guide when writing the testing standards. Otherwise derive testing standards from project patterns alone.
  - `premise_notes` → any concerns surfaced by Premise Challenge (if the user selected `A` in section 1b)

### 5. Present Final Story for Approval

"**스토리 문서 초안이 준비됐어요!** ✨

**Story Key:** `{story_key}`
**저장 예정 위치:** `{implementation_artifacts}/{story_key}.md`
**Complexity:** {complexity}

---

{full rendered story document in a code block}

---

**이 내용으로 저장할까요?**

- **(Y)** 네, 저장하고 sprint-status에 등록할게요
- **(E)** 수정할 부분이 있어요 — 알려드릴게요 (AC/Tasks/Dev Notes 등)
- **(R)** AC나 Tasks를 다시 생성해주세요"

**HALT and wait for user response.**

- **IF E**: Accept specific edits, apply, re-present the full story for re-approval
- **IF R**: Regenerate AC and/or Tasks sections only, re-present
- **IF Y**: Proceed to write

### 6. Write the Story File

Use Write tool to save the rendered story to `{implementation_artifacts}/{story_key}.md`.

Report: "**스토리 파일 저장 완료** ✓
📄 `{story_path}`"

### 7. Register in sprint-status.yaml

Load `{sprint_status}` (sprint-status.yaml) and add a new entry for this story:

- `key`: `{story_key}`
- `title`: `{title}`
- `status`: `ready-for-dev`
- `created_by`: `quick-story`
- `created`: `{date}`

**CRITICAL:** Preserve ALL existing entries, comments, formatting, and structure exactly. Only append the new entry in the appropriate location. Use Edit tool if possible (targeted insertion); Write tool only if Edit cannot preserve structure.

Report: "**sprint-status.yaml 등록 완료** ✓
📊 status: ready-for-dev"

### 8. Present MENU OPTIONS

Display: **[C] Continue to Routing**

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute `{nextStepFile}`
- IF Any other: help user respond, then [Redisplay Menu Options](#8-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the story file is written AND sprint-status.yaml is updated AND user confirms will you proceed to step-05-route.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All 4 PRD questions asked in one message and answered
- `plan-ceo-review` loaded in FULL and Premise Challenge applied (if installed)
- Premise Challenge concerns surfaced to the user with A/B/C/D choice (if any)
- `test-driven-development` loaded in FULL when writing testing standards (if installed)
- Story composed using the template exactly
- Architecture Impact section included (if available) or cleanly removed (if not)
- Conditional Review subsection included from step-03 2b (if applicable) or cleanly omitted
- User explicitly approved the final story
- Story file written to `{implementation_artifacts}/{story_key}.md`
- sprint-status.yaml updated while preserving existing entries and structure
- Status set to `ready-for-dev`
- Warnings emitted for any missing REQUIRED skills

### FAILURE:

- Skipping any of the 4 PRD questions
- Asking PRD questions one at a time instead of all at once
- Skipping Premise Challenge when plan-ceo-review is installed
- Using a non-template format
- Leaving empty `{{impact_*}}` placeholders when plan-eng-review was not installed
- Writing the file before user approval
- Breaking existing sprint-status structure
- Not updating sprint-status.yaml
- Using hardcoded formulas for complexity / AC count / task count (let judgment decide)

**Master Rule:** Thorough discovery + Premise Challenge, compact template, user approval, clean sprint-status. Judgment over formulas.
