---
name: step-03-review
description: 'Parallel per-file checklist review — one sub-agent per file, every finding cites a specific checklist item'
nextStepFile: '~/.claude/workflows/code-review/steps-c/step-04-report.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 3 — Parallel Review

## Outcome

Every collected file has been reviewed by its own dedicated sub-agent against the full checklist, restricted to the file's changed/added lines. Findings are aggregated for the report step. No file is modified during this step.

## Approach

### Load the parallel agents skill

Read the full content of `{parallelAgentsSkill}` and follow its dispatch pattern. One sub-agent per file — never batch multiple files into a single agent. Batching breaks scope isolation.

### Prepare each agent

Each agent receives:

1. **The full checklist** (every category, every item — not a summary).
2. **The file path** to review.
3. **The file's diff content** (changed/added lines only) from step-02.
4. **A scope-locked instruction**: review only the changed/added lines; the agent may use Read for surrounding context but only the diff lines are subject to checklist evaluation; for each violation, return the checklist category, the specific item, file path and line number, what is wrong, and how to fix it; do not modify any files; do not flag unchanged code.
5. **Output format**: a structured list of findings; if no violations exist on the changed lines, return `PASS - no checklist violations in changed lines of {file_path}`.

### Dispatch and collect

Dispatch all agents in parallel. Wait for every agent to return before continuing. Aggregate findings: group by file, retain checklist references, deduplicate identical findings on the same location, and note files that passed with no violations. Store as `primary_findings` for step-04.

## Next

Load and follow `{nextStepFile}`.
