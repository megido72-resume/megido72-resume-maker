default:
  just --list
  for i in a b; do echo $i; done
make:
  deno bundle -c tsconfig.json Maker.ts deploy/maker.js
  @for x in index.html data/megido_eng.csv; do cp -v $x deploy/$x; done
