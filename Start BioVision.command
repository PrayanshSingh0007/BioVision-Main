#!/bin/bash
# Double-click to launch BioVision. Works even with no / bad Wi-Fi (school networks
# often block npm's registry) — it automatically falls back to the offline build.
cd "$(dirname "$0")"
clear
echo "🌿 BioVision — starting…"
echo ""

# Quick, short network probe (3s timeout) — never hangs on a bad connection.
have_network() { curl -fsS -m 3 -o /dev/null https://registry.npmjs.org 2>/dev/null; }

open_offline() {
  if [ -f dist/index.html ]; then
    echo "→ No usable network / dependencies. Opening the offline build instead."
    echo "  (This is the same app, fully self-contained — no Wi-Fi needed.)"
    open dist/index.html
    exit 0
  else
    echo "⚠️  No offline build found (dist/index.html is missing) and dependencies"
    echo "   aren't installed. This computer needs internet at least once to run"
    echo "   'npm install', or copy a 'dist' folder onto this machine."
    read -n 1 -s -r -p "Press any key to close…"
    exit 1
  fi
}

if [ -d node_modules ]; then
  echo "Starting the live dev server — press Ctrl+C in this window to stop."
  npm run dev
else
  echo "First run on this computer — checking for a network connection…"
  if have_network; then
    echo "Network OK. Installing dependencies (one-time)…"
    if npm install; then
      echo "Starting the live dev server — press Ctrl+C in this window to stop."
      npm run dev
    else
      echo "npm install failed partway through."
      open_offline
    fi
  else
    open_offline
  fi
fi
