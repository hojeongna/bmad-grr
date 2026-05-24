#!/usr/bin/env python3
"""grr hook — PreToolUse(Bash): block obviously dangerous commands.

Patterns blocked (regex on the Bash command string):
  - rm -rf / -fr / -r -f anywhere
  - sudo …
  - chmod 777 / 666 (world-writable)
  - Force-pushing main / master without explicit override
  - curl | sh and curl | bash (remote-code execution)

Set GRR_HOOK_BASH_SAFETY=0 in the shell to disable.
"""
import json
import os
import re
import sys

if os.environ.get("GRR_HOOK_BASH_SAFETY", "1") == "0":
    sys.exit(0)

DANGEROUS = [
    (re.compile(r"\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b"), "rm with recursive force flags"),
    (re.compile(r"\bsudo\b"), "sudo invocation"),
    (re.compile(r"\bchmod\s+(777|666)\b"), "world-writable chmod"),
    (re.compile(r"\bgit\s+push\s+.*--force(\s|$)"), "git push --force (use --force-with-lease if intended)"),
    (re.compile(r"curl\s+[^|]*\|\s*(sh|bash)\b"), "curl | sh / bash (remote code execution)"),
    (re.compile(r"\bdd\s+if=.*of=/dev/(sd|nvme|hd)"), "dd to a raw block device"),
    (re.compile(r"\b:\(\)\{\s*:\|:&\s*\}"), "fork bomb"),
]


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    if payload.get("tool_name") != "Bash":
        return 0

    cmd = (payload.get("tool_input") or {}).get("command", "")
    for pattern, label in DANGEROUS:
        if pattern.search(cmd):
            print(
                f"[grr-hook] Refused Bash: matched '{label}'.\n"
                f"  Command: {cmd[:200]}{'…' if len(cmd) > 200 else ''}\n"
                f"  If this is intentional, set GRR_HOOK_BASH_SAFETY=0 in your shell "
                f"for the session.",
                file=sys.stderr,
            )
            return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
