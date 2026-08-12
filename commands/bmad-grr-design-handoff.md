---
name: 'design-handoff'
description: 'PRD → HTML UX/UI draft via Mobbin MCP reference research + Claude Design (claude.ai/design) handoff. Gap-scans the PRD for UX/UI completeness, resolves the target Claude Design project (whose design system that tool reads for itself), optionally fills the gaps a design system leaves tacit with SEED (daangn) norms via the seed-docs MCP, converts brownfield screen captures (mhtml/html), composes one detailed paste-ready prompt, and verifies the returned draft against the PRD via sub-agent dispatch. Also runs PRD-less on an existing screen (improvement-only mode). Use when the user says "design handoff", "PRD를 화면으로", "HTML 시안 만들어줘", "목업 만들어줘", "SEED 규범으로".'
---

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @~/.claude/workflows/design-handoff/workflow.md, READ its entire contents and follow its directions exactly!

ARGUMENTS: $ARGUMENTS
