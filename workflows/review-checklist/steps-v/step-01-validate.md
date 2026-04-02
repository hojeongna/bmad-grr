---
name: 'step-01-validate'
description: 'Validate checklist quality: specificity, completeness, duplicates, and code-review compatibility'

nextStepFile: './step-02-report.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 1: Validate — Checklist Quality Check

## STEP GOAL:

Validate an existing checklist md file for quality, specificity, completeness, and compatibility with code-review workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review checklist quality auditor
- You validate objectively against clear criteria
- Every finding must reference a specific validation rule

### Step-Specific Rules:

- Focus ONLY on validation — do NOT fix issues
- FORBIDDEN to modify the checklist file
- Report findings for the report step to summarize

## MANDATORY SEQUENCE

### 1. Load Checklist

**IF checklist path not already provided (standalone validation):**

"**Checklist Validate Mode**

Please provide the checklist file path to validate:"

Use Read tool to load the FULL checklist file.

**IF already loaded (from create or edit flow):**
Use the already loaded checklist.

### 2. Run Validation Checks

Perform these checks systematically:

**Check 1: Specificity**
For each item, verify it is specific enough to objectively assess pass/fail.

Bad: "Follow naming conventions" (vague)
Good: "Components use PascalCase naming" (specific, verifiable)

Flag items that are too vague or subjective.

**Check 2: Duplicates**
Scan for duplicate or near-duplicate items within or across categories.

**Check 3: Completeness**
Load {analysisCategories} and check for missing categories that should be covered based on the tech stack in the frontmatter.

**Check 4: code-review Compatibility**
Verify:
- File has valid frontmatter (project, techStack, generatedDate)
- Uses `## Category` headers for sections
- Uses `- [ ] item` format for checklist items
- Items are reviewable by reading code (not requiring runtime testing)

**Check 5: Item Quality**
For each item:
- Is it actionable? (reviewer knows what to check)
- Is it non-overlapping? (doesn't duplicate another item's scope)
- Is it relevant? (applies to the stated tech stack)

### 3. Store Findings

Collect all findings with:
- Check name (Specificity/Duplicates/Completeness/Compatibility/Quality)
- Severity (HIGH/MEDIUM/LOW)
- Specific item or location
- What's wrong
- Suggested fix

"**Validation complete. Generating report...**"

Auto-proceed to {nextStepFile}

#### Menu Handling Logic:

- After all checks complete, immediately load, read entire file, then execute {nextStepFile}

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All 5 validation checks performed
- Each finding references a specific check and item
- Severity assigned to each finding
- No modifications made to checklist file

### FAILURE:

- Skipping any of the 5 checks
- Modifying the checklist during validation
- Findings without severity or specific references

**Master Rule:** Validate objectively. Do NOT fix — only report.
