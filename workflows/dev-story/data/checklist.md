---
title: 'Dev Story - Definition of Done Checklist'
validation-target: 'Story markdown ({{story_path}})'
validation-criticality: 'HIGHEST'
---

# Definition of Done Checklist

## Implementation Completion

- [ ] **All Tasks Complete:** Every task and subtask marked [x]
- [ ] **Acceptance Criteria:** Implementation satisfies EVERY AC in the story
- [ ] **No Scope Creep:** Only implements what's in Tasks/Subtasks, nothing extra
- [ ] **Edge Cases:** Error conditions and edge cases handled

## TDD Compliance (from loaded skill)

- [ ] **Every function has a test:** All new functions/methods have corresponding tests
- [ ] **RED verified:** Each test was watched failing before implementation
- [ ] **Correct failure:** Each test failed for expected reason (feature missing, not typo)
- [ ] **GREEN minimal:** Wrote minimal code to pass each test
- [ ] **All tests pass:** Full test suite green
- [ ] **Output pristine:** No errors, warnings in test output
- [ ] **Real code tested:** Mocks only used when unavoidable
- [ ] **Anti-patterns avoided:** No mock behavior testing, no test-only production methods

## Test Coverage

- [ ] **Unit Tests:** Added/updated for core functionality
- [ ] **Integration Tests:** Added for component interactions (when required)
- [ ] **E2E Tests:** Created for critical flows (when required)
- [ ] **Regression Prevention:** ALL existing tests still pass

## Documentation & Tracking

- [ ] **File List:** Includes EVERY new/modified/deleted file
- [ ] **Dev Agent Record:** Contains implementation notes
- [ ] **Change Log:** Includes summary of changes
- [ ] **Story Sections Only:** Only permitted sections modified

## Final Status

- [ ] **Story Status:** Set to "review"
- [ ] **Sprint Status:** Updated to "review" (when tracking enabled)
- [ ] **No HALT Conditions:** No blocking issues remaining
