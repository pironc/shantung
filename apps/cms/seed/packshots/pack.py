"""Studio packshot: cut the subject out (Vision), centre it on one flat background with a soft shadow, 4:5 JPEG.
usage: pack.py SRC OUT [--crop x0,y0,x1,y1 (fractions of SRC)] [--fit 0.72] [--rotate DEG] [--dy 0]"""
import argparse, os, subprocess, tempfile
from PIL import Image, ImageFilter

BG = (0xF4, 0xF4, 0xF4)  # --ds-color-neutral-light-2
W, H = 1200, 1500        # 4:5, the Photo ratio the app uses (125)
HERE = os.path.dirname(os.path.abspath(__file__))


def cutout(im):
    """The photo's subject on transparency, edge pulled in a pixel and softened so no halo of the old ground survives."""
    tool = os.path.join(HERE, 'mask')  # built once from mask.swift (macOS 14+, Vision), kept out of git
    if not os.path.exists(tool):
        subprocess.run(['xcrun', 'swiftc', '-O', os.path.join(HERE, 'mask.swift'), '-o', tool], check=True)
    with tempfile.TemporaryDirectory() as t:
        src, mpath = os.path.join(t, 's.png'), os.path.join(t, 'm.png')
        im.save(src)
        subprocess.run([tool, src, mpath], check=True, capture_output=True)
        mask = Image.open(mpath).convert('L').resize(im.size)
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    sub = im.convert('RGBA'); sub.putalpha(mask)
    return sub


def trim(sub):
    return sub.crop(sub.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox())


def place(sub, fit=0.72, dy=0.0):
    """Centre a cut-out on the studio ground with an ambient and a contact shadow."""
    sub = trim(sub)
    s = min(W * fit / sub.width, H * fit / sub.height)
    sub = sub.resize((round(sub.width * s), round(sub.height * s)), Image.LANCZOS)
    x, y = (W - sub.width) // 2, round((H - sub.height) / 2 + dy * H)
    canvas = Image.new('RGB', (W, H), BG)
    alpha = sub.getchannel('A')
    for blur, off, strength in ((28, 18, 0.20), (6, 4, 0.16)):
        sh = Image.new('L', (W, H), 0); sh.paste(alpha, (x, y + off))
        sh = sh.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * strength))
        canvas = Image.composite(Image.new('RGB', (W, H), (60, 55, 50)), canvas, sh)
    canvas.paste(sub, (x, y), alpha)
    return canvas


def save(canvas, out):
    canvas.save(out, 'JPEG', quality=86, optimize=True, progressive=True)
    print(out, os.path.getsize(out) // 1024, 'KB')


def crop_fraction(im, box):
    x0, y0, x1, y1 = map(float, box.split(','))
    return im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--crop'); ap.add_argument('--fit', type=float, default=0.72)
    ap.add_argument('--rotate', type=float, default=0); ap.add_argument('--dy', type=float, default=0)
    a = ap.parse_args()
    im = Image.open(a.src).convert('RGB')
    if a.crop:
        im = crop_fraction(im, a.crop)
    sub = cutout(im)
    if a.rotate:
        sub = sub.rotate(a.rotate, resample=Image.BICUBIC, expand=True)
    save(place(sub, a.fit, a.dy), a.out)
