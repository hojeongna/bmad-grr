---
name: 'step-06-complete'
description: 'Update story status if applicable, ask for story if unknown, and present completion summary'

csoSkill: '~/.claude/skills/gstack/cso/SKILL.md'
---

# Step 6: Complete — Final Summary and Status Update

## STEP GOAL:

Update story/sprint status if known, ask user for story document if not provided, then present a clear completion summary.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- CRITICAL: Read the complete step file before taking any action
- YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- You are a code review agent finalizing the review workflow
- If a story document is known, the status update is MANDATORY
- If no story document was provided, you MUST ask the user

### Step-Specific Rules:

- Focus ONLY on status updates and completion summary
- FORBIDDEN to make any code changes in this step
- FORBIDDEN to skip story status update when story_file is known

## EXECUTION PROTOCOLS:

- Follow the MANDATORY SEQUENCE exactly
- HALT and wait for user response when asking about story document
- Do NOT assume user's answer — wait for explicit Y/N
- Only modify story file and sprint-status.yaml — no code changes

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Story Status Update

**IF review_source == "story" (story_file already known):**

- Load the story file using Read tool
- Update story Status from "review" to "done"
- IF {sprint_status} file exists:
  - Load the FULL sprint-status.yaml using Read tool
  - Find the story key
  - Update status from "review" to "done"
  - Save file, preserving ALL comments and structure

"**Story status updated:** review → done"

**IF review_source != "story" (diff or manual):**

Ask the user:

"**Review complete! Is there a story document related to this review?**

**[Y]** Yes — Please provide the story file path
**[N]** No — Complete right away"

#### Menu Handling Logic:

- IF Y: Ask for story file path, load story file, update Status from "review" to "done". IF {sprint_status} exists, update sprint-status.yaml too. Then proceed to step 2.
- IF N: Proceed to step 2.
- IF user provides a path directly: Treat as Y, load and update. Then proceed to step 2.

#### EXECUTION RULES:

- HALT and wait for user response before proceeding
- Do NOT assume an answer — the user must explicitly choose
- After story status is handled, proceed to step 2 (Completion Summary)

### 1b. Reflect Code Review Changes to Story Documents

**After status update, for EACH story document:**

**Step A: Load and Analyze**
- Load the story document completely using Read tool
- Gather code review findings (from step-04 report) and applied fixes (from step-05 results)
- Identify which changes are relevant to this specific story

**Step B: Update Existing Plans That Changed**
- If code review fixes changed implementation approach, data flow, file structure, or architecture described in the story → update those sections directly in the story document
- Keep the story document consistent with the actual code state after review

**Step C: Append Additional Changes**
- Look for an existing section that records changes (e.g., "## Changes", "## Notes", "## Review Notes", "## Code Review Changes")
- **If found →** append code review changes there
- **If not found →** append a new `## Code Review Changes` section at the end with:
  - Date
  - Files modified and summary of changes per file
  - Checklist items that triggered the changes

**Repeat for all story documents if multiple exist.**

### 2. Security Audit (gstack)

**IF {csoSkill} exists (gstack installed):**

Load {csoSkill} via Read tool and follow its directives for a focused security check on the reviewed files:

- Check for OWASP Top 10 vulnerabilities in changed code (SQL injection, XSS, CSRF, etc.)
- Scan for hardcoded secrets or credentials
- Verify input validation on system boundaries
- Flag any security findings with concrete exploit scenarios

"**Security Check:**
- **Findings:** {count} ({critical_count} critical, {warning_count} warnings)
{for each finding: - {severity}: {description} in {file}:{line}}"

**IF {csoSkill} does NOT exist:** Skip this section.

### 3. Completion Summary

"**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**
**Code Review Complete!**

**Review source:** {{source_type}}
**Reviewed files:** {{file_count}}
**Changed lines:** {{total_changed_lines}}
**Violations found:** {{violation_count}}
**Fixed:** {{fixed_count}} (if fixes were applied)
**Checklist:** {{checklist_path}}
{{IF story updated: **Story status:** done}}

**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━**"

### 4. Suggest Next Steps

"**Next steps:**
- Review and test the modified code
- Update the checklist if new items need to be added
{{IF story updated: - Check the sprint-status}}
- **If UI changes were involved**, run `/bmad-grr-design-pass {url}` on the live result for a UX audit and improvement proposal (design-pass Branch B)"

### 5. End

Workflow complete. Remain available for user questions.

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Story status updated to "done" (when story_file is known)
- User asked about story document (when review_source != "story")
- Sprint status updated (when story-based and sprint file exists)
- Code review changes reflected in each story document (plans updated + changes appended)
- Clear completion summary presented with all metrics
- Next steps suggested

### FAILURE:

- Not updating story status when story_file is known
- Not asking user about story document when review_source != "story"
- Corrupting sprint-status.yaml comments or structure
- Not reflecting code review changes in story documents
- Only updating status without writing review changes to story
- Incomplete summary missing key metrics
- Making code changes in this step

**Master Rule:** Always handle story status — update if known, ASK if not. After status update, ALWAYS reflect code review changes into story documents. Skipping either is SYSTEM FAILURE.
