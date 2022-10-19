"download megido list from portal site"
import re
import requests
import json
from collections import defaultdict
from dataclasses import dataclass, asdict
from bs4 import BeautifulSoup, Tag
from utils import git_root

BASE = git_root()

PAGE_MAX = 30

PAT_NUM = re.compile(r"(\d+)_03.png")

# pattern for regenerated megido
PAT_RE_NAME = re.compile("(.*)（.*）")

URL_PREFIX = "https://megido72-portal.com"

OUTPUT_PATH = BASE / "deploy" / "data" / "megido_list_new.json"

@dataclass
class Megido:
    name: str = ""
    num: str = ""
    n: str = ""
    re_n: str | None = None
    img: str | None = None
    re_img: str | None = None

def parse_item(items: dict[str, Megido], item: Tag):
    name = item.select(".title")[0].text
    num = item.select(".detail")[0].text
    thumb_path = item.select(".card > img")[0]["data-original"]
    assert isinstance(thumb_path, str)
    if m := PAT_NUM.search(thumb_path):
        img_num = m.group(1)
    else:
        raise Exception(thumb_path + " does not match PAT_NUM")
    img_path = re.sub("/character_s/", "/character/", thumb_path)
    img_url = URL_PREFIX + img_path

    if m := PAT_RE_NAME.match(name):
        name = m.group(1)
        items[name].re_n = img_num
        items[name].re_img = img_url
    else:
        items[name].n = img_num
        items[name].img = img_url
    items[name].num = num
    items[name].name = name


def main():
    items = defaultdict(Megido)
    for i in range(PAGE_MAX):
        url = f"{URL_PREFIX}/megido?page={i+1}&sort=&q="
        res = requests.get(url)
        soup = BeautifulSoup(res.text, features="html5lib")
        found = False
        print(f"GET: {url}")
        for item in soup.select(".characters > li"):
            found = True
            parse_item(items, item)
        if not found:
            break
    lst = [asdict(y[1]) for y in sorted(items.items(), key=lambda x: x[1].num)]
    with OUTPUT_PATH.open("w") as f:
        json.dump({"list": lst}, f)
        print(f"SAVED: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
