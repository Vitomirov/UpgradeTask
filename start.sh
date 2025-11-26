#!/bin/bash
set -e

echo "🚀 Full development reset..."

# Stop containers
echo "🛑 Stopping containers..."
docker compose down

# Remove old DB volume
echo "🧹 Cleaning old database volume..."
docker volume rm UpgradeTask_postgres_data 2>/dev/null || true

# Build Docker images
echo "🔧 Building Docker images..."
docker compose build

# Start containers
echo "▶️ Starting containers..."
docker compose up -d

# Wait until Postgres is healthy
echo "⏳ Waiting for Postgres..."
until [ "$(docker inspect --format='{{.State.Health.Status}}' upgrade_postgres_db)" == "healthy" ]; do
  sleep 2
done

echo "✅ Database is ready."

# Run migrations
echo "📂 Running database migrations..."
docker compose exec -T backend npx knex migrate:latest

# Seed initial data
echo "🌱 Seeding products and users..."
docker compose exec -T backend npx knex seed:run

# Start backend logs
echo "💻 Starting backend server..."
docker compose logs -f backend
