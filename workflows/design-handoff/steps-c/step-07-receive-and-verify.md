---
name: step-07-receive-and-verify
description: 'Intake the HTML draft(s) back from Claude Design, dispatch a fresh sub-agent Review+Verify pipeline against the UX/UI Guide document, collect surviving findings'
nextStepFile: './step-08-route.md'
uxGuidePath: '{ux_guide_path}'
---

# Step 7 — Receive & Verify the Draft

## Outcome

The HTML draft(s) from Claude Design are collected, and a fresh sub-agent pipeline — never this same conversation's context, per this repo's sub-agent-dispatch-over-self-verification rule — has checked them against `{uxGuidePath}` (screen spec, design system, and `[ASSUMPTION]` entries). Surviving findings are stored as `conformance_findings`.

## Approach

### Collect the draft

Ask the user for the file path(s) (or inline pasted code) of what Claude Design returned, plus any notes it gave about which `[ASSUMPTION]` items it resolved differently. Read every file in full.

### Dispatch via the Workflow tool

Call the **Workflow** tool — this is the same pattern this repo's `code-review` step-03 uses, and for the same reason: the agent that wrote the prompt is a bad judge of whether the result actually matches it. Two phases:

- **Review** — one `agent()` per screen/file, each given: that screen's entry from `{uxGuidePath}` section 2, the relevant section 3 `[ASSUMPTION]` entries, section 4's design-system tokens (or the design system Claude Design proposed, if none existed locally), and the file content. Scope-locked: report only concrete mismatches (missing state, wrong IA, unaddressed assumption, off-system token/color, accessibility gap) with what's wrong and where — never a style opinion dressed as a requirement. If `has_prd` is false (improvement-only mode), section 3 is N/A — skip assumption checks and focus the review on design-system anchoring and internal consistency instead.
- **Verify** — distribute the candidate findings across `agent()` calls to confirm or refute each against the actual file content. Keep confirmed, drop refuted, surface uncertain.

Store the surviving findings as `conformance_findings`, grouped by screen/file, each with the requirement it violates and a one-line description of the mismatch.

### Present

```
🔍 Draft 검증 결과

{screen/file}: {n}개 이슈
- {requirement} — {what's wrong}
- ...

{screen/file}: 이상 없음 ✅
```

## Next

Load and follow `{nextStepFile}`.
