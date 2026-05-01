---
name: step-03b-document-fix
description: 'Branch B — compose improvement document from step-02b audit + recommendations; pick save target (new dp-N story / append to existing via refine-story / file only); user-approve; write and register'
nextStepFile: './step-04-route.md'
improvementTemplate: '~/.claude/workflows/design-pass/data/improvement-doc-template.md'
---

# Step 3b — Document Improvement

## Outcome

An improvement document is composed from step-02b's `audit_findings` and `skill_recommendations`, the save target is chosen (new `dp-{N}-{slug}` story / append to an existing story via `refine-story` / file-only), the user has approved the rendered document, the file has been written (or staged for handoff), and `sprint-status.yaml` is registered with the new story when applicable. Every recommendation has an explicit priority (P0 / P1 / P2).

## Approach

### Pick the save target

Halt for input:

- `[N]` New story — `dp-{next}-{slug}.md` independent improvement story (dev-story can implement directly). ⭐ recommended.
- `[A]` Append to existing — user gives a target story key/path; routing in step-04 will delegate to `refine-story` with this improvement doc as context.
- `[S]` File only — write the improvement doc, skip sprint-status registration.

If `A`, ask for the target story key or path; verify it exists.

### Generate the story key (when N or S)

Load `{sprint_status}`, scan keys starting with `dp-`, take the highest `N`, use `N+1`. Start at `dp-1` if none exist.

Format: `dp-{N}-{slug}`. Slug derived from:

- The user concern (if provided)
- Otherwise the URL's primary feature area (`/products` → `products`)
- Otherwise the main audit finding

Max 3–4 meaningful words, kebab-case, articles stripped.

### Compose the document

Read `{improvementTemplate}` and substitute:

**Frontmatter** — `story_key` (generated or existing), `date`, `user_name`, `url` (from step-01), `related_story` (target key for `A`, or `'standalone'` for `N`/`S`), `complexity` (`S`/`M`/`L` — judgment based on recommendation count, scope breadth, risk; e.g., 1–3 small recommendations on one component → `S`; 8+ across multiple sections → `L`).

**Sections**:

- **Mini PRD** — derive from audit intent: 문제/동기 (what's wrong, why it matters); 대상 사용자 (who benefits); 성공 기준 (observable improvement, with measurable elements where possible); 비범위 (what's out of scope this pass).
- **Audited State (Before)** — url, primary screenshot, audit date, "audited via inline live-audit framework + critique inline scoring".
- **Audit Findings** — visual/structural findings list, critique scores per dimension, browse capture (console errors, network issues, viewport notes).
- **User Concern** — verbatim quote if provided.
- **Auto-Dispatch Reasoning** — table mapping each selected ui-ux-pro-max skill to the specific audit finding that triggered it.
- **Proposed Improvements (per skill)** — for every applied skill: Finding, Recommendation (concrete: file paths, DOM elements, CSS, copy, interaction patterns), Target file(s), Priority (P0/P1/P2).
- **Story** — `As a / I want / So that` from the intent.
- **Acceptance Criteria** — BDD `Given / When / Then` covering each P0/P1 recommendation as a testable outcome. Judgment decides count.
- **Tasks / Subtasks** — atomic, dependency-ordered, each referencing an AC number.
- **Dev Notes** — refs (audited URL, screenshot, related story, skills applied), testing standards (visual-regression / E2E / a11y / Core Web Vitals / TDD note), priority notes.
- **Dev Agent Record** — empty placeholder.

**Priority assignment rules** (every recommendation gets one):

- **P0** — UX blocker (a11y failures, broken interactions, console errors that affect user, data loss, primary goal can't complete).
- **P1** — quality gate (consistency drift, missing feedback, unclear copy, hierarchy issues hurting comprehension).
- **P2** — nice-to-have (delight, micro-polish, optional enhancements, subtle animation).

Default to `P1` when genuinely unclear.

### Present and approve

Show in `{communication_language}`: save target description, story key (or "existing: {target_key}"), planned save path or handoff status, complexity, total recommendations broken down by priority, then the full rendered doc in a code block. Halt for input:

- `[Y]` Save and register
- `[E]` Edit specific parts
- `[P]` Adjust priorities
- `[R]` Regenerate AC/Tasks
- `[N]` Cancel

Apply changes and re-present until `Y`.

### Write and register

- **`N` (new story)** — Write to `{implementation_artifacts}/{story_key}.md`. Then load `{sprint_status}`, append:
  ```yaml
  - key: {story_key}
    title: {feature_name from url/concern}
    status: ready-for-dev
    created_by: design-pass
    source: live-audit
    created: {date}
  ```
  Preserve all existing entries, comments, and structure (Edit for targeted insertion; Write only if Edit can't preserve structure).
- **`A` (append to existing)** — Don't write to disk here. Stage the rendered doc as a handoff artifact (in context) so step-04 can pass it to `refine-story` with the target story key.
- **`S` (file only)** — Write to disk; skip sprint-status entirely.

Report briefly which action was taken.

## Next

Load and follow `{nextStepFile}`.
