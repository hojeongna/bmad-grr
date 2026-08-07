---
name: design-handoff
description: 'PRD (or brownfield live site) → UX/UI improvement, via Mobbin MCP reference research, a prescriptive redesign spec, and one of three delivery paths: a Claude Design (claude.ai/design) paste-ready prompt, direct implementation against a user-supplied code scaffold, or a plain-language stakeholder report. Gap-scans the PRD for UX/UI completeness (explicit [ASSUMPTION] tags, never blocking), checks the local project design system and the Claude Design design-system project, optionally harvests SEED (daangn) norms via the seed-docs MCP to fill whatever the local system leaves tacit (spacing/motion/loading thresholds, UX-writing Do/Don''t), walks a single screen or an entire multi-screen site live, converts brownfield screen captures (mhtml/html), re-verifies every finding against its reference standard before prescribing a concrete fix, and verifies whatever comes back (an external draft or an in-repo edit) against the guide via fresh sub-agent dispatch.'

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

# Local design system is asked about directly (step-03), never file-hunted. This is the
# only fallback when the user says there isn't one.
frontend_design_skill: "~/.claude/skills/frontend-design/SKILL.md"

# Output
output_folder: "{config_source}:output_folder"
handoff_output_path: "{output_folder}/design-handoff"
ux_guide_path: "{handoff_output_path}/ux-ui-guide-{date}.md"
redesign_spec_path: "{handoff_output_path}/redesign-spec-{date}.md"
converted_screens_dir: "{handoff_output_path}/converted"
reference_images_dir: "{handoff_output_path}/references"
reference_images_aside_dir: "{handoff_output_path}/references/_do-not-attach"

# Workflow chaining
quick_story_command: "{project-root}/bmad-grr/commands/bmad-grr-quick-story.md"
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
design_pass_command: "{project-root}/bmad-grr/commands/bmad-grr-design-pass.md"

# External tool dependencies:
# - Mobbin MCP must be available in the environment for step-05/05b. Its exact tool/method names
#   were not verified against a live connection when this workflow was authored — resolve them
#   via ToolSearch at first run rather than assuming a specific tool name.
# - The seed-docs MCP (`claude mcp add seed-docs -- npx -y @seed-design/docs-mcp`) is required only
#   when the user turns on SEED norm mode in step-03. Public docs, no auth. Step-03b halts rather
#   than falling back to WebFetch or recollection if it's missing — a remembered design system is
#   the exact failure mode this workflow exists to avoid. Note that its `section` enum
#   (react/docs/breeze/ai-integration/lynx) lags the live site, which moved the norms to
#   foundations/components/patterns; step-03b documents the relative-path workaround.
# - The native DesignSync tool (claude.ai/design design-system projects) is required for step-03
#   and the optional push in step-08. It ships with Claude Code; no separate MCP install needed.
# - Multi-screen walkthroughs (step-04b), reference re-audits (step-05b), and direct-implementation
#   conformance checks (step-07b) all lean on the Workflow tool for parallel per-screen sub-agent
#   dispatch — this is not optional flourish, it's how those steps stay honest (fresh eyes per
#   screen, adversarial re-verification) instead of one context asserting its own work is fine.
# - Automated in-browser capture (step-04b) must never route around a safety refusal (retrying with
#   base64/obfuscation, or hiding a script's own return value from review) — that pattern reads as
#   data exfiltration even when the underlying intent is benign, and it should be treated as a hard
#   stop, not an obstacle to engineer past. Fall back to asking the user to capture manually.
---

# Design Handoff

## Overview

Take a completed PRD — or, for brownfield work, an existing screen capture (one screen, or a whole multi-screen site) — and turn it into a UX/UI improvement package: a gap-scanned, reference-backed, prescriptive spec that names exactly what to change and to what, then hands that off through whichever delivery path actually fits the project — a Claude Design (claude.ai/design) paste-ready prompt, direct implementation against a code scaffold the user already has, and/or a plain-language stakeholder report — informed by Mobbin MCP reference-pattern research and anchored to whatever design system already exists, both locally in this project and inside the target Claude Design project itself.

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
