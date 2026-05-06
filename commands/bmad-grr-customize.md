---
name: 'grr-customize'
description: 'Apply grr ouroboros customizations to the current BMAD project. Gates /bmad-create-prd, /bmad-create-architecture, /bmad-create-epics-and-stories, and /bmad-create-story with Ouroboros ambiguity scoring and 3-stage evaluation. Use when the user says "customize", "apply ouroboros gate", "install grr customizations", or "set up spec gate"'
---

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND PRECISELY:

# /bmad-grr-customize

Install grr ouroboros customizations into the current BMAD project.

ARGUMENTS: $ARGUMENTS  (optional: target project path; defaults to cwd)

## Step 1 — Resolve target project

- If `$ARGUMENTS` is non-empty, treat it as the target project path. Otherwise use the current working directory (`pwd`).
- Resolve the path to absolute. Verify the target is a BMAD project by checking that `<target>/_bmad/` exists. If it does not, STOP and tell the user:
  > Target is not a BMAD project — `<target>/_bmad/` does not exist. Initialize BMAD first (it must have config.yaml and the standard `_bmad/` skeleton), then re-run /bmad-grr-customize.

## Step 2 — Verify Ouroboros plugin availability

Use the `ToolSearch` tool with query `+ouroboros` and `max_results` 10.

Look for any tool whose name matches `mcp__plugin_ouroboros_*__ouroboros_*` (e.g. `ouroboros_interview`, `ouroboros_pm`, `ouroboros_seed`, `ouroboros_evaluate`).

- **If none are returned**: warn the user clearly. Do NOT block the customization install — the tomls themselves contain pre-flight checks that will halt the BMAD workflows at runtime if Ouroboros isn't available. Just inform:
  > Ouroboros plugin is not yet installed. After this customize step finishes, install it with:
  > ```
  > claude plugin marketplace add Q00/ouroboros
  > claude plugin install ouroboros@ouroboros
  > ```
  > Requires Python >= 3.12 and uvx (https://docs.astral.sh/uv/). Restart your Claude Code session after install for the gate to activate.

- **If at least one ouroboros tool is found**: note "Ouroboros plugin detected" and continue.

## Step 3 — Locate the source customizations

The source customization tomls live alongside this command file in the grr repo. Use the `Glob` tool with pattern `**/customizations/bmad-create-*.toml` from `~/.claude/` to find them, OR fall back to `~/.claude/skills/bmad-grr/customizations/*.toml`, OR search nearby paths the user may have cloned the repo to. If you cannot locate the source files, ask the user where they cloned the bmad-grr repo and use that path's `customizations/` directory.

Expected files (4):
- `bmad-create-prd.toml`
- `bmad-create-architecture.toml`
- `bmad-create-epics-and-stories.toml`
- `bmad-create-story.toml`

## Step 4 — Copy with idempotence

Create `<target>/_bmad/custom/` if it does not exist (use the `Bash` tool: `mkdir -p`).

For each of the 4 source tomls:

- If `<target>/_bmad/custom/<filename>` already exists, **skip** it and note "skipped (exists)" in the summary. Do not overwrite — the user may have local edits.
- If it does not exist, copy the source into place and note "installed" in the summary.

Use the `Bash` tool with `cp` for the copy, one file at a time so each result is observable. Verify each copy with a quick `ls` afterward.

## Step 5 — Summary

Present a structured summary to the user:

```
Target project: <absolute-path>
Ouroboros plugin: detected | not installed
Source: <path-to-customizations-dir>

Customizations:
  - bmad-create-prd.toml                      installed | skipped (exists)
  - bmad-create-architecture.toml             installed | skipped (exists)
  - bmad-create-epics-and-stories.toml        installed | skipped (exists)
  - bmad-create-story.toml                    installed | skipped (exists)

Result: <N> installed, <M> skipped.
```

Then list next steps based on plugin status:

- If plugin not installed: show the 2-line install command + "Restart session after install."
- If plugin installed: "Ready. Next /bmad-create-prd in this project will activate the ouroboros gate."

Always include the opt-out instruction:
> To disable a specific workflow's gate later: `rm <target>/_bmad/custom/<workflow>.toml`

## Notes for the executing agent

- This command is idempotent — running it twice is safe; second run shows all skipped.
- Existing `<target>/_bmad/custom/<filename>.user.toml` files are personal overrides; never touch them.
- If the user passes `--force` (or similar) in `$ARGUMENTS`, you MAY overwrite existing tomls — but only if explicitly requested, and warn before doing so.
- BMAD's `resolve_customization.py` reads these tomls at workflow activation time, merging team toml + user toml on top of the workflow's base `customize.toml`. The customizations only take effect inside this specific project (per-project by design).
