---
story_key: {{story_key}}
Status: ready-for-dev
type: quick-story
change_type: {{change_type}}
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

**Structure:**
- Placement: existing function or named small stages, and why? {{arch_placement}}
- Policy: existing rule? Name its owner and location. {{arch_policy}}
- Meaning: which empty values, order and failures must stay? {{arch_meaning}}

**Constraints:** {{arch_constraints}}

**Risks:** {{arch_risks}}

## 🔍 Architecture Impact

- **Scope Challenge:** {{impact_scope}}
- **Failure Scenarios:** {{impact_failures}}
- **Cross-Story Impact:** {{impact_cross_story}}
- **Test Coverage Gap:** {{impact_coverage}}

## 📋 {{conditional_review_title}}

{{conditional_review_bullets}}

> Only for `fix`; `ui` / `devex` notes stay in step-03.

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
- TDD: dev-story loads RED-GREEN-REFACTOR + anti-patterns.

**디버깅:** `/bmad-grr-bug-hunt`.

## Dev Agent Record

_[dev-story 실행 시 채워짐]_

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
