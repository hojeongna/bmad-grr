---
type: qa-test-spec
identifier: '[story-id or epic-id]'
title: '[Story/Epic Title]'
date: '[date]'
status: '[draft/approved/in-progress/completed]'
app_url: '[app URL]'
story_path: '[story document path]'
tester: 'AI QA Agent'
---

# QA Test Specification: [Story/Epic Title]

## 1. Test Overview

| Field | Value |
|-------|-------|
| Identifier | [story-id or epic-id] |
| Feature Under Test | [feature name] |
| Related Pages/Routes | [list of affected URLs] |
| Preconditions | [app running, user logged in, test data, etc.] |
| Test Environment | [browser, viewport, URL] |

## 2. Feature Summary

[Brief description of what was implemented, based on story ACs. What the user should be able to do after this feature ships.]

## 3. Test Scope

### In Scope
- [Specific features/pages being tested]
- [User flows that must work]

### Out of Scope
- [Features not affected by this change]
- [Already tested and unchanged areas]

### Affected Existing Features
- [List of existing features that share components/pages/state with this change]
- [These MUST be regression-tested]

---

## 4. Test Scenarios

### TS-001: [Scenario Group Name, e.g., "User Registration Form"]

**Description:** [What this scenario group covers]
**Page/Route:** [URL path]
**Precondition:** [Setup needed before these cases]

#### Test Cases

| TC# | Test Case | Steps | Input/Action | Expected Result | Priority |
|-----|-----------|-------|--------------|-----------------|----------|
| TC-001-01 | [Descriptive name] | 1. [step] 2. [step] | [specific input or action] | [exact expected outcome] | P0 |
| TC-001-02 | [name] | 1. ... 2. ... | [input] | [expected] | P1 |

#### Edge Cases

| TC# | Test Case | Steps | Input/Action | Expected Result | Priority |
|-----|-----------|-------|--------------|-----------------|----------|
| TC-001-E01 | [edge case name] | 1. ... 2. ... | [boundary input] | [expected] | P1 |
| TC-001-E02 | [edge case name] | 1. ... 2. ... | [unusual input] | [expected] | P2 |

#### Error Cases

| TC# | Test Case | Steps | Input/Action | Expected Result | Priority |
|-----|-----------|-------|--------------|-----------------|----------|
| TC-001-R01 | [error scenario] | 1. ... 2. ... | [invalid input] | [error message / graceful handling] | P1 |

---

### TS-002: [Next Scenario Group]

[Same structure repeats per scenario group]

---

## 5. Navigation & Flow Tests

| TC# | Test Case | Steps | Expected Result | Priority |
|-----|-----------|-------|-----------------|----------|
| NAV-01 | Back button after [action] | 1. perform action 2. press back | [expected page/state] | P1 |
| NAV-02 | Browser refresh at [state] | 1. reach state 2. F5 | [expected behavior] | P1 |
| NAV-03 | Direct URL access | 1. paste URL directly | [expected behavior] | P1 |
| NAV-04 | Breadcrumb navigation | 1. click breadcrumb | [expected destination] | P2 |

## 6. Cross-Feature Regression Tests

Tests for existing features that might be affected by this change.

| TC# | Existing Feature | Test Case | Steps | Expected Result | Priority |
|-----|-----------------|-----------|-------|-----------------|----------|
| REG-01 | [feature name] | [what to verify] | 1. ... | [still works as before] | P0 |
| REG-02 | [feature name] | [what to verify] | 1. ... | [still works] | P1 |

## 7. Accessibility Tests

| TC# | Test Case | Check Point | Expected Result | Priority |
|-----|-----------|-------------|-----------------|----------|
| A11Y-01 | Keyboard navigation | [interactive elements] | All reachable via Tab, activatable via Enter/Space | P1 |
| A11Y-02 | Focus visibility | [after Tab navigation] | Focus indicator visible on every element | P1 |
| A11Y-03 | ARIA labels | [dynamic elements] | Appropriate roles and labels present | P2 |
| A11Y-04 | Color contrast | [text elements] | Sufficient contrast ratio (WCAG AA) | P2 |
| A11Y-05 | Form labels | [form fields] | Every input has associated label | P1 |

## 8. Responsive Tests

| TC# | Viewport | Test Case | Expected Result | Priority |
|-----|----------|-----------|-----------------|----------|
| RSP-01 | Mobile (375px) | Layout adaptation | No horizontal scroll, readable text, usable touch targets | P1 |
| RSP-02 | Tablet (768px) | Layout adaptation | Proper use of available space | P2 |
| RSP-03 | Desktop (1280px) | Primary layout | Feature renders correctly at primary viewport | P0 |
| RSP-04 | Any | Text overflow | Long text wraps or truncates gracefully | P1 |

## 9. UI/Visual Tests

| TC# | Test Case | Check Point | Expected Result | Priority |
|-----|-----------|-------------|-----------------|----------|
| UI-01 | Layout integrity | [page/component] | [no layout shift, proper spacing] | P1 |
| UI-02 | Loading states | [action trigger] | [spinner/skeleton visible] | P2 |
| UI-03 | Empty state | [no data condition] | [appropriate empty state UI] | P2 |
| UI-04 | Console errors | [after all actions] | [no new console errors/warnings] | P0 |

## 10. Test Case Summary

| Category | P0 | P1 | P2 | Total |
|----------|----|----|-----|-------|
| Functional (TS-*) | [N] | [N] | [N] | [N] |
| Edge Cases (E*) | [N] | [N] | [N] | [N] |
| Error Cases (R*) | [N] | [N] | [N] | [N] |
| Navigation (NAV-*) | [N] | [N] | [N] | [N] |
| Regression (REG-*) | [N] | [N] | [N] | [N] |
| Accessibility (A11Y-*) | [N] | [N] | [N] | [N] |
| Responsive (RSP-*) | [N] | [N] | [N] | [N] |
| UI/Visual (UI-*) | [N] | [N] | [N] | [N] |
| **Total** | **[N]** | **[N]** | **[N]** | **[N]** |
