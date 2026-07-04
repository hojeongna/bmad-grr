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

## 2. Screens & Flows

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

## 5. Mobbin References

{{#each mobbin_references}}
- **{{screen}}** — {{pattern_description}} (ref: {{source}}). Why: {{why}}
{{/each}}
{{#unless mobbin_references}}
None selected for this run.
{{/unless}}

## 6. Handoff Log

{{#each handoff_log_entries}}
### {{date}} — {{event}}

{{details}}
{{/each}}
