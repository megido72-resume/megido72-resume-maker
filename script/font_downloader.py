# Download subset of ZenKurenaido.woff2 -> https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap&text=%E4%BD%9C%E6%88%90%E6%97%A5%3A%2F0123456789

from bs4 import BeautifulSoup
from subprocess import run
from shutil import copyfileobj
from urllib.parse import urlparse
import re
import requests

# show log of requests
# import logging
# logging.basicConfig(level=logging.DEBUG)

PATTERN = re.compile(r"^ *src: url\((.*?)\) format\('woff2'\);")

BASE = (
    run("git rev-parse --show-toplevel".split(" "), capture_output=True, check=True)
    .stdout.decode("utf-8")
    .rstrip()
)

FONT_PATH = f"{BASE}/deploy/img/Kosugi-Maru-Subset.woff2"


def download_font(font_url: str):
    res = requests.get(font_url, stream=True)
    with open(FONT_PATH, "wb") as fout:
        copyfileobj(res.raw, fout)


def main():
    chars = set("0123456789")
    with open(f"{BASE}/data/megido_eng.csv", encoding="utf-8") as f:
        for line in f:
            jp, _ = line.split(",")
            for c in jp:
                chars.add(c)
    with open(f"{BASE}/index.html", encoding="utf-8") as f:
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
