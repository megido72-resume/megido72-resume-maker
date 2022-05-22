from PIL import Image
from pathlib import Path

CHAR_DIR = Path("./deploy/character")
OUT_DIR = Path("./deploy/thumbnail")
BACKGROUND = Path("./deploy/character/character_bg.jpg")


def main():
    with Image.open(BACKGROUND) as bg:
        bg = bg.resize((537, 537))
        for fn in CHAR_DIR.glob("*.png"):
            im = Image.new("RGB", (537, 537))
            im.paste(bg)
            with Image.open(fn) as fg:
                fg = fg.resize((520, 520))
                im.paste(fg, (15, 15), fg)
                target = OUT_DIR / f"{fn.stem}.webp"
                im.save(target, quality=95)
                target = OUT_DIR / f"{fn.stem}.jpg"
                im.save(target, quality=90)
                print(fn)


if __name__ == "__main__":
    main()
