---
name: step-02b-live-audit
description: 'Branch B — verify server, audit live screen via Chrome DevTools MCP using inline live-audit framework, identify UX issues with evidence, auto-dispatch ui-ux-pro-max skills, user-confirmed, produce skill_recommendations'
nextStepFile: './step-03b-document-fix.md'

# Reference (hints, NOT rules)
uxDispatchRules: '~/.claude/workflows/design-pass/data/ux-auto-dispatch-rules.md'

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

# Step 2b — Live Audit + Auto-Dispatch

## Outcome

The live screen at `url` has been audited end-to-end via Chrome DevTools MCP using the inline live-audit framework, screenshot evidence is captured, UX issues are identified with concrete evidence (screenshots, console errors, network problems, user concerns), the relevant ui-ux-pro-max improvement skills have been selected with explicit reasoning, the user has confirmed the selection, and the skills have been applied to produce `skill_recommendations` for step-03b.

## Approach

### Verify the server

Ask once how the server is running:

- `[R]` Already running.
- `[S]` Start it for me — ask for the start command, run it, wait for ready.
- `[U]` User will start it manually — wait for confirmation.

Halt for input.

### Inline live-audit framework

The audit happens directly via Chrome DevTools MCP — no external base skill needed. Walk through these dimensions:

**a. Capture (browse / Chrome DevTools MCP)**
- Navigate to `{url}`.
- Take a primary screenshot (store the path as `primary_screenshot`).
- Read console messages — capture errors as `console_errors`.
- List network requests — capture failed/slow requests as `network_issues`.
- If responsive concerns apply, capture mobile (375px), tablet (768px), desktop (1440px) via `emulate`.

**b. Visual / structural inspection**
- **Token/consistency drift** — multiple button styles, inconsistent spacing, fonts mixing without intent.
- **Spacing & rhythm** — gaps that feel arbitrary, sections crammed or floating.
- **Visual hierarchy** — what does the eye land on first? Is it the right thing? Are primary CTAs visually weaker than secondary ones?
- **AI-slop patterns** — generic gradients, system-font defaults, placeholder feel, decorative emojis where copy should carry the meaning.
- **Interaction feedback** — hover, focus, active, click states for all interactive elements.
- **Error and empty states** — what does the screen show when there's no data, when something fails, when something's loading?
- **Accessibility quick check** — keyboard reachability of every interactive element; visible focus ring; aria attributes on dynamic UI; color contrast; touch-target sizes ≥ 44px on mobile.
- **Console / network health** — any red entries? Failed assets? Misshapen API responses?

**c. Quantitative dimension scoring (inline critique-style)**
- Visual Hierarchy: `{score}/10` — brief note
- Information Architecture: `{score}/10` — brief note
- Cognitive Load: `{score}/10` — brief note
- Emotional Resonance: `{score}/10` — brief note
- **Overall**: `{score}/10`

Store findings as `audit_findings` — `{ visual: [...], hierarchy_scores: {...}, capture: {primary_screenshot, console_errors, network_issues, viewports} }`.

### Reference dispatch hints

Load `{uxDispatchRules}` as **reference hints** only — read, then ignore anything that doesn't fit the actual evidence.

### Identify UX issues

Combine three inputs:

1. The audit findings (what visual + structural inspection actually surfaced).
2. The user's concern (if any).
3. Your UX judgment (reading between the lines, noticing what's implicit).

For each issue, capture:

- The issue (one clear sentence)
- Evidence — design-review-style finding / critique score / screenshot observation / user's exact words / console error
- User impact — why it matters

**Forbidden anti-pattern**: "critique mentioned 'hierarchy' → load arrange". Required pattern: "Visual Hierarchy 4/10 because the primary CTA shares size/weight with the secondary cancel button (visible in primary_screenshot at the form footer). Loading `arrange` for spatial restructuring + `typeset` for type-weight hierarchy."

### Select improvement skills

For each issue, pick the ui-ux-pro-max skill(s) that address it. Hints (judgment overrides):

- Token drift / inconsistency → `normalize`
- Spacing/rhythm broken → `arrange`
- Hierarchy weak → `arrange` + `typeset`
- AI-slop generic → `colorize` / `typeset` / `delight`
- "밋밋해" / lifeless → `bolder` + `delight` + `colorize` + `animate`
- "복잡해" / overwhelming → `distill` + `quieter` + `normalize`
- Errors/states broken → `harden` + `clarify`
- First-time/empty experience → `onboard`
- Mobile / responsive issues → `adapt`
- "한 단계 더" / push limits → `overdrive`
- Final polish before ship → `polish`

If the audit reveals issues the user didn't mention (a11y problems, console errors), include them — being a UX partner means catching what was missed. Don't pad with irrelevant skills.

### Present and confirm

Show in `{communication_language}`:

```
📋 {url} 라이브 감사 결과

📸 Screenshot: {primary_screenshot_path}

📊 Critique Scores
- Visual Hierarchy: …/10
- Information Architecture: …/10
- Cognitive Load: …/10
- Emotional Resonance: …/10
- Overall: …/10

🔍 UX 이슈
- {issue_1} — ({evidence})
- {issue_2} — ({evidence})
- ...

⚠️ Console/Network: {errors or "clean"}

🎨 적용할 개선 스킬 ({n}개)
- {skill} — {reasoning tied to issue + evidence}
- ...

고민 사항: {user_concern or "없음 — 화면 기반 자동 판단"}

[Y] 진행   [M] 일부 조정   [+] 추가   [N] 취소
```

Halt for input. `M` / `+` adjust then re-present. `N` ends the workflow. `Y` advances.

### Load skills and apply

For each confirmed skill, read the full file via Read tool. Warn briefly on any missing skill and continue.

Apply each skill's framework to the audit context. For each, capture:

- Finding — what the skill reveals about the audited screen.
- Recommendation — specific changes (file paths, DOM elements, CSS properties, copy, interaction patterns).
- Target files — which source files need editing.
- Priority — `P0` UX blocker / `P1` quality gate / `P2` nice-to-have.

Store as `skill_recommendations`: `{ skill_name: { finding, recommendation, target_files, priority } }`. This is analysis only — writing the improvement document happens in step-03b.

## Next

Load and follow `{nextStepFile}`.
