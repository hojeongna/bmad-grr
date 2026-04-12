---
name: 'step-02a-plan-audit'
description: 'Branch A: Load full story document, apply LLM judgment to identify UX risks from actual content (NOT keyword matching), auto-dispatch UX skills (gstack + ui-ux-pro-max) with specific reasoning, get user confirmation, apply selected skills'

nextStepFile: './step-03a-enhance-doc.md'

# gstack base skills — ALWAYS loaded in Branch A
planDesignReviewSkill: '~/.claude/skills/gstack/plan-design-review/SKILL.md'

# Reference files (hints, NOT rules)
uxDispatchRules: '~/.claude/workflows/design-pass/data/ux-auto-dispatch-rules.md'
uxChecklist: '~/.claude/workflows/design-pass/data/ux-checklist.md'

# ui-ux-pro-max auto-dispatch candidate skills (loaded only if LLM judgment selects them)
critiqueSkill: '~/.claude/skills/critique/SKILL.md'
polishSkill: '~/.claude/skills/polish/SKILL.md'
normalizeSkill: '~/.claude/skills/normalize/SKILL.md'
arrangeSkill: '~/.claude/skills/arrange/SKILL.md'
distillSkill: '~/.claude/skills/distill/SKILL.md'
typesetSkill: '~/.claude/skills/typeset/SKILL.md'
colorizeSkill: '~/.claude/skills/colorize/SKILL.md'
bolderSkill: '~/.claude/skills/bolder/SKILL.md'
quieterSkill: '~/.claude/skills/quieter/SKILL.md'
delightSkill: '~/.claude/skills/delight/SKILL.md'
animateSkill: '~/.claude/skills/animate/SKILL.md'
overdriveSkill: '~/.claude/skills/overdrive/SKILL.md'
adaptSkill: '~/.claude/skills/adapt/SKILL.md'
hardenSkill: '~/.claude/skills/harden/SKILL.md'
clarifySkill: '~/.claude/skills/clarify/SKILL.md'
onboardSkill: '~/.claude/skills/onboard/SKILL.md'
---

# Step 2a: Pre-dev Plan Audit + Auto-Dispatch

## STEP GOAL:

