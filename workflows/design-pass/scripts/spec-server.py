#!/usr/bin/env python3
"""spec-server.py — static host for the mockups plus a drop box for extracted specs.

Two jobs, one process:

  GET  /<anything>            serve a file from --serve (the mockup directory)
  POST /__spec/<name>         write the request body to --out/<name>

The second one is why this exists. A full record dump is hundreds of kilobytes; returning
it through a browser-tool result would put every byte into the agent's context, which is
the reading-and-skimming that design-pass was rewritten to stop doing. The page POSTs its
own spec straight to disk, `diff` compares two files, and only the differences are ever
read by anyone.

CORS is wide open because the live side POSTs from the application's origin, not from
localhost. That is safe only because the socket is bound to 127.0.0.1 and writes are
confined to --out; keep both of those properties if you change anything here.

    python spec-server.py --serve ./mockups --out ./specs --port 8973
"""

import argparse
import json
import os
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

SAFE_NAME = re.compile(r"^[A-Za-z0-9._-]{1,120}$")
MAX_BYTES = 64 * 1024 * 1024


class SpecHandler(SimpleHTTPRequestHandler):
    out_dir = None

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "content-type")

    def end_headers(self):
        self._cors()
        # A mockup cached between runs is a mockup you are no longer testing.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if not self.path.startswith("/__spec/"):
            self.send_error(404, "only /__spec/<name> accepts POST")
            return

        name = self.path[len("/__spec/"):]
        # Percent-decoding happens before the safety check on purpose: %2e%2e%2f must be
        # rejected, not silently normalized into a traversal after the check has passed.
        from urllib.parse import unquote
        name = unquote(name)
        if not SAFE_NAME.match(name) or name in (".", ".."):
            self.send_error(400, "name must match [A-Za-z0-9._-]{1,120}")
            return

        try:
            length = int(self.headers.get("content-length", "0"))
        except ValueError:
            self.send_error(411, "content-length required")
            return
        if length <= 0 or length > MAX_BYTES:
            self.send_error(413, f"body must be 1..{MAX_BYTES} bytes")
            return

        body = self.rfile.read(length)
        target = os.path.join(self.out_dir, name)
        # Belt and braces — SAFE_NAME already forbids separators.
        if os.path.dirname(os.path.abspath(target)) != os.path.abspath(self.out_dir):
            self.send_error(400, "refusing to write outside --out")
            return

        with open(target, "wb") as fh:
            fh.write(body)

        msg = json.dumps({"ok": True, "path": target, "bytes": len(body)}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(msg)))
        self.end_headers()
        self.wfile.write(msg)
        print(f"[spec] wrote {name} ({len(body)} bytes)", flush=True)

    def log_message(self, fmt, *args):
        # The GET stream is noise; POSTs print themselves above.
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--serve", default=".", help="directory to serve over GET (the mockups)")
    ap.add_argument("--out", default="./specs", help="directory POSTed specs are written to")
    ap.add_argument("--port", type=int, default=8973)
    args = ap.parse_args()

    serve_dir = os.path.abspath(args.serve)
    out_dir = os.path.abspath(args.out)
    os.makedirs(out_dir, exist_ok=True)
    if not os.path.isdir(serve_dir):
        sys.exit(f"--serve is not a directory: {serve_dir}")

    SpecHandler.out_dir = out_dir
    handler = partial(SpecHandler, directory=serve_dir)
    httpd = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"serving {serve_dir} on http://localhost:{args.port}", flush=True)
    print(f"specs   -> {out_dir}  (POST /__spec/<name>)", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
