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

> `gstack/plan-eng-review` 로드 시 포함. 미설치 시 compose 단계에서 섹션 전체 자동 생략.

## 📋 {{conditional_review_title}}

{{conditional_review_bullets}}

> `change_type`이 `fix` / `ui` / `devex`일 때 해당 CONDITIONAL 스킬(systematic-debugging / plan-design-review / plan-devex-review) 로드 시 포함. `feature` / `refactor` / `chore`는 섹션 전체 자동 생략.

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
- Prior learnings (gstack/learn): {{refs_learnings}}
- Related stories: {{refs_related}}

**Premise Challenge Notes:** {{premise_notes}}

**Testing Standards:**
- 단위: {{testing_unit}}
- 통합: {{testing_integration}}
- E2E: gstack `/qa` 또는 `/browse` 권장 (설치된 경우)
- TDD: dev-story 실행 시 `test-driven-development` 스킬 자동 로드

**디버깅 시:** `/bmad-grr-bug-hunt` 워크플로우 사용 — systematic-debugging + /investigate 통합 파이프라인

## Dev Agent Record

_[dev-story 실행 시 채워짐]_

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
