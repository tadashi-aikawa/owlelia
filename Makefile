MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help

.PHONY: $(shell egrep -oh ^[a-zA-Z0-9][a-zA-Z0-9_-]+: $(MAKEFILE_LIST) | sed 's/://')

help: ## Print this help
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9][a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "[REQUIRED ERROR] \`$*\` is required."; \
		exit 1; \
	fi

init-develop: ## Install dependencies
	npm install

build: ## Build
	npm run build

test: ## Run test
	npm run test

release: guard-version build test ## make release version=x.y.z
	@echo 1. Increment version
	@npm version $(version)

	@echo 2. Build
	@make build

	@echo 3. Publish
	@npm publish

	@echo 4. push to GitHub
	@git push --tags
	@git push

	@echo "All Successed!!"
