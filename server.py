#!/usr/bin/env python3
"""
ITUB UltraBalaton Tracker – Proxy Server
Serves static files + proxies live race data from runtiming.hu to avoid CORS.

Local:  python3 server.py  →  http://localhost:8899
Cloud:  PORT env var is picked up automatically (Render, Railway, Fly.io, etc.)
"""

import http.server
import urllib.request
import urllib.error
import os
from http import HTTPStatus

LIVE_URL = "https://runtiming.hu/verseny/ub2026/ub2026-csapat13/versenyzo/84095"
# Cloud platforms inject PORT; fall back to 8899 locally
PORT = int(os.environ.get("PORT", 8899))
# Bind to all interfaces so cloud routers can reach us (0.0.0.0 = any interface)
HOST = "0.0.0.0"

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files and proxies /api/live to runtiming.hu."""

    def do_GET(self):
        if self.path == "/api/live" or self.path.startswith("/api/live?"):
            self.proxy_live()
        else:
            # Serve static files from the same directory
            super().do_GET()

    def proxy_live(self):
        try:
            req = urllib.request.Request(
                LIVE_URL,
                headers={
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                                  "Chrome/124.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "hu,en;q=0.9",
                    "Referer": "https://runtiming.hu/",
                }
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                content_type = resp.headers.get("Content-Type", "text/html; charset=utf-8")

            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)
            print(f"[proxy] Fetched {len(data)} bytes from runtiming.hu")

        except urllib.error.HTTPError as e:
            error_msg = f"Upstream HTTP {e.code}: {e.reason}".encode()
            self.send_response(e.code)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(error_msg)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(error_msg)
            print(f"[proxy] HTTP error {e.code}: {e.reason}")

        except Exception as e:
            error_msg = f"Proxy error: {e}".encode()
            self.send_response(HTTPStatus.BAD_GATEWAY)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Content-Length", str(len(error_msg)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(error_msg)
            print(f"[proxy] Error: {e}")

    def log_message(self, fmt, *args):
        # Quieter logs – only print non-asset requests
        path = args[0] if args else ""
        if any(ext in str(path) for ext in [".css", ".js", ".ico", ".png", ".woff"]):
            return
        super().log_message(fmt, *args)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"🏃 ITUB UltraBalaton Tracker")
    print(f"   Serving:   http://{HOST}:{PORT}")
    print(f"   Live data: {LIVE_URL}")
    print(f"   Proxy at:  http://{HOST}:{PORT}/api/live")
    print(f"   Press Ctrl+C to stop\n")

    server = http.server.HTTPServer((HOST, PORT), ProxyHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()
