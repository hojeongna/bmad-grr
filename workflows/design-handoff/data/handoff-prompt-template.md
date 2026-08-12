# Claude Design Handoff Prompt — fill-in skeleton

Fill every `{{slot}}` from the UX/UI Guide document (`{ux_guide_path}`) — that document, not raw memory, is the source of truth by the time this template is rendered. Present the whole thing as one copy-paste block. Drop any section whose slot is empty (e.g. no Mobbin references, no brownfield base) rather than leaving a hollow heading — an empty section reads as an instruction to invent one.

---

## 0. Before you generate anything

Check whether this Claude Design project already has an established design system (components, tokens, styles, prior screens). If it does, **use it** and tell me which parts you're reusing — this brief deliberately doesn't restate it, because you can read it and I'd only be summarizing. If it doesn't, propose one, show it to me, and wait for my confirmation before generating full screens.

{{#if claude_design_project}}
This should be project `{{claude_design_project.name}}` (`{{claude_design_project.projectId}}`) — if what you find there conflicts with anything below, point out the conflict rather than silently picking one.
{{/if}}

## 1. Product context

{{product_one_paragraph_summary}}

Target users: {{target_users}}
Core goal of this screen set: {{core_goal}}

## 2. Screens & flows

{{#each screens}}
### {{name}}

- Purpose: {{purpose}}
- Key content/elements: {{elements}}
- Primary action: {{primary_action}} · Secondary: {{secondary_actions}}
- States to implement (not just describe): empty — {{state_empty}}; loading — {{state_loading}}; error — {{state_error}}; success — {{state_success}}
{{/each}}

Navigation model: {{ia_summary}}

{{#if seed_design_mode}}
## 3. Norms for what your design system doesn't state

Section 0 told you to use your project's own design system. It names components and colors; it probably doesn't say how far apart two buttons sit, how long a sheet takes to open, at what loading duration a spinner should become a skeleton, or what error copy is allowed to say. Those rules follow, taken from SEED (daangn's design system).

**Read these as rules, not as a component library.** Keep using your project's components — these norms govern their dimensions, timing, states, and copy. Never substitute a SEED component for one of yours.

**Precedence, in order:** your project's design system → the norms below → your own judgment. Where one of these norms contradicts something your design system already fixes, follow your design system and say which norm you overrode and why — don't silently pick one.

{{#each seed_norms}}
### {{area}}

{{rules_verbatim}}
{{/each}}

Apply these to every screen in section 2, not just the ones where a violation was already flagged. Where a norm gives a token name and a value (`$dimension.x2` / 8px), use the value — this output isn't consuming SEED's token package.

{{#if writing_language_is_korean}}
The UX-writing rules above are Korean-language rules and apply to Korean copy. If any screen ships non-Korean copy, carry the intent (plain words, no honorific inflation, positive and active phrasing, actionable error messages) rather than the literal examples.
{{/if}}
{{/if}}

## 4. Reference patterns (Mobbin)

{{#each mobbin_references}}
- **{{screen}}** — {{pattern_description}} (ref: {{source}}). Why: {{why}}
{{/each}}
{{#unless mobbin_references}}
No specific reference patterns were selected for this handoff — use your own judgment, anchored to your project's design system.
{{/unless}}

## 5. Existing screen (if revising, not starting fresh)

{{#if converted_html_path}}
The attached HTML is the current implementation. Revise it — preserve what already works, change only what sections 2–4 call for. Don't rewrite from scratch.
{{/if}}
{{#if reference_image_path}}
The attached image is the current screen for visual reference only (no HTML base available). Treat it as a starting point for layout/content, not pixel-exact source.
{{/if}}

## 6. Known gaps / assumptions

The source spec didn't resolve everything. These are explicit assumptions — follow them, or flag if you'd choose differently and why:

{{#each ux_gaps}}
- [ASSUMPTION] {{dimension}} ({{prd_location}}) → {{assumption}}
{{/each}}

## 7. Output contract

- Self-contained HTML per screen (or one file with clearly anchored sections) — semantic markup, no framework dependency unless the design system specifies one.
- Every state listed in section 2 actually implemented (toggle-able or shown as separate marked sections), not just the happy path.
- Responsive behavior named per breakpoint, not just "responsive."
- Accessibility floor: contrast, keyboard reachability, ARIA labels on dynamic UI, touch-target sizing.
- Before handing the draft back, list which `[ASSUMPTION]` items (section 6) you resolved differently than stated, and why.
