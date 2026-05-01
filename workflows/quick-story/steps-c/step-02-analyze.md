---
name: step-02-analyze
description: 'Gather lightweight context — project-context, touchpoint discovery, observed patterns — to inform the mini architecture'
nextStepFile: './step-03-architect.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
---

# Step 2 — Pattern Analysis

## Outcome

Enough context exists to draft a 5-field mini architecture in step-03: project conventions are loaded, touchpoint files are identified with their blast radius, and observed patterns from those files are captured. No architecture drafting happens here.

## Approach

### Load project context

Search for `project-context.md` (per the `{project_context}` glob). If found, read it and extract: coding standards/conventions, architectural patterns (layered/clean/hexagonal/DDD/etc.), domain rules and invariants, tech stack notes.

If not found, note that and rely on direct code scanning instead.

### Discover touchpoint files

Based on the intent and `touchpoint_hints` from step-01:

- **Glob** for candidate files matching hinted paths or feature area.
- **Grep** for files containing semantic keywords from the intent (not just literal strings).
- Narrow to files actually in the change's blast radius — judgment decides "how many is enough" (usually 3–5 for a quick story; can be more if the intent really spans them).

For each touchpoint, capture:

- path
- one-line purpose (from filename + content)
- relevant existing patterns observed (imports, structure, conventions)
- blast radius (what else changes if we modify this)

When 2+ files need deep reading, load `{parallelAgentsSkill}` and dispatch one sub-agent per file (each returns a structured summary). For small/obvious files, read directly.

### Present a tight summary

Tell the user, in `{communication_language}`:

- Project context status (loaded from `project-context.md` / not found)
- Touchpoint candidates (path → purpose → blast radius)
- Observed patterns (1–3 bullets of the most relevant conventions)

Brief — this is reconnaissance for step-03, not a deliverable.

## Next

Load and follow `{nextStepFile}`.
