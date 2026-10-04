"""Generate web-sized JPEG derivatives from the original photos.

Originals in assets/photos/ are never modified. Run from the repo root:
    python3 tools/make_derivatives.py
"""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("assets/photos")
OUT = Path("assets/web")
WIDTHS = [800, 1600]  # 1600 is capped at the original width

# Optional tighter 4:5 crops for the studio shots on white, used on dark stages.
# (center_x, center_y, fraction_of_shorter_fit)
STAGE_CROPS = {
    "One-Thirty_New_York0539.jpg": (0.503, 0.503, 0.62),
    "Capture_One_Catalog0006_07f31f3d-f59c-4f2c-b5cc-4638f0a9559e.jpg": (0.50, 0.54, 0.82),
    "Capture_One_Catalog0004.jpg": (0.50, 0.54, 0.82),
    "Capture_One_Catalog0009.jpg": (0.50, 0.50, 1.0),
}


def save(im, path, width):
    if im.width > width:
        h = round(im.height * width / im.width)
        im = im.resize((width, h), Image.LANCZOS)
    im.save(path, "JPEG", quality=82, optimize=True, progressive=True)
    return im.size


def crop_45(im, cx, cy, frac):
    # Largest 4:5 box that fits, scaled by frac, centered on (cx, cy).
    w, h = im.size
    bw = min(w, h * 4 / 5) * frac
    bh = bw * 5 / 4
    left = min(max(cx * w - bw / 2, 0), w - bw)
    top = min(max(cy * h - bh / 2, 0), h - bh)
    return im.crop((round(left), round(top), round(left + bw), round(top + bh)))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for src in sorted(SRC.iterdir()):
        if src.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        stem = src.stem
        for w in WIDTHS:
            size = save(im, OUT / f"{stem}-{w}.jpg", w)
            print(OUT / f"{stem}-{w}.jpg", size)
        if src.name in STAGE_CROPS:
            c = crop_45(im, *STAGE_CROPS[src.name])
            for w in [800, 1600]:
                size = save(c, OUT / f"{stem}-stage-{w}.jpg", w)
                print(OUT / f"{stem}-stage-{w}.jpg", size)


if __name__ == "__main__":
    main()
