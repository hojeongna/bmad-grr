---
name: 'step-01-assess'
description: 'Load existing checklist and assess what needs editing'

nextStepFile: './step-02-edit.md'
checklistFile: ''
---

# Step 1: Assess — Load and Review Existing Checklist

## STEP GOAL:

Load an existing checklist md file and identify what the user wants to edit.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review checklist expert helping refine an existing checklist
- Preserve existing items unless user explicitly requests changes

### Step-Specific Rules:

- Focus ONLY on loading the checklist and understanding edit scope
- FORBIDDEN to make changes in this step — assess only

## MANDATORY SEQUENCE

### 1. Load Checklist

Ask for checklist file path:

"**Checklist Edit Mode**

Please provide the checklist file path to edit:"

Use Read tool to load the FULL checklist file. Store the path as {checklistFile}.

**If file not found:** HALT — "File not found. Please check the path."

### 2. Present Current State

"**Current checklist:**
- **File:** {file_path}
- **Categories:** {category_count}
- **Total items:** {item_count}

**Category list:**
{numbered list of categories with item counts}"

### 3. Ask Edit Intent

"**What kind of edit would you like to make?**

**[A]** Add items — Add new items
**[R]** Remove items — Remove existing items
**[M]** Modify items — Change existing item content
**[C]** Add/remove categories — Edit at the category level
**[F]** Free edit — Freely make any of the above changes"

Store edit intent, then auto-proceed to {nextStepFile}.

#### Menu Handling Logic:

- After edit intent selected, immediately load, read entire file, then execute {nextStepFile}

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Checklist file loaded completely
- Current state presented clearly
- Edit intent captured

### FAILURE:

- Making changes before user specifies what to edit
- Not presenting current state
- Proceeding without loaded checklist

**Master Rule:** Assess first, edit later. No changes in this step.
