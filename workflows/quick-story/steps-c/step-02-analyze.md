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

### Discover upstream PRD (if present)

Before scanning code, look for an upstream PRD that may inform the Mini PRD draft in step-04 and the validation gate in step-04b. Glob the BMAD output area:

- `_bmad-output/**/prd.md`
- `_bmad-output/**/PRD.md`
- `_bmad-output/**/product-*.md`

If a PRD file exists:

- Read it once, in full.
- Note its path as `prd_path` — step-04b will pass this to `grr-spec-validate` as a `reference_path`.
- Extract: problem statement, target users, success criteria, explicit out-of-scope items. These inform — but do **not** auto-fill — the Mini PRD questions in step-04.

If no PRD exists, set `prd_path = null` and continue silently. quick-story is designed to work without one.

**Architecture documents are intentionally NOT loaded** — they drift heavily during development and are unreliable validation input. Patterns are gathered from real code (next subsections) instead.

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

When 2+ files need deep reading, **proceed with a dynamic workflow** — load `{parallelAgentsSkill}`, dispatch one sub-agent per file by judgment, and pull in any new touchpoint a file reveals until the blast-radius set stops growing. For small/obvious files, read directly.

### Present a tight summary

Tell the user, in `{communication_language}`:

- Project context status (loaded from `project-context.md` / not found)
- Touchpoint candidates (path → purpose → blast radius)
- Observed patterns (1–3 bullets of the most relevant conventions)

Brief — this is reconnaissance for step-03, not a deliverable.

## Next

Load and follow `{nextStepFile}`.
