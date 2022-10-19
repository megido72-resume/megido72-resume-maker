"check diff of megido_list.json and megido_list_new.json"

from utils import git_root
from csv import DictReader
import sys
import json

BASE = git_root()

LIST_OLD = BASE / "deploy" / "data" / "megido_list.json"

LIST_NEW = BASE / "deploy" / "data" / "megido_list_new.json"

ENG_CSV = BASE / "data" / "megido_eng.csv"

IMG_BASE = BASE / "deploy" / "character"

THUMB_BASE = BASE / "deploy" / "thumbnail"

def load_eng():
    data = {}
    with ENG_CSV.open() as fin:
        reader = DictReader(fin, fieldnames=["ja", "en"])
        for item in reader:
            data[item["ja"]] = item["en"]
    return data

def main():
    with LIST_OLD.open() as fin:
        lst_old = json.load(fin)
    with LIST_NEW.open() as fin:
        lst_new = json.load(fin)
    dict_old = {}
    list_added = []
    for item in lst_old["list"]:
        if k := item["n"]:
            dict_old[k] = True
        if k := item["re_n"]:
            dict_old[k] = True
    for item in lst_new["list"]:
        k = item["n"]
        if k and (k not in dict_old):
            list_added.append((
                item["name"],item["img"], k, False
                    ))
        k = item["re_n"]
        if k and  (k not in dict_old):
            list_added.append((
                item["name"],item["re_img"], k, True
                ))
    eng = load_eng()
    not_in_eng = set()
    img_not_downloaded = []
    if not list_added:
        print("no new megido")
    thumb_not_created = []
    for i, (name, img, num, is_re) in enumerate(list_added):
        name_s = name if not is_re else name + " (Re)"
        name_en = eng.get(name)
        print(f"[{i+1}] {name_s} {name_en or 'NO_ENG'} {img}")
        if not name_en:
            not_in_eng.add(name)
        img = IMG_BASE / f"{num}.png"
        if not img.exists():
            img_not_downloaded.append(name_s)
        thumb_webp = THUMB_BASE / f"{num}.webp"
        thumb_jpg = THUMB_BASE / f"{num}.jpg"
        if not thumb_webp.exists() or not thumb_jpg.exists():
            thumb_not_created.append(name_s)
    exit_code = 0
    if not_in_eng:
        print(f"WARN: {not_in_eng} is not in megido_eng.csv")
        exit_code = 1
    if img_not_downloaded:
        print(f"WARN: image for {img_not_downloaded} not yet downloaded. execute `download_img.py`")
        exit_code = 1
    if thumb_not_created:
        print(f"WARN: thumbnail for {thumb_not_created} not yet created. execute `gen_thumbnail.py`")
        exit_code = 1
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
