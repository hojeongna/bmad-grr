#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["pyyaml"]
# ///
"""QA Test state file management — create, update, and query state."""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml required. Run with: uv run scripts/qa-state.py", file=sys.stderr)
    sys.exit(1)


def create_state(args):
    """Create a new QA test state file."""
    state = {
        "stepsCompleted": ["step-01-init"],
        "lastStep": "step-01-init",
        "status": "IN_PROGRESS",
        "date": args.date or datetime.now().strftime("%Y-%m-%d"),
        "scope": args.scope,
        "epicId": args.epic_id,
        "appUrl": args.app_url,
        "currentStoryIndex": 0,
        "stories": [],
        "prior_learnings": [],
        "fixes_applied": [],
        "deferred_issues": [],
    }

    if args.stories:
        for s in args.stories:
            parts = s.split("|", 1)
            state["stories"].append({
                "path": parts[0],
                "title": parts[1] if len(parts) > 1 else parts[0],
                "status": "pending",
                "testCases": 0,
                "passed": 0,
                "fixed": 0,
                "deferred": 0,
                "blocked": 0,
            })

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    content = "---\n" + yaml.dump(state, default_flow_style=False, allow_unicode=True) + "---\n\n"
    content += f"# QA Test State: {state['date']}\n\n## Session Log\n"

    output_path.write_text(content, encoding="utf-8")
    print(json.dumps({"created": str(output_path), "stories": len(state["stories"])}))


def update_state(args):
    """Update an existing state file."""
    path = Path(args.state_file)
    if not path.exists():
        print(json.dumps({"error": f"State file not found: {path}"}))
        sys.exit(1)

    text = path.read_text(encoding="utf-8")
    # Parse YAML frontmatter
    parts = text.split("---", 2)
    if len(parts) < 3:
        print(json.dumps({"error": "Invalid state file format"}))
        sys.exit(1)

    state = yaml.safe_load(parts[1])
    body = parts[2]

    # Apply updates from JSON
    updates = json.loads(args.updates)
    for key, value in updates.items():
        if key == "addStep":
            if value not in state["stepsCompleted"]:
                state["stepsCompleted"].append(value)
            state["lastStep"] = value
        elif key == "addFix":
            state["fixes_applied"].append(value)
            idx = state["currentStoryIndex"]
            if idx < len(state["stories"]):
                state["stories"][idx]["fixed"] = state["stories"][idx].get("fixed", 0) + 1
        elif key == "addDeferred":
            state["deferred_issues"].append(value)
            idx = state["currentStoryIndex"]
            if idx < len(state["stories"]):
                state["stories"][idx]["deferred"] = state["stories"][idx].get("deferred", 0) + 1
        elif key == "incrementPassed":
            idx = state["currentStoryIndex"]
            if idx < len(state["stories"]):
                state["stories"][idx]["passed"] = state["stories"][idx].get("passed", 0) + 1
        elif key == "incrementBlocked":
            idx = state["currentStoryIndex"]
            if idx < len(state["stories"]):
                state["stories"][idx]["blocked"] = state["stories"][idx].get("blocked", 0) + 1
        elif key == "nextStory":
            state["currentStoryIndex"] = state["currentStoryIndex"] + 1
        elif key == "storyStatus":
            idx = state["currentStoryIndex"]
            if idx < len(state["stories"]):
                state["stories"][idx]["status"] = value
        elif key == "logEntry":
            body += f"\n### {datetime.now().strftime('%H:%M')} — {value}\n"
        else:
            state[key] = value

    content = "---\n" + yaml.dump(state, default_flow_style=False, allow_unicode=True) + "---\n" + body
    path.write_text(content, encoding="utf-8")
    print(json.dumps({"updated": str(path), "status": state["status"]}))


def query_state(args):
    """Query state file and return JSON."""
    path = Path(args.state_file)
    if not path.exists():
        print(json.dumps({"exists": False}))
        return

    text = path.read_text(encoding="utf-8")
    parts = text.split("---", 2)
    if len(parts) < 3:
        print(json.dumps({"exists": True, "valid": False}))
        return

    state = yaml.safe_load(parts[1])
    state["exists"] = True
    state["valid"] = True
    print(json.dumps(state, ensure_ascii=False))


def find_active(args):
    """Find active (IN_PROGRESS) state files in a directory."""
    directory = Path(args.directory)
    active = []
    for f in sorted(directory.glob("qa-test-*.state.md")):
        text = f.read_text(encoding="utf-8")
        parts = text.split("---", 2)
        if len(parts) >= 3:
            state = yaml.safe_load(parts[1])
            if state.get("status") == "IN_PROGRESS":
                active.append({"path": str(f), "date": state.get("date"), "lastStep": state.get("lastStep")})
    print(json.dumps(active))


def main():
    parser = argparse.ArgumentParser(description="QA Test state management")
    sub = parser.add_subparsers(dest="command", required=True)

    c = sub.add_parser("create")
    c.add_argument("--output", required=True)
    c.add_argument("--scope", required=True, choices=["story", "epic"])
    c.add_argument("--app-url", required=True)
    c.add_argument("--epic-id", default=None)
    c.add_argument("--date", default=None)
    c.add_argument("--stories", nargs="*", help="path|title pairs")

    u = sub.add_parser("update")
    u.add_argument("--state-file", required=True)
    u.add_argument("--updates", required=True, help="JSON object of updates")

    q = sub.add_parser("query")
    q.add_argument("--state-file", required=True)

    f = sub.add_parser("find-active")
    f.add_argument("--directory", required=True)

    args = parser.parse_args()
    {"create": create_state, "update": update_state, "query": query_state, "find-active": find_active}[args.command](args)


if __name__ == "__main__":
    main()
