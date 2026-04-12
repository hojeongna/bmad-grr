---
type: qa-report
scope: '[story/epic]'
identifier: '[story-id or epic-id]'
date: '[date]'
status: '[in-progress/completed/completed-with-deferred]'
app_url: '[app URL]'
---

# QA Test Report: [Story/Epic Title]

## Session Info

| Field | Value |
|-------|-------|
| Date | [date] |
| Scope | [single story / epic] |
| Identifier | [story-id or epic-id] |
| App URL | [app URL] |
| Tester | AI QA Agent |

## Test Plan

### Coverage Summary

| Category | Count |
|----------|-------|
| Functional (TS-*) | [N] |
| Edge Cases (E*) | [N] |
| Error Cases (R*) | [N] |
| Navigation (NAV-*) | [N] |
| Regression (REG-*) | [N] |
| Accessibility (A11Y-*) | [N] |
| Responsive (RSP-*) | [N] |
| UI/Visual (UI-*) | [N] |
| **Total** | **[N]** |

### Test Cases

| TC# | Name | Priority | Category | Result | Evidence |
|-----|------|----------|----------|--------|----------|
| TC-01 | [name] | P0 | [category] | [PASS/FIXED/DEFERRED/BLOCKED] | [screenshot ref] |
| TC-02 | [name] | P1 | [category] | [result] | [evidence] |

## Execution Results

### Fixes Applied During QA

| # | Test Case | Root Cause | Fix Description | Files Changed |
|---|-----------|------------|-----------------|---------------|
| 1 | TC-[NN] | [cause] | [fix] | [files] |

### Deferred Issues

| # | Test Case | Issue | Severity | Suggested Fix | Written to Story |
|---|-----------|-------|----------|---------------|-----------------|
| 1 | TC-[NN] | [issue] | P[N] | [approach] | [Y/N - story path] |

### Blocked Test Cases

| # | Test Case | Blocked By | Reason |
|---|-----------|------------|--------|
| 1 | TC-[NN] | TC-[NN] | [why this test couldn't run] |

## Summary

| Metric | Value |
|--------|-------|
| Total test cases | [N] |
| Passed | [N] |
| Fixed during QA | [N] |
| Deferred | [N] |
| Blocked | [N] |
| **Pass Rate** | **[%]** |

## Story Documents Updated

| Story | QA Feedback Added | Deferred Issues |
|-------|-------------------|-----------------|
| [story path] | [Y/N] | [count] |

## QA Learnings

- [Notable patterns, recurring issues, or insights from this session]
