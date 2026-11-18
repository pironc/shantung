"""A tie folded for the box: the blade from its tip up, stood upright, cut straight and turned under at the top.
usage: tie.py SRC OUT [--crop x0,y0,x1,y1 (fractions)] [--keep 0.6 (share of the visible tie kept, from the tip)]
              [--fit 0.74] [--skin raw-silk] [--motif SRC --motif-box x0,y0,x1,y1 --motif-at 0.5,0.7 --motif-width 0.55]
--skin re-clothes the tie in another fabric while keeping its shape and its light; --motif adds embroidery from SRC."""
import argparse
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from pack import cutout, place, save, crop_fraction, trim


def upright(sub):
    """Turn the tie so it hangs straight down, its wide blade end (the tip) at the bottom."""
    a = np.asarray(sub.getchannel('A')) > 128
    ys, xs = np.nonzero(a)
    vals, vecs = np.linalg.eigh(np.cov(np.stack([xs, ys]).astype(float)))
    vx, vy = vecs[:, -1]
    th = np.degrees(np.arctan2(vx, vy))
    sub = min((trim(sub.rotate(t, resample=Image.BICUBIC, expand=True)) for t in (th, -th)), key=lambda s: s.width)
    # The cut end is full width right at its edge; the tip narrows to a point.
    widths = (np.asarray(sub.getchannel('A')) > 128).sum(1); k = max(3, len(widths) // 40)
    if widths[:k].mean() < widths[-k:].mean():
        sub = sub.rotate(180)
    return sub


def fold(sub, keep):
    """Keep the bottom `keep` of the tie, cut straight across, and turn the cut edge under like a folded blade."""
    sub = trim(sub.crop((0, int(sub.height * (1 - keep)), sub.width, sub.height)))
    w, h = sub.size
    a = np.asarray(sub.getchannel('A'), np.float32)
    top = np.where(a.max(1) > 128)[0][0]
    row = np.nonzero(a[top + 2] > 128)[0]; x0, x1 = row[0], row[-1]; tw = x1 - x0
    r = tw * 0.22
    corner = Image.new('L', (w, h), 255)
    ImageDraw.Draw(corner).rectangle([0, 0, w, top + r], fill=0)
    ImageDraw.Draw(corner).rounded_rectangle([x0, top, x1, top + 3 * r], radius=r, fill=255)
    a = np.minimum(a, np.asarray(corner.filter(ImageFilter.GaussianBlur(1.2)), np.float32))
    rgb = np.asarray(sub.convert('RGB'), np.float32)
    d = (np.arange(h, dtype=np.float32) - top)[:, None] / (tw * 0.16)
    # Dark where the cloth turns under, a highlight on the curve, then the blade's own light.
    light = 1 + 0.10 * np.exp(-((d - 0.5) / 0.35) ** 2) - 0.22 * np.exp(-(np.maximum(d, 0) / 0.18) ** 2)
    rgb = np.clip(rgb * light[..., None], 0, 255)
    out = Image.fromarray(rgb.astype(np.uint8)).convert('RGBA'); out.putalpha(Image.fromarray(a.astype(np.uint8)))
    return out


def raw_silk(w, h, seed=3):
    """Shantung: honey-gold silk with uneven slubs in the weft, cut on the bias like every tie."""
    rng = np.random.default_rng(seed)
    n = int(np.hypot(w, h)) + 4
    t = np.full((n, n), 1.0, np.float32)
    t *= (1 + rng.normal(0, 0.008, (n, 1))).astype(np.float32)          # one weft thread a row
    img = Image.new('L', (n, n), 128)                                    # 128 = no change; 8-bit so it can blur
    d = ImageDraw.Draw(img)
    for _ in range(int(n * n / 700)):                                   # the slubs: short thick nubs of thread
        x, y = rng.uniform(0, n, 2); ln = rng.uniform(6, 34); th = rng.uniform(1.5, 3.5)
        d.line([x, y, x + ln, y], fill=int(128 + 1000 * rng.choice([1, -0.6]) * rng.uniform(0.03, 0.07)), width=int(round(th)))
    t += (np.asarray(img.filter(ImageFilter.GaussianBlur(0.7)), np.float32) - 128) / 1000
    t += rng.normal(0, 0.012, (n, n)).astype(np.float32)                 # the warp's fine grain
    tex = Image.fromarray(t).rotate(45, resample=Image.BICUBIC)
    c = (n - w) // 2, (n - h) // 2
    t = np.asarray(tex.crop((c[0], c[1], c[0] + w, c[1] + h)), np.float32)
    base = np.array([0xC2, 0xA8, 0x7C], np.float32)                     # undyed Shantung, champagne gold
    return t[..., None] * base


def repp_stripe(w, h, seed=5):
    """Regimental repp: ink ground, a stone stripe edged with grey pinlines, fine ribs, all on the bias."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u = (xx + yy) / np.sqrt(2)                                          # across the stripes
    period = w * 0.62
    f = (u % period) / period
    ink, stone, grey = (np.array(c, np.float32) for c in ((0x1E, 0x1E, 0x22), (0xCF, 0xC2, 0xA8), (0x8F, 0x9A, 0xA4)))
    def band(c, half):
        return np.clip((half - np.abs(f - c)) * period / 1.2, 0, 1)[..., None]
    cloth = ink * np.ones((h, w, 1), np.float32)
    for c, half, col in ((0.5, 0.075, stone), (0.405, 0.012, grey), (0.595, 0.012, grey)):
        k = band(c, half); cloth = cloth * (1 - k) + col * k
    rib = 1 + 0.07 * np.sin(2 * np.pi * u / 3.4) + np.random.default_rng(seed).normal(0, 0.015, (h, w)).astype(np.float32)
    return cloth * rib[..., None]


def reskin(sub, motif=None, cloth=raw_silk, folds=0.6):
    """Same shape and light, other cloth: the tie's own luminance, smoothed, lights the new fabric."""
    rgb = np.asarray(sub.convert('RGB'), np.float32)
    lum = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
    a = np.asarray(sub.getchannel('A'), np.float32) / 255
    blur = lambda x, r: np.asarray(Image.fromarray(np.clip(x, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32)
    r = max(14, sub.width * 0.07)                                       # wider than the print's repeat
    lit = blur(lum * a, r) / np.maximum(blur(a * 255, r) / 255, 1e-3)    # the light, without the print
    lit = 1 + folds * (lit / np.median(lit[a > 0.5]) - 1)               # its folds, softened (plain cloth shows them more)
    cloth = cloth(*sub.size)
    if motif is not None:
        m, (mx, my) = motif
        cloth[my:my + m.shape[0], mx:mx + m.shape[1]] += m
    out = np.clip(cloth * np.clip(lit, 0.7, 1.12)[..., None], 0, 255)
    o = Image.fromarray(out.astype(np.uint8)).convert('RGBA'); o.putalpha(sub.getchannel('A'))
    return o


def embroidery(src, box, width_px):
    """The stitches of an embroidered motif, as relief to add to new cloth: brighter thread over its own ground.
    The box is the motif's square; only the circle inside it is kept."""
    im = Image.open(src).convert('RGB').crop(box)
    im = im.resize((width_px, round(width_px * im.height / im.width)), Image.LANCZOS)
    a = np.asarray(im, np.float32)
    ground = np.asarray(im.filter(ImageFilter.GaussianBlur(width_px * 0.08)), np.float32)
    relief = np.clip((a - ground) * 1.3, -10, 110)                      # the raised thread, not its old ground
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]].astype(np.float32)
    fade = np.clip((1 - np.hypot((xx / a.shape[1] - 0.5) * 2, (yy / a.shape[0] - 0.5) * 2)) / 0.12, 0, 1)
    return relief * fade[..., None] * np.array([1.0, 0.95, 0.75], np.float32)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--crop'); ap.add_argument('--keep', type=float, default=0.6); ap.add_argument('--fit', type=float, default=0.74)
    ap.add_argument('--skin', choices=['raw-silk', 'repp-stripe']); ap.add_argument('--mirror', action='store_true')
    ap.add_argument('--motif'); ap.add_argument('--motif-box'); ap.add_argument('--motif-at', default='0.5,0.72')
    ap.add_argument('--motif-width', type=float, default=0.55)
    a = ap.parse_args()
    im = Image.open(a.src).convert('RGB')
    if a.crop:
        im = crop_fraction(im, a.crop)
    tie = fold(upright(cutout(im)), a.keep)
    if a.mirror:
        tie = tie.transpose(Image.FLIP_LEFT_RIGHT)
    if a.skin:
        motif = None
        if a.motif:
            m = embroidery(a.motif, tuple(map(int, a.motif_box.split(','))), int(tie.width * a.motif_width))
            fx, fy = map(float, a.motif_at.split(','))
            row = np.nonzero(np.asarray(tie.getchannel('A'))[int(tie.height * fy)] > 128)[0]  # the blade at that height
            cx = row[0] + fx * (row[-1] - row[0])
            motif = (m, (int(cx - m.shape[1] / 2), int(tie.height * fy - m.shape[0] / 2)))
        cloth, folds = {'raw-silk': (raw_silk, 0.4), 'repp-stripe': (repp_stripe, 0.6)}[a.skin]
        tie = reskin(tie, motif, cloth, folds)
    save(place(tie, a.fit), a.out)
