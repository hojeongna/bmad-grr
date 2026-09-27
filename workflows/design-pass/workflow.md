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
browser_facts: "~/.claude/workflows/design-pass/data/browser-operating-facts.md"
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
quick_story_command: "~/.claude/commands/bmad-grr-quick-story.md"
dev_story_command: "~/.claude/commands/bmad-grr-dev-story.md"
refine_story_command: "~/.claude/commands/bmad-grr-refine-story.md"
design_handoff_command: "~/.claude/commands/bmad-grr-design-handoff.md"

# Tools required: claude-in-chrome (both sides are rendered, never read as source) and the Workflow
# tool for per-screen fan-out. Operating facts: data/browser-operating-facts.md; capture gotchas:
# data/live-capture-protocol.md §1, §2.1, §8, §9.1. Capture holds a browser, diffing doesn't; one agent extracts both sides of a screen.
---

# Design Pass

## Overview

`design-handoff` produces an HTML draft. Nothing downstream ever checks whether the thing that got built actually resembles it — the draft gets looked at once, implemented from memory, and the drift is never measured. This workflow closes that loop.

It renders the mockup in a real browser and extracts it with a bundled deterministic extractor, `{extractor}` — structure, component inventory, computed tokens and CSS custom properties resolved to their cascade winners, verbatim copy, interaction targets, hover/focus/disabled treatments, table geometry, option sets, alignment and placement, and measured facts no declaration states (whether text is actually clipped, how many lines it actually renders, contrast ratios, real column boundaries). The same script is then injected into whatever is supposed to match it, so both specs are produced by identical code rather than by two agents' independent judgment.

The output is a flat, sorted `key ⇥ field ⇥ value` dump per side, uploaded straight to disk by `{spec_server}`, and **the comparison is a mechanical `diff` of two files.** A `diff` cannot skim, and every difference it emits names the element, the property, and both values — `align.textAlign right → left`, not "the column looks shifted".

Capturing a running app is not the same job as capturing a static file — it hydrates, fetches, animates, lazy-loads, renders whatever data is in the database, and carries dev tooling the mockup never had. `{live_capture_protocol}` holds the rules that earn the right to compare the two: a readiness gate instead of a sleep, a scroll sweep before extraction, explicit noise exclusion, template-not-instance comparison so real data volume never reads as a gap, a stated permission level, and state-reaching that drives the app rather than injecting DOM.

The comparison target depends on where the story is:

- **Mode P (pre-dev)** — the story document exists, nothing runs yet. The mockup spec is compared against the story's AC / Tasks / Dev Notes, and every mockup element or interaction the story doesn't cover is promoted into concrete AC and Tasks so `dev-story` can actually build it.
- **Mode L (post-dev)** — the screen is running. The two sides are paired first (step-03a), then the live DOM is extracted through the same schema and diffed 1:1 against the mockup spec, including what happens when things are clicked. Findings are classified by the fidelity rubric, then small drifts get fixed on the spot and structural gaps get routed to `quick-story`.

**Nothing is compared until a human has confirmed the two sides are the same thing.** Step-03a enumerates every repeating identity unit the mockup contains — table row, card, form field, nav item, modal section, dashboard widget — pairs each with its counterpart, and prints a readable fingerprint from both sides for confirmation. Automatic key matching handles the easy cases and is measured, not assumed.

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
