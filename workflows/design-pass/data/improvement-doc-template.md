---
story_key: {{story_key}}
Status: ready-for-dev
type: design-pass-improvement
source: live-audit
created: {{date}}
author: {{user_name}}
target_url: {{url}}
related_story: {{related_story_key or 'standalone'}}
complexity: {{complexity}}
---

# Story {{story_key}}: {{feature_name}} — Design Pass Improvement

## 🎯 Mini PRD

**문제/동기:** {{why_this_improvement_matters}}

**대상 사용자:** {{who_benefits}}

**성공 기준:** {{observable_improvement}}

**비범위:** {{out_of_scope}}

## 📸 Audited State (Before)

- **URL:** `{{url}}`
- **Screenshot path:** `{{screenshot_path}}`
- **Audit date:** {{date}}
- **Audited by:** `design-review` + `critique` + auto-dispatched UX skills

## 🔍 Audit Findings

### From `design-review` (Live QA)
{{design_review_findings}}

### From `critique` (Quantitative UX)
- **Visual Hierarchy:** {{score}}/10 — {{notes}}
- **Information Architecture:** {{score}}/10 — {{notes}}
- **Cognitive Load:** {{score}}/10 — {{notes}}
- **Emotional Resonance:** {{score}}/10 — {{notes}}
- **Overall:** {{score}}/10

### From Chrome DevTools / `browse`
- **Console errors:** {{console_errors or 'none'}}
- **Network issues:** {{network_issues or 'none'}}
- **Viewport tested:** {{viewport_list}}

### User Concern (if provided)
> "{{user_concern_text}}"

## 🧠 Auto-Dispatch Reasoning

The LLM selected the following skills based on the audit findings and user concern:

{{auto_dispatch_reasoning_table}}

*(Each row: skill name + specific reference from the audit findings or user concern)*

## 🛠️ Proposed Improvements (by skill)

### From `{{skill_1}}`
- **Finding:** {{what_the_skill_found}}
- **Recommendation:** {{what_the_skill_suggests}}
- **Target file(s):** `{{affected_file_paths}}`
- **Priority:** {{P0 | P1 | P2}}

### From `{{skill_2}}`
- **Finding:** ...
- **Recommendation:** ...
- **Target file(s):** ...
- **Priority:** ...

*(Repeat per skill applied)*

## Story

**As a** {{role}}
**I want** {{improved_experience}}
**So that** {{ux_benefit}}

## Acceptance Criteria

1. **Given** {{current_state}} **When** {{action}} **Then** {{improved_UX_outcome}}
2. ...

## Tasks / Subtasks

- [ ] Task 1 (AC: #1) — {{description with file path}}
  - [ ] Subtask 1.1
- [ ] Task 2 (AC: #2) — {{description}}

## Dev Notes

**Refs:**
- **Audited URL:** `{{url}}`
- **Screenshots folder:** `{{screenshot_folder}}`
- **Related story** (if any): {{related_story_key}}
- **Skills applied:** {{list of UX skills used (gstack + ui-ux-pro-max)}}
- **Prior learnings (gstack/learn):** {{relevant_learnings}}

**Testing Standards:**
- **Visual regression:** 스크린샷 diff 권장 (개선 전/후 비교)
- **E2E:** gstack `/qa` 또는 `/browse`로 개선 흐름 검증
- **a11y:** keyboard navigation + contrast check
- **Performance:** Core Web Vitals 기준 (LCP, CLS, INP)
- **TDD:** dev-story 실행 시 `test-driven-development` 스킬 자동 로드

**Priority Notes:**
- **P0** — 반드시 fix (UX 블로커)
- **P1** — 이번 PR에 포함 권장 (품질 게이트)
- **P2** — 별도 스토리로 분리 가능 (nice-to-have)

**Debugging:** 구현 중 이슈 발생 시 `/bmad-grr-bug-hunt` 또는 systematic-debugging 스킬

## Dev Agent Record

_[dev-story 실행 시 채워짐]_

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