Load the FULL story document, read it deeply, identify UX risks using LLM judgment (NOT keyword matching), select relevant UX skills (gstack + ui-ux-pro-max), present the selection with specific reasoning tied to the actual story content, get user confirmation, and apply the selected skills to produce findings for step-03a.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a UX-minded design partner applying JUDGMENT, not matching keywords
- ✅ The story document is the source of truth — read it in FULL before judging
- ✅ Every skill selection must come with a SPECIFIC reference from the story (AC #N, Tasks, Dev Notes, Risks)
- ✅ If uncertain, prefer reading more of the content over guessing

### Step-Specific Rules:

- 🧠 **LLM JUDGMENT FIRST**: Read the full story. Identify UX risks from the actual content. Select skills that address those risks. NEVER mechanically match keywords.
- 🔧 ALWAYS load base skills (`plan-design-review` + `critique`) in FULL before judging
- 💬 ALWAYS explain each skill selection with a specific quote/reference from the story
- 🚫 FORBIDDEN to add skills without specific reasoning tied to the story content
- 🚫 FORBIDDEN to skip the user confirmation gate
- 📖 ALWAYS read the story file in FULL — no skimming

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `story_content`, `ux_risks`, `selected_skills`, `reasoning_per_skill`, `skill_findings`
- 📖 Load story → load base skills → judge → select → present → confirm → apply
- 🚫 FORBIDDEN to proceed past confirmation gate without explicit user Y

## CONTEXT BOUNDARIES:

- Available: `story_ref` and `user_concern` from step-01, project-context.md, sprint-status.yaml, UX skills (gstack + ui-ux-pro-max), reference files
- Focus: Deep reading + judgment + skill selection with reasoning + application
- Limits: No document writing yet (that's step-03a)
- Dependencies: `story_ref` from step-01

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load the Full Story Document

Use Read tool to load the FULL story document referenced by `story_ref`:

- If `story_ref` is a file path → Read directly
- If `story_ref` is a story key (e.g., `q-1-profile-upload`) → construct path `{implementation_artifacts}/{story_ref}.md` and Read
- If the file doesn't exist → HALT with: "스토리 파일을 찾을 수 없어요: `{story_ref}`. 경로를 다시 확인해주세요."

Read EVERY section:

- Frontmatter (story_key, status, type, complexity)
- Mini PRD (문제, 대상, 성공 기준, 비범위)
- Mini Architecture (Stack, Touchpoints, Patterns, Constraints, Risks)
- Architecture Impact (if present)
- Story (As a / I want / So that)
- Acceptance Criteria
- Tasks / Subtasks
- Dev Notes

Do NOT skim. This is the source of truth for your judgment.

### 2. Load Project Context (if exists)

Check for `project-context.md` (use `{project_context}` glob pattern). If found, Read it in full. This provides project-wide UX conventions and design system notes that should inform your judgment.

### 3. Load Base Skills (REQUIRED — always)

Load these in FULL via Read tool:

- **`{planDesignReviewSkill}`** — Interactive design plan review framework. Internalize its scoring dimensions and "what would make it a 10" logic.
- **`{critiqueSkill}`** — Quantitative UX evaluation framework. Internalize its scoring dimensions (visual hierarchy, information architecture, cognitive load, emotional resonance).

These give you the baseline evaluation framework. Apply them to the story plan you just read.

### 4. Load Dispatch Reference (as HINTS, not rules)

Load `{uxDispatchRules}` in FULL via Read tool. Read it as REFERENCE HINTS, not rules. The file explicitly warns against keyword matching.

Also load `{uxChecklist}` in FULL — use it as a thinking prompt for UX dimensions.

### 5. Deep Reading & UX Risk Assessment (LLM JUDGMENT CORE)

**This is the heart of Branch A. Do this carefully.**

Based on your reading of the story document, answer these questions from the ACTUAL content (not generic patterns):

1. **What is the user doing in this story?** (interaction type, emotional context — first use? recovery? celebration? routine task?)
2. **What specific UX risks exist in this story?** Look at:
   - Acceptance Criteria — what failure modes, edge cases, states are mentioned or implied?
   - Risks section — what does the author already flag?
   - Dev Notes — what's defined and, more importantly, what's missing?
   - Touchpoints — what UI surfaces are affected?
3. **What makes this moment matter to the user?** (first impression? recovery from error? celebration of success? efficiency in a routine?)
4. **What sensory dimensions are involved?** (typography, color, motion, layout, hierarchy, spacing)
5. **What platforms/contexts apply?** (mobile, desktop, offline, a11y, i18n, low bandwidth)
6. **What's the emotional arc?** (calm, exciting, urgent, delightful?)
7. **Is the user's concern (if provided) addressing something specific or a general vibe?** Interpret it in context.

For each identified UX risk, document:

- **The risk** (one clear sentence)
- **Where it comes from** (specific AC/Tasks/Dev Notes/Risks reference, or user concern quote)

### 6. Select Skills Based on Risks (LLM JUDGMENT)

For each UX risk you identified in section 5, select the UX skill(s) that best address it.

**Rules of selection:**

- Always include base skills: `plan-design-review` + `critique`
- For each risk, add the skill(s) that best address it
- Use `{uxDispatchRules}` patterns as a REFERENCE to recognize common situations, but your judgment from the actual story content OVERRIDES any pattern lookup
- If a risk doesn't match any pattern, select the skill that best addresses it using your UX knowledge
- Multiple risks may need the same skill — list the skill ONCE and cite multiple sources
- **If user_concern was provided**, make sure at least one selected skill addresses it
- Do NOT pad the selection with irrelevant skills — judgment, not kitchen sink

**Critical: Ban the anti-pattern:**

❌ "Story mentions 'upload' → load harden"
✅ "AC #3 specifies '5MB 초과 시 에러', but Dev Notes doesn't define how the error is communicated to the user. Loading `harden` for resilience + `clarify` for message quality."

### 7. Present Selection to User

Use this EXACT format (filling in specific references):

"**📋 `{story_ref}` 분석 결과**

**발견된 UX 리스크:**

- **{risk_1}** — *({specific reference: AC #N / Tasks / Dev Notes / Risks / user concern})*
- **{risk_2}** — *({specific reference})*
- **{risk_3}** — *({specific reference})*
... (one bullet per risk)

**적용할 스킬 ({n}개):**

🎨 **plan-design-review** — base (항상 로드)
📊 **critique** — base (항상 로드)
{for each additional skill:}
{emoji} **{skill_name}** — {specific reasoning tied to a risk and its source, e.g., '위 risk_1을 다룸 — AC #3의 에러 시나리오가 UX 미정의'}

**고민 사항:** {user_concern if provided, else '없음 — 문서 기반 자동 판단'}

---

**진행할까요?**

- **[Y]** 네, 이 선택대로 실행
- **[M]** 일부만 선택 / 조정하고 싶어요 (어떻게 조정할지 알려주세요)
- **[+]** 추가할 스킬이 있어요
- **[N]** 취소 (종료)"

**HALT and wait for user response.**

### 8. Handle User Response

**IF Y:** Proceed to section 9.

**IF M:** Accept the user's adjustment (e.g., "harden은 빼고 delight는 추가"), apply changes to `selected_skills` list, re-present (section 7), ask again.

**IF +:** User wants to add a skill. Accept the addition, re-present, ask again.

**IF N:** "Design Pass 취소합니다." END workflow.

### 9. Load Selected Additional Skills in FULL

For each skill in `selected_skills` that is NOT already loaded (base skills are already loaded from section 3):

Use Read tool to load the FULL SKILL.md file. Read it completely and internalize its framework.

**IF a selected skill file does NOT exist:** Emit warning:

> ⚠️ `{skill_name}` not installed — this risk will not be addressed in the UX enhancement. Install the corresponding module (gstack or ui-ux-pro-max) to enable full coverage.

Continue with the remaining skills — do not fail the workflow.

### 10. Apply Each Skill to the Story Content

**IMPORTANT:** When applying ui-ux-pro-max skills (polish, critique, animate, etc.), use the `design_context` and `frontend-design` aesthetic guidelines loaded during workflow initialization. These skills expect project design context (target audience, brand personality, design direction) — the init step already gathered this. Do NOT re-run the context gathering protocol inside each skill; it was done once at init.

For each loaded skill (base + selected), apply its framework to the story document and capture:

- **What did the skill's framework reveal?** (observations specific to this story)
- **What specific guidance does it suggest for this story?** (actionable recommendations)
- **Which AC/Tasks/Dev Notes/Risks sections should be enhanced?** (target locations)

Store as `skill_findings` — a structured map of `skill_name` → `{observations, recommendations, target_sections}`.

**Important:** The application here is ANALYSIS, not yet writing. Writing to the story document happens in step-03a.

### 11. Auto-Proceed to Step-03a

Display: "**분석 완료! 스토리 문서 강화 단계로 넘어갈게요...** ✨"

#### Menu Handling Logic:

- After user confirms selection AND all selected skills applied, immediately load, read entire file, then execute `{nextStepFile}`

#### EXECUTION RULES:

- Halt ONLY at section 7 (user confirmation gate) — all other sections auto-proceed
- Do NOT proceed without explicit Y (or M-adjusted Y)
- After confirmation, auto-proceed through sections 9-11 without additional halts

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN user has confirmed skill selection AND all selected skills have been loaded and applied to produce `skill_findings` will you proceed to step-03a-enhance-doc.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Full story document read completely (not skimmed)
- Base skills (`plan-design-review` + `critique`) loaded in FULL
- `ux-auto-dispatch-rules.md` loaded as reference
- UX risks identified FROM the actual story content (with specific citations)
- Skills selected by LLM judgment with specific reasoning per skill
- User confirmed the selection (with or without adjustment)
- All confirmed skills loaded in FULL and applied to produce structured findings
- Auto-proceeded to step-03a

### FAILURE:

- Skimming the story instead of reading fully
- Mechanical keyword matching to select skills
- Selecting skills without specific reference to story content
- Not loading base skills in FULL
- Proceeding without user confirmation
- Silently skipping missing skills (should warn with ⚠️)
- Writing to the story document in this step (that's step-03a)

**Master Rule:** LLM judgment from reading the actual story content, with specific citations, overrides any keyword or pattern lookup. Read deeply, judge honestly, cite specifically.
