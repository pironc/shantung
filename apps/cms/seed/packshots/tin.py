"""A Shantung tea tin, rendered: lacquered cylinder, paper label wrapped around it, soft studio light, 4:5 packshot.
Writes the three tea tins into ../photos. Needs numpy, Pillow and fontTools; run `pnpm install` first for the font."""
import io, pathlib, numpy as np
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = pathlib.Path(__file__).resolve().parent
FONTS = HERE.parents[3] / 'node_modules/@fontsource/cormorant-garamond/files'
BG = np.array([0xF4, 0xF4, 0xF4], float)      # --ds-color-neutral-light-2
RED, INK, PAPER = (0x93, 0x2B, 0x1E), (0x24, 0x24, 0x24), (0xF3, 0xEE, 0xE5)
S = 2                                          # supersampling
W, H = 1200 * S, 1500 * S
L = np.array([-0.55, 0.35, 0.76]); L /= np.linalg.norm(L)
Hv = L + [0, 0, 1]; Hv /= np.linalg.norm(Hv)

_fonts = {}
def font(size, weight=500):
    """Cormorant Garamond with its lining figures made the default (Pillow without raqm can't turn on `lnum`)."""
    if weight not in _fonts:
        f = TTFont(FONTS / f'cormorant-garamond-latin-{weight}-normal.woff'); g = f['GSUB'].table; sub = {}
        for fr in g.FeatureList.FeatureRecord:
            if fr.FeatureTag == 'lnum':
                for i in fr.Feature.LookupListIndex:
                    for st in g.LookupList.Lookup[i].SubTable:
                        sub.update(getattr(getattr(st, 'ExtSubTable', st), 'mapping', {}))
        for t in f['cmap'].tables:
            t.cmap.update({cp: sub[n] for cp, n in t.cmap.items() if n in sub})
        f.flavor = None; buf = io.BytesIO(); f.save(buf); _fonts[weight] = buf.getvalue()
    return ImageFont.truetype(io.BytesIO(_fonts[weight]), size)

def seal(px):
    """The Shantung seal: red square, white 山 (same geometry as assets/logo.svg, 96-unit box)."""
    im = Image.new('RGB', (96 * 4, 96 * 4), RED); d = ImageDraw.Draw(im)
    for x, y, w, h in [(44.5, 19, 7, 58), (22, 43, 7, 34), (67, 38, 7, 39), (22, 70, 52, 7)]:
        d.rectangle([x * 4, y * 4, (x + w) * 4, (y + h) * 4], fill=PAPER)
    return im.resize((px, px), Image.LANCZOS)

