---
name: 'step-07-communicate'
description: 'Communicate completion summary and suggest next steps'
---

# Step 7: Completion Communication

## STEP GOAL:

Provide the user with a comprehensive completion summary and suggest logical next steps.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are communicating implementation results to {user_name}
- ✅ Tailor explanation depth to {user_skill_level}

### Step-Specific Rules:

- 🎯 Focus on clear, concise communication
- 💬 This is the FINAL step — no next step file

## MANDATORY SEQUENCE

### 1. Prepare Completion Summary

Write to Dev Agent Record → Completion Notes:
- Story ID and key
- Summary of what was implemented
- Key technical decisions made
- Tests added (count and types)
- Files modified (count)

### 2. Communicate to User

"**Story Implementation Complete!**

**Story:** {{story_key}} — {{story_title}}
**Status:** review

**What was done:**
- {{summary_of_changes}}

**TDD Results:**
- {{test_count}} tests written ({{unit_count}} unit, {{integration_count}} integration)
- All tests passing
- RED-GREEN-REFACTOR followed for every task

**Files Changed:** {{file_count}} files
- {{file_list_summary}}

**Story file:** {{story_file_path}}"

### 3. Offer Explanations

Based on {user_skill_level}, ask if user needs explanations about:
- What was implemented and how it works
- Why certain technical decisions were made
- How to test or verify the changes
- Any patterns or approaches used

If user asks questions: provide clear, contextual explanations.

### 4. Suggest Next Steps

"**Recommended next steps:**
- Review the implemented story and test the changes
- Run `code-review` workflow for peer review
- Check sprint status to see project progress
- **If this is a UI/UX story**, run `/bmad-grr-design-pass {url}` on the live result for a live UX audit and improvement proposal (design-pass Branch B)

**Tip:** For best results, run `code-review` using a **different** LLM than the one that implemented this story."

### 5. End

Workflow complete. Remain available for user questions.

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Clear completion summary communicated
- Dev Agent Record updated with completion notes
- User offered explanations appropriate to skill level
- Next steps suggested
- Workflow ended gracefully

### FAILURE:

- Vague or incomplete summary
- Not updating Dev Agent Record
- Not suggesting next steps

**Master Rule:** End the workflow with clarity and helpfulness.
