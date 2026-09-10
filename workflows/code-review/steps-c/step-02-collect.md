---
name: step-02-collect
description: 'Collect changed files and their per-file diffs (added/modified lines) for line-level review'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-03-review.md'
---

# Step 2 — Collect

## Outcome

A list of changed files with their per-file diff content (added/modified lines with line numbers) is ready for the per-file review agents in step-03. At least one file with diffs must be present, or the workflow halts.

## Approach

### Determine the diff range

- **review_source == "story"**: read the story file, extract paths from the File List, ask the user for the diff base (default suggestion `main...HEAD`).
- **review_source == "diff"**: present quick options — `[1]` `main...HEAD`, `[2]` `HEAD~1..HEAD`, `[3]` `HEAD` (uncommitted), `[M]` custom range.
- **review_source == "manual"**: ask for the file paths (any common separator) and the diff base.

### Pin the base commit

Resolve whatever range was chosen down to a single base commit SHA and store it as `base_sha`: `main...HEAD` → `git merge-base main HEAD`, `HEAD~1..HEAD` → `HEAD~1`, `HEAD` (uncommitted) → `HEAD`. A custom range resolves to its left-hand side. Pin the SHA, not the ref — a ref moves, and a review whose base moves mid-loop compares against something it never reported on.

### Collect per-file diffs

Run `git diff {diff_range}` and parse the unified output. Split by file boundary (`diff --git a/... b/...`). For each file capture: path, hunks of added/modified lines with line numbers, and exclude deleted files (nothing to review). Store each file's diff separately so step-03 can hand it to one sub-agent per file.

If `review_source` is `story` or `manual`, intersect the diff with the provided path list. Note any listed file that has no diff (unchanged) and exclude it from the review queue.

### Re-collection rounds (auto mode)

Arriving here from step-05 means fixes were just applied and the diff has to be re-read before the next review. Two things change, and both matter:

- **Run `git diff {base_sha}`** — two dots, no right-hand side, so the comparison runs against the working tree. Fixes are applied in the working tree and never committed, so the round-one range (`main...HEAD` and friends) does not contain a single one of them. Re-collecting with it would hand the reviewers the pre-fix lines and re-report every finding that was just fixed, which reads exactly like a loop that cannot converge.
- **Ask nothing.** The base is pinned and the source is settled; the questions in this step belong to round one only.

Everything else is unchanged — same splitting, same story/manual path intersection, same validation.

### Validate

At least one file must have diff content. Remove duplicates. Count total changed lines per file for the report.

If nothing is collected, halt with a brief message asking the user to verify the diff range.

## Communicate

Briefly: count of files, total changed lines, and the file list with per-file change counts.

## Next

Load and follow `{nextStepFile}`.
