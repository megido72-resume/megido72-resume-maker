"Download subset of font from google fonts"

from bs4 import BeautifulSoup
from shutil import copyfileobj
import re
import requests
from utils import git_root

# show log of requests
# import logging
# logging.basicConfig(level=logging.DEBUG)

PATTERN = re.compile(r"^ *src: url\((.*?)\) format\('woff2'\);")

BASE = git_root()

FONT_PATH = BASE / "deploy" / "img" / "Kosugi-Maru-Subset.woff2"


def download_font(font_url: str):
    res = requests.get(font_url, stream=True)
    with FONT_PATH.open("wb") as fout:
        copyfileobj(res.raw, fout)


def main():
    chars = set("0123456789")
    with (BASE / "data" / "megido_eng.csv").open() as f:
        for line in f:
            jp, _ = line.split(",")
            for c in jp:
                chars.add(c)
    with (BASE / "index.html").open() as f:
        soup = BeautifulSoup(f, features="html5lib")
    # TODO: this downloads all the chars in <option> tag. However some chars are not needed. e.g. '<select class="form-select" id="megidral_pos">'
    for item in soup.find_all("option"):
        for c in item.text:
            chars.add(c)
    text = "".join(sorted(chars))
    url = "https://fonts.googleapis.com/css2"
    params = {
        "family": "Kosugi Maru",
        "display": "swap",
        "text": text,
    }
    # to download as woff2, we have to set user agent, otherwise it returns ttf file
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
    }
    res = requests.get(url, params=params, headers=headers)
    font_url = None
    for line in res.text.splitlines():
        if m := PATTERN.match(line):
            font_url = m.group(1)
    if not font_url:
        raise Exception(f"cannot find font url in: {res.text}")
    download_font(font_url)
    print(f"Successfully saved to: {FONT_PATH}")


if __name__ == "__main__":
    main()
