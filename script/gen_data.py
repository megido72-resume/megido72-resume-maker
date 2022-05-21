import re
import requests
import json
from collections import defaultdict
from dataclasses import dataclass, asdict
from bs4 import BeautifulSoup, Tag

PAGE_MAX = 30

PAT_NUM = re.compile(r"(\d+)_03.png")

# pattern for regenerated megido
PAT_RE_NAME = re.compile("(.*)（.*）")

URL_PREFIX = "https://megido72-portal.com"


@dataclass
class Megido:
    name: str
    num: str
    n: str
    re_n: str | None


def parse_item(items: dict[str, Megido], item: Tag):
    name = item.select(".title")[0].text
    num = item.select(".detail")[0].text
    img_url = item.select(".card > img")[0]["data-original"]
    assert isinstance(img_url, str)
    m = PAT_NUM.search(img_url)
    img_url = re.sub("/character_s/", "/character/", img_url)
    print(f"{URL_PREFIX}/{img_url}")
    if m:
        img_num = m.group(1)
    else:
        raise Exception(img_url + " does not match PAT_NUM")
    m = PAT_RE_NAME.match(name)
    if m:
        name = m.group(1)
        items[name].re_n = img_num
    else:
        items[name].n = img_num
    items[name].num = num
    items[name].name = name


def main():
    items = defaultdict(lambda: Megido("", "", "", None))
    for i in range(PAGE_MAX):
        url = f"{URL_PREFIX}/megido?page={i+1}&sort=&q="
        res = requests.get(url)
        soup = BeautifulSoup(res.text, features="html5lib")
        found = False
        for item in soup.select(".characters > li"):
            found = True
            parse_item(items, item)
        if not found:
            break
    lst = []
    lst = [asdict(y[1]) for y in sorted(items.items(), key=lambda x: x[1].num)]
    with open("./megido_list.json", "w") as f:
        json.dump({"list": lst}, f)


if __name__ == "__main__":
    main()
