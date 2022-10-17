
import json
import requests
from shutil import copyfileobj
from utils import git_root

BASE = git_root()

LIST_NEW = BASE / "deploy" / "data" / "megido_list_new.json"

IMG_BASE = BASE / "deploy" / "character"

def download(n: str, url: str) -> bool:
    target = IMG_BASE / f"{n}.png"
    if target.exists():
        return False
    with (target.open("wb") as fout,
          requests.get(url, stream=True) as res
          ):
        copyfileobj(res.raw, fout)
    print(f"DOWNLOAD: {url} -> {target}")
    return True

def main():
    with LIST_NEW.open() as fin:
        data = json.load(fin)
    skip = 0
    for item in data["list"]:
        num = item["n"]
        url = item["img"]
        if num and url:
            skip += 0 if download(num, url) else 1
        num = item["re_n"]
        url = item["re_img"]
        if num and url:
            skip += 0 if download(num, url) else 1
    print(f"DONE: skipped {skip} image which already exists")
if __name__ == "__main__":
    main()
