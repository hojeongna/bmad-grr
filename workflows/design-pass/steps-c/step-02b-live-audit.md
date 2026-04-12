---
name: 'step-02b-live-audit'
description: 'Branch B: Verify server, audit live screen (design-review + critique + browse/Chrome DevTools), apply LLM judgment to identify UX issues from actual audit findings + user concern, auto-dispatch improvement skills with specific reasoning, get user confirmation, apply selected skills'

nextStepFile: './step-03b-document-fix.md'

# gstack base skills — ALWAYS loaded in Branch B
designReviewSkill: '~/.claude/skills/gstack/design-review/SKILL.md'
browseSkill: '~/.claude/skills/gstack/browse/SKILL.md'

# Reference
uxDispatchRules: '~/.claude/workflows/design-pass/data/ux-auto-dispatch-rules.md'

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

# Step 2b: Live Audit + Auto-Dispatch

## STEP GOAL:

Verify the server is running, audit the live screen with base skills (`design-review` + `critique` + `browse`/Chrome DevTools), apply LLM judgment to identify UX issues from the actual audit findings + user concern, select relevant UX improvement skills (ui-ux-pro-max) with specific reasoning, get user confirmation, and apply the selected skills to produce recommendations for step-03b.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a UX-minded design partner applying JUDGMENT to real screens
- ✅ The live screen is the source of truth — audit it thoroughly before judging
- ✅ Every skill selection must come with a specific audit finding or user concern quote
- ✅ Evidence before hypothesis — see it, cite it, then select

### Step-Specific Rules:

- 🧠 **LLM JUDGMENT FIRST**: Audit the live screen. Identify UX issues from what you actually see. Select skills that address those issues. NEVER mechanically match keywords.
- 🔧 ALWAYS load base skills (`design-review` + `critique` + `browse`) in FULL before auditing
- 📸 ALWAYS capture screenshots for evidence
- 💬 ALWAYS explain each skill selection with a specific audit finding or user quote
- 🚫 FORBIDDEN to select skills without specific audit evidence or user concern reference
- 🚫 FORBIDDEN to skip the user confirmation gate

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `audit_findings`, `screenshots`, `ux_issues`, `selected_skills`, `reasoning_per_skill`, `skill_recommendations`
- 📖 Server check → load base skills → audit → judge → select → present → confirm → apply
- 🚫 FORBIDDEN to proceed past confirmation gate without explicit user Y

## CONTEXT BOUNDARIES:

- Available: `url` and `user_concern` from step-01, UX skills (gstack + ui-ux-pro-max), Chrome DevTools MCP, reference files
- Focus: Live audit + judgment + skill selection with reasoning + application
- Limits: No document writing yet (that's step-03b)
- Dependencies: `url` from step-01

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Verify Server Status

Ask the user about server status:

"**서버 상태 확인 🔌**

`{url}` 을 확인하기 전에 서버 상태를 알려주세요:

- **[R]** 이미 실행 중이에요
- **[S]** 제가 직접 실행할게요 — 실행 명령어를 알려주세요
- **[U]** 제가 실행할게요 — 잠깐만 기다려주세요"

**HALT and wait for user response.**

- **IF S:** Ask for the start command, execute it, wait for ready signal, then proceed.
- **IF U:** Wait for user confirmation before proceeding.
- **IF R:** Proceed immediately.

### 2. Load Base Skills (REQUIRED — always)

Load these in FULL via Read tool:

- **`{designReviewSkill}`** — Live-site designer's eye QA framework (finds inconsistency, AI slop, spacing/hierarchy issues, iterative fix loop)
- **`{critiqueSkill}`** — Quantitative UX evaluation framework (scores dimensions 0-10)
- **`{browseSkill}`** — Headless browser / Chrome DevTools integration framework (screenshots, console, network capture)

Internalize each skill's framework, voice, and decision patterns.

### 3. Load Dispatch Reference (as HINTS, not rules)

Load `{uxDispatchRules}` in FULL via Read tool. Read as REFERENCE HINTS. Do NOT mechanically match keywords.

### 4. Execute Audit (design-review + critique + browse/Chrome DevTools)

Apply the base skills to `{url}`:

**a. Initial capture (browse / Chrome DevTools MCP):**

- Navigate to `{url}`
- Take a screenshot of the current state (store path as `primary_screenshot`)
- Check browser console for errors (store as `console_errors`)
- Check network tab for failed/slow requests (store as `network_issues`)
- Capture key viewports if responsive concerns apply:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1440px)
- Store all screenshot paths for the final document

