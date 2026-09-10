---
title: 'Dev Story — Definition of Done'
---

# Definition of Done

## Acceptance

Which set applies depends on `change_type` in the story file's frontmatter. Read it first, then judge only that set — the other set's items are `n/a`, not `FAIL`.

**Scenario track** — `change_type` is anything but `ui` (or is absent):

- [ ] Every AC has a Gherkin scenario (or is explicitly marked non-executable with a verification note)
- [ ] All scenarios green under the project's BDD runner
- [ ] Non-executable ACs verified by inspection, with note in Dev Agent Record

**UI track** — `change_type: ui`. There are no Gherkin scenarios and no BDD runner by design; their absence is not a defect:

- [ ] Every AC names the test that proves it, or is explicitly marked for inspection
- [ ] All named tests green under the project's own runner
- [ ] Inspection-marked ACs verified by inspection, with note in Dev Agent Record

## TDD discipline (from loaded skill)

- [ ] Every new function/method has a unit test
- [ ] Each unit test was watched failing before implementation
- [ ] Each test failed for the expected reason (missing behavior, not typo)
- [ ] Implementation is minimal — no unrequested features
- [ ] Real code tested; mocks limited to genuine boundaries

## Test integrity

- [ ] Unit tests added/updated where applicable
- [ ] Integration / scenario tests added where applicable
- [ ] Full suite green — no regressions
- [ ] Test output is clean (no errors, no warnings)

## Story hygiene

- [ ] File List reflects every file touched
- [ ] Tasks/Subtasks accurate (no stale [x], no orphan [ ])
- [ ] Dev Agent Record has technical decisions and notes
- [ ] Change Log entry added
- [ ] Only permitted story sections were modified

## Final

- [ ] Story Status set to `review`
- [ ] Sprint status updated to `review` (if tracking enabled)
- [ ] Summary delivered to user
