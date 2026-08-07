---
title: '{{title}} — UX/UI Guide'
status: draft
mode: '{{mode}}'
prd_or_story_path: '{{prd_or_story_path}}'
created: '{{date}}'
updated: '{{date}}'
---

# {{title}} — UX/UI Guide

Generated and maintained by `design-handoff`. This document — not the PRD — is where every UX/UI finding from this workflow lives. It's the source the handoff prompt is rendered from; edit it directly if something's wrong and re-run step-06 to re-render.

## 1. Product Context

{{product_one_paragraph_summary}}

Target users: {{target_users}}
Core goal: {{core_goal}}

{{#if product_context_notes}}
**Intentional design notes (confirmed with the user — do not treat these as bugs):** {{product_context_notes}}
{{/if}}

## 2. Screens & Flows

{{#if top_issues}}
**Cross-cutting issues** (recur across 3+ screens — see each screen's own notes for the local instance):

{{#each top_issues}}
- {{issue}}
{{/each}}
{{/if}}

{{#each screens}}
### {{name}}

- Purpose: {{purpose}}
- Key content/elements: {{elements}}
- Primary action: {{primary_action}} · Secondary: {{secondary_actions}}
- States: empty — {{state_empty}}; loading — {{state_loading}}; error — {{state_error}}; success — {{state_success}}
{{/each}}

Navigation model: {{ia_summary}}

## 3. UX/UI Gap-Scan

The PRD didn't resolve everything below. Each is an explicit assumption, not a silent invention — correct any of these directly in this section if the assumption is wrong.

{{#each ux_gaps}}
- [ASSUMPTION] {{dimension}} ({{prd_location}}) → {{assumption}}{{#if user_resolved}} — resolved by {{user_name}}{{/if}}
{{/each}}
{{#unless has_prd}}
No PRD for this run (improvement-only mode) — this section is N/A; see section 1/2 for what's known from the existing screen instead.
{{/unless}}

## 4. Design System

**Local project:** {{local_design_system_summary}}

**Claude Design project:** {{claude_design_project_summary}}

### 4a. SEED norms (tacit-gap layer)

{{#if seed_design_mode}}
Harvested from SEED (daangn) via the seed-docs MCP in step-03b. These are **rules, not component choices** — the project keeps its own components. Precedence when anything disagrees: **local design system > SEED norms > model judgment.**

{{#each seed_norms}}
#### {{area}}

{{rules_verbatim}}

Reconciliation: {{reconciliation}} <!-- fills-gap / agrees with local / conflicts (local wins) -->
{{/each}}

{{#if seed_conflicts}}
**Conflicts with the local design system — local wins in every row below.** Recorded so a downstream builder sees the disagreement instead of silently picking one.

| Rule | Local | SEED | Use |
| --- | --- | --- | --- |
{{#each seed_conflicts}}
| {{rule}} | {{local}} | {{seed}} | {{local}} |
{{/each}}
{{/if}}

{{#if seed_misses}}
**Not harvested** — these documents 404'd during step-03b, so the areas below carry no SEED norms and fall through to model judgment. Not "SEED has no rule here."

{{#each seed_misses}}
- `{{path}}` ({{area}})
{{/each}}
{{/if}}
{{else}}
SEED norm mode was off for this run.
{{/if}}

## 5. Mobbin References

{{#each mobbin_references}}
- **{{screen}}** — {{pattern_description}} (ref: {{source}}). Why: {{why}}
{{/each}}
{{#unless mobbin_references}}
None selected for this run.
{{/unless}}

{{#if redesign_spec_path}}
These references were re-verified live and rewritten into concrete prescriptions in `{{redesign_spec_path}}` (step-05b) — that document, not this list, is what step-06 renders the handoff prompt from.
{{/if}}

## 6. Handoff Log

{{#each handoff_log_entries}}
### {{date}} — {{event}}

{{details}}
{{/each}}
