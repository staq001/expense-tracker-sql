DEV_COMPOSE_FILE=docker-compose-dev.yml
TEST_COMPOSE_FILE=docker-compose-test.yml
DEBUG_COMPOSE_FILE=docker-compose-debug.yml

.PHONY: compose-build
compose-build:
	docker compose -f $(DEV_COMPOSE_FILE) build

.PHONY: compose-up
compose-up:
	docker compose -f $(DEV_COMPOSE_FILE) up -d

.PHONY: compose-up-build
compose-up-build:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

.PHONY: compose-down
compose-down:
	docker compose -f $(DEV_COMPOSE_FILE) down

.PHONY: compose-down-v
compose-down-v:
	docker compose -f $(DEV_COMPOSE_FILE) down -v

####
.PHONY: run-tests
run-tests:
	docker compose -f $(DEV_COMPOSE_FILE) -f ${TEST_COMPOSE_FILE} run --build api-node

###
.PHONY: compose-up-debug-build
compose-up-debug-build:
	docker compose -f $(DEV_COMPOSE_FILE) -f $(DEBUG_COMPOSE_FILE) up --build