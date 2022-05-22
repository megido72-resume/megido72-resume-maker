# Download ZenKurenaido.woff2 -> https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap&text=%E4%BD%9C%E6%88%90%E6%97%A5%3A%2F0123456789

# Pleace the downloaded font to: `deploy/img/Kosugi-Maru-Subset.woff2`

from bs4 import BeautifulSoup
from urllib import parse
from subprocess import run


def main():
    chars = set("0123456789")
    base = (
        run("git rev-parse --show-toplevel".split(" "), capture_output=True)
        .stdout.decode("utf-8")
        .rstrip()
    )
    with open(f"{base}/data/megido_eng.csv") as f:
        for line in f:
            jp, en = line.split(",")
            for c in jp:
                chars.add(c)
    with open(f"{base}/index.html") as f:
        soup = BeautifulSoup(f, features="html5lib")
    for item in soup.find_all("option"):
        for c in item.text:
            chars.add(c)
    res = "".join(sorted(chars))
    quoted = parse.quote(res)
    print(res)
    run(
        [
            "xdg-open",
            f"https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap&text={quoted}",
        ]
    )


if __name__ == "__main__":
    main()
