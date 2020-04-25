MAKEFLAGS += --warn-undefined-variables


#------

.PHONY: help
help: ## Help
	@"C:\Program Files\Git\usr\bin\awk" 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9][a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

guard-%:
	@if [ "${${*}}" = "" ]; then \
	    echo "[ERROR] $* is required!!"; \
	    exit 1; \
	fi

.PHONY: init-develop
init-develop: ## Install dependencies
	npm install

.PHONY: build
build: ## Build
	npm run build

.PHONY: test
test: ## Run test
	npm run test

.PHONY: release
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
