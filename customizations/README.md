# grr Customizations — Ouroboros Integration

This directory contains BMad customization overrides that gate the upstream
BMad workflows with [Ouroboros](https://github.com/Q00/ouroboros) — a
specification-first agent OS that produces ambiguity scores, three-stage
evaluation, and convergent evolution loops.

## What gets gated

| BMad workflow | Pre-flight gate | Mid-workflow guidance | Post-flight gate |
| --- | --- | --- | --- |
| `/bmad-create-prd` | `ouroboros:pm` (or interview) → `seed` (ambiguity ≤ 0.2) | persistent_facts trigger `ouroboros:interview` on vague answers / non-measurable ACs | `ouroboros:evaluate` (Stage 2 ≥ 0.7, AC == YES) |
| `/bmad-create-architecture` | `ouroboros:brownfield` → `interview` → `seed` | trigger `interview` on non-obvious trade-offs / quality attrs without numbers | `ouroboros:evaluate` (Goal Alignment ≥ 0.8) |
| `/bmad-create-epics-and-stories` | install check only | trigger `interview` on overlapping scope / vague ACs | batch `ouroboros:evaluate` per story (AC strict) |
| `/bmad-create-story` | `ouroboros:interview` mini | trigger `interview` on bundled ACs / missing edge cases | `ouroboros:evaluate` (AC == YES, edge cases covered) |

## Prerequisites

1. **Ouroboros plugin** must be installed in your Claude Code session:
   ```
   claude plugin marketplace add Q00/ouroboros
   claude plugin install ouroboros@ouroboros
   ```
2. **Python ≥ 3.12** and `uvx` available (https://docs.astral.sh/uv/) — Ouroboros'
   MCP server is bootstrapped via `uvx --from ouroboros-ai[mcp,claude]`.
3. **BMad project** — the target project must have `_bmad/` initialized.

If Ouroboros is not installed, the customizations halt the workflow at
pre-flight and instruct the user to install it. The upstream BMad workflows
are NOT modified — removing or renaming the `_bmad/custom/*.toml` files
restores the unmodified upstream behavior.

## Installation

These customizations are **per-project** because BMad's `resolve_customization.py`
only merges from `{project-root}/_bmad/custom/`. Two ways to apply them:

### Recommended: `/bmad-grr-customize` slash command

From inside Claude Code, with your BMad project as the cwd:

```
/bmad-grr-customize
```

The command checks Ouroboros plugin availability, copies the toml files into
`<project>/_bmad/custom/` (idempotent — skips files that already exist), and
reports next steps. To target a different project, pass the path:

```
/bmad-grr-customize /path/to/other-bmad-project
```

### Alternative: shell script

For CI/CD or scripted usage, `install-customizations.sh` does the same thing
without the plugin check:

```bash
./install-customizations.sh /path/to/your/bmad-project
# Or, from within the BMad project:
/path/to/bmad-grr/install-customizations.sh
```

Both methods preserve existing files in `<project>/_bmad/custom/`.

## Disabling for one workflow

To opt out of the gate for a single workflow, delete or rename its toml in
`{project-root}/_bmad/custom/`:

```bash
rm _bmad/custom/bmad-create-prd.toml
# Now /bmad-create-prd runs unmodified upstream behavior
```

## Personal overrides

If you want to tighten or loosen the gate for yourself only (not your team),
add `_bmad/custom/<workflow>.user.toml` with overrides — BMad merges
`<workflow>.user.toml` on top of `<workflow>.toml`. The user file should be
gitignored.

## Strength of each hook

- `activation_steps_prepend` / `activation_steps_append` → **strong** (deterministic,
  the workflow runs the step explicitly).
- `on_complete` → **strong** (deterministic, runs at terminal stage).
- `persistent_facts` → **best-effort** (LLM autonomous decision based on the
  trigger rules — workflow-specific rules in these files are more reliable
  than generic ones, but not as guaranteed as activation steps).

## Updating

When this repo updates the customizations, the team override is overwritten
(since `*.toml` files are committed). Personal `*.user.toml` files are
preserved across updates.
