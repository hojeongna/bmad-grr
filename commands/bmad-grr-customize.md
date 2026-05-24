---
name: 'grr-customize'
description: 'Apply grr customizations to the current BMAD project. Gates /bmad-create-prd, /bmad-create-architecture, /bmad-create-epics-and-stories, and /bmad-create-story with `grr-spec-validate` (sub-agent-dispatched, four-rubric spec validator). No external plugin required. Use when the user says "customize", "apply spec gate", "install grr customizations", or "set up spec validator".'
---

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND PRECISELY:

# /bmad-grr-customize

Install grr customizations into the current BMAD project. The
customizations gate the four upstream BMAD `create-*` workflows with
`grr-spec-validate` — a self-contained, sub-agent-dispatched spec
validator that requires no external plugin.

ARGUMENTS: $ARGUMENTS  (optional: target project path; defaults to cwd. Pass `--force` as the first arg to overwrite existing tomls.)

## Step 1 — Parse arguments

- If `$ARGUMENTS` starts with `--force`, set `$FORCE = true` and consume that token.
- The remaining `$ARGUMENTS` (or `pwd` if none) is the target project path. Resolve to absolute.

## Step 2 — Verify target is a BMAD project

Check that `<target>/_bmad/` exists. If not, STOP and tell the user:

> Target is not a BMAD project — `<target>/_bmad/` does not exist. Initialize BMAD first (the standard `_bmad/` skeleton with `config.yaml`), then re-run /bmad-grr-customize.

## Step 3 — Verify grr-spec-validate skill is installed globally

Check that `~/.claude/skills/grr-spec-validate/SKILL.md` exists. If missing, warn but do not block:

> The grr-spec-validate skill is not installed at `~/.claude/skills/grr-spec-validate/`. The gated workflows will HALT at pre-flight until it is installed. Run `bash install.sh` from the bmad-grr repo to install all skills, then re-run /bmad-create-prd in this project to activate the gate.

(Do not block the customize step — the user may install the skill afterwards. The tomls themselves halt the BMAD workflows at runtime if the skill is missing.)

## Step 4 — Locate the source customizations

Use Glob with pattern `**/customizations/bmad-create-*.toml` from `~/.claude/` first. If empty, look for the bmad-grr repo via the source path of this command (`commands/bmad-grr-customize.md` is at `<grr-repo>/commands/`, so the customizations are at `<grr-repo>/customizations/`).

If you cannot locate them, ask the user where they cloned bmad-grr and use that path's `customizations/` directory.

Expected files (4):

- `bmad-create-prd.toml`
- `bmad-create-architecture.toml`
- `bmad-create-epics-and-stories.toml`
- `bmad-create-story.toml`

## Step 5 — Copy

Ensure `<target>/_bmad/custom/` exists (`mkdir -p` via Bash).

For each of the 4 source tomls:

- If `<target>/_bmad/custom/<filename>` already exists:
  - `$FORCE == true` → overwrite with `cp`. Note "overwritten" in summary.
  - `$FORCE == false` → skip. Note "skipped (exists)" in summary.
- Else → copy. Note "installed".

Use Bash with `cp` per file so each result is observable. Verify with `ls` after.

## Step 6 — Summary

Present in `{communication_language}`:

```
Target project: <absolute path>
grr-spec-validate skill: installed | NOT INSTALLED
Source: <path-to-customizations-dir>
Mode: <normal | --force>

Customizations:
  - bmad-create-prd.toml                  installed | skipped (exists) | overwritten
  - bmad-create-architecture.toml         installed | skipped (exists) | overwritten
  - bmad-create-epics-and-stories.toml    installed | skipped (exists) | overwritten
  - bmad-create-story.toml                installed | skipped (exists) | overwritten

Result: <N> installed, <M> overwritten, <K> skipped.
```

Then state what happens next:

- If skill installed: "Ready. Next /bmad-create-prd (or any of the other three) in this project will activate the grr-spec-validate gate."
- If skill missing: "Install the skill first — `bash install.sh` from the bmad-grr repo — then the gate will activate."

Always include the opt-out instruction:

> To disable a specific workflow's gate later: `rm <target>/_bmad/custom/<workflow>.toml`

## Notes for the executing agent

- This command is idempotent — running it twice with default args shows all skipped on the second run.
- `<target>/_bmad/custom/<filename>.user.toml` files are personal overrides; never touch them.
- `--force` only overwrites the team toml, never the `.user.toml` files.
- BMAD's `resolve_customization.py` reads these tomls at workflow activation time, merging team toml + user toml on top of the workflow's base `customize.toml`. The customizations only take effect inside this specific project (per-project by design).
- No external plugin / MCP server is required for the gate to function. The validator is dispatched via Claude Code's Task / Agent sub-agent mechanism, using the local `~/.claude/skills/grr-spec-validate/` skill.
