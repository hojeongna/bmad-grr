#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# ///
"""Parse a QA test specification document and return statistics as JSON."""

import argparse
import json
import re
import sys
from pathlib import Path


def parse_spec(spec_path: str) -> dict:
    """Parse test case IDs and priorities from a QA spec document."""
    path = Path(spec_path)
    if not path.exists():
        return {"error": f"File not found: {spec_path}"}

    text = path.read_text(encoding="utf-8")

    # Match test case IDs: TC-NNN-NN, TC-NNN-ENN, TC-NNN-RNN, NAV-NN, REG-NN, UI-NN, A11Y-NN, RSP-NN
    tc_pattern = re.compile(
        r"(TC-\d+-(?:E|R)?\d+|NAV-\d+|REG-\d+|UI-\d+|A11Y-\d+|RSP-\d+)"
    )
    priority_pattern = re.compile(r"P([012])")

    categories = {
        "functional": [],   # TC-NNN-NN (no E or R suffix)
        "edge": [],         # TC-NNN-ENN
        "error": [],        # TC-NNN-RNN
        "navigation": [],   # NAV-NN
        "regression": [],   # REG-NN
        "accessibility": [],# A11Y-NN
        "responsive": [],   # RSP-NN
        "ui_visual": [],    # UI-NN
    }

    by_priority = {"P0": 0, "P1": 0, "P2": 0}

    for line in text.split("\n"):
        tc_match = tc_pattern.search(line)
        if not tc_match:
            continue

        tc_id = tc_match.group(1)
        priority_match = priority_pattern.search(line)
        priority = f"P{priority_match.group(1)}" if priority_match else "P1"
        by_priority[priority] = by_priority.get(priority, 0) + 1

        entry = {"id": tc_id, "priority": priority}

        if tc_id.startswith("A11Y"):
            categories["accessibility"].append(entry)
        elif tc_id.startswith("RSP"):
            categories["responsive"].append(entry)
        elif tc_id.startswith("NAV"):
            categories["navigation"].append(entry)
        elif tc_id.startswith("REG"):
            categories["regression"].append(entry)
        elif tc_id.startswith("UI"):
            categories["ui_visual"].append(entry)
        elif re.match(r"TC-\d+-E\d+", tc_id):
            categories["edge"].append(entry)
        elif re.match(r"TC-\d+-R\d+", tc_id):
            categories["error"].append(entry)
        else:
            categories["functional"].append(entry)

    total = sum(len(v) for v in categories.values())
    summary = {cat: len(items) for cat, items in categories.items()}

    return {
        "total": total,
        "by_priority": by_priority,
        "by_category": summary,
        "test_case_ids": [tc["id"] for cat_items in categories.values() for tc in cat_items],
    }


def main():
    parser = argparse.ArgumentParser(description="QA spec statistics")
    parser.add_argument("spec_path", help="Path to QA test specification document")
    parser.add_argument("-o", "--output", help="Output JSON file path")
    args = parser.parse_args()

    result = parse_spec(args.spec_path)

    if args.output:
        Path(args.output).write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(f"Stats written to {args.output}")
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
