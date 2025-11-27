#!/bin/bash
# test.sh - Integration test for UpgradeTask MLM Backend

# Load environment variables
export $(grep -v '^#' .env | xargs)

echo "🚀 Starting MLM Backend Integration Test"

# 1️⃣ Check Health Endpoint
echo -e "\n1️⃣ Checking Health Endpoint..."
curl -s http://localhost:${PORT}"/api/health" | jq

# 2️⃣ Create Users
echo -e "\n2️⃣ Creating Users..."
MARKO=$(curl -s -X POST http://localhost:${PORT}/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Marko"}')
echo "Marko created: $MARKO"
MARKO_ID=$(echo $MARKO | jq '.user.id')

MILAN=$(curl -s -X POST http://localhost:${PORT}/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Milan\",\"referrer_id\":$MARKO_ID}")
echo "Milan created: $MILAN"
MILAN_ID=$(echo $MILAN | jq '.user.id')

DEJAN=$(curl -s -X POST http://localhost:${PORT}/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Dejan\",\"referrer_id\":$MILAN_ID}")
echo "Dejan created: $DEJAN"
DEJAN_ID=$(echo $DEJAN | jq '.user.id')

# 3️⃣ Check Dejan's Upline
echo -e "\n3️⃣ Checking Dejan's Upline Hierarchy..."
curl -s http://localhost:${PORT}/api/users/$DEJAN_ID | jq

# 4️⃣ Add Purchase for Dejan
echo -e "\n4️⃣ Adding Purchase for Dejan (product_id=2)..."
PURCHASE=$(curl -s -X POST http://localhost:${PORT}/api/purchases \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":$DEJAN_ID,\"product_id\":2}")
echo "Purchase created: $PURCHASE"

# 5️⃣ Check Bonuses Table directly in DB container
echo -e "\n5️⃣ Checking Bonuses Table..."
docker compose exec -T db psql -U ${PG_USER} -d ${PG_DATABASE} -c \
"SELECT * FROM bonuses ORDER BY id ASC;"

echo -e "\n✅ Test finished."
