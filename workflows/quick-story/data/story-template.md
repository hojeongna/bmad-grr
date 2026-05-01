---
story_key: {{story_key}}
Status: ready-for-dev
type: quick-story
created: {{date}}
author: {{user_name}}
complexity: {{complexity}}
---

# Story {{story_key}}: {{title}}

## 🎯 Mini PRD

**문제/동기:** {{prd_problem}}

**대상 사용자:** {{prd_users}}

**성공 기준:** {{prd_success}}

**비범위:** {{prd_out_of_scope}}

## 🏗️ Mini Architecture

**Stack:** {{arch_stack}}

**Touchpoints:**
{{arch_touchpoints_list}}

**Patterns:** {{arch_patterns}}

**Constraints:** {{arch_constraints}}

**Risks:** {{arch_risks}}

## 🔍 Architecture Impact

- **Scope Challenge:** {{impact_scope}}
- **Failure Scenarios:** {{impact_failures}}
- **Cross-Story Impact:** {{impact_cross_story}}
- **Test Coverage Gap:** {{impact_coverage}}

## 📋 {{conditional_review_title}}

{{conditional_review_bullets}}

> Included only when `change_type` is `fix` (Fix-Specific Review) — `ui` / `devex` notes stay inline in step-03 commentary. Omitted entirely otherwise.

## Story

**As a** {{story_role}}
**I want** {{story_want}}
**So that** {{story_benefit}}

## Acceptance Criteria

{{acceptance_criteria_list}}

## Tasks / Subtasks

{{tasks_list}}

## Dev Notes

**Refs:**
- project-context.md: {{refs_project_context}}
- Related stories: {{refs_related}}

**Premise Challenge Notes:** {{premise_notes}}

**Testing Standards:**
- Unit: {{testing_unit}}
- Integration: {{testing_integration}}
- TDD: dev-story 실행 시 `test-driven-development` 스킬 자동 로드 (RED-GREEN-REFACTOR + anti-patterns)

**디버깅 시:** `/bmad-grr-bug-hunt` 사용 — superpowers systematic-debugging 통합 파이프라인.

## Dev Agent Record

_[dev-story 실행 시 채워짐]_

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
