#!/usr/bin/env python3
"""Tests for qa-state.py"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT = str(Path(__file__).parent.parent / "qa-state.py")


def run(args: list[str]) -> dict:
    result = subprocess.run(
        ["uv", "run", SCRIPT] + args,
        capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(f"Script failed: {result.stderr}")
    return json.loads(result.stdout)


def test_create_and_query():
    with tempfile.TemporaryDirectory() as d:
        out = Path(d) / "state.md"

        # Create
        result = run([
            "create",
            "--output", str(out),
            "--scope", "story",
            "--app-url", "http://localhost:3000",
            "--stories", "docs/story-1.md|Login Feature"
        ])
        assert out.exists()
        assert result["stories"] == 1

        # Query
        result = run(["query", "--state-file", str(out)])
        assert result["exists"] is True
        assert result["scope"] == "story"
        assert result["appUrl"] == "http://localhost:3000"
        assert len(result["stories"]) == 1
        assert result["stories"][0]["title"] == "Login Feature"
        assert result["status"] == "IN_PROGRESS"


def test_update_pass_and_fix():
    with tempfile.TemporaryDirectory() as d:
        out = Path(d) / "state.md"
        run([
            "create", "--output", str(out),
            "--scope", "epic", "--app-url", "http://localhost:3000",
            "--stories", "s1.md|Story 1", "s2.md|Story 2"
        ])

        # Increment passed
        run(["update", "--state-file", str(out), "--updates", '{"incrementPassed":true}'])
        state = run(["query", "--state-file", str(out)])
        assert state["stories"][0]["passed"] == 1

        # Add fix
        run(["update", "--state-file", str(out), "--updates",
             '{"addFix":{"tc":"TC-001","cause":"typo","fix":"fixed typo","files":["app.js"]}}'])
        state = run(["query", "--state-file", str(out)])
        assert state["stories"][0]["fixed"] == 1
        assert len(state["fixes_applied"]) == 1

        # Next story
        run(["update", "--state-file", str(out), "--updates", '{"nextStory":true}'])
        state = run(["query", "--state-file", str(out)])
        assert state["currentStoryIndex"] == 1


def test_find_active():
    with tempfile.TemporaryDirectory() as d:
        # Create an active state
        out = Path(d) / "qa-test-2026-04-12.state.md"
        run(["create", "--output", str(out), "--scope", "story", "--app-url", "http://localhost:3000"])

        # Create a completed state
        out2 = Path(d) / "qa-test-2026-04-11.state.md"
        run(["create", "--output", str(out2), "--scope", "story", "--app-url", "http://localhost:3000"])
        run(["update", "--state-file", str(out2), "--updates", '{"status":"COMPLETED"}'])

        result = run(["find-active", "--directory", d])
        assert len(result) == 1
        assert "2026-04-12" in result[0]["path"]


if __name__ == "__main__":
    test_create_and_query()
    test_update_pass_and_fix()
    test_find_active()
    print("All tests passed!")
