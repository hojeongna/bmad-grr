---
name: step-02-gap-scan
description: 'Read the full PRD, run the inline UX/UI gap-scan, tag unresolved gaps as [ASSUMPTION], get user confirmation, seed the UX/UI Guide document'
nextStepFile: './step-03-design-systems.md'
gapScanChecklist: '{gap_scan_checklist}'
uxGuideTemplate: '{ux_guide_template}'
uxGuidePath: '{ux_guide_path}'
---

# Step 2 — PRD UX/UI Gap-Scan

## Outcome

The PRD has been read in full, every genuine UX/UI gap has been identified with its PRD location (or lack of one), each carries a concrete default `[ASSUMPTION]`, and the user has confirmed, corrected, or answered enough of them to proceed. **None of this is written back into the PRD** — it's captured as `ux_gaps` and seeded into `{uxGuidePath}`, a standalone UX/UI Guide document this workflow owns.

## Approach

### Read everything

Read `{prd_or_story_path}` completely — every section, not just the ones that look design-relevant. Read `project-context.md` (per `{project_context}` glob) too, if present, for product-wide conventions that might resolve a gap the PRD itself leaves open.

### Apply the gap-scan

Load `{gapScanChecklist}` as reference hints, then read the PRD with a designer's eye. For every real gap: name the dimension, cite the PRD location it's missing from (or state plainly it isn't addressed anywhere), and write a one-line default assumption specific enough to act on — not "적절히 처리" but "네트워크 실패 시 재시도 버튼이 있는 인라인 에러 배너".

Tag every one of these `[ASSUMPTION]` — this is the same convention `bmad-ux` uses; keep it consistent so downstream docs read the same way.

Don't pad. A PRD that already specifies states, IA, and accessibility needs few or no assumptions — that's a good outcome, not a missed pass.

### Present and confirm

Show the list in `{communication_language}`:

```
📋 {prd_or_story_path} UX/UI 갭 스캔

- [ASSUMPTION] {dimension} — {prd_location or "PRD에 없음"}
  → {default_assumption}
- ...

[Y] 이대로 진행   [E] {n}번 답 다르게 줄게   [+] 추가로 짚을 거 있음   [N] 취소
```

Halt for input. On `E`, accept the correction and replace that assumption (now resolved, not a gap anymore — but keep it recorded as a resolved decision, not silently dropped). On `+`, accept additions and re-present. On `N`, end the workflow. On `Y`, proceed with assumptions as-is.

Store the final list as `ux_gaps`: `{ dimension, prd_location, assumption, user_resolved: bool }[]`.

### Seed the UX/UI Guide document

Create `{uxGuidePath}` from `{uxGuideTemplate}`, filling:

- Frontmatter: `title` (from the PRD/product name), `mode` (greenfield/brownfield), `prd_or_story_path`, `created`/`updated` = `{date}`.
- Section 1 (Product Context) and Section 2 (Screens & Flows) from the PRD reading.
- Section 3 (UX/UI Gap-Scan) from `ux_gaps` above.

Leave sections 4–6 as their template placeholders — later steps fill those in. Tell the user briefly where the doc landed: "UX/UI 가이드: `{uxGuidePath}`".

## Next

Load and follow `{nextStepFile}`.
