---
name: 'step-03b-document-fix'
description: 'Branch B: Compose improvement document from step-02b audit findings and skill recommendations, determine save target (new dp-N story OR append to existing via refine-story), get user approval, write to disk and register in sprint-status.yaml'

nextStepFile: './step-04-route.md'
improvementTemplate: '~/.claude/workflows/design-pass/data/improvement-doc-template.md'
---

# Step 3b: Document Design Pass Improvement

## STEP GOAL:

Compose the improvement document from step-02b's `audit_findings` and `skill_recommendations`, determine the save target (new `dp-N-slug` story OR append to an existing story via refine-story handoff), get user approval, write to disk (if applicable), and register in sprint-status.yaml as ready-for-dev.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a precise document composer producing dev-story-compatible output
- ✅ Every finding, recommendation, and task must tie back to evidence from the audit
- ✅ Priorities (P0/P1/P2) must be clearly assigned per recommendation

### Step-Specific Rules:

- 🎯 Focus on composing + save target decision + writing + sprint-status registration
- 🚫 FORBIDDEN to skip priority assignment (every recommendation needs P0/P1/P2)
- 🚫 FORBIDDEN to write without user approval
- 🚫 FORBIDDEN to register in sprint-status if user chose 'S' (file only)
- 📄 ALWAYS use the `{improvementTemplate}` as the base structure
- 💾 ALWAYS preserve existing sprint-status.yaml structure when updating

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `save_target_type` (N/A/S), `story_key`, `story_path`, `rendered_doc`
- 📖 Save target → generate key → compose → present → confirm → write → register
- 🚫 FORBIDDEN to proceed without user approval

## CONTEXT BOUNDARIES:

- Available: `url`, `user_concern`, `audit_findings`, `skill_recommendations`, `primary_screenshot` from step-02b, `{improvementTemplate}`
- Focus: Compose + save + register
- Limits: Write ONE document, update sprint-status ONCE
- Dependencies: step-02b findings

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Determine Save Target

Ask the user:

"**개선안 저장 방식 선택 💾**

감사 결과를 어디에 기록할까요?

- **[N]** 새 스토리로 저장 — `dp-{next_n}-{slug}.md` 형식의 독립 개선안 스토리 (dev-story로 바로 구현 가능) ⭐ 추천
- **[A]** 기존 스토리에 추가 — 관련 기존 스토리를 지정해주세요. refine-story로 위임해서 gap 분석 후 업데이트합니다.
- **[S]** 파일로만 저장 — 개선안 문서만 저장하고 sprint-status에는 등록 안 함 (나중에 결정)"

**HALT and wait for user response.**

Store as `save_target_type` (`N`, `A`, or `S`).

**IF A:** Ask for the target story key or path:

"**기존 스토리 경로를 알려주세요.** (예: `q-1-profile-upload` 또는 전체 파일 경로)"

Verify the target story exists. Note: in step-04, routing will delegate to refine-story with the improvement doc as context.

### 2. Generate Story Key

**IF `save_target_type == 'N'` OR `save_target_type == 'S'`:**

Load `{sprint_status}` and scan existing keys starting with `dp-`. Find the highest `N` and use `N + 1`. If no `dp-*` keys exist yet, start at `dp-1`.

**Format:** `dp-{next_n}-{slug}`

**Slug:** lowercase kebab-case derived from:
- The user's concern (if provided) — main emotional/functional topic
- Otherwise the URL's primary feature area (e.g., `/products` → `products`)
- Otherwise the main finding from the audit

Max 3-4 meaningful words. Strip articles and stopwords.

**Examples:**

- `url = /products`, `user_concern = "일관성 없어"` → slug `products-consistency-pass` → key `dp-1-products-consistency-pass`
- `url = /checkout`, no concern → slug from audit main finding → e.g., `checkout-hierarchy-fix` → key `dp-2-checkout-hierarchy-fix`

Store as `story_key`.

**IF `save_target_type == 'A'`:** Skip key generation — using the existing story's key.

### 3. Load Improvement Template

Use Read tool to load `{improvementTemplate}` in full. Keep in context for substitution.

### 4. Compose Improvement Document

Substitute all template variables based on step-02b's findings:

**Frontmatter:**

- `{{story_key}}` → generated key (or existing key if appending)
- `{{date}}` → today (YYYY-MM-DD)
- `{{user_name}}` → config user_name
- `{{url}}` → from step-01
- `{{related_story}}` → target key (if appending) or `'standalone'`
- `{{complexity}}` → S/M/L judgment based on:
  - Number of recommendations (1-3 → S, 4-7 → M, 8+ → L)
  - Scope breadth (single component → S, section → M, multiple sections → L)
  - Risk (low → S, moderate → M, architectural → L)
  - Use judgment, not mechanical formula

**Sections:**

- **Mini PRD**: Derive from audit intent
  - 문제/동기: what's wrong and why it matters (from audit_findings)
  - 대상 사용자: who benefits (from url context)
  - 성공 기준: observable improvement (metrics + UX outcome)
  - 비범위: what's NOT being fixed in this pass

- **Audited State (Before)**: url, screenshot path, audit date, list of audited-by skills

- **Audit Findings**:
  - `design-review` findings (from step-02b)
  - `critique` scores with notes per dimension
  - Chrome DevTools / browse capture (console errors, network issues, viewports)

- **User Concern** (if provided): quote verbatim

- **Auto-Dispatch Reasoning**: a table/list showing `skill_name` + specific reference from audit findings that triggered the selection

