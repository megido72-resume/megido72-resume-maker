from PIL import Image
from pathlib import Path


from utils import git_root

BASE = git_root()
CHAR_DIR = BASE / "deploy" / "character"
OUT_DIR = BASE / "deploy" / "thumbnail"
BACKGROUND = BASE / "deploy" / "character" / "character_bg.jpg"

def src_is_newer(src: Path, target: Path) -> bool:
    if not target.exists():
        return True
    if not src.exists():
        return False
    src_mtime = src.stat().st_mtime
    target_mtime = target.stat().st_mtime
    return src_mtime > target_mtime

def gen_thumbnail(bg: Image.Image, fn: Path) -> bool:
    target_webp = OUT_DIR / f"{fn.stem}.webp"
    target_jpg = OUT_DIR / f"{fn.stem}.jpg"
    do_webp = src_is_newer(fn, target_webp)
    do_jpg = src_is_newer(fn, target_jpg)
    if not do_webp and not do_jpg:
        return False
    im = Image.new("RGB", (537, 537))
    im.paste(bg)
    with Image.open(fn) as fg:
        fg = fg.resize((520, 520))
        im.paste(fg, (15, 15), fg)
        if do_webp:
            im.save(target_webp, quality=95)
        if do_jpg:
            im.save(target_jpg, quality=90)
        print(f"SUCCESS: {fn}")
    return True

def main():
    with Image.open(BACKGROUND) as bg:
        bg = bg.resize((537, 537))
        skip = 0
        for fn in CHAR_DIR.glob("*.png"):
            skip += 0 if gen_thumbnail(bg, fn) else 1
        print(f"DONE: skipped {skip} images which already has thumbnail")


if __name__ == "__main__":
    main()
