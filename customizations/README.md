# grr Customizations — `grr-spec-validate` integration

This directory contains BMAD customization overrides that gate the four
upstream BMAD `create-*` workflows with `grr-spec-validate` — a
self-contained, sub-agent-dispatched spec validator (no external plugin
or MCP server required).

## What gets gated

| BMAD workflow | Pre-flight | Mid-workflow guidance | Post-flight (on_complete) |
| --- | --- | --- | --- |
| `/bmad-create-prd` | skill availability check + ask checklist path | `persistent_facts` block vague answers / non-measurable ACs | dispatch `grr-spec-validate` (ambiguity + ac-measurability + three-stage + checklist) |
| `/bmad-create-architecture` | same check | block soft NFRs, require trade-off rationale | dispatch validator (ambiguity + three-stage + checklist; AC rubric skipped) |
| `/bmad-create-epics-and-stories` | same check | per-story anti-vagueness + scope-overlap check | parallel dispatch — one sub-agent per story; aggregate verdict |
| `/bmad-create-story` | same check | per-AC measurability + task atomicity + edge-case requirement | dispatch validator (full four rubrics) |

## Prerequisites

1. **bmad-grr installed** (provides `~/.claude/skills/grr-spec-validate/`):
   ```
   git clone https://github.com/hojeongna/bmad-grr.git
   cd bmad-grr && bash install.sh
   ```
2. **BMAD project** — the target project must have `_bmad/` initialized.

No external plugin / MCP server is required. The validator is a local
skill dispatched via Claude Code's Task / Agent sub-agent mechanism.

If `~/.claude/skills/grr-spec-validate/` is missing when one of the
gated workflows runs, the customization halts the workflow at pre-flight
and tells the user to install bmad-grr. The upstream BMAD workflows are
not modified — removing or renaming the `_bmad/custom/*.toml` files
restores the unmodified upstream behavior.

## Installation

These customizations are **per-project** because BMAD's
`resolve_customization.py` only merges from `{project-root}/_bmad/custom/`.
Two ways to apply them:

### Recommended: `/bmad-grr-customize` slash command

From inside Claude Code, with your BMAD project as the cwd:

```
/bmad-grr-customize
```

The command copies the toml files into `<project>/_bmad/custom/`
(idempotent — skips files that already exist) and reports next steps. To
target a different project, pass the path:

```
/bmad-grr-customize /path/to/other-bmad-project
```

### Alternative: shell script

For CI/CD or scripted usage:

```bash
./install-customizations.sh /path/to/your/bmad-project
```

Both methods preserve existing files in `<project>/_bmad/custom/`.

## Disabling per workflow

To opt out of a single workflow's gate, delete or rename its toml in
`{project-root}/_bmad/custom/`:

```bash
rm _bmad/custom/bmad-create-prd.toml
# /bmad-create-prd now runs unmodified upstream behavior.
```

## Personal overrides

If you want to tighten or loosen the gate for yourself only (not your
team), add `_bmad/custom/<workflow>.user.toml` with overrides — BMAD
merges `<workflow>.user.toml` on top of `<workflow>.toml`. The user file
should be gitignored.

Example — bump the ambiguity threshold for stories in your local
checkout only:

```toml
# _bmad/custom/bmad-create-story.user.toml
# (Personal — gitignored)

on_complete = """
... (override on_complete with stricter threshold) ...
"""
```

## Strength of each hook

| Hook | Strength | Notes |
| --- | --- | --- |
| `activation_steps_prepend` / `activation_steps_append` | **strong** | Deterministic — the workflow runs these steps explicitly. |
| `on_complete` | **strong** | Deterministic — runs at the terminal stage. The validator dispatch lives here. |
| `persistent_facts` | **best-effort** | LLM autonomous decision based on the workflow-specific trigger rules. Workflow-specific rules are more reliable than generic ones, but not as guaranteed as activation steps. |

## Updating

When this repo updates the customizations, the team toml is overwritten
on next `/bmad-grr-customize` run (only if you pass `--force`; otherwise
existing files are preserved). Personal `*.user.toml` files are
preserved across updates either way.
