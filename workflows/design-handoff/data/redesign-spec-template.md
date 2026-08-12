# {{title}} — Redesign Spec (prescriptive, reference-backed) — fill-in skeleton

Fill every `{{slot}}` from step-05b's output. Unlike the flat handoff-prompt template, this document is prescription-first: every finding that survived the live re-audit is written as current → named pattern → reference → buildable spec, not as a bare diagnosis. Drop any section whose slot is empty rather than leaving a hollow heading.

This one document feeds three different downstream uses — mark sections accordingly so whichever step renders from it knows what to keep:
- **Claude Design paste** (step-06): keep everything, including the tool-setup section below.
- **Direct implementation** (step-07b): the tool-setup section is irrelevant — skip it, keep everything else as the working spec.
- **Stakeholder report** (step-06b): drop the tool-setup section AND flatten the prose prescriptions into short table rows with embedded reference images — a non-technical reader needs the "current → recommended" pairing, not the build-detail prose.

---

## 0. Tool setup (Claude Design path only — drop for direct implementation or stakeholder report)

Check whether this Claude Design project already has an established design system (components, tokens, styles, prior screens). If it does, **use it** and say which parts are being reused — this spec deliberately doesn't restate it, because you can read it directly. If it doesn't, propose one, show it, and wait for confirmation before generating full screens.

{{#if claude_design_project}}
This should be project `{{claude_design_project.name}}` (`{{claude_design_project.projectId}}`) — if what's there conflicts with anything below, point out the conflict rather than silently picking one.
{{/if}}

## 1. Global direction

{{global_direction}}

<!-- global_direction should name the biggest structural pattern across screens, if one exists (e.g. "most screens over-use dense tables for what's really browse-then-detail content") and state the two or three governing principles that follow from it. This is the paragraph a reader should remember even if they read nothing else. -->

## 2. Cross-cutting patterns

{{#each cross_cutting_patterns}}
### {{pattern_name}}
Applies to: {{applies_to_screens}}

{{spec}}
{{/each}}
{{#unless cross_cutting_patterns}}
No pattern recurred across enough screens to warrant its own entry — every prescription below is screen-specific.
{{/unless}}

<!-- Each entry here should be fully specified once (component structure, states, triggers) so every screen section below can reference it by name instead of repeating it. -->

## 3. Screens

{{#each screens}}
### {{name}}

**Layout paradigm:** {{layout_verdict}} — {{layout_rationale}} {{#if layout_reference}}(ref: {{layout_reference}}){{/if}}

**Prescriptions (high → low priority):**

{{#each prescriptions}}
- **{{element}}** — current: *{{current}}* → recommended: **{{recommended_pattern}}** (ref: {{reference_url}}{{#if reference_local_path}}, 이미지: `{{reference_local_path}}`{{/if}})
  - Spec: {{concrete_spec}}
{{#if from_user_report}}
  - _(from the user's own hands-on use, not a walkthrough finding)_
{{/if}}
{{/each}}

{{/each}}

{{#if seed_design_mode}}
## 4. Norms for what the design system doesn't state

<!-- Needed on the Claude Design path AND the direct-implementation path — a builder editing an existing scaffold needs the same spacing/motion/copy rules as one generating from scratch. Only the stakeholder report drops it. -->

Rules, not component choices — components stay whatever the target project already uses. **Precedence: the project's own design system → these norms → own judgment.** Where a norm contradicts something the design system already fixes, follow the design system and name the norm that was overridden.

{{#each seed_norms}}
### {{area}}

{{rules_verbatim}}
{{/each}}

These apply to every screen in section 3, not only where a prescription already cites one. Where a norm gives a token name and a value, use the value.
{{/if}}

## 5. Existing screen(s) (revising, not starting fresh)

{{#each converted_screens}}
- `{{slug}}` → `{{converted_html_path}}`
{{/each}}
{{#unless converted_screens}}
No saved HTML/image capture exists for these screens — treat section 3 above as the authoritative "current state" description; it was produced by a live walkthrough, not guessed at.
{{/unless}}

Revise the attached implementation(s) — preserve what already works, change only what section 3 calls for. Don't rewrite from scratch.

## 6. Open questions

{{#each open_questions}}
- **{{question}}** — needs: {{what_would_resolve_it}}. Default assumed if unanswered: {{default_assumption}}.
{{/each}}
{{#unless open_questions}}
Nothing outstanding — every prescription above resolves to a concrete default.
{{/unless}}

## 7. Output contract (Claude Design / direct implementation paths)

- Self-contained output per screen (or one file with clearly anchored sections) — semantic markup, on the design system named in section 4, no unnecessary framework dependency.
- Every state named in section 3 actually implemented (toggleable or shown as separate marked sections), not just the happy path.
- Responsive behavior named per breakpoint, not just "responsive."
- Accessibility floor: contrast, keyboard reachability, ARIA on dynamic UI, touch-target sizing.
- Before handing a draft back, list which section-6 open questions were resolved differently than the stated default, and why.
