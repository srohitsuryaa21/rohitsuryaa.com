"""Builds the rs© logo as outlined SVG paths (no font needed wherever it is used).

Letters: Manrope at weight 800, the same face as the site headings, with the site's tight tracking.
Output goes to ../../brand/ ; run from anywhere:  python scripts/brand/make-logo.py
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parents[2]
FONT = ROOT / 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'
OUT = ROOT / 'brand'
OUT.mkdir(exist_ok=True)

INK, PAPER, ACCENT, BLUE = '#0d0d0c', '#ece8df', '#ff4d1f', '#5b9bff'

font = instantiateVariableFont(TTFont(FONT), {'wght': 800})
cmap = font.getBestCmap()
gs = font.getGlyphSet()
upm = font['head'].unitsPerEm


def glyph(ch):
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[name].draw(pen)
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    return pen.getCommands(), gs[name].width, bp.bounds


# Lay out "rs" with -0.06em tracking, then a smaller © tucked top-right like a superscript.
track = -0.06 * upm
parts, x = [], 0.0
for ch in 'rs':
    d, adv, _ = glyph(ch)
    parts.append((d, x, 0.0, 1.0))
    x += adv + track
copy_d, copy_adv, _ = glyph('©')
cs = 0.42                                  # © scale
x_height = font['OS/2'].sxHeight
parts.append((copy_d, x + 0.02 * upm, x_height - 0.05 * upm, cs))  # baseline of © raised near x-height

# bounds of the whole mark from the real glyph outlines (font units, y up), plus a small safety margin
def part_bounds(ch, dx, dy, sc):
    _, _, (x0, y0, x1, y1) = glyph(ch)
    return dx + x0 * sc, dy + y0 * sc, dx + x1 * sc, dy + y1 * sc

boxes = [part_bounds(ch, dx, dy, sc) for ch, (_, dx, dy, sc) in zip('rs©', parts)]
margin = 0.02 * upm
xmin = min(bx[0] for bx in boxes) - margin
ymin = min(bx[1] for bx in boxes) - margin
xmax = max(bx[2] for bx in boxes) + margin
ymax = max(bx[3] for bx in boxes) + margin


def mark_group(fill_letters, fill_copy, fill_s=None):
    """<g> of the mark, in font units with y flipped, origin at (xmin, ymax). parts are r, s, ©."""
    fills = [fill_letters, fill_s or fill_letters, fill_copy]
    out = []
    for i, (d, dx, dy, sc) in enumerate(parts):
        fill = fills[i]
        out.append(f'<path fill="{fill}" transform="translate({dx - xmin:.1f} {ymax - dy:.1f}) scale({sc} {-sc})" d="{d}"/>')
    return '\n  '.join(out)


mw, mh = xmax - xmin, ymax - ymin


def write_mark(name, fill_letters, fill_copy, fill_s=None):
    """Tight mark with transparent background."""
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {mw:.0f} {mh:.0f}">\n  {mark_group(fill_letters, fill_copy, fill_s)}\n</svg>\n'
    (OUT / name).write_text(svg, encoding='utf8')


def write_tile(name, bg, fill_letters, fill_copy, size=1024, pad=0.2, radius=0, fill_s=None):
    """Square tile with the mark centred, for avatars and social icons."""
    inner = size * (1 - 2 * pad)
    s = inner / mw
    tx = (size - mw * s) / 2
    ty = (size - mh * s) / 2
    rect = f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>' if bg else ''
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">\n  {rect}\n'
           f'  <g transform="translate({tx:.1f} {ty:.1f}) scale({s:.5f})">\n  {mark_group(fill_letters, fill_copy, fill_s)}\n  </g>\n</svg>\n')
    (OUT / name).write_text(svg, encoding='utf8')
    return svg


write_mark('rs-mark-light.svg', PAPER, ACCENT)      # for dark backgrounds
write_mark('rs-mark-blue.svg', '#eef3ff', BLUE)     # for the blue cover
write_mark('rs-mark-dark.svg', INK, ACCENT)         # for light backgrounds
write_mark('rs-mark-mono-black.svg', INK, INK)
write_mark('rs-mark-mono-white.svg', '#ffffff', '#ffffff')
write_tile('rs-tile-ink.svg', INK, PAPER, ACCENT)
write_tile('rs-tile-paper.svg', PAPER, INK, ACCENT)
write_tile('rs-tile-accent.svg', ACCENT, INK, INK)
fav = write_tile('favicon.svg', INK, PAPER, ACCENT, size=64, pad=0.16, radius=14)
(ROOT / 'public/favicon.svg').write_text(fav, encoding='utf8')
print('wrote', sorted(p.name for p in OUT.glob('*.svg')))
