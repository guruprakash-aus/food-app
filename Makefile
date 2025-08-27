start_db:
	docker compose -f ./db/docker-compose.yml -p food_app up -d

stop_db:
	docker compose -p food_app down

start_kafka:
	docker compose -f ./broker/docker-compose.yml -p food_app_kafka up -d

stop_kafka:
	docker compose -p food_app_kafka down