---
name: step-01-init
description: 'Collect situation context, discover and load relevant story documents; apply receiving-code-review discipline when the situation is reviewer/QA feedback'
nextStepFile: './step-02-verify.md'
receivingCodeReviewSkill: '~/.claude/skills/receiving-code-review/SKILL.md'
---

# Step 1 — Init

## Outcome

The user's situation is understood (what went wrong or what needs improvement), all relevant story documents are loaded, and the project context is in place. Ready to verify visually (step-02) or jump straight to gap analysis.

## Approach

### Collect the situation

Ask the user, in `{communication_language}`, what's happening. Useful prompts (don't insist on structure):

- What went wrong or what needs improvement?
- Story file path, story key, or epic number — if known.
- A URL to verify visually, if applicable.

If the situation is reviewer or QA feedback (the user is bringing comments from a code review, a QA report, or a stakeholder), load `{receivingCodeReviewSkill}` and apply its discipline through the analysis: read every item completely before reacting, restate each requirement, verify against the actual codebase before implementing, ask for clarification on items you don't fully understand instead of guessing, push back with technical reasoning when a comment is wrong (don't silently agree). No performative "you're absolutely right!" responses — actions over words.

### Parse and discover stories

From the user's response, extract: situation summary, story references (paths/keys/epic), URLs, and scope (single story vs multiple vs epic).

- **Specific path provided** — load the file directly.
- **Epic number provided** — load `{sprint_status}`, find every story in that epic, dispatch one sub-agent per story file (parallel) to load and summarize each. Sub-agents return `{story_key, status, tasks_summary, ac_summary}`. Sequential fallback if sub-agents are unavailable.
- **No specific reference** — load `{sprint_status}` for the full picture; grep `{implementation_artifacts}` for keywords from the situation; present discovered stories `[1] {story_key} - {title} (status)` and ask the user to pick.

### Load project context

Read `{project_context}` if present. Note any standards or constraints likely to affect refinement decisions.

### Communicate

Briefly: situation summary, the loaded stories with status and task progress, and the scope (single/multi/epic).

## Next

Load and follow `{nextStepFile}`.
