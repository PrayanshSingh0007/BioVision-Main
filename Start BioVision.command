#!/bin/bash
# Double-click to launch BioVision in your browser.
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  echo "Installing dependencies (first run only)…"
  npm install
fi
echo "Starting BioVision — press Ctrl+C in this window to stop."
npm run dev
