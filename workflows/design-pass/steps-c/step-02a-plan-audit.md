---
name: step-02a-plan-audit
description: 'Branch A — read full story; apply inline plan-audit framework to identify UX risks; auto-dispatch ui-ux-pro-max skills with citations; user-confirmed selection; produce skill_findings'
nextStepFile: './step-03a-enhance-doc.md'

# Reference (hints, NOT rules)
uxDispatchRules: '~/.claude/workflows/design-pass/data/ux-auto-dispatch-rules.md'
uxChecklist: '~/.claude/workflows/design-pass/data/ux-checklist.md'

# ui-ux-pro-max auto-dispatch candidates (loaded only if LLM judgment selects them)
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
claritySkill: '~/.claude/skills/clarify/SKILL.md'
onboardSkill: '~/.claude/skills/onboard/SKILL.md'
---

# Step 2a — Pre-dev Plan Audit + Auto-Dispatch

## Outcome

The full story document is read, UX risks are identified from the actual content (citations to AC/Tasks/Dev Notes/Risks/concern), the relevant ui-ux-pro-max skills are selected with explicit reasoning per skill, the user has confirmed the selection, and the selected skills have been applied to produce `skill_findings` for step-03a.

## Approach

### Load the full story

Read the file referenced by `story_ref` completely. If it's a story key (e.g., `q-1-profile-upload`), construct the path `{implementation_artifacts}/{story_ref}.md`. If the file doesn't exist, halt with a clear message asking the user to verify the path.

Read every section: frontmatter, Mini PRD, Mini Architecture (Stack/Touchpoints/Patterns/Constraints/Risks), Architecture Impact (if present), Story (As a/I want/So that), Acceptance Criteria, Tasks/Subtasks, Dev Notes. No skimming.

### Load project context (if present)

Read `project-context.md` (per `{project_context}` glob) if it exists. Project-wide UX conventions and design-system notes inform judgment.

### Inline plan-audit framework

Apply this framework directly to the story plan — no external skill load needed. Walk through these dimensions, citing the specific story location for every risk:

- **Visual hierarchy** — does the plan describe how primary vs. secondary actions/info are weighted? Missing emphasis is a risk.
- **States — empty / error / loading / success** — for every interaction the AC implies, does Dev Notes define the four states explicitly? Unspecified states almost always become AI-slop or jarring jumps in implementation.
- **AI-slop risk** — does the plan default to generic patterns (purple gradient, rounded card, system font, generic spinner)? Watch for missing project-context anchoring.
- **Accessibility** — keyboard reachability, focus management, ARIA roles for dynamic UI, color contrast, screen-reader labels, touch-target sizes. Missing AC/Dev Notes coverage of any of these is a risk.
- **Edge cases** — long text, RTL, locale formatting, very large/small content, viewport extremes, slow networks, no-permission states.
- **Motion / feedback** — does the plan call out micro-interactions where they matter (success moments, errors, transitions)? Or are they implicit (and thus unlikely)?
- **Micro-copy quality** — error messages, empty-state guidance, button labels: are they specified? Generic strings ("뭔가 잘못됐어요") are AI-slop signals.
- **Responsive breakpoints** — does the plan name the touch/mobile/tablet/desktop targets and how layout adapts?

For each risk identified, capture: the risk (one sentence) and the specific story location (`AC #N` / `Tasks 1.2` / `Dev Notes` / `Risks` / `user_concern` quote).

### Reference dispatch hints

Load `{uxDispatchRules}` as **reference hints** — read it then ignore patterns that don't fit. The file explicitly warns against keyword matching. Also load `{uxChecklist}` as a thinking prompt for UX dimensions, not as a fill-in form.

### Select skills for the risks identified

For each risk, pick the ui-ux-pro-max skill(s) that address it. Patterns to keep in mind (these are starting hints — judgment overrides):

- States missing → `harden` (resilience) + `clarify` (message quality)
- Visual hierarchy weak → `arrange` (rhythm/spacing) + `typeset` (type weight)
- AI-slop risk → `colorize`, `typeset`, or `delight` depending on what's generic
- "밋밋해" / lifeless concern → `bolder`, `delight`, `colorize`, or `animate`
- "복잡해" / overwhelming concern → `distill`, `quieter`, `normalize`
- First impression matters → `polish`, `delight`, `animate`
- Onboarding / empty-state journey → `onboard`
- Mobile / responsive concerns → `adapt`
- Quantitative dimension scoring desired → `critique`

If a risk doesn't fit any pattern, pick the skill that best addresses it from your UX knowledge. Don't pad — judgment, not kitchen sink.

**Forbidden anti-pattern**: "Story mentions 'upload' → load harden". Required pattern: "AC #3 specifies '5MB 초과 시 에러', Dev Notes doesn't define how the error reaches the user. Loading `harden` for resilience + `clarify` for message quality."

### Present and confirm

Show a tight selection summary in `{communication_language}`:

```
📋 {story_ref} 분석 결과

🔍 UX 리스크
- {risk_1} — ({source: AC #N / Tasks / Dev Notes / Risks / concern})
- {risk_2} — ({source})
- ...

🎨 적용할 스킬 ({n}개)
- {skill_name} — {reasoning tied to a specific risk + source}
- ...

고민 사항: {user_concern or "없음 — 문서 기반 자동 판단"}

[Y] 진행   [M] 일부 조정   [+] 추가 스킬 있음   [N] 취소
```

Halt for input. On `M` accept the user's adjustment ("harden은 빼고 delight 추가") and re-present. On `+` accept additions and re-present. On `N` end the workflow. On `Y` proceed.

### Load selected skills and apply

For each confirmed skill not already loaded, read the full file via Read tool. If a selected skill file doesn't exist, warn briefly ("⚠️ {skill} 미설치 — 해당 risk 미커버") and continue with the rest.

For each loaded skill, apply its framework to the story document and capture:

- What the skill's framework reveals (specific to this story)
- What specific guidance it suggests (actionable recommendations)
- Which AC/Tasks/Dev Notes/Risks sections to enhance

Store as `skill_findings`: `{ skill_name: { observations, recommendations, target_sections } }`.

This is analysis only — writing to the story document happens in step-03a.

## Next

Load and follow `{nextStepFile}`.