**b. Apply `design-review` framework:**

Follow the skill's directives to inspect the live screen. Identify issues in:

- Visual consistency (multiple button styles, spacing inconsistencies, token drift)
- Spacing and rhythm
- Visual hierarchy
- AI slop patterns (generic aesthetic, placeholder feel)
- Interaction feedback (hover, focus, click states)
- Error and empty states

Capture annotated findings — each finding with: location (element/area), issue description, severity (high/medium/low).

**c. Apply `critique` framework:**

Follow the skill's directives to quantitatively evaluate:

- **Visual Hierarchy:** {score}/10 — brief note
- **Information Architecture:** {score}/10 — brief note
- **Cognitive Load:** {score}/10 — brief note
- **Emotional Resonance:** {score}/10 — brief note
- **Overall:** {score}/10

Store all findings as `audit_findings` — a structured object with keys: `design_review_findings`, `critique_scores`, `browse_capture`.

### 5. Deep Analysis & UX Issue Identification (LLM JUDGMENT CORE)

**This is the heart of Branch B. Combine three inputs:**

1. **Audit findings** (from section 4) — what design-review + critique + browse actually found
2. **User concern** (from step-01, if provided) — what the user is worried about
3. **Your UX judgment** — reading between the lines, noticing what's implicit

For each identified UX issue, document:

