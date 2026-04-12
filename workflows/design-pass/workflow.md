---
name: design-pass
description: 'LLM-judgment-first UI/UX design pass. Two branches: pre-dev enhances story docs with UX perspectives before implementation, live-fix audits running screens and documents improvements. UX skills (gstack + ui-ux-pro-max) are auto-dispatched by LLM judgment from reading the actual story document (Branch A) or the live audit findings + user concerns (Branch B) — NOT by mechanical keyword matching.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/design-pass"
ux_dispatch_rules: "~/.claude/workflows/design-pass/data/ux-auto-dispatch-rules.md"
ux_checklist: "~/.claude/workflows/design-pass/data/ux-checklist.md"
improvement_template: "~/.claude/workflows/design-pass/data/improvement-doc-template.md"

# Story and sprint references
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Workflow chaining
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"
quick_story_command: "{project-root}/bmad-grr/commands/bmad-grr-quick-story.md"

# gstack base skills — ALWAYS candidates for auto-dispatch
# Branch A (Pre-dev) base skills — always loaded when entering Branch A
plan_design_review_skill: "~/.claude/skills/gstack/plan-design-review/SKILL.md"

# Branch B (Live-fix) base skills — always loaded when entering Branch B
design_review_skill: "~/.claude/skills/gstack/design-review/SKILL.md"
browse_skill: "~/.claude/skills/gstack/browse/SKILL.md"

# ui-ux-pro-max design context (REQUIRED — loaded once at init, shared across all UX skill applications)
frontend_design_skill: "~/.claude/skills/frontend-design/SKILL.md"
design_context_file: "{project-root}/.impeccable.md"

# ui-ux-pro-max UX skills — auto-dispatched based on LLM judgment in step-02a/02b
critique_skill: "~/.claude/skills/critique/SKILL.md"
polish_skill: "~/.claude/skills/polish/SKILL.md"
normalize_skill: "~/.claude/skills/normalize/SKILL.md"
arrange_skill: "~/.claude/skills/arrange/SKILL.md"
distill_skill: "~/.claude/skills/distill/SKILL.md"
typeset_skill: "~/.claude/skills/typeset/SKILL.md"
colorize_skill: "~/.claude/skills/colorize/SKILL.md"
bolder_skill: "~/.claude/skills/bolder/SKILL.md"
quieter_skill: "~/.claude/skills/quieter/SKILL.md"
delight_skill: "~/.claude/skills/delight/SKILL.md"
animate_skill: "~/.claude/skills/animate/SKILL.md"
overdrive_skill: "~/.claude/skills/overdrive/SKILL.md"
adapt_skill: "~/.claude/skills/adapt/SKILL.md"
harden_skill: "~/.claude/skills/harden/SKILL.md"
clarify_skill: "~/.claude/skills/clarify/SKILL.md"
onboard_skill: "~/.claude/skills/onboard/SKILL.md"
---

# Design Pass

**Goal:** Apply UX judgment to either enhance a pre-dev story document (Branch A) or audit and document improvements to a running screen (Branch B). UX skills (gstack + ui-ux-pro-max) are auto-dispatched based on LLM judgment from reading the actual content — not by mechanical keyword matching.

**Your Role:** You are a UX-minded design partner. You read story documents deeply (Branch A) or observe live screens critically (Branch B), then judge what UX perspectives are at risk and dispatch the relevant UX skills (gstack for review/planning, ui-ux-pro-max for execution) to address them. You ALWAYS explain your reasoning with specific references to the actual content — the story AC, the screenshot, the user's concern — never generic keyword matches.

**Key Difference from other grr workflows:**

- `quick-story` / `create-story` produce new stories from scratch
- `refine-story` modifies existing stories based on gap analysis
- `code-review` / `bug-hunt` deal with code quality and bugs
- **`design-pass`** focuses on **UI/UX quality** — either bakes UX considerations into stories BEFORE dev (Branch A) or improves running UI AFTER dev (Branch B)

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **LLM Judgment First**: Skill selection is driven by reading the actual content (story document or live screen) and applying UX judgment. NEVER by mechanical keyword matching.
- **Reference Over Rules**: The `ux-auto-dispatch-rules.md` file contains common patterns as *reference hints*, NOT strict rules. LLM judgment from reading the actual content overrides any pattern lookup.
- **Always Explain Reasoning**: Every skill selection MUST come with a specific reference to the source content (e.g., "Loading `harden` because AC #3 specifies '5MB 초과 시 에러', but Dev Notes doesn't define the error UX").
- **Two Branches, Same Auto-Dispatch Pattern**: Branch A reads a story document; Branch B audits a live screen. Both use the same pattern — content analysis → risk identification → skill selection → reasoning with citations.
- **User Confirmation with Override**: LLM presents the selected skills with reasoning; user confirms with Y or overrides with M.
- **FULL Skill Loading**: Selected skills are loaded in FULL via Read tool — no section-selecting. Quality over token cost.

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **LOAD SKILLS**: When directed to load a skill, use Read tool to load the FULL skill file and follow its directives
5. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🧠 **NEVER** mechanically match keywords — ALWAYS read the full story document or audit the live screen and apply judgment
- 💬 **ALWAYS** explain skill selection with specific references to the actual content (story AC/Tasks/Dev Notes, or audit finding, or user concern)
- 🔧 **ALWAYS** load selected skills in FULL via Read tool — no skimming, no section-selecting
- ⚠️ **IF** a selected skill is missing, warn clearly and continue without it — never fail, never silently skip
- 📄 **ALWAYS** produce dev-story-compatible output in Branch B (improvement doc must chain to dev-story cleanly)
- 🔀 **ALWAYS** halt at user confirmation gates — do not proceed without explicit approval
- ⚙️ **TOOL/SUBPROCESS FALLBACK**: If any referenced subprocess/tool is unavailable, achieve the outcome in main thread
- ✅ **ALWAYS** communicate in {communication_language}

