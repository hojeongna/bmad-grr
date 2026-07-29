---
name: design-pass
description: 'Mockup-fidelity pass. Takes the HTML draft a design-handoff run produced (or any hand-supplied HTML mockup), extracts it into a normalized DOM spec — structure, component inventory, computed tokens, verbatim copy, interaction traces, states, responsive behavior — and checks whether the thing that was actually built matches it. Two modes: (P) the story document exists but nothing is running yet, so mockup elements missing from the story get promoted into AC/Tasks; (L) the screen is running, so the live DOM is extracted through the same schema and diffed 1:1, with small drifts fixed on the spot and structural gaps routed to quick-story.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/design-pass"
dom_spec_schema: "~/.claude/workflows/design-pass/data/dom-spec-schema.md"
live_capture_protocol: "~/.claude/workflows/design-pass/data/live-capture-protocol.md"
fidelity_rubric: "~/.claude/workflows/design-pass/data/fidelity-rubric.md"
gap_report_template: "~/.claude/workflows/design-pass/data/gap-report-template.md"
extractor: "~/.claude/workflows/design-pass/scripts/extract-dom-spec.js"
spec_server: "~/.claude/workflows/design-pass/scripts/spec-server.py"

# Story and sprint references
planning_artifacts: "{config_source}:planning_artifacts"
implementation_artifacts: "{config_source}:implementation_artifacts"
sprint_status: "{implementation_artifacts}/sprint-status.yaml"
project_context: "**/project-context.md"

# Mockup discovery — design-handoff's own output locations, checked before asking the user
output_folder: "{config_source}:output_folder"
handoff_output_path: "{output_folder}/design-handoff"
auto_draft_dir: "{handoff_output_path}/auto-draft"
converted_screens_dir: "{handoff_output_path}/converted"
redesign_spec_glob: "{handoff_output_path}/redesign-spec-*.md"
ux_guide_glob: "{handoff_output_path}/ux-ui-guide-*.md"

# Output
design_pass_output_path: "{output_folder}/design-pass"
spec_dir: "{design_pass_output_path}/specs"
gap_report_path: "{design_pass_output_path}/fidelity-report-{date}.md"

# Workflow chaining
quick_story_command: "{project-root}/bmad-grr/commands/bmad-grr-quick-story.md"
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
refine_story_command: "{project-root}/bmad-grr/commands/bmad-grr-refine-story.md"
design_handoff_command: "{project-root}/bmad-grr/commands/bmad-grr-design-handoff.md"

# External tool dependencies:
# - claude-in-chrome is mandatory, not optional — a mockup is only a spec once it's been rendered.
#   Reading the HTML source instead of rendering it defeats the entire workflow: computed tokens,
#   cascade resolution, and interaction behavior are exactly what source-reading cannot see, and
#   source-only comparison is the failure mode this rewrite exists to fix. Both sides run on the
#   user's real Chrome, which is what makes an authenticated app reachable without anyone handling
#   credentials. Load the tools via ToolSearch at first run; call tabs_context_mcp before anything
#   else, and never reuse a tab id from a prior session.
# - claude-in-chrome facts this workflow is built around, all verified against a live target rather
#   than assumed: the extractor is injected by fetching it from the spec server and eval-ing it
#   (Chrome exempts localhost from mixed-content blocking, the server sends permissive CORS, and
#   neither eval nor Function was restricted on a real production origin) with pasting the contents
#   as the CSP fallback — a <script src> tag added from page context does get blocked, so never use
#   one; javascript_tool has REPL semantics, so each call ends in the expression to return and a
#   top-level `return` is a syntax error; a navigation or reload in the same call as an extraction
#   kills the evaluation context mid-call; and an agent-driven tab is backgrounded, so
#   requestAnimationFrame never fires and any readiness gate awaiting a frame hangs forever.
# - resize_window does not work here. It returns "Successfully resized window ... to 1024x800
#   pixels" and leaves innerWidth at 1920 on a maximized window, twice, silently. The responsive
#   pass runs through same-origin iframes instead (__grrSpec.responsive), which set a real viewport,
#   flip media queries, inherit the authenticated session, and leave the parent window alone — so S7
#   parallelizes with everything else rather than having to walk screens one at a time.
# - The spec never passes through the agent's context. A production route measures ~5,100 records /
#   440 KB; pages POST their own TSV to scripts/spec-server.py and findings come from a mechanical
#   `diff` of two files. An agent that reads two specs and reports what it noticed is the original
#   defect this rewrite exists to remove.
# - Never return page-derived strings as object KEYS. The claude-in-chrome result filter redacts
#   values under keys that look sensitive: a CSS custom property named `--media-token` comes back as
#   "[BLOCKED: Sensitive key]" while `--brand` passes, and renaming the key does not help. Array
#   pairs and TSV lines pass through untouched.
# - There is no network throttling or request blocking on this path. S6 loading and error states are
#   reached instead by patching fetch/XMLHttpRequest from page context, which drives the app down its
#   own branches rather than faking markup — see live-capture-protocol.md section 6, including what
#   that genuinely cannot reach (initial-page-load states, module-scope-captured fetch, resource-level
#   slowness) and must be recorded as `not reached`.
# - A route is not a screen. Apps persist view state (table/card toggle, density step, saved filter)
#   in localStorage, and it survives reloads, new tabs and the responsive iframes. The state the
#   mockup depicts must be asserted through the app's own controls and recorded in spec meta before
#   anything is extracted — see live-capture-protocol.md section 5.1.
# - Per-screen extraction is dispatched in parallel via the Workflow tool, one agent per screen with
#   its own tab, the same pattern design-handoff step-04b/07b already use. Two rules that pattern
#   does not cover and that this workflow depends on: (1) capture holds a browser, diffing does not —
#   extract to spec artifacts on disk first, then fan out diff agents that only read files; (2) a
#   screen's mockup spec and its live spec must be extracted by the SAME agent, back to back, or the
#   two sides come back at different granularity and the diff is worthless.
---

