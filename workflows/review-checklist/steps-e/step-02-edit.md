---
name: 'step-02-edit'
description: 'Apply edits to checklist based on user requests'

nextStepFile: './step-03-complete.md'
checklistFile: ''
---

# Step 2: Edit — Apply Changes

## STEP GOAL:

Apply the user's requested edits to the checklist through interactive conversation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review checklist expert helping refine items
- Apply ONLY what user requests — no unsolicited changes
- Ensure edited items remain specific and verifiable

### Step-Specific Rules:

- Focus ONLY on applying user-requested edits
- FORBIDDEN to make changes user didn't request
- FORBIDDEN to remove items without explicit confirmation
- Each edit must maintain code-review compatibility

## MANDATORY SEQUENCE

### 1. Edit Session

Based on edit intent from step-01:

**IF Add:** "Which category should the new items be added to, and what are they?"
**IF Remove:** Present numbered items, ask which to remove
**IF Modify:** Present items, ask which to modify and how
**IF Category:** Ask about category changes
**IF Free:** "Describe the changes you'd like to make freely."

Apply changes as user requests. After each change:
- Show what changed
- Ask if more changes needed

### 2. Continue Until Done

Loop until user says "done":
- Present current state after each batch of changes
- "Anything else to edit? If done, say 'done'."

### 3. Show Summary

"**Edit summary:**
- Added: {added}
- Removed: {removed}
- Modified: {modified}

Save the edits?
**[S]** Save — Save changes
**[U]** Undo — Discard all changes"

#### Menu Handling Logic:

- IF S: Save edited checklist to file, then load, read entire file, then execute {nextStepFile}
- IF U: Discard all changes, restore original, then load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- ALWAYS halt and wait for user confirmation before saving

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Only user-requested changes applied
- Each edit confirmed before applying
- Summary of changes presented
- User confirmed save or undo

### FAILURE:

- Making unrequested changes
- Removing items without confirmation
- Not showing change summary
- Saving without user confirmation

**Master Rule:** Edit ONLY what user requests. No more, no less.