- **Proposed Improvements (by skill)**: for EACH applied skill, include:
  - **Finding**: what the skill found in the audit context
  - **Recommendation**: specific changes to make
  - **Target file(s)**: paths
  - **Priority**: P0 | P1 | P2 (see assignment rules below)

- **Story**: Generate `As a` / `I want` / `So that` from the intent

- **Acceptance Criteria**: BDD-style `Given / When / Then` covering each P0/P1 improvement as a testable outcome. Judgment decides count (typically a handful).

- **Tasks / Subtasks**: Atomic, dependency-ordered, each referencing an AC number. Tasks should be concrete enough that dev-story can pick them up directly.

- **Dev Notes**:
  - Refs: audited URL, screenshots, related story (if any), skills applied, prior learnings (via /learn if available)
  - Testing Standards: visual regression (screenshot diff), E2E via /qa or /browse, a11y (keyboard + contrast), Core Web Vitals, TDD note
  - Priority Notes: P0/P1/P2 interpretation

- **Dev Agent Record**: Empty placeholder (dev-story fills later)

**Priority Assignment Rules:**

- **P0** — UX blocker (accessibility failures, broken interactions, console errors, data loss, user can't complete their primary goal)
- **P1** — Quality gate (consistency drift, missing feedback, unclear copy, visual hierarchy problems that hurt comprehension)
- **P2** — Nice-to-have (delight moments, micro-polish, optional enhancements, subtle animation)

Every single recommendation MUST have a priority. Default to P1 if genuinely unclear.

### 5. Present Composed Document to User

"**개선안 문서 초안이 준비됐어요!** ✨

**Save target:** {save_target_type_description}
**Story Key:** `{story_key or 'existing: target_key'}`
**저장 예정 위치:** `{implementation_artifacts}/{story_key}.md` {or 'refine-story will handle if A'}
**Complexity:** {complexity}
**총 개선 제안:** {n}개 (P0: {count}, P1: {count}, P2: {count})

---

{full rendered improvement document in a code block}

---

**이 내용으로 저장할까요?**

- **(Y)** 네, 저장하고 sprint-status에 등록할게요
- **(E)** 수정할 부분이 있어요 — 알려드릴게요 (섹션 추가/제거/수정)
- **(P)** Priority를 다시 조정하고 싶어요 (어떤 항목을 어떻게?)
- **(R)** AC나 Tasks를 다시 생성해주세요
- **(N)** 취소 (저장 안 함)"

**HALT and wait for user response.**

**IF E:** Apply specific edits, re-present.
**IF P:** Accept priority changes, re-present.
**IF R:** Regenerate AC/Tasks sections, re-present.
**IF N:** "저장하지 않고 종료합니다." END workflow.
**IF Y:** Proceed to section 6.

### 6. Write the Document

**IF `save_target_type == 'N'`:** Use Write tool to save the rendered doc to `{implementation_artifacts}/{story_key}.md`.

**IF `save_target_type == 'A'`:** DO NOT write the improvement doc to disk here. Instead, store the rendered doc as a handoff artifact (in context) so that step-04-route can pass it to refine-story. refine-story will handle the actual update of the existing target story.

**IF `save_target_type == 'S'`:** Use Write tool to save the rendered doc to `{implementation_artifacts}/{story_key}.md` but **skip section 7** (sprint-status registration).

Report the action taken:

"**{action} 완료** ✓
📄 `{story_path}` {or 'staged for refine-story handoff'}"

### 7. Register in sprint-status.yaml

**IF `save_target_type == 'N'`:**

Load `{sprint_status}` and add a new entry:

```yaml
- key: {story_key}
  title: {feature_name derived from url/concern}
  status: ready-for-dev
  created_by: design-pass
  source: live-audit
  created: {date}
```

**Preserve ALL existing entries, comments, and structure.** Use Edit tool for targeted insertion if possible; Write tool only if Edit cannot preserve structure.

Report: "**sprint-status.yaml 등록 완료** ✓ status: ready-for-dev"

**IF `save_target_type == 'A'`:** Skip — refine-story will handle status updates to the target story.

**IF `save_target_type == 'S'`:** Skip — user explicitly opted out of registration.

### 8. Auto-Proceed to Routing

Display: "**개선안 문서화 완료! 다음 단계로 넘어갈게요...** 🚀"

#### Menu Handling Logic:

- After document is written (or staged for handoff) AND sprint-status is updated (if applicable), immediately load, read entire file, then execute `{nextStepFile}`

#### EXECUTION RULES:

- Halt at section 1 (save target) and section 5 (approval gate)
- After Y in section 5, auto-proceed through sections 6-8

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN save target is determined AND improvement document is composed AND user approves AND the doc is written (or staged for handoff) AND sprint-status is registered (if applicable) will you proceed to step-04-route.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Save target determined with user input (N/A/S)
- Story key generated using `dp-{n}-{slug}` format (if new story)
- Improvement document composed using the template
- EVERY recommendation has a priority (P0/P1/P2)
- EVERY finding cites specific audit evidence
- User approved the final document
- Document written to disk (or staged for refine-story)
- sprint-status.yaml updated preserving existing entries (if applicable)
- Auto-proceeded to step-04

### FAILURE:

- Missing priority on any recommendation
- Not citing specific audit evidence
- Writing without user approval
- Breaking sprint-status structure
- Not using the template
- Registering in sprint-status when user chose 'S' (file only)
- Writing to disk when user chose 'A' (should stage for handoff)

**Master Rule:** Every improvement must be cited, prioritized, and approved. Template supremacy. Clean sprint-status. Respect save target choice.
