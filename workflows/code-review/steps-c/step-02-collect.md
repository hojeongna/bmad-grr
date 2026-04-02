---
name: 'step-02-collect'
description: 'Collect changed files and per-file diffs (added/modified lines) for line-level review'

nextStepFile: '~/.claude/workflows/code-review/steps-c/step-03-review.md'
---

# Step 2: Collect Files and Diffs

## STEP GOAL:

Collect the list of changed files AND their per-file diffs (added/modified lines with line numbers) based on the review source selected in step-01.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review agent collecting diff-level review targets
- Checklist is already loaded from step-01 — it remains ACTIVE and BINDING
- You collect files and diffs only — no review happens in this step

### Step-Specific Rules:

- Focus ONLY on collecting file list AND per-file diffs
- FORBIDDEN to start reviewing files in this step
- FORBIDDEN to proceed with an empty file list or missing diffs
- This is an auto-proceed step after collection

## EXECUTION PROTOCOLS:

- Follow the MANDATORY SEQUENCE exactly
- Store per-file diff content for dispatch to step-03 review agents
- HALT and wait for user input when asking for diff range or file paths
- Auto-proceed to next step after collection completes

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Determine Diff Range

**IF review_source == "story":**
- Read the story file completely (path stored from step-01)
- Extract file paths from the File List section of the story
- Ask user for the diff base (e.g., branch name, commit): "Please specify the diff base (e.g.: main, HEAD~3, specific commit)"
- Default suggestion: `main...HEAD`
- Note: story_file path is retained for status updates

**IF review_source == "diff":**

"**Select the diff range:**

**[1]** All changes against main (main...HEAD)
**[2]** Last 1 commit (HEAD~1..HEAD)
**[3]** Uncommitted changes (HEAD)
**[M]** Manual input"

#### Menu Handling Logic:

- IF 1: Set diff_range = "main...HEAD"
- IF 2: Set diff_range = "HEAD~1..HEAD"
- IF 3: Set diff_range = "HEAD"
- IF M: Ask user for custom diff range, then set diff_range to user input
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- After selection, set diff_range and proceed to Section 2

**IF review_source == "manual":**
- Ask user to provide the file paths to review
- Accept comma-separated list, space-separated, or one path per line
- Ask user for the diff base: "Please specify the diff base (e.g.: main, HEAD~3, specific commit)"
- HALT and wait for user input before proceeding

### 2. Collect Per-File Diffs

Run `git diff {diff_range}` to get the full unified diff output.

**Parse the diff output:**
- Split by file boundaries (`diff --git a/... b/...`)
- For each file, extract:
  - File path
  - Diff hunks: added lines (`+`), modified lines, with line numbers
  - Filter out deleted files (they cannot be reviewed)
- Store each file's diff content separately for dispatch to review agents

**If review_source == "story" or "manual":**
- Filter diff output to only include files from the provided file list
- If a listed file has no diff (unchanged), note it and exclude from review

### 3. Validate Collection

- Verify at least 1 file has diff content
- Remove duplicates if any
- Count total changed lines per file

**If no files with diffs found:**

HALT — "No changed lines found. Please verify the diff range."

### 4. Communicate and Auto-Proceed

"**Review target collection complete**

{{file_count}} files, total {{total_changed_lines}} changed lines

{{file_list_with_line_counts}}

**Starting parallel line review...**"

#### Menu Handling Logic:

- After collection is validated, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed step after collection completes
- For "manual" source: wait for user input, then auto-proceed
- For "story" and "diff" sources: auto-proceed immediately after collection
- HALT only if no valid diffs are found

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN at least 1 file with diff content is collected will you proceed to step-03-review.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- File list collected based on selected review source
- Per-file diffs extracted with line numbers
- At least 1 file with changes confirmed
- Changed line counts communicated to user
- Auto-proceeded to step-03

### FAILURE:

- Proceeding with an empty file list
- Collecting file paths only without diffs
- Starting file review in this step
- Not validating diff content existence
- Skipping user input for manual source

**Master Rule:** Must have files WITH diffs to review before proceeding. File paths alone are NOT enough — per-file diff content is REQUIRED.
