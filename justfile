default:
  @just --list

build:
  deno bundle -c tsconfig.json Maker.ts deploy/maker.js
  @for x in index.html data/megido_eng.csv; do cp -uv $x deploy/$x; done

prepare:
  python script/download_list.py
  python script/download_img.py
  python script/gen_thumbnail.py

check:
  python script/diff_check.py

deploy: check build
  python script/download_font.py
  python script/commit_list.py

clean:
  rm deploy/data/megido_list_new.json
