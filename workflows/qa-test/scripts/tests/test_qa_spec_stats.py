#!/usr/bin/env python3
"""Tests for qa-spec-stats.py"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT = str(Path(__file__).parent.parent / "qa-spec-stats.py")

SAMPLE_SPEC = """---
type: qa-test-spec
---

# QA Test Specification: Sample

## 4. Test Scenarios

### TS-001: Login Form

| TC# | Test Case | Steps | Input/Action | Expected Result | Priority |
|-----|-----------|-------|--------------|-----------------|----------|
| TC-001-01 | Valid login | 1. Enter email 2. Enter password 3. Click login | valid@test.com / pass123 | Dashboard shown | P0 |
| TC-001-02 | Remember me | 1. Check remember 2. Login | valid creds | Session persists | P1 |

#### Edge Cases

| TC# | Test Case | Steps | Input/Action | Expected Result | Priority |
|-----|-----------|-------|--------------|-----------------|----------|
| TC-001-E01 | Empty email | 1. Leave empty 2. Click login | empty | Error shown | P1 |
| TC-001-E02 | Very long email | 1. Enter 500 chars | long string | Validation error | P2 |

#### Error Cases

| TC# | Test Case | Steps | Input/Action | Expected Result | Priority |
|-----|-----------|-------|--------------|-----------------|----------|
| TC-001-R01 | Wrong password | 1. Enter wrong pass | bad pass | Error message | P0 |

## 5. Navigation Tests

| TC# | Test Case | Steps | Expected Result | Priority |
|-----|-----------|-------|-----------------|----------|
| NAV-01 | Back after login | 1. Login 2. Back | Stay on dashboard | P1 |

## 6. Regression Tests

| TC# | Existing Feature | Test Case | Steps | Expected Result | Priority |
|-----|-----------------|-----------|-------|-----------------|----------|
| REG-01 | Sidebar | Still visible | 1. Check sidebar | Sidebar present | P0 |

## 7. Accessibility Tests

| TC# | Test Case | Check Point | Expected Result | Priority |
|-----|-----------|-------------|-----------------|----------|
| A11Y-01 | Keyboard nav | Login form | All fields reachable | P1 |

## 8. Responsive Tests

| TC# | Viewport | Test Case | Expected Result | Priority |
|-----|----------|-----------|-----------------|----------|
| RSP-01 | Mobile (375px) | Layout | No horizontal scroll | P1 |

## 9. UI/Visual Tests

| TC# | Test Case | Check Point | Expected Result | Priority |
|-----|-----------|-------------|-----------------|----------|
| UI-01 | Console clean | After all actions | No errors | P0 |
"""


def test_parse_spec():
    with tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(SAMPLE_SPEC)
        f.flush()

        result = subprocess.run(
            [sys.executable, SCRIPT, f.name],
            capture_output=True, text=True
        )
        assert result.returncode == 0
        data = json.loads(result.stdout)

        assert data["total"] == 10
        assert data["by_category"]["functional"] == 2
        assert data["by_category"]["edge"] == 2
        assert data["by_category"]["error"] == 1
        assert data["by_category"]["navigation"] == 1
        assert data["by_category"]["regression"] == 1
        assert data["by_category"]["accessibility"] == 1
        assert data["by_category"]["responsive"] == 1
        assert data["by_category"]["ui_visual"] == 1
        assert data["by_priority"]["P0"] == 4
        assert data["by_priority"]["P1"] == 5
        assert data["by_priority"]["P2"] == 1

    Path(f.name).unlink()


def test_missing_file():
    result = subprocess.run(
        [sys.executable, SCRIPT, "/nonexistent/file.md"],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    assert "error" in data


if __name__ == "__main__":
    test_parse_spec()
    test_missing_file()
    print("All tests passed!")
