#!/bin/sh
# Rebuilds every product packshot in ../photos (macOS 14+ for the Vision cut-out; numpy, Pillow, fontTools).
set -e
cd "$(dirname "$0")"
python3 tin.py
python3 scarf.py ../photos/silk-scarf-design.jpg ../photos/scarf-imperial-thread.jpg --box 147,134,1107,1094 --clone 458,424,510,454,0,26
