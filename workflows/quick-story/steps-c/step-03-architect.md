---
name: 'step-03-architect'
description: 'Draft mini architecture (5 fields), run plan-eng-review 4-point Impact, apply change_type-conditional reviews (systematic-debugging / plan-design-review / plan-devex-review)'

nextStepFile: './step-04-compose.md'

# REQUIRED skills (load FULL when installed)
engReviewSkill: '~/.claude/skills/gstack/plan-eng-review/SKILL.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'

# CONDITIONAL skills (load based on change_type from step-01)
systematicDebuggingSkill: '~/.claude/skills/systematic-debugging/SKILL.md'  # change_type == 'fix'
planDesignReviewSkill: '~/.claude/skills/gstack/plan-design-review/SKILL.md'  # change_type == 'ui'
planDevexReviewSkill: '~/.claude/skills/gstack/plan-devex-review/SKILL.md'    # change_type == 'devex'
---

# Step 3: Mini Architecture Draft & Impact Analysis

## STEP GOAL:

Draft a lightweight 5-field mini architecture (Stack / Touchpoints / Patterns / Constraints / Risks) for the intended change using context from step-02, then run it through `gstack/plan-eng-review` for a 4-point Architecture Impact sanity check (Scope Challenge / Failure Scenarios / Cross-Story Impact / Test Coverage Gap).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a pragmatic architect drafting a mini architecture, not designing a system
- ✅ **Written output budget**: 5 architecture fields + 4 impact points + conditional review bullets. This constrains the *written* draft, not the *thinking* — load skills in full, then distill.
- ✅ Bullet points only in the final write-up, no paragraphs — this is a working doc, not a whitepaper

### Step-Specific Rules:

