# grr hooks

Optional Claude Code hooks bundled with bmad-grr. Each hook is a small
Python script (≤ ~60 lines) that runs at a specific lifecycle event and
either allows (exit 0) or blocks (exit 2 with stderr feedback). Hooks
are opt-in — `install.sh` copies the scripts under `~/.claude/hooks/grr/`
but does **not** auto-modify your `~/.claude/settings.json`. After
install you receive a snippet to paste into `settings.json` (or skip
entirely).

## Bundled hooks

| Script | Event | What it does | Env override |
| --- | --- | --- | --- |
| `pretool-file-size.py` | `PreToolUse(Edit\|Write)` | Refuse edits to files ≥ 500 lines (configurable). Encourages decomposition before further edits. | `GRR_HOOK_MAX_LINES=N` (0 to disable) |
| `pretool-bash-safety.py` | `PreToolUse(Bash)` | Refuse obviously dangerous commands: `rm -rf`, `sudo`, `chmod 777/666`, `git push --force`, `curl | sh`, `dd` to raw block device, fork bomb. | `GRR_HOOK_BASH_SAFETY=0` to disable |
| `posttool-format.py` | `PostToolUse(Edit\|Write)` | Run `npx prettier --write` (+ `eslint --fix` for JS/TS) on the edited file when the project has the matching config. Silent if formatter or config is absent. Never blocks. | `GRR_HOOK_AUTOFORMAT=0` to disable |
| `stop-test-gate.py` | `Stop` | Refuse session stop when a `.grr/tests-failing` marker exists anywhere from cwd upward. dev-story / qa-test can write this marker during red phases; remove it when green. | `GRR_HOOK_STOP_GATE=0` to disable |

All hooks are self-contained — no shared library, no external Python
deps. They read JSON payload from stdin and exit 0 (allow) or 2 (block
with stderr message).

## Install

`bash install.sh` (from the bmad-grr repo root) copies these scripts to
`~/.claude/hooks/grr/`. It prints a `settings.json` snippet at the end
that you can paste into `~/.claude/settings.json`.

The snippet looks roughly like this:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/pretool-file-size.py" }] },
      { "matcher": "Bash",       "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/pretool-bash-safety.py" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/posttool-format.py" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/stop-test-gate.py" }] }
    ]
  }
}
```

If you already have hooks in `settings.json`, merge by appending to the
existing arrays — do not replace.

On Windows, use `python` instead of `python3` in the commands if
`python3` is not on PATH.

## Disabling

Per-session: set the env var noted in the table above before launching
Claude Code (e.g. `export GRR_HOOK_MAX_LINES=0`).

Permanently: remove the corresponding entry from `~/.claude/settings.json`.

## Authoring more hooks

These four are intentionally narrow. To add your own grr-style hook:

1. Drop a Python script in `hooks/` here. Keep it self-contained.
2. Update this README.
3. Add a snippet line to `install.sh`'s settings-snippet output.
4. Commit.

The hook should read `sys.stdin` as JSON (Claude Code hook payload),
make a decision, and exit 0 (allow) or 2 (block). Print a single helpful
sentence to stderr when blocking — the user reads that directly.
