# Individual service commands (legacy - using unified tag below)
start_db:
	docker compose -f ./db/docker-compose.yml -p food_app up -d

stop_db:
	docker compose -f ./db/docker-compose.yml -p food_app down

start_kafka:
	docker compose -f ./broker/docker-compose.yml -p food_app up -d

stop_kafka:
	docker compose -f ./broker/docker-compose.yml -p food_app down

# Whole app commands using unified project tag
start_app:
	docker compose -f ./db/docker-compose.yml -p food_app up -d
	docker compose -f ./broker/docker-compose.yml -p food_app up -d
	@echo "Food app services started successfully"

stop_app:
	docker compose -f ./broker/docker-compose.yml -p food_app down
	docker compose -f ./db/docker-compose.yml -p food_app down
	@echo "Food app services stopped successfully"

# Force stop - removes containers and networks
force_stop:
	docker compose -f ./broker/docker-compose.yml -p food_app down --remove-orphans
	docker compose -f ./db/docker-compose.yml -p food_app down --remove-orphans
	@echo "Food app services force stopped"

# Alternative commands with different naming
up: start_app

down: force_stop

# Status check
status:
	@echo "=== Food App Services Status ==="
	docker compose -p food_app ps

# Restart the whole app
restart: force_stop start_app

# Clean up (stops and removes containers, networks, volumes)
clean:
	docker compose -f ./broker/docker-compose.yml -p food_app down -v --remove-orphans
	docker compose -f ./db/docker-compose.yml -p food_app down -v --remove-orphans
	docker system prune -f --volumes
	@echo "Food app cleaned up successfully"

# Clean up networks specifically
clean_networks:
	docker network prune -f
	@echo "Docker networks cleaned up"

.PHONY: start_db stop_db start_kafka stop_kafka start_app stop_app force_stop up down status restart clean clean_networks