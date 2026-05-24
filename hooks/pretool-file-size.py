#!/usr/bin/env python3
"""grr hook — PreToolUse(Edit|Write): block when the target file is ≥ 500 lines.

The rule: "If a file is ≥ 500 lines, decompose before editing."
Threshold is configurable via env var GRR_HOOK_MAX_LINES (set to 0 to disable).

Behavior:
- On Edit targeting an existing file ≥ threshold → block (exit 2).
- On Write whose new content is ≥ threshold → block (exit 2).
- Otherwise → allow (exit 0).

Read stdin (Claude Code hook payload), make decision, exit.
"""
import json
import os
import sys

THRESHOLD = int(os.environ.get("GRR_HOOK_MAX_LINES", "500"))


def main() -> int:
    if THRESHOLD <= 0:
        return 0  # disabled

    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0  # malformed payload — fail open

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input") or {}

    if tool_name not in {"Edit", "Write"}:
        return 0

    path = tool_input.get("file_path", "")
    if not path:
        return 0

    line_count = 0

    if tool_name == "Edit":
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                line_count = sum(1 for _ in f)
        except (FileNotFoundError, IsADirectoryError, PermissionError):
            return 0  # nothing to block; let Claude proceed
    elif tool_name == "Write":
        content = tool_input.get("content", "")
        line_count = content.count("\n") + 1 if content else 0

    if line_count >= THRESHOLD:
        print(
            f"[grr-hook] Refused {tool_name} on {path} "
            f"({line_count} lines ≥ {THRESHOLD}).\n"
            f"Files this large should be decomposed first. "
            f"Either split the file or set GRR_HOOK_MAX_LINES=0 in your shell to "
            f"disable this rule for the session.",
            file=sys.stderr,
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
