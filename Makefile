develop:
	npx webpack serve

install:
	npm ci

build:
	npm run dev

watch:
	npm run watch

test:
	npm test

lint:
	npx eslint .

.PHONY: test