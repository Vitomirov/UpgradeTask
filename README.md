MLM Bonus API

This project implements a simple MLM (Multi-Level Marketing) bonus system.
Users can invite others, purchase products, and generate direct and team bonuses according to the hierarchy.

Features

Add users to the platform with optional referrer (referrer_id)

Users can purchase products (Package 1 and Package 2)

Direct bonus (10%) is paid instantly to the inviter

Team bonus (5%) is scheduled 1 hour later for all upline members

PostgreSQL database with migrations and seeds

Express.js backend API

Integration test included

Assumptions

No authentication is implemented (open API)

Products are pre-defined in database:

Package 1 - 100.00

Package 2 - 500.00

Team bonus delay is exactly 1 hour

Database transactions ensure atomicity for purchases and bonuses

Tech Stack

Node.js + Express.js

PostgreSQL

Knex.js for query building, migrations, and seeds

Docker + Docker Compose

Nodemon for development

Dotenv for environment variables

Getting Started
1. Clone repository
git clone https://github.com/Vitomirov/UpgradeTask
cd UpgradeTask

2. Create .env file

Example .env:

PG_HOST=db
PG_USER=upgrade
PG_PASSWORD=upgrade123
PG_DATABASE=upgrade_db
PORT=3000

3. Start the backend with Docker
npm run start


This script will:

Stop any running containers

Remove old database volume

Build Docker images

Start containers (backend + Postgres)

Run database migrations

Seed products and users (Marko, Milan, Dejan)

Start backend server with Nodemon

Check logs to see the Bonus Worker processing team bonuses every 60 seconds.

4. Run Integration Test
npm run test


This will:

Check the health endpoint

Create test users with referrals (Marko, Milan, Dejan)

Verify upline hierarchy

Create a purchase

Check the bonuses table for direct and team bonuses

Expected output: bonuses table will have correct amounts, statuses, and scheduled times.

Notes

Team bonus worker runs every 60 seconds to process pending bonuses (status = pending) exactly 1 hour after purchase.

Backend logs show bonus processing in real-time:

Bonus Worker started, running every 60s.
Bonus Worker: found 2 bonuses to pay.
Bonus Worker: successfully paid 2 bonuses: [1, 2]

Commands
# Start environment (Docker + backend + migrations + seeds)
npm run start

# Run integration test
npm run test