#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# ///
"""Convert a browser-saved .mhtml archive into a single self-contained .html file.

Inlines every part with a Content-Location (images, fonts, stylesheets) as a
data: URI and rewrites references to it in the HTML and in any CSS parts.
Best-effort: matches resource references by exact Content-Location string, so
it handles the common case (Chrome/Edge "Webpage, Single File" saves) but not
recursive @import chains or relative-path variants of the same URL.
"""

import argparse
import base64
import json
import sys
from email import policy
from email.parser import BytesParser
from pathlib import Path


def _data_uri(content_type: str, payload: bytes) -> str:
    return f"data:{content_type};base64,{base64.b64encode(payload).decode('ascii')}"


def convert(input_path: str, output_path: str) -> dict:
    """Convert one .mhtml file to a self-contained .html file. Returns a JSON-able summary."""
    src = Path(input_path)
    if not src.exists():
        return {"error": f"File not found: {input_path}"}

    with src.open("rb") as f:
        msg = BytesParser(policy=policy.compat32).parse(f)

    parts = list(msg.walk()) if msg.is_multipart() else [msg]

    html_parts = []
    asset_by_location = {}  # Content-Location -> (content_type, raw bytes)
    css_locations = []

    for part in parts:
        if part.is_multipart():
            continue
        content_type = part.get_content_type()
        location = part.get("Content-Location")
        payload = part.get_payload(decode=True)
        if payload is None:
            continue
        if content_type == "text/html":
            charset = part.get_content_charset() or "utf-8"
            html_parts.append((location, payload, charset))
        elif location:
            asset_by_location[location] = (content_type, payload)
            if content_type == "text/css":
                css_locations.append(location)

    if not html_parts:
        return {"error": "No text/html part found in the mhtml file"}

    snapshot_location = msg.get("Snapshot-Content-Location")
    main = next((h for h in html_parts if h[0] == snapshot_location), None) if snapshot_location else None
    if main is None:
        main = html_parts[0]

    warnings = []

    # Pass 1 — resolve non-CSS assets first, inline them into CSS text, then finalize each CSS part's own data URI.
    resolved_assets = {
        location: _data_uri(content_type, payload)
        for location, (content_type, payload) in asset_by_location.items()
        if content_type != "text/css"
    }

    for location in css_locations:
        content_type, payload = asset_by_location[location]
        try:
            css_text = payload.decode("utf-8")
        except UnicodeDecodeError:
            css_text = payload.decode("utf-8", errors="replace")
            warnings.append(f"CSS part {location} was not valid utf-8; replaced undecodable bytes")
        for asset_url, data_uri in resolved_assets.items():
            css_text = css_text.replace(asset_url, data_uri)
        resolved_assets[location] = _data_uri(content_type, css_text.encode("utf-8"))

    # Pass 2 — rewrite the main HTML document with every resolved asset inlined.
    _, html_payload, charset = main
    try:
        html_text = html_payload.decode(charset)
    except (UnicodeDecodeError, LookupError):
        html_text = html_payload.decode("utf-8", errors="replace")
        warnings.append("Main HTML part was not valid in its declared charset; replaced undecodable bytes")

    assets_inlined = 0
    for asset_url, data_uri in resolved_assets.items():
        if asset_url in html_text:
            html_text = html_text.replace(asset_url, data_uri)
            assets_inlined += 1

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html_text, encoding="utf-8")

    return {
        "input": str(src),
        "output": str(out),
        "htmlBytes": len(html_text.encode("utf-8")),
        "assetsFound": len(resolved_assets),
        "assetsInlined": assets_inlined,
        "warnings": warnings,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, help="Path to the source .mhtml file")
    parser.add_argument("--output", required=True, help="Path to write the converted, self-contained .html file")
    args = parser.parse_args()

    result = convert(args.input, args.output)
    print(json.dumps(result))
    if "error" in result:
        sys.exit(1)


if __name__ == "__main__":
    main()
