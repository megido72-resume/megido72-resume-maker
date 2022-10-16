default:
  just --list
make:
  deno bundle -c tsconfig.json Maker.ts deploy/maker.js
  @for x in index.html data/megido_eng.csv; do cp -uv $x deploy/$x; done
