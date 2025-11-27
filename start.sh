#!/bin/bash
set -e

echo "🚀 Starting development environment..."

# Load env
export $(grep -v '^#' .env | xargs)

# Stop and remove everything
docker compose down -v

# Build and start
docker compose build
docker compose up -d

# Wait for Postgres
echo "⏳ Waiting for Postgres..."
until [ "$(docker inspect --format='{{.State.Health.Status}}' upgrade_postgres_db)" == "healthy" ]; do
  sleep 2
done

echo "✅ Database is ready."

# Run migrations and seeds
docker compose exec -T backend env \
  PG_HOST=$PG_HOST \
  PG_USER=$PG_USER \
  PG_PASSWORD=$PG_PASSWORD \
  PG_DATABASE=$PG_DATABASE \
  npx knex migrate:latest

docker compose exec -T backend env \
  PG_HOST=$PG_HOST \
  PG_USER=$PG_USER \
  PG_PASSWORD=$PG_PASSWORD \
  PG_DATABASE=$PG_DATABASE \
  npx knex seed:run

docker compose logs -f backend
