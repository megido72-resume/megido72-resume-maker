all: deploy/maker.js deploy/index.html deploy/data/megido_eng.csv
deploy/maker.js: Maker.ts
	deno bundle -c tsconfig.json $< > $@

deploy/index.html: index.html
	cp $< $@

deploy/data/megido_eng.csv: data/megido_eng.csv
	cp $< $@
