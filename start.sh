#!/bin/bash
set -e

echo "🚀 Starting development environment..."

# Stop existing containers
echo "🛑 Stopping any running containers..."
docker compose down

# Optional: remove old postgres data for clean DB
echo "🧹 Cleaning old database volume..."
docker volume rm UpgradeTask_postgres_data 2>/dev/null || true

# Build Docker images
echo "🔧 Building Docker images..."
docker compose build

# Start containers in detached mode
echo "▶️ Starting containers..."
docker compose up -d

# Wait for Postgres to be healthy
echo "⏳ Waiting for database to become healthy..."
until [ "$(docker inspect --format='{{.State.Health.Status}}' upgrade_postgres_db)" == "healthy" ]; do
  echo "Waiting for Postgres..."
  sleep 2
done

echo "✅ Database is ready."

# Run migrations
echo "📂 Running database migrations..."
docker compose exec -T backend npx knex migrate:latest

# Seed initial products
echo "🌱 Seeding products..."
docker compose exec -T backend npx knex seed:run

# Start backend server logs
echo "💻 Backend is starting..."
docker compose logs -f backend
