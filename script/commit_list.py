from utils import git_root
import json


BASE = git_root()

LIST_IN = BASE / "deploy" / "data" / "megido_list_new.json"

LIST_OUT = BASE / "deploy" / "data" / "megido_list.json"

def main():
    with (LIST_IN.open("r") as fin,
          LIST_OUT.open("w") as fout):
        data = json.load(fin)
        for item in data["list"]:
            del item["img"]
            del item["re_img"]
        json.dump(data, fout, indent=2)
    print(f"SUCCESS: {LIST_IN} -> {LIST_OUT}")
    print(f"you can delete {LIST_IN}")

if __name__ == "__main__":
    main()
