"""A silk square folded in four, top-down on the studio ground: a corner of the design on top, the folded edges of the
layers beneath showing on two sides, a rolled hem, a silk sheen. Same ground, size and shadow as pack.py.
usage: scarf.py SRC OUT --box x0,y0,x1,y1 (pixels: a square of the design, its corner at the top left) [--turn DEG]
       [--clone x0,y0,x1,y1,dx,dy ...] (cover a mark in the source with the patch dx,dy pixels away)
       [--tint R,G,B] (re-dye the ground: the source's median colour becomes this, ink stays ink)
       [--border R,G,B] (print a band and a hairline along the two hemmed sides, so a painting reads as a carre)"""
import argparse
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

BG = (0xF4, 0xF4, 0xF4)  # --ds-color-neutral-light-2
W, H = 1200, 1500
S = 2                    # supersampling

def smooth_noise(n, scale, seed):
    """Low-frequency noise in [-1, 1]: tiny random grid, upsampled smoothly."""
    g = np.random.default_rng(seed).uniform(-1, 1, (scale, scale)).astype(np.float32)
    return np.asarray(Image.fromarray(g).resize((n, n), Image.BICUBIC))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--box', required=True); ap.add_argument('--turn', type=float, default=0)
    ap.add_argument('--clone', action='append', default=[])
    ap.add_argument('--tint'); ap.add_argument('--border')
    a = ap.parse_args()
    x0, y0, x1, y1 = map(int, a.box.split(','))
    side = int(W * 0.64) * S
    src = Image.open(a.src).convert('RGB')
    for c in a.clone:
        cx0, cy0, cx1, cy1, dx, dy = map(int, c.split(','))
        patch = src.crop((cx0 + dx, cy0 + dy, cx1 + dx, cy1 + dy))
        m = Image.new('L', patch.size, 0); ImageDraw.Draw(m).rectangle([3, 3, patch.width - 4, patch.height - 4], fill=255)
        src.paste(patch, (cx0, cy0), m.filter(ImageFilter.GaussianBlur(2)))
    top = src.crop((x0, y0, x1, y1)).resize((side, side), Image.LANCZOS)
    t = np.asarray(top, np.float32)
    if a.tint:
        target = np.array(list(map(float, a.tint.split(','))), np.float32)
        w = np.array([0.299, 0.587, 0.114], np.float32)
        ground = np.median(t.reshape(-1, 3), 0)
        lum = (t * w).sum(-1, keepdims=True) / max(float((ground * w).sum()), 1)
        cast = ground - ground.mean()                                    # the old silk's yellowing
        sat = t - t.mean(-1, keepdims=True) - cast                       # the painting's own colours, without it
        t = np.clip(target * np.clip(lum, 0, 1.08) + 0.5 * sat, 0, 255)
    if a.border:
        col = np.array(list(map(float, a.border.split(','))), np.float32)
        b, line, gap = int(side * 0.045), max(2, side // 500), int(side * 0.012)
        t[:b, :] = col; t[:, :b] = col
        t[b + gap:b + gap + line, b + gap:] = col; t[b + gap:, b + gap:b + gap + line] = col
    top = Image.fromarray(t.astype(np.uint8))

    # Silk: light from the top left, a broad soft sheen across the diagonal, a faint weave of shade.
    yy, xx = np.mgrid[0:side, 0:side].astype(np.float32) / side
    diag = (xx + yy) / 2
    light = 1.05 - 0.10 * diag + 0.05 * np.exp(-((diag - 0.38) / 0.16) ** 2) + 0.02 * smooth_noise(side, 6, 1)
    t = t * light[..., None]
    # Folded edges (right, bottom) curl under: a highlight on the curve, then shade.
    e = 0.035 * side
    for d in (side - 1 - xx * side, side - 1 - yy * side):
        k = np.clip(d / e, 0, 1)
        t = t * (0.80 + 0.20 * k)[..., None] + (14 * np.exp(-((d - e * 0.45) / (e * 0.3)) ** 2))[..., None]
    # Rolled hem (left, top): a thin darker roll.
    for d in (xx * side, yy * side):
        t = t * (1 - 0.28 * np.exp(-(d / (0.006 * side)) ** 2))[..., None]
    t = np.clip(t, 0, 255)

    layer = Image.fromarray(t.astype(np.uint8)).convert('RGBA')
    # Layers beneath: a few pixels of fold showing on the folded sides, darker as they go down.
    stack = Image.new('RGBA', (side + 14 * S, side + 14 * S), (0, 0, 0, 0))
    edge = np.asarray(top, np.float32)
    for i, (off, dark) in enumerate(((10 * S, 0.70), (5 * S, 0.82))):
        under = Image.fromarray(np.clip(edge * dark, 0, 255).astype(np.uint8)).convert('RGBA')
        stack.alpha_composite(under, (off, off))
    stack.alpha_composite(layer, (0, 0))
    # A fabric that lies flat but not machined: a few pixels of gentle wobble along every edge.
    n = stack.width
    dx = smooth_noise(n, 5, 2) * 3 * S; dy = smooth_noise(n, 5, 3) * 3 * S
    gy, gx = np.mgrid[0:n, 0:n].astype(np.float32)
    arr = np.asarray(stack)
    sx = np.clip((gx + dx).round().astype(int), 0, n - 1); sy = np.clip((gy + dy).round().astype(int), 0, n - 1)
    stack = Image.fromarray(arr[sy, sx])
    if a.turn:
        stack = stack.rotate(a.turn, resample=Image.BICUBIC, expand=True)

    canvas = Image.new('RGB', (W * S, H * S), BG)
    x, y = (W * S - stack.width) // 2, (H * S - stack.height) // 2
    alpha = stack.getchannel('A')
    for blur, off, strength in ((26 * S, 14 * S, 0.18), (4 * S, 2 * S, 0.22)):
        sh = Image.new('L', canvas.size, 0); sh.paste(alpha, (x, y + off))
        sh = sh.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * strength))
        canvas = Image.composite(Image.new('RGB', canvas.size, (60, 55, 50)), canvas, sh)
    canvas.paste(stack, (x, y), alpha)
    g = np.asarray(canvas, np.float32) + np.random.default_rng(7).normal(0, 1.2, (H * S, W * S, 3))
    Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).resize((W, H), Image.LANCZOS) \
        .save(a.out, 'JPEG', quality=88, optimize=True, progressive=True)
    print(a.out)

main()
