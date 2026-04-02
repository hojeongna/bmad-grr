---
name: 'step-01-init'
description: 'Load mandatory checklist and select review source for code review'

nextStepFile: '~/.claude/workflows/code-review/steps-c/step-02-collect.md'
---

# Step 1: Initialize — Load Checklist and Select Review Source

## STEP GOAL:

Load the mandatory checklist md file and let the user select the review source (story, git diff, or manual file list).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step, ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review agent performing checklist-based reviews
- You follow the checklist EXACTLY — no subjective opinions allowed
- Every finding MUST reference a specific checklist item

### Step-Specific Rules:

- Focus ONLY on loading the checklist and selecting review source
- FORBIDDEN to start any file review in this step
- FORBIDDEN to proceed without a loaded checklist — this is ABSOLUTE
- HALT immediately if the user cannot provide a checklist

## EXECUTION PROTOCOLS:

- Follow the MANDATORY SEQUENCE exactly
- Store checklist content, categories, and items for all later steps
- Store review_source and story_file path (if applicable)
- FORBIDDEN to proceed without checklist loaded

## CONTEXT BOUNDARIES:

- Available: Checklist md file (user-provided), story files, git repo
- Focus: Checklist loading and source selection only
- Limits: Do NOT review any files yet
- Dependencies: None — this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Require Checklist Input (NON-NEGOTIABLE)

Ask the user for the checklist md file path:

"**Code Review**

checklist md file path:"

- Use Read tool to load the FULL checklist file
- Parse all checklist categories and their items
- Store the complete checklist content for dispatch to review agents

**If user says they don't have one or refuses to provide one:**

HALT — "checklist md file. checklist md file."

**NEVER proceed without a loaded checklist. This is absolute and non-negotiable.**

### 2. Select Review Source

Present 3 options to the user:

"**checklist load. review source:**

**[S]** Story document — story file review (story file path)
**[D]** Git diff — git diff changed file auto-collect
**[M]** Manual — review file direct specify"

#### Menu Handling Logic:

- **IF S:** Ask for story file path, use Read tool to load story file, set review_source = "story", store story_file path. Then auto-proceed to {nextStepFile}.
- **IF D:** Set review_source = "diff". Then auto-proceed to {nextStepFile}.
- **IF M:** Set review_source = "manual". Then auto-proceed to {nextStepFile}.

#### EXECUTION RULES:

- HALT if no checklist provided — this is NON-NEGOTIABLE
- Wait for user to select a review source before proceeding
- After source selected, immediately load, read entire file, then execute {nextStepFile}

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the checklist is fully loaded AND a review source is selected will you proceed to step-02-collect.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Checklist md file loaded completely via Read tool
- Checklist categories and items parsed and stored
- Review source selected (story / diff / manual)
- Story file loaded if source is "story"
- Auto-proceeded to step-02

### FAILURE:

- Proceeding without a loaded checklist
- Skipping review source selection
- Starting file review in this step
- Accepting vague or incomplete checklist

**Master Rule:** NO CHECKLIST = NO REVIEW. This is absolute. Proceeding without a loaded checklist is SYSTEM FAILURE.
