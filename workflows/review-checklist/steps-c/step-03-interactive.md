---
name: 'step-03-interactive'
description: 'Collaboratively build checklist items through category-by-category conversation with user'

nextStepFile: './step-04-integrate.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 3: Interactive Mode — Collaborative Checklist Building

## STEP GOAL:

Build checklist items through category-by-category conversation with the user, collecting their team-specific rules, preferences, and standards.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review checklist expert having a collaborative conversation
- You guide the user through categories but let THEM define the rules
- You suggest items based on expertise, user confirms or modifies
- This is a partnership — you facilitate, they decide

### Step-Specific Rules:

- Focus ONLY on collecting checklist items through conversation
- FORBIDDEN to auto-generate items without user input — ASK first, then suggest
- Ask 1-2 categories at a time, don't overwhelm
- If other modes already produced results, use them as starting points for discussion
- User can skip categories they don't care about

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Load Categories and Set Context

Load {analysisCategories} to understand the full list of categories.

**IF other modes (A/P/U) also ran:**

"**Based on the automatic analysis results, let's refine and adjust through conversation.**

We'll go through each category, and for each one:
- If there are auto-generated items, I'll show them to you
- You can confirm, modify, or add items
- You can skip categories you don't need"

**IF interactive mode only (no other modes):**

"**Let's build the checklist through category-by-category conversation.**

For each category:
- Tell me the rules your team considers important
- I can suggest common items as well
- You can skip categories you don't need

Shall we begin?"

### 2. Category-by-Category Conversation

For each category from {analysisCategories}, engage the user:

**Pattern per category:**

"**[Category Name]**

[IF auto results exist for this category: The automatic analysis produced these items:
- item 1
- item 2]

Are there any rules your team particularly cares about in this category?
[Suggest 1-2 common items if user seems unsure]"

**User responses:**
- User adds items → record them
- User modifies auto-generated items → update them
- User says "skip" or "pass" → move to next category
- User says "done" or "enough" → end interactive session early

**Rules:**
- Present 2-3 categories at a time, then pause for input
- Don't rapid-fire all 14 categories at once
- Think about their responses before moving to next category
- If they give short answers, probe: "For example, what kind of pattern?"

### 3. Capture Additional Items

After going through categories:

"**Are there any additional rules not covered in other categories?**
Please share any team-specific rules, frequently flagged code review items, or easily overlooked items."

Record any additional items.

### 4. Summarize Interactive Results

"**Interactive mode results:**
- Items added: {added_count}
- Items modified: {modified_count}
- Categories skipped: {skipped_count}

**Proceeding to result integration...**"

### 5. Auto-Proceed

Load, read entire file, then execute {nextStepFile}

#### Menu Handling Logic:

- After interactive session complete, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This step is collaborative — ALWAYS wait for user input during conversation
- Auto-proceed ONLY after user confirms they're done with all categories
- If user says "done" early, respect that and proceed

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Categories presented 2-3 at a time, not all at once
- User input collected for each category they engaged with
- Auto-generated items reviewed and refined (if other modes ran)
- Additional items captured beyond standard categories
- User confirmed completion before proceeding
- Results stored for integration step

### FAILURE:

- Dumping all 14 categories at once
- Auto-generating items without asking user
- Not pausing for user input between categories
- Ignoring user's desire to skip categories
- Not capturing additional items beyond categories

**Master Rule:** This is a CONVERSATION, not a form. Engage naturally, respect user's pace, and let them drive the content.
