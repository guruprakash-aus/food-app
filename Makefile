start_db:
	docker compose -f ./db/docker-compose.yml -p food_app up -d

stop_db:
	docker compose -p food_app down