- **The issue** (one clear sentence)
- **Evidence** — where does this come from? (design-review finding / critique score / screenshot observation / user's exact words / console error)
- **Why it matters** — user impact

**Critical: Ban the anti-pattern:**

❌ "critique mentioned 'hierarchy' → load arrange"
✅ "critique gave Visual Hierarchy 4/10 because the primary CTA is visually weaker than secondary actions (observed in screenshot at `{path}` — primary uses the same size/weight as cancel button). Loading `arrange` to restructure spacing/rhythm + `typeset` for type weight hierarchy."

### 6. Select Skills Based on Issues (LLM JUDGMENT)

For each UX issue identified, select the UX skill(s) that best address it.

**Rules of selection:**

- Base skills (`design-review` + `critique` + `browse`) are already loaded — do NOT re-include
- For each issue, add the improvement skill(s) that best address it
- Use `{uxDispatchRules}` patterns as REFERENCE
- Multiple issues may need the same skill — list once, cite multiple sources
- **If the user's concern addresses a specific emotional quality** (e.g., "밋밋해" → lifeless), include skills matching that quality (e.g., `delight`, `bolder`, `colorize`, `animate`)
- **If the audit revealed issues the user DIDN'T mention** (e.g., a11y problem, console errors), INCLUDE them — part of being a UX partner is catching what the user missed
- Do NOT pad with irrelevant skills

### 7. Present Selection to User

Use this EXACT format:

"**📋 `{url}` 라이브 감사 결과**

**📸 Screenshot:** `{primary_screenshot_path}`

**📊 Critique Scores:**
- Visual Hierarchy: {score}/10 — {brief note}
- Information Architecture: {score}/10 — {brief note}
- Cognitive Load: {score}/10 — {brief note}
- Emotional Resonance: {score}/10 — {brief note}
- **Overall:** {score}/10

**🔍 발견된 UX 이슈:**

- **{issue_1}** — *({specific evidence: design-review finding / critique score / screenshot / user concern / console error})*
- **{issue_2}** — *({specific evidence})*
- **{issue_3}** — *({specific evidence})*
... (one bullet per issue)

**⚠️ Console/Network:** {errors or 'clean'}

**적용할 개선 스킬 ({n}개):**

{for each improvement skill (excluding base):}
{emoji} **{skill_name}** — {specific reasoning tied to an issue and its evidence}

**고민 사항:** {user_concern if provided, else '없음 — 화면 기반 자동 판단'}

---

**진행할까요?**

- **[Y]** 네, 이 선택대로 실행
- **[M]** 일부만 선택 / 조정하고 싶어요
- **[+]** 추가할 스킬이 있어요
- **[N]** 취소 (종료)"

**HALT and wait for user response.**

### 8. Handle User Response

**IF Y:** Proceed to section 9.
**IF M:** Apply adjustment, re-present (section 7), ask again.
**IF +:** Accept additions, re-present, ask again.
**IF N:** "Design Pass 취소합니다." END workflow.

### 9. Load Selected Improvement Skills in FULL

For each improvement skill in `selected_skills`:

Use Read tool to load the FULL SKILL.md file. Read completely, internalize framework.

**IF a selected skill file does NOT exist:** Emit warning:

> ⚠️ `{skill_name}` not installed — the related issue will not be fully addressed in the improvement document. Install the corresponding module (gstack or ui-ux-pro-max) to enable.

Continue with the remaining skills.

### 10. Apply Each Skill to the Live Audit Context

**IMPORTANT:** When applying ui-ux-pro-max skills (polish, critique, animate, etc.), use the `design_context` and `frontend-design` aesthetic guidelines loaded during workflow initialization. These skills expect project design context (target audience, brand personality, design direction) — the init step already gathered this. Do NOT re-run the context gathering protocol inside each skill; it was done once at init.

For each loaded improvement skill, apply its framework to the audit findings and capture:

- **Finding**: what does the skill's framework reveal about the audited screen?
- **Recommendation**: what specific changes should be made? (file paths, DOM elements, CSS properties, copy changes, interaction patterns)
- **Target files**: which source files need editing?
- **Priority**: P0 (UX blocker) / P1 (quality gate) / P2 (nice-to-have)

Store as `skill_recommendations` — a structured map of `skill_name` → `{finding, recommendation, target_files, priority}`.

**Important:** This is ANALYSIS and RECOMMENDATION, not yet writing to disk. Writing the improvement document happens in step-03b.

### 11. Auto-Proceed to Step-03b

Display: "**분석 완료! 개선안 문서 작성 단계로 넘어갈게요...** ✨"

#### Menu Handling Logic:

- After user confirms selection AND all selected skills applied, immediately load, read entire file, then execute `{nextStepFile}`

#### EXECUTION RULES:

- Halt at section 1 (server status) and section 7 (user confirmation gate)
- Do NOT proceed without explicit Y (or M-adjusted Y)
- After confirmation, auto-proceed through sections 9-11

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN server is ready AND audit is complete AND user confirms selection AND all selected skills are loaded and applied will you proceed to step-03b-document-fix.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Server status verified before audit
- Base skills (`design-review` + `critique` + `browse`) loaded in FULL
- Live screen audited with screenshots + console + network captured
- Critique scores computed for all dimensions
- UX issues identified FROM actual audit findings (with specific evidence)
- Skills selected by LLM judgment with reasoning per skill
- User confirmed the selection
- All confirmed skills loaded in FULL and applied to produce structured recommendations
- Auto-proceeded to step-03b

### FAILURE:

- Auditing without screenshots (no evidence)
- Mechanical keyword matching to select skills
- Selecting skills without specific audit evidence
- Not loading base skills in FULL
- Proceeding without user confirmation
- Silently skipping missing skills
- Writing to improvement doc in this step (that's step-03b)

**Master Rule:** Evidence before hypothesis. Audit the actual screen, cite findings specifically, judge honestly. Every skill selection tied to an actual observation or user quote.