- 🎯 Focus on Mini Architecture draft + Impact Analysis + change_type-specific review
- 🚫 FORBIDDEN to write the full story document here (that's step-04)
- 🔧 ALWAYS load REQUIRED skills in FULL (plan-eng-review, parallel-agents) when installed
- 🎛️ CONDITIONAL skills (systematic-debugging / plan-design-review / plan-devex-review) load based on `change_type` from step-01
- 🚫 FORBIDDEN to add more than 5 architecture fields or 4 impact points in the *written* draft (skill insights absorbed then distilled)
- ⚠️ ALWAYS warn user if REQUIRED or change_type-required CONDITIONAL skill is missing
- 💬 Present the draft clearly and require user confirmation before proceeding

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Track: `mini_architecture` (5 fields) + `impact_analysis` (4 fields, if available)
- 📖 Use context from step-02 (patterns, learnings, touchpoints)
- 🚫 FORBIDDEN to proceed without user confirmation on the draft

## CONTEXT BOUNDARIES:

- Available: Intent + change_type from step-01, full context from step-02, REQUIRED skills (plan-eng-review, parallel-agents), CONDITIONAL skills matched to change_type
- Focus: Mini architecture design + Impact Analysis + change_type-specific review
- Limits: 5 architecture fields + 4 impact points + 1-2 conditional review bullets (written output budget)
- Dependencies: Full context + change_type from step-02 / step-01

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Draft Mini Architecture (5 Fields)

Using the intent (step-01) and context (step-02), produce a draft with these EXACT 5 fields:

1. **Stack**: language / framework / key libs + versions relevant to this change (not the whole project stack — just what's touched)
2. **Touchpoints**: list of files/modules to change, each with a one-line "why"
3. **Patterns**: existing patterns from `project-context.md`, `/learn` results, or observed code that this change should follow
4. **Constraints**: performance / security / compatibility / API contracts that apply
5. **Risks**: realistic things that could break (from existing patterns, failure modes, or known pitfalls)

Keep each field concise — bullet points only, NOT paragraphs. Aim for 2-5 bullets per field.

### 2. Run Architecture Impact Analysis (REQUIRED — plan-eng-review)

**IF `{engReviewSkill}` exists:** Load the **FULL** file via Read tool. Yes, all ~22K tokens of it. Read the entire plan-eng-review skill end to end — internalize its Priority Hierarchy, Engineering Preferences, Cognitive Patterns, Scope Challenge framework, Architecture review methodology, Failure modes catalog, Test Plan artifact guidance, and Prior Learnings integration.

This is expensive in tokens but gives you the real plan-eng-review voice and judgment framework. The **written output** stays compact (4 bullets), but your *thinking* uses the full skill.

Apply the **4-point Impact Analysis** to your mini architecture draft, using the skill's own framework:

1. **Scope Challenge**: Is this over-engineered? Is there existing code to reuse instead? Could this be simpler? (plan-eng-review's Step 0 framework)
2. **Failure Scenarios**: For each Touchpoint change, name ONE realistic production failure mode — specific ("race condition when X happens while Y"), not vague ("could fail")
3. **Cross-Story Impact**: Scan `sprint-status.yaml` for any story (quick-story `q-*` keys AND epic-scoped keys) whose touchpoints overlap with your proposed touchpoints. Could this change break them? Name the story keys.
4. **Test Coverage Gap**: Map each Touchpoint change to the test that must exist to protect it. Note which tests already exist vs which need to be written.

Produce exactly 4 concise bullet points in the *written* draft — one per dimension. Sharp, not verbose.

**IF `{engReviewSkill}` does NOT exist:** Emit warning:

> ⚠️ `gstack/plan-eng-review` not installed — Architecture Impact analysis will be skipped. The story's Architecture Impact section will be omitted from the final document. Install gstack to enable full quality.

Set `impact_analysis = null`. Do NOT fake the analysis.

### 2b. Change-Type Conditional Reviews

Based on `change_type` from step-01, load ONE additional skill in FULL to add a change-type-specific review on top of the general Architecture Impact.

**IF `change_type == 'fix'`**:
- Load `{systematicDebuggingSkill}` in FULL via Read tool — this is the superpowers systematic-debugging skill bundled with bmad-grr
- Apply its 4-phase investigation framework (investigate → analyze → hypothesize → implement) to the mini architecture
- Ensure touchpoints include the root cause area, not just the symptom surface
- Capture 1-2 bullets for a **"Fix-Specific Review"** subsection in the written draft:
  - `Root cause hypothesis`: ...
  - `Symptom vs cause touchpoints`: ...

**IF `change_type == 'ui'`**:
- Load `{planDesignReviewSkill}` in FULL via Read tool
- Apply its design-review framework to the mini architecture (design system compliance, visual hierarchy, interaction patterns, accessibility, edge cases)
- Capture 1-2 bullets under a **"UI/UX Review"** subsection:
  - `Design gap identified`: ...
  - `Consistency with design system`: ...

**IF `change_type == 'devex'`**:
- Load `{planDevexReviewSkill}` in FULL via Read tool
- Apply its DX-review framework (developer friction, tooling gaps, TTHW, error message quality)
- Capture 1-2 bullets under a **"DX Review"** subsection:
  - `DX friction addressed`: ...
  - `Tooling / workflow impact`: ...

**IF `change_type` is `feature` / `refactor` / `chore`**: No conditional review needed — the REQUIRED plan-eng-review already covers it. Skip this subsection silently.

**IF a CONDITIONAL skill is required by change_type but not installed:** Emit warning:

> ⚠️ `{skill_name}` required for change_type `{change_type}` but not installed. Story will lack {fix / UI / DX}-specific review. Install to enable full quality.

Continue with that review subsection omitted.

### 3. Present Draft to User

"**Mini Architecture 초안** 🏗️

**Stack:**
{stack_bullets}

**Touchpoints:**
- `{path1}` — {why}
- `{path2}` — {why}

**Patterns:**
{patterns_bullets}

**Constraints:**
{constraints_bullets}

**Risks:**
{risks_bullets}

{IF Impact Analysis ran:}

**🔍 Architecture Impact:**
- **Scope Challenge:** {scope_finding}
- **Failure Scenarios:** {failure_findings}
- **Cross-Story Impact:** {cross_story_finding}
- **Test Coverage Gap:** {coverage_finding}

{ELSE:}
⚠️ plan-eng-review 미설치 — Architecture Impact 섹션은 최종 문서에서 생략됩니다.

{IF conditional review ran (based on change_type):}

**📋 {Fix-Specific / UI/UX / DX} Review:**
- {bullet 1}
- {bullet 2}

{ELSE IF change_type requires conditional review but skill missing:}
⚠️ {skill_name} 미설치 — {change_type} 관점 리뷰 생략됩니다.

---

**이 구조로 진행할까요?**

- **(Y)** 네, 다음 단계로 (스토리 문서 작성)
- **(E)** 수정하고 싶은 부분이 있어요 — 알려드릴게요
- **(R)** Impact 결과 보고 구조를 다시 짤래요 (Impact 분석이 있을 때만)"

**HALT and wait for user response.**

- **IF E**: Accept user edits, merge into the draft, re-present for confirmation
- **IF R**: Adjust the architecture based on Impact findings, re-present for confirmation
- **IF Y**: Proceed to menu

### 4. Present MENU OPTIONS

Display: **[C] Continue to Compose**

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute `{nextStepFile}`
- IF Any other: help user respond, then [Redisplay Menu Options](#4-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the mini architecture is drafted, impact analysis is run (if available), AND user confirms the draft will you proceed to step-04-compose.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Mini architecture drafted with exactly 5 fields in the written output
- `plan-eng-review` loaded in FULL (if installed) and its framework applied to Impact Analysis
- Impact Analysis produces exactly 4 bullet points (if plan-eng-review installed)
- Conditional skill for `change_type` loaded in FULL and applied (if change_type requires one AND skill installed)
- Clear warnings emitted for any missing REQUIRED or change_type-required CONDITIONAL skills
- User explicitly confirmed the draft
- Draft is concise in writing (bullets only)

### FAILURE:

- Section-selecting plan-eng-review instead of FULL load
- Writing the full story document here
- Adding more than 5 architecture fields or 4 impact points in the written output
- Skipping conditional review when change_type matches and skill is installed
- Faking Impact Analysis when plan-eng-review is NOT installed
- Proceeding without user confirmation

**Master Rule:** FULL skill loads drive the thinking, compact 5+4+conditional output drives the writing. Thorough process, tight output.
