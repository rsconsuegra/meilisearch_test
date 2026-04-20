.PHONY: help

help:
	@echo "Available targets:"
	@echo "  help - Show this help message"
	@echo "  lint - Run ESLint on frontend"
	@echo "  lint-fix - Run ESLint with autofix on frontend"
	@echo "  test - Run unit tests"
	@echo "  test-e2e - Run Playwright e2e tests"
	@echo "  curl-get - GET request: make curl-get ROUTE=\"/indexes\""
	@echo "  curl-post - POST request: make curl-post ROUTE=\"/indexes/movies/documents?primaryKey=id\" FILE=\"movies.json\""


.PHONY: start-colima
start-colima:
	@echo "Starting Colima..."
	@colima start --cpu 1 --memory 2 --disk 20


.PHONY: lint
lint:
	@cd frontend && npm run lint

.PHONY: lint-fix
lint-fix:
	@cd frontend && npm run lint -- --fix

.PHONY: test
test:
	@cd frontend && npm run test

.PHONY: test-e2e
test-e2e:
	@cd frontend && npm run test:e2e


.PHONY: curl-get
curl-get:
	@export $$(cat .env | xargs) && \
  curl -X GET "http://localhost:$$MEILISEARCH_PORT$(ROUTE)" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $$MEILISEARCH_ADMIN_API_KEY"

.PHONY: curl-post
curl-post:
	@export $$(cat .env | xargs) && \
  curl -X POST "http://localhost:$$MEILISEARCH_PORT$(ROUTE)" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $$MEILISEARCH_ADMIN_API_KEY" \
  --data-binary '@$(FILE)'