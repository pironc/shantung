#!/bin/sh
# Rebuilds every product packshot in ../photos (macOS 14+ for the Vision cut-out; numpy, Pillow, fontTools).
set -e
cd "$(dirname "$0")"
python3 tin.py
python3 scarf.py ../photos/silk-scarf-design.jpg ../photos/scarf-imperial-thread.jpg --box 147,134,1107,1094 --clone 458,424,510,454,0,26
python3 scarf.py ../photos/brocade-robe.jpg ../photos/scarf-kesi-cloud-gate.jpg --box 300,750,1300,1750
python3 -c "from PIL import Image; Image.open('../photos/brocade-robe.jpg').convert('RGB').crop((620, 760, 1260, 1560)).resize((960, 1200), Image.LANCZOS).save('../photos/kesi-detail.jpg', 'JPEG', quality=86, optimize=True, progressive=True)"
