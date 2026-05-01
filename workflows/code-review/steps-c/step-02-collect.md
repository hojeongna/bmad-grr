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

### Collect per-file diffs

Run `git diff {diff_range}` and parse the unified output. Split by file boundary (`diff --git a/... b/...`). For each file capture: path, hunks of added/modified lines with line numbers, and exclude deleted files (nothing to review). Store each file's diff separately so step-03 can hand it to one sub-agent per file.

If `review_source` is `story` or `manual`, intersect the diff with the provided path list. Note any listed file that has no diff (unchanged) and exclude it from the review queue.

### Validate

At least one file must have diff content. Remove duplicates. Count total changed lines per file for the report.

If nothing is collected, halt with a brief message asking the user to verify the diff range.

## Communicate

Briefly: count of files, total changed lines, and the file list with per-file change counts.

## Next

Load and follow `{nextStepFile}`.
