---
name: design-handoff
description: 'PRD → HTML UX/UI draft via Mobbin MCP reference research + Claude Design (claude.ai/design) handoff. Gap-scans the PRD for UX/UI completeness (explicit [ASSUMPTION] tags, never blocking), checks both the local project design system and the Claude Design design-system project, converts brownfield screen captures (mhtml/html), composes one detailed paste-ready prompt, and verifies the returned draft against the PRD via fresh sub-agent dispatch.'

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

# Workflow chaining
quick_story_command: "{project-root}/bmad-grr/commands/bmad-grr-quick-story.md"
dev_story_command: "{project-root}/bmad-grr/commands/bmad-grr-dev-story.md"
design_pass_command: "{project-root}/bmad-grr/commands/bmad-grr-design-pass.md"

# External tool dependencies:
# - Mobbin MCP must be available in the environment for step-05. Its exact tool/method names
#   were not verified against a live connection when this workflow was authored — resolve them
#   via ToolSearch at first run rather than assuming a specific tool name.
# - The native DesignSync tool (claude.ai/design design-system projects) is required for step-03
#   and the optional push in step-08. It ships with Claude Code; no separate MCP install needed.
---

# Design Handoff

## Overview

Take a completed PRD — and, for brownfield work, an existing screen capture — and turn it into one richly-specified handoff prompt that a Claude Design (claude.ai/design) session can execute into a real HTML UI draft, informed by Mobbin MCP reference-pattern research and anchored to whatever design system already exists, both locally in this project and inside the target Claude Design project itself.

PRDs are never UX/UI-complete — they're written by product thinking, not screen thinking. This workflow never blocks on that gap and never edits the PRD itself; instead every finding (gap-scan `[ASSUMPTION]`s, design-system anchoring, Mobbin references) is written into a standalone **UX/UI Guide document** (`{ux_guide_path}`) that this workflow owns and builds up step by step — the same "living document" treatment `bmad-ux` gives `DESIGN.md`/`EXPERIENCE.md`. The handoff prompt is then rendered *from* that guide, not from scratch, so the guide stays useful on its own even before or after any Claude Design round-trip. When the HTML draft comes back, it's checked against the PRD and the guide by a fresh sub-agent (never the same context that wrote the prompt), and whatever doesn't match becomes either a Design Sync push of the approved output or a list of standalone, individually-pasteable fix-prompts — both logged back into the guide.

## Your Role

A pragmatic UX-to-handoff broker. Read the PRD like a designer would — notice what it left unsaid before you notice what it said. Gather reference material that's actually relevant to these specific screens, not generic inspiration. Write a brief detailed enough that a separate design tool can execute it without a round of clarifying questions. Stay skeptical of the first draft that comes back — verify it against the PRD itself, not against how convincing it looks.

## Branch Distinction

- `bmad-ux` runs full Discovery from zero to author `DESIGN.md`/`EXPERIENCE.md`, with its own external-tool handoff (default producer: Google Stitch).
- `design-pass` audits an already-written story document or a live running screen and produces judgment-based improvement notes — no external generation tool, no HTML draft produced.
- **`design-handoff`** starts from a completed PRD (optionally plus a screen capture) — or, when neither exists yet, delegates to `quick-story` first and continues from its output — gap-scans it for UX/UI completeness, and produces one detailed prompt for Claude Design — informed by Mobbin MCP research — to generate an actual HTML draft, then verifies what comes back against it and closes the gap either via Design Sync or fix-prompts.

## Activation

Load configuration from `{config_source}`. If config is missing, fall back to sensible defaults.

Then load and follow `~/.claude/workflows/design-handoff/steps-c/step-01-init.md` to begin.
