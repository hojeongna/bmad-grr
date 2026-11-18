---
name: step-01-init
description: 'Settle the mode; load the mandatory checklist; select the review source (story / git diff / manual file list)'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-02-collect.md'
---

# Step 1 — Init

## Outcome

Set mode, load the checklist and choose story/diff/manual source. Halt without a checklist.

## Approach

### Mode

Announce interactive/auto per the workflow. Auto fixes all findings and repeats until clean or stopped, without a scope menu.

Use the checklist, source and diff base supplied in arguments; ask only for missing inputs in either mode.

### Require a checklist (non-negotiable)

Read the supplied checklist markdown path, or ask for it if absent. Parse and retain every category and item for step-03.

In memory, replace three generic responsibility/DRY/value-edge items with:
- 같은 정책이 두 곳에 복사되지 않았나
- 없음·빈 값·0의 뜻이 바뀌지 않았나
- 저장 순서·여러 조회가 이름 뒤에 숨지 않았나

Replace only matching items; do not append or write a checklist. Preserve concrete contracts, security and authorization rules.

No checklist → halt; suggest `review-checklist`.

### Select review source

Offer three options:

- `[S]` Story document — review the files listed in a story's File List section. Ask for the story path and load it.
- `[D]` Git diff — review by diff range (collected in step-02).
- `[M]` Manual — review a specific list of files provided by the user.

Store `review_source` and `story_file` (if S) for downstream steps.

## Next

Once the checklist is loaded and a review source is chosen, load and follow `{nextStepFile}`.
