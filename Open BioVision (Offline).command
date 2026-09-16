#!/bin/bash
# Emergency / classroom button: opens the finished app directly from disk.
# No terminal commands, no npm, no server, no Wi-Fi required — guaranteed to work
# as long as this folder still has its "dist" subfolder.
cd "$(dirname "$0")"
if [ -f dist/index.html ]; then
  open dist/index.html
else
  osascript -e 'display alert "BioVision — offline build missing" message "This folder no longer has a dist/index.html. Run npm run build once on a machine with internet, then copy the whole project folder (including dist) here." as critical'
fi
