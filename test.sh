#!/bin/bash
# test.sh - Integration test for UpgradeTask MLM Backend

echo "🚀 Starting MLM Backend Integration Test"

# 1️⃣ Check Health Endpoint
echo -e "\n1️⃣ Checking Health Endpoint..."
curl -s http://localhost:3000/api/health | jq

# 2️⃣ Create Users
echo -e "\n2️⃣ Creating Users..."
ALICE=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}')
echo "Alice created: $ALICE"
ALICE_ID=$(echo $ALICE | jq '.user.id')

BOB=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Bob\",\"referrer_id\":$ALICE_ID}")
echo "Bob created: $BOB"
BOB_ID=$(echo $BOB | jq '.user.id')

CHARLIE=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Charlie\",\"referrer_id\":$BOB_ID}")
echo "Charlie created: $CHARLIE"
CHARLIE_ID=$(echo $CHARLIE | jq '.user.id')

# 3️⃣ Check Charlie's Upline
echo -e "\n3️⃣ Checking Charlie's Upline Hierarchy..."
curl -s http://localhost:3000/api/users/$CHARLIE_ID | jq

# 4️⃣ Add Purchase for Charlie
echo -e "\n4️⃣ Adding Purchase for Charlie (product_id=2)..."
PURCHASE=$(curl -s -X POST http://localhost:3000/api/purchases \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":$CHARLIE_ID,\"product_id\":2}")
echo "Purchase created: $PURCHASE"

# 5️⃣ Check Bonuses Table directly in DB container
echo -e "\n5️⃣ Checking Bonuses Table..."
docker compose exec -T db psql -U ${PG_USER:-upgrade} -d ${PG_DATABASE:-upgrade_db} \
  -c "SELECT * FROM bonuses ORDER BY id ASC;"

echo -e "\n✅ Test finished."