def label(wt, ht, name, line, band):
    """The label as a flat strip; its centre faces the camera."""
    im = Image.new('RGB', (wt, ht), PAPER); d = ImageDraw.Draw(im); cx = wt // 2
    def text(y, s, f, fill, track=0.0):
        chars = list(s); widths = [d.textlength(c, font=f) for c in chars]
        total = sum(widths) + track * f.size * (len(chars) - 1); x = cx - total / 2
        for c, w in zip(chars, widths):
            d.text((x, y), c, font=f, fill=fill); x += w + track * f.size
    sz = int(ht * 0.20); im.paste(seal(sz), (cx - sz // 2, int(ht * 0.09)))
    text(ht * 0.34, 'SHANTUNG', font(int(ht * 0.105), 600), INK, 0.32)
    d.line([cx - ht * 0.16, ht * 0.505, cx + ht * 0.16, ht * 0.505], fill=RED, width=max(1, int(ht * 0.006)))
    text(ht * 0.55, name, font(int(ht * 0.075), 600), RED, 0.16)
    text(ht * 0.67, line, font(int(ht * 0.055), 500), INK, 0.2)
    d.rectangle([0, int(ht * 0.86), wt, int(ht * 0.90)], fill=band)  # the tea's own colour
    return np.asarray(im, float)

def shade(base, u, gloss):
    u = np.clip(np.nan_to_num(u), -1, 1)
    n = np.stack([u, np.zeros_like(u), np.sqrt(1 - u * u)], -1)
    diff = np.clip((n * L).sum(-1), 0, 1); spec = np.clip((n * Hv).sum(-1), 0, 1)
    c = base * (0.34 + 0.80 * diff)[..., None]
    return c + 255 * (gloss * spec ** 70 + gloss * 0.22 * spec ** 6)[..., None]

def render(name, line, band, body=RED, height=0.40, out='tin.jpg'):
    img = np.tile(BG, (H, W, 1))
    r = int(W * 0.235); e = int(r * 0.24); cx = W // 2
    bh = int(H * height); lid = int(bh * 0.2)
    top = (H - bh) // 2 + int(H * 0.02); bot = top + bh
    yy, xx = np.mgrid[0:H, 0:W].astype(float)

    # Shadow on the floor: tight contact plus a wide soft one, lit from the upper left.
    sh = Image.new('L', (W, H), 0); d = ImageDraw.Draw(sh)
    d.ellipse([cx - r * 1.0 + r * 0.12, bot - e * 0.9, cx + r * 1.15 + r * 0.12, bot + e * 1.25], fill=150)
    soft = np.asarray(sh.filter(ImageFilter.GaussianBlur(r * 0.22)), float) / 255
    sh2 = Image.new('L', (W, H), 0); ImageDraw.Draw(sh2).ellipse([cx - r * 0.98, bot - e * 0.95, cx + r * 0.98, bot + e * 1.02], fill=255)
    tight = np.asarray(sh2.filter(ImageFilter.GaussianBlur(r * 0.035)), float) / 255
    img *= (1 - 0.32 * soft - 0.30 * tight)[..., None]

    def side(rad, y0, y1, colour, gloss, tex=None, tex_y=None):
        u = (xx - cx) / rad; inside = np.abs(u) < 1
        arc = e * (rad / r) * np.sqrt(np.clip(1 - u * u, 0, 1))
        m = inside & (yy >= y0 + arc) & (yy < y1 + arc)
        base = np.broadcast_to(np.array(colour, float), (H, W, 3)).copy()
        if tex is not None:
            th = np.arcsin(np.clip(u, -1, 1)); tw = tex.shape[1]
            tx = np.clip((tw / 2 + th * rad).astype(int), 0, tw - 1)
            ty = np.clip(((yy - y0 - arc) / (y1 - y0) * tex.shape[0]).astype(int), 0, tex.shape[0] - 1)
            base = tex[ty, tx]
        c = shade(base, u, gloss)
        img[m] = c[m]
        return m, arc

    # Body, the label on it, the shadow of the lid's lip, then the lid and its top.
    side(r, top + lid, bot, body, 0.55)
    lh0, lh1 = top + lid + bh * 0.07, bot - bh * 0.07
    tex = label(int(2 * np.pi * r), int(lh1 - lh0), name, line, band)
    side(r * 1.002, lh0, lh1, PAPER, 0.05, tex)
    u = (xx - cx) / r; arc = e * np.sqrt(np.clip(1 - u * u, 0, 1))
    lip = (np.abs(u) < 1) & (yy >= top + lid + arc) & (yy < top + lid + arc + bh * 0.03)
    k = 1 - 0.45 * (1 - (yy - top - lid - arc) / (bh * 0.03))
    img[lip] *= k[lip][..., None]
    rl = r * 1.025
    side(rl, top, top + lid, body, 0.6)
    # Lid top: an ellipse lit from the back left, with a pressed ring.
    tu, tv = (xx - cx) / rl, (yy - top) / (e * rl / r)
    m = tu * tu + tv * tv <= 1
    lit = 0.62 + 0.30 * np.clip(-0.6 * tu - 0.8 * tv, -1, 1)
    c = np.array(body, float) * lit[..., None] + 255 * 0.10 * np.exp(-((tu + 0.35) ** 2 + (tv + 0.3) ** 2) * 6)[..., None]
    img[m] = c[m]
    ring = np.abs(np.sqrt(tu * tu + tv * tv) - 0.86) < 0.012
    img[ring] *= 0.82

    img += np.random.default_rng(7).normal(0, 1.4, img.shape)  # a little grain, so it never looks flat
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((W // S, H // S), Image.LANCZOS) \
        .save(out, 'JPEG', quality=88, optimize=True, progressive=True)
    print(out)

if __name__ == '__main__':
    out = HERE.parent / 'photos'
    render('SPRING GREEN', 'LAOSHAN GREEN TEA  ·  100 G', (0x8F, 0xB3, 0x9A), out=out / 'tin-laoshan-spring.jpg')
    render('SEA MIST', 'LAOSHAN FIRST FLUSH  ·  100 G', (0x8C, 0xA3, 0xB5), out=out / 'tin-laoshan-mist.jpg')
    render('TAIQING RESERVE', 'HAND ROLLED  ·  50 G', (0xB8, 0x95, 0x4A), body=INK, height=0.30, out=out / 'tin-taiqing.jpg')