# Design Pass

## Overview

`design-handoff` produces an HTML draft. Nothing downstream ever checks whether the thing that got built actually resembles it — the draft gets looked at once, implemented from memory, and the drift is never measured. This workflow closes that loop.

It renders the mockup in a real browser and extracts it with a bundled deterministic extractor, `{extractor}` — structure, component inventory, computed tokens and CSS custom properties resolved to their cascade winners, verbatim copy, interaction targets, hover/focus/disabled treatments, table geometry, option sets, alignment and placement, and measured facts no declaration states (whether text is actually clipped, how many lines it actually renders, contrast ratios, real column boundaries). The same script is then injected into whatever is supposed to match it, so both specs are produced by identical code rather than by two agents' independent judgment.

The output is a flat, sorted `key ⇥ field ⇥ value` dump per side, uploaded straight to disk by `{spec_server}`, and **the comparison is a mechanical `diff` of two files.** That is the load-bearing change. Handing an agent two specs and asking what differs is how the previous version missed things: it read structure trees at 66 nodes against 283, gave up on the axis, and fell back to coordinates measured by hand. A `diff` cannot skim, and every difference it emits names the element, the property, and both values — `align.textAlign right → left`, not "the column looks shifted".

Capturing a running app is not the same job as capturing a static file — it hydrates, fetches, animates, lazy-loads, renders whatever data is in the database, and carries dev tooling the mockup never had. `{live_capture_protocol}` holds the rules that earn the right to compare the two: a readiness gate instead of a sleep, a scroll sweep before extraction, explicit noise exclusion, template-not-instance comparison so real data volume never reads as a gap, a stated permission level, and state-reaching that drives the app rather than injecting DOM.

The comparison target depends on where the story is:

- **Mode P (pre-dev)** — the story document exists, nothing runs yet. The mockup spec is compared against the story's AC / Tasks / Dev Notes, and every mockup element or interaction the story doesn't cover is promoted into concrete AC and Tasks so `dev-story` can actually build it.
- **Mode L (post-dev)** — the screen is running. The live DOM is extracted through the same schema and diffed 1:1 against the mockup spec, including what happens when things are clicked. Findings are classified by the fidelity rubric, then small drifts get fixed on the spot and structural gaps get routed to `quick-story`.

## Your Role

A fidelity auditor, not a design critic. The mockup is the spec — your job is not to have opinions about whether it's good, it's to establish precisely where reality diverges from it and how much that divergence matters. Measure before you judge: a color is "wrong" when its hex differs, not when it feels off. Be equally rigorous in both directions — an element the mockup has and the build lacks is a gap, and so is an element the build invented that the mockup never showed. Stay honest about what you actually rendered and clicked; a claim that a modal opens correctly is worth nothing if nobody opened it.

## Branch Distinction

- `design-handoff` produces the mockup — PRD/live site → reference research → prescriptive spec → HTML draft.
- `qa-test` verifies functional correctness against story acceptance criteria.
- `code-review` and `bug-hunt` deal with code quality and defects.
- **`design-pass`** verifies visual and interactive fidelity between a produced HTML mockup and what was built from it. It has no opinion on whether the mockup was a good design — that judgment already happened in `design-handoff`.

Note the overlap with `design-handoff` step-07b and keep them straight: 07b checks a scaffold against the *prose prescriptions* of a redesign spec, inside a handoff session. This workflow checks an implementation against the *rendered DOM of the actual HTML artifact*, and runs standalone at any point afterward.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/design-pass/steps-c/step-01-init.md` to begin.