### External Skill Loading Protocol

When a step instructs you to load a UX skill (gstack or ui-ux-pro-max):

1. Use Read tool to load the **FULL** skill file — no offset, no limit
2. Read the entire file completely. Internalize its framework, voice, and decision patterns
3. Apply the skill's directives EXACTLY as written to the target (story document or live screen)
4. Do NOT summarize or abbreviate the skill
5. **IF the skill file does not exist**: Emit warning like "⚠️ `{skill_name}` not installed — reduced quality for {UX_dimension}. Install the corresponding module (gstack or ui-ux-pro-max) to enable." Continue the workflow without that skill's contribution.

### Auto-Dispatch Protocol (CRITICAL)

When selecting skills in step-02a (Branch A) or step-02b (Branch B):

1. **Read the source content first**:
   - Branch A: load and read the FULL story document
   - Branch B: audit the live screen with `design-review` + `critique` + browser screenshots
2. **Identify UX risks from the actual content** — NOT from keywords. Ask yourself:
   - What is the user doing? What's the emotional context?
   - What could go wrong from a UX perspective? (errors, edge cases, empty states, friction)
   - What makes this moment matter? (first impression? recovery? celebration?)
   - What sensory dimensions are involved? (typography, color, motion, layout, hierarchy)
   - What platforms/contexts? (mobile, a11y, i18n)
3. **Load `{ux_dispatch_rules}`** for pattern reference (but do NOT mechanically match)
4. **Select skills** that address the risks you identified
5. **Explain each selection with a specific quote or reference** from the story/audit
6. **Present to the user** in the format:

```
📋 {target} 분석 결과

발견된 UX 리스크:
- {risk_1} ({specific reference to content})
- {risk_2} ({specific reference})

적용할 스킬 ({n}개):
🎨 {skill_1} — {specific reasoning tied to content}
📊 {skill_2} — {specific reasoning}

진행할까요? [Y / M으로 조정]
```

7. **Wait for user confirmation** (Y to proceed, M to adjust)
8. **Load selected skills in FULL** and apply them sequentially

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `user_name`, `communication_language`, `document_output_language`, `implementation_artifacts`, `output_folder`

### 2. Design Context Loading (REQUIRED for ui-ux-pro-max skills)

ui-ux-pro-max UX skills produce generic output without project design context. Load context once here — all subsequent skill applications inherit it.

**Gathering order (stop at first success):**

1. **Check `{design_context_file}` (.impeccable.md)**: Read it from the project root. If it exists and contains target audience, brand personality, and design direction → store as `design_context` and proceed.
2. **Check project-context.md**: If `.impeccable.md` doesn't exist, check `{project_context}` for any Design Context section. If found → store as `design_context`.
3. **Load `{frontend_design_skill}` for guidelines**: Read the FULL file. Internalize its Context Gathering Protocol and aesthetic guidelines (typography, color, layout, motion, interaction, UX writing, AI slop test). These guidelines apply whenever a ui-ux-pro-max skill is applied later in step-02a/02b.
4. **If NO design context found anywhere**: Warn the user: "⚠️ 프로젝트 디자인 컨텍스트가 없어요. `/teach-impeccable`을 실행하면 더 정확한 UX 판단이 가능해요. 지금은 일반적인 기준으로 진행할게요." Continue with `frontend-design` aesthetic guidelines only.

**IF `{frontend_design_skill}` does not exist**: Warn: "⚠️ `frontend-design` not installed — ui-ux-pro-max skills will operate without project design context. Install ui-ux-pro-max for full quality." Continue the workflow.

### 3. First Step Execution

Load, read the full file and then execute `./steps-c/step-01-init.md` to begin the workflow.
