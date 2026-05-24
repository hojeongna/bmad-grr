#!/usr/bin/env python3
"""grr hook — PostToolUse(Edit|Write): auto-format the edited file.

Runs prettier or eslint on JS/TS/JSON/CSS/MD files in projects that have
the matching config. Silent if the formatter or config is absent.

Set GRR_HOOK_AUTOFORMAT=0 to disable.
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

if os.environ.get("GRR_HOOK_AUTOFORMAT", "1") == "0":
    sys.exit(0)

FORMATTABLE_EXT = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts",
    ".json", ".css", ".scss", ".less", ".html", ".md", ".yaml", ".yml",
}


def find_project_root(start: Path) -> Path | None:
    """Walk up looking for package.json or .prettierrc*."""
    for p in [start, *start.parents]:
        if (p / "package.json").is_file() or any(p.glob(".prettierrc*")) or (p / ".eslintrc.json").is_file():
            return p
    return None


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    if payload.get("tool_name") not in {"Edit", "Write"}:
        return 0

    path_str = (payload.get("tool_input") or {}).get("file_path", "")
    if not path_str:
        return 0

    path = Path(path_str)
    if not path.is_file():
        return 0
    if path.suffix.lower() not in FORMATTABLE_EXT:
        return 0

    project_root = find_project_root(path.parent)
    if project_root is None:
        return 0

    # Prefer prettier if present; otherwise try eslint --fix.
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    if npx is None:
        return 0

    # prettier (silent — failure is non-blocking).
    try:
        subprocess.run(
            [npx, "--no-install", "prettier", "--write", str(path)],
            cwd=project_root,
            timeout=20,
            capture_output=True,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass

    # eslint --fix on JS/TS files only.
    if path.suffix.lower() in {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts"}:
        try:
            subprocess.run(
                [npx, "--no-install", "eslint", "--fix", str(path)],
                cwd=project_root,
                timeout=30,
                capture_output=True,
            )
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass

    return 0


if __name__ == "__main__":
    sys.exit(main())
