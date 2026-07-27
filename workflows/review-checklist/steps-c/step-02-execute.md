---
name: step-02-execute
description: 'Dispatch parallel agents for selected automatic modes (A/P/U/S/R/Au); collect structured checklist results'
nextStepFile: './step-03-interactive.md'
skipToIntegrate: './step-04-integrate.md'
outputFile: '{output_folder}/checklist-{project_name}.md'
analysisCategories: '../data/analysis-categories.md'
---

# Step 2 — Parallel Execute

## Outcome

Each selected automatic mode has its own dedicated sub-agent that returns a structured list of checklist items (category headers + verifiable items). Results are aggregated and ready for either the interactive step (if `I` was also selected) or direct integration.

## Approach

### Analyze via the Workflow tool

Load `{analysisCategories}` for category guidance. Call the **Workflow** tool for this: write a script with one `agent()` per selected mode (never batch multiple modes into one agent); let each mode-agent's judgment drive which categories it surfaces from the actual code, and pipeline a re-scan when a first pass reveals a new convention or risk area, repeating until no new category surfaces (cap at 3 rounds).

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

**Agent Au — Audit** (when Au selected): tech stack. Instruction: produce four dedicated categories for front-end quality that line-by-line review reliably misses — `## Accessibility` (keyboard reachability and focus order, visible focus indicators, ARIA roles on dynamic UI, form labeling, contrast ratios, motion-reduction preferences — cite the WCAG 2.x AA criterion each item maps to); `## Performance` (Core Web Vitals with numeric thresholds, bundle and asset budgets, render-blocking resources, list virtualization, image formats and dimensions); `## Theming` (design-token usage over hard-coded values, light/dark parity, semantic color roles); `## Responsive` (declared breakpoints actually handled, touch targets ≥ 44px, no horizontal overflow, text reflow at 320px). Each item must be objectively verifiable — by reading code, running a specific command, or checking a stated numeric threshold. Skip any of the four categories that don't apply to the stack.

### Collect

The Workflow script already dispatches and aggregates internally. Group the returned results by mode for the integration step, and note any mode that returned empty or failed.

### Route

- If `I` was also selected → load and follow `{nextStepFile}` (interactive step uses the auto results as starting points).
- Otherwise → load and follow `{skipToIntegrate}`.
