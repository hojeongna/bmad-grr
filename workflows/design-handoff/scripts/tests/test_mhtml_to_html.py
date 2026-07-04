#!/usr/bin/env python3
"""Tests for mhtml_to_html.py"""

import json
import subprocess
import tempfile
from pathlib import Path

SCRIPT = str(Path(__file__).parent.parent / "mhtml_to_html.py")

# 1x1 transparent PNG, base64-encoded
PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="

MHTML_FIXTURE = (
    "From: <Saved by Blink>\n"
    "Snapshot-Content-Location: https://example.com/page\n"
    "Subject: Example Page\n"
    "MIME-Version: 1.0\n"
    "Content-Type: multipart/related;\n"
    '\ttype="text/html";\n'
    '\tboundary="----MultipartBoundary--test1234----"\n'
    "\n"
    "------MultipartBoundary--test1234----\n"
    "Content-Type: text/html\n"
    "Content-Transfer-Encoding: quoted-printable\n"
    "Content-Location: https://example.com/page\n"
    "\n"
    '<html><body><img src=3D"https://example.com/logo.png"></body></html>\n'
    "\n"
    "------MultipartBoundary--test1234----\n"
    "Content-Type: image/png\n"
    "Content-Transfer-Encoding: base64\n"
    "Content-Location: https://example.com/logo.png\n"
    "\n"
    f"{PNG_B64}\n"
    "\n"
    "------MultipartBoundary--test1234------\n"
)


def run(args: list[str]):
    return subprocess.run(
        ["uv", "run", SCRIPT] + args,
        capture_output=True, text=True
    )


def test_inlines_image_and_reports_stats():
    with tempfile.TemporaryDirectory() as d:
        src = Path(d) / "page.mhtml"
        src.write_text(MHTML_FIXTURE, encoding="utf-8")
        out = Path(d) / "page.html"

        result = run(["--input", str(src), "--output", str(out)])
        assert result.returncode == 0, result.stderr
        data = json.loads(result.stdout)

        assert "error" not in data
        assert data["assetsFound"] == 1
        assert data["assetsInlined"] == 1
        assert out.exists()

        html = out.read_text(encoding="utf-8")
        assert "https://example.com/logo.png" not in html
        assert "data:image/png;base64," in html


def test_missing_input_reports_error():
    with tempfile.TemporaryDirectory() as d:
        missing = Path(d) / "nope.mhtml"
        out = Path(d) / "nope.html"

        result = run(["--input", str(missing), "--output", str(out)])
        assert result.returncode != 0
        data = json.loads(result.stdout)
        assert "error" in data
        assert not out.exists()


if __name__ == "__main__":
    test_inlines_image_and_reports_stats()
    test_missing_input_reports_error()
    print("All tests passed.")
