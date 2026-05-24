#!/usr/bin/env python3
"""grr hook — Stop: block session stop when a test-failure marker exists.

Looks for a marker file at .grr/tests-failing in the current working
directory or any ancestor. The dev-story / qa-test workflows can write
this marker when a test command exited non-zero, and remove it once
tests pass again. This prevents "claim done while tests are red".

Set GRR_HOOK_STOP_GATE=0 to disable.
"""
import json
import os
import sys
from pathlib import Path

if os.environ.get("GRR_HOOK_STOP_GATE", "1") == "0":
    sys.exit(0)


def find_marker() -> Path | None:
    cwd = Path.cwd()
    for p in [cwd, *cwd.parents]:
        marker = p / ".grr" / "tests-failing"
        if marker.is_file():
            return marker
    return None


def main() -> int:
    try:
        json.load(sys.stdin)  # consume payload; we don't actually need anything from it
    except json.JSONDecodeError:
        pass

    marker = find_marker()
    if marker is None:
        return 0

    try:
        reason = marker.read_text(encoding="utf-8", errors="ignore").strip()
    except OSError:
        reason = "(marker file unreadable)"

    print(
        f"[grr-hook] Refused Stop: a .grr/tests-failing marker is present at\n"
        f"  {marker}\n"
        f"  Reason recorded by workflow: {reason or '(empty)'}\n"
        f"  Resolve the failure and remove the marker, OR set "
        f"GRR_HOOK_STOP_GATE=0 to override for the session.",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
