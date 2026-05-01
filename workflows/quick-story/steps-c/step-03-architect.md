---
name: step-03-architect
description: 'Draft 5-field mini architecture; run inline 4-point Architecture Impact pressure test; for fix change_type, layer in superpowers systematic-debugging'
nextStepFile: './step-04-compose.md'
systematicDebuggingSkill: '~/.claude/skills/systematic-debugging/SKILL.md'
---

# Step 3 — Mini Architecture & Impact

## Outcome

A 5-field mini architecture (Stack / Touchpoints / Patterns / Constraints / Risks) is drafted from step-02 context and pressure-tested through a 4-point Architecture Impact analysis (Scope Challenge / Failure Scenarios / Cross-Story Impact / Test Coverage Gap). For `change_type == 'fix'`, the superpowers systematic-debugging skill is loaded to ensure root-cause-shaped touchpoints. The user has confirmed the draft.

## Approach

### Draft the mini architecture (5 fields)

Bullet points only — no paragraphs. 2–5 bullets per field.

1. **Stack** — language, framework, key libs and versions actually touched (not the whole project).
2. **Touchpoints** — files/modules to change; one-line "why" each.
3. **Patterns** — existing conventions from `project-context.md` and observed code that this change must respect.
4. **Constraints** — performance, security, compatibility, API contracts that bind the change.
5. **Risks** — realistic things that could break.

### Run the 4-point Architecture Impact pressure test (inline)

This is the core sanity check. Apply directly — no external skill needed. Produce four crisp bullets:

- **Scope Challenge** — Is this over-engineered? Is there existing code/feature that already solves (or half-solves) this? Could the simpler cut work?
- **Failure Scenarios** — For each Touchpoint change, name **one realistic** production failure mode. Specific ("race when X runs while Y"), not vague ("could fail").
- **Cross-Story Impact** — Scan `{sprint_status}` for any story (quick-story `q-*` keys and epic-scoped keys) whose touchpoints overlap. Could this change break them? Name keys.
- **Test Coverage Gap** — Map each Touchpoint change to the test that must exist. Note which tests are already there vs. which need to be written.

### Fix-specific deepening (when change_type == 'fix')

Load the full content of `{systematicDebuggingSkill}` and apply its 4-phase framework (investigate → analyze → hypothesize → implement) to the architecture. Ensure touchpoints include the **root cause** area, not just the symptom surface. Capture 1–2 bullets under a "Fix-Specific Review" subsection:

- Root cause hypothesis: …
- Symptom vs cause touchpoints: …

For `change_type == 'ui'` or `'devex'`, stay inline — present 1–2 short UX/DX considerations directly without loading additional skills (the design-pass workflow handles deeper UX analysis when invoked via the routing menu in step-05).

For `change_type` in `feature | refactor | chore`, no extra subsection needed.

### Present and confirm

Show the draft in `{communication_language}`:

```
🏗️ Mini Architecture
Stack: …
Touchpoints: …
Patterns: …
Constraints: …
Risks: …

🔍 Architecture Impact
- Scope Challenge: …
- Failure Scenarios: …
- Cross-Story Impact: …
- Test Coverage Gap: …

[Fix-Specific / UI / DX Review subsection if applicable]

(Y) 다음 단계로
(E) 수정할 부분이 있어요
(R) Impact 결과 보고 구조를 다시 짤래요
```

Halt for input. On `E`, accept user edits, merge, re-present. On `R`, adjust the architecture based on Impact findings, re-present. On `Y`, advance.

## Next

Load and follow `{nextStepFile}`.
