from PIL import Image, ImageFont, ImageDraw
from pathlib import Path

BLANK = Path("./img/template_blank.png")

# https://fonts.google.com/noto/specimen/Noto+Sans+JP

FONT = ImageFont.truetype("./NotoSansJP-Medium.otf", size=22)

CONTENTS = ["メインストーリー", "イベントクエスト", "コロシアム", "心深圏", "キャラストーリー", "ガチャ(召喚)", "共襲", "星間の塔"]


def main():
    with Image.open(BLANK) as im:
        draw = ImageDraw.Draw(im)
        top = 436
        pos = [900, top]
        color = (0xB7, 0xC0, 0xE7)
        for i, txt in enumerate(CONTENTS):
            draw.text(tuple(pos), txt, font=FONT, fill=color)
            if i == 3:
                pos[1] = top
                pos[0] += 250
            else:
                pos[1] += 34
        im.save("template_new.png")


if __name__ == "__main__":
    main()
