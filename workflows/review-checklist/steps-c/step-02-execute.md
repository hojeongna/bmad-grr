---
name: step-02-execute
description: 'Dispatch parallel agents for selected automatic modes (A/P/U/S/R/Au); collect structured checklist results'
nextStepFile: './step-03-interactive.md'
skipToIntegrate: './step-04-integrate.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
parallelAgentsSkill: '~/.claude/skills/dispatching-parallel-agents/SKILL.md'
analysisCategories: '../data/analysis-categories.md'

# ui-ux-pro-max plugin skill (NOT gstack)
auditSkill: '~/.claude/skills/audit/SKILL.md'
---

# Step 2 — Parallel Execute

## Outcome

Each selected automatic mode has its own dedicated sub-agent that returns a structured list of checklist items (category headers + verifiable items). Results are aggregated and ready for either the interactive step (if `I` was also selected) or direct integration.

## Approach

### Load the parallel agents skill

Read `{parallelAgentsSkill}` for the dispatch pattern. Load `{analysisCategories}` for category guidance. One agent per selected mode — never batch multiple modes into one agent.

### Prepare per-agent prompts

Every agent receives: the relevant inputs from step-01, the category guidance from `{analysisCategories}`, an explicit "READ-ONLY: do not modify any files" rule, and the required output format:

```
## [Category Name]
- [ ] [Specific verifiable checklist item]
```

Common rules across all agents: every item must be objectively verifiable (pass/fail by reading code or running a specific command). Concrete patterns ("Components use PascalCase"), not generic advice ("Follow naming conventions"). Skip categories that don't apply.

**Agent A — Project Analysis** (when A selected): project root, conventions doc content (if loaded), conventions strategy (`C`/`R`/`B`), category guidance. Instruction: examine actual code with Read/Glob/Grep; identify the conventions the project follows; produce checklist items reflecting those actual patterns.

**Agent P — PR Review Mining** (when P selected): repo, PR range. Instruction: use `gh pr list --state merged --limit {N} --json number,title`; for each PR, fetch reviews and review comments via `gh pr view ... --json reviews,comments` and `gh api repos/{owner}/{repo}/pulls/{n}/comments`; filter to human reviewers (skip bots); cluster recurring themes; produce checklist items that prevent the kinds of issues reviewers commonly flag.

**Agent U — Universal Best Practices** (when U selected): tech stack. Instruction: use general knowledge plus WebSearch/WebFetch to find current best practices for the stack; cover language idioms, framework patterns, common pitfalls, performance, testing conventions; produce stack-specific items (not generic ones).

**Agent S — Security** (when S selected): tech stack. Instruction: produce a dedicated **Security** category covering input validation; injection (SQL, XSS, command, LDAP, template); authentication / authorization; session management; secrets (env vars, key rotation, accidental commits); CSRF / SSRF; file-upload safety; dependency supply-chain risks; CI/CD pipeline security; LLM-specific concerns (prompt injection, tool trust boundaries). Each item must reference a specific threat (e.g., "Prevents SQL injection via parameterized queries", not "Is secure"). Prioritize OWASP Top 10–level items relevant to the stack. Produce only the structured `## Security` category.

**Agent R — Structural** (when R selected): tech stack. Instruction: produce a dedicated **Structural** category for issues that are hard to catch line-by-line — SQL safety; race conditions; LLM trust-boundary violations; conditional side effects spanning multiple files; coupling and layering violations; dependency inversion; null-propagation pitfalls; error-rescue maps. Each item must be objectively verifiable by a reviewer. Focus on items that catch real bugs in production, not style. Produce only the structured `## Structural` category.

**Agent Au — Audit (auto-enabled when `auditSkill` is installed)**: tech stack. Load `{auditSkill}` in full and apply its accessibility / performance / theming / responsive / anti-pattern framework. Produce dedicated categories: `## Accessibility` (WCAG 2.x AA references), `## Performance` (Core Web Vitals, bundle size, rendering — measurable thresholds where possible), `## Theming` (design-token consistency), `## Responsive` (breakpoints, touch targets). Skip silently if `auditSkill` doesn't exist.

### Dispatch and collect

Dispatch all agents in parallel. Wait for every agent to return before continuing. Aggregate results grouped by mode for the integration step. Note any agent that returned empty or failed.

### Route

- If `I` was also selected → load and follow `{nextStepFile}` (interactive step uses the auto results as starting points).
- Otherwise → load and follow `{skipToIntegrate}`.
