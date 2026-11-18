#!/bin/sh
# Rebuilds every product packshot in ../photos (macOS 14+ for the Vision cut-out; numpy, Pillow, fontTools).
set -e
cd "$(dirname "$0")"
python3 tin.py
python3 scarf.py ../photos/silk-scarf-design.jpg ../photos/scarf-imperial-thread.jpg --box 147,134,1107,1094 --clone 458,424,510,454,0,26
python3 scarf.py ../photos/brocade-robe.jpg ../photos/scarf-kesi-cloud-gate.jpg --box 300,750,1300,1750
python3 -c "from PIL import Image; Image.open('../photos/brocade-robe.jpg').convert('RGB').crop((620, 760, 1260, 1560)).resize((960, 1200), Image.LANCZOS).save('../photos/kesi-detail.jpg', 'JPEG', quality=86, optimize=True, progressive=True)"
python3 tie.py ../photos/printed-ties.jpg ../photos/tie-lattice.jpg --crop 0.5,0,1,1 --keep 1
python3 tie.py ../photos/printed-ties.jpg ../photos/tie-taishan-stripe.jpg --crop 0,0,0.5,1 --keep 0.88 --skin repp-stripe
python3 tie.py ../photos/printed-ties.jpg ../photos/tie-golden-thread.jpg --crop 0.5,0,1,1 --keep 1 --mirror --skin raw-silk --motif ../photos/shantung-sleeve.jpg --motif-box 600,690,940,1030 --motif-at 0.5,0.66 --motif-width 0.5
python3 scarf.py ../photos/penglai-yuan-jiang.jpg ../photos/scarf-penglai-mist.jpg --box 0,900,1920,2820 --tint 206,214,208 --border 60,78,80
