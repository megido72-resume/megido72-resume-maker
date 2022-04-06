all: deploy/maker.js deploy/index.html
deploy/maker.js: Maker.ts
	deno bundle -c tsconfig.json $< > $@

deploy/index.html: index.html
	cp $< $@
