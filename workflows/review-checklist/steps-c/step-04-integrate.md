---
name: 'step-04-integrate'
description: 'Merge all mode results into a single unified checklist, resolving duplicates and conflicts'

nextStepFile: './step-05-finalize.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
analysisCategories: '../data/analysis-categories.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Integrate — Merge All Results

## STEP GOAL:

Merge checklist items from all executed modes into a single, unified checklist. Remove duplicates, resolve conflicts, and organize by category.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review checklist expert performing systematic integration
- You merge results objectively — no adding your own items
- Every item in the final checklist must trace back to a mode result

### Step-Specific Rules:

- Focus ONLY on merging, deduplicating, and organizing
- FORBIDDEN to add new items not from any mode result
- FORBIDDEN to remove items without user confirmation
- When items conflict, present both and let user decide
- Prescriptive approach: follow integration rules exactly

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Collect All Results

Gather checklist items from all executed modes:
- Mode A (Project Analysis) results — if executed
- Mode P (PR Review Mining) results — if executed
- Mode U (Universal) results — if executed
- Mode I (Interactive) results — if executed

"**Starting integration. Results by mode:**
- [Mode A]: {count_a} items
- [Mode P]: {count_p} items
- [Mode U]: {count_u} items
- [Mode I]: {count_i} items
- **Total:** {total} items"

### 2. Deduplicate

Compare items across all modes:

**Exact duplicates:** Remove, keep one copy
**Near duplicates (same intent, different wording):** Merge into the most specific/clear version
**Overlapping items:** Combine into a single comprehensive item

"**Deduplication results:**
- Exact duplicates removed: {exact}
- Near duplicates merged: {near} → {merged}
- **After deduplication:** {after_dedup} items"

### 3. Resolve Conflicts

Identify items that contradict each other across modes:

**Example conflicts:**
- Mode A found: "Components use default exports"
- Mode U suggests: "Components should use named exports"

For each conflict:

"**Conflict found:**

Item 1 (Project Analysis): [item from mode A]
Item 2 (Universal): [item from mode U]

Which should we keep?
**[1]** Keep Item 1
**[2]** Keep Item 2
**[B]** Keep both (apply contextually)
**[N]** Remove both"

Wait for user input on each conflict.

### 4. Organize by Category

Group all surviving items by category:
- Use categories from {analysisCategories} as primary structure
- Items that don't fit existing categories → create new category or "Other"
- Order categories logically
- Order items within each category by importance (critical → nice-to-have)

### 5. Present Integrated Checklist Preview

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**
**Integrated Checklist Preview**

**Total items:** {final_count}
**Categories:** {category_count}
**Sources:** [list of modes used]

---

For each category:
**## [Category Name]** ({item_count} items)
- [ ] [item 1]
- [ ] [item 2]
...

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 6. Present MENU OPTIONS

Display: **Review the integration results:**
**[A]** Advanced Elicitation — Deeper analysis
**[P]** Party Mode
**[C]** Continue — Proceed to final review

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can request changes before proceeding

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save integrated checklist, then load, read entire file, then execute {nextStepFile}
- IF user requests changes: Apply changes, re-present preview, then redisplay menu

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All mode results collected and counted
- Exact and near duplicates identified and removed
- Conflicts presented to user with clear options
- Items organized by category logically
- Integrated preview presented clearly
- User confirmed before proceeding

### FAILURE:

- Adding items not from any mode result
- Removing items without user confirmation
- Not detecting duplicates across modes
- Silently resolving conflicts without asking user
- Presenting unorganized/uncategorized list

**Master Rule:** Integration is mechanical and transparent. Every merge, dedup, and conflict resolution must be visible to the user.
