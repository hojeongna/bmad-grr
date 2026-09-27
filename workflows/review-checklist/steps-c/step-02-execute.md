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

### Analyze

Load `{analysisCategories}` for category guidance. Give each selected mode its own agent — through the **Workflow** tool when 3 or more modes are selected (or parallel `Agent` calls where the Workflow tool isn't available), plain `Agent` calls otherwise. Never batch multiple modes into one agent; let each mode-agent's judgment drive which categories it surfaces from the actual code, and pipeline a re-scan when a first pass reveals a new convention or risk area, repeating until no new category surfaces (cap at 3 rounds).

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

**Agent S — Security** (when S selected): tech stack. Instruction: produce a dedicated **Security** category — OWASP Top 10–level threats for this stack, plus secrets handling, supply chain / CI, and LLM trust boundaries where they apply. Each item must reference a specific threat (e.g., "Prevents SQL injection via parameterized queries", not "Is secure"). Produce only the structured `## Security` category.

**Agent R — Structural** (when R selected): tech stack. Instruction: produce a dedicated **Structural** category for issues that are hard to catch line-by-line (cross-file side effects, races, layering, null propagation, error handling paths). Each item must be objectively verifiable by a reviewer. Focus on items that catch real bugs in production, not style. Produce only the structured `## Structural` category.

**Agent Au — Audit** (when Au selected): tech stack. Instruction: produce four dedicated categories for front-end quality that line-by-line review reliably misses — `## Accessibility` (cite the WCAG 2.x AA criterion each item maps to); `## Performance` (Core Web Vitals and budgets with numeric thresholds); `## Theming` (design tokens over hard-coded values, light/dark parity); `## Responsive` (declared breakpoints actually handled, touch targets ≥ 44px, no horizontal overflow, text reflow at 320px). Each item must be objectively verifiable — by reading code, running a specific command, or checking a stated numeric threshold. Skip any of the four categories that don't apply to the stack.

### Collect

The dispatch already aggregates. Group the returned results by mode for the integration step, and note any mode that returned empty or failed.

### Route

- If `I` was also selected → load and follow `{nextStepFile}` (interactive step uses the auto results as starting points).
- Otherwise → load and follow `{skipToIntegrate}`.
