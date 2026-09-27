---
name: design-handoff
description: 'PRD (or brownfield live site) → UX/UI improvement, via Mobbin MCP reference research, a prescriptive redesign spec, and one of three delivery paths: a Claude Design (claude.ai/design) paste-ready prompt, direct implementation against a user-supplied code scaffold, or a plain-language stakeholder report. Gap-scans the PRD for UX/UI completeness (explicit [ASSUMPTION] tags, never blocking), resolves which Claude Design project to target without restating its design system (the prompt tells Claude Design to read its own), optionally harvests SEED (daangn) norms via the seed-docs MCP for what a design system leaves tacit (spacing/motion/loading thresholds, UX-writing Do/Don''t), walks a single screen or an entire multi-screen site live, converts brownfield screen captures (mhtml/html), re-verifies every finding against its reference standard before prescribing a concrete fix, and verifies whatever comes back (an external draft or an in-repo edit) against the guide via fresh sub-agent dispatch.'

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "~/.claude/workflows/design-handoff"
gap_scan_checklist: "~/.claude/workflows/design-handoff/data/gap-scan-checklist.md"
ux_guide_template: "~/.claude/workflows/design-handoff/data/ux-ui-guide-template.md"
prompt_template: "~/.claude/workflows/design-handoff/data/handoff-prompt-template.md"
redesign_spec_template: "~/.claude/workflows/design-handoff/data/redesign-spec-template.md"
mhtml_converter: "~/.claude/workflows/design-handoff/scripts/mhtml_to_html.py"

# PRD discovery (glob — actual path is customize.toml-dependent upstream)
planning_artifacts: "{config_source}:planning_artifacts"
implementation_artifacts: "{config_source}:implementation_artifacts"
prd_glob: "{planning_artifacts}/**/prd.md"
project_context: "**/project-context.md"

# Output
output_folder: "{config_source}:output_folder"
handoff_output_path: "{output_folder}/design-handoff"
ux_guide_path: "{handoff_output_path}/ux-ui-guide-{date}.md"
redesign_spec_path: "{handoff_output_path}/redesign-spec-{date}.md"
converted_screens_dir: "{handoff_output_path}/converted"
reference_images_dir: "{handoff_output_path}/references"
reference_images_aside_dir: "{handoff_output_path}/references/_do-not-attach"

# Workflow chaining
quick_story_command: "~/.claude/commands/bmad-grr-quick-story.md"
dev_story_command: "~/.claude/commands/bmad-grr-dev-story.md"
design_pass_command: "~/.claude/commands/bmad-grr-design-pass.md"

# External tool dependencies:
# - Mobbin MCP (`search_screens`, `search_flows`, `search_sections`) for step-05/05b.
# - seed-docs MCP (`claude mcp add seed-docs -- npx -y @seed-design/docs-mcp`), only when SEED norm
#   mode is on in step-03; step-03b halts rather than falling back if it's missing, and documents the
#   `section`-enum workaround.
# - DesignSync tool (claude.ai/design projects) for step-03 and the optional push in step-08. Not
#   every Claude Code build or account exposes it: if ToolSearch doesn't find it, those steps take
#   their no-project path (plain prompt, no push).
# - claude-in-chrome for live capture and step-06c; the Workflow tool for per-screen fan-out
#   (04b, 05b, 07b). The "never route around a safety refusal" rule lives in step-04.
---

# Design Handoff

## Overview

Take a completed PRD — or, for brownfield work, an existing screen capture (one screen, or a whole multi-screen site) — and turn it into a UX/UI improvement package: a gap-scanned, reference-backed, prescriptive spec that names exactly what to change and to what, then hands that off through whichever delivery path actually fits the project — a Claude Design (claude.ai/design) paste-ready prompt, direct implementation against a code scaffold the user already has, and/or a plain-language stakeholder report — informed by Mobbin MCP reference-pattern research and anchored to whatever design system already lives inside the target Claude Design project, which that tool reads for itself rather than having summarized back to it.

PRDs are never UX/UI-complete — they're written by product thinking, not screen thinking. This workflow never blocks on that gap and never edits the PRD itself; instead every finding (gap-scan `[ASSUMPTION]`s, design-system anchoring, Mobbin references, live re-audit corrections) is written into a standalone **UX/UI Guide document** (`{ux_guide_path}`) that this workflow owns and builds up step by step — the same "living document" treatment `bmad-ux` gives `DESIGN.md`/`EXPERIENCE.md`. Findings don't stop at diagnosis: once a reference is confirmed, step-05b re-verifies each finding live against it (catching both false positives and under-stated bugs) and rewrites survivors into a concrete, buildable **redesign spec** (`{redesign_spec_path}`) — current pattern → named recommended pattern → reference → spec detailed enough to build without a follow-up question. The handoff prompt (step-06) is rendered *from* the redesign spec when one exists, so the guide and spec stay useful on their own even before or after any external round-trip. Whatever comes back — an external draft (step-07) or an in-repo edit against a scaffold the user already built (step-07b) — is checked against the guide/spec by a fresh sub-agent (never the same context that wrote the prompt), and whatever doesn't match becomes either a Design Sync push of the approved output or a list of standalone, individually-pasteable fix-prompts — both logged back into the guide.

## Your Role

A pragmatic UX-to-handoff broker. Read the PRD (or the live screens) like a designer would — notice what it left unsaid before you notice what it said. Before treating anything as a bug, check whether it's actually intentional (a test-mode switch, sample data, a role-gated feature) — ask once, early, rather than re-litigating a whole findings pass later. Gather reference material that's actually relevant to these specific screens, not generic inspiration, and don't just cite it — re-verify each finding live against it and rewrite the fix as something buildable. Write a brief detailed enough that a separate design tool (or your own hand, editing a scaffold directly) can execute it without a round of clarifying questions. Stay skeptical of the first draft that comes back, and skeptical of your own first read of an existing implementation — verify against the guide/spec itself and against the live page, not against how convincing either looks at a glance.

## Branch Distinction

- `bmad-ux` runs full Discovery from zero to author `DESIGN.md`/`EXPERIENCE.md`, with its own external-tool handoff (default producer: Google Stitch).
- `design-pass` runs *after* this workflow, on its output: it renders the HTML draft produced here into a normalized DOM spec and checks whether the story document (pre-dev) or the running screen (post-dev) actually matches it. It has no opinion on whether the design is good — that judgment happens here.
- **`design-handoff`** starts from a completed PRD (optionally plus a screen capture, one screen or a whole site) — or, when neither exists yet, delegates to `quick-story` first and continues from its output — gap-scans it for UX/UI completeness, re-verifies findings against Mobbin reference standards, and produces a prescriptive redesign spec that routes to Claude Design generation, direct implementation against an existing scaffold, and/or a stakeholder report, then verifies what comes back against it and closes the gap either via Design Sync or fix-prompts.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/design-handoff/steps-c/step-01-init.md` to begin.
