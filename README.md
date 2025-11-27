🚀 MLM Bonus API
This project implements a simple MLM (Multi-Level Marketing) bonus system. It allows users to invite others, purchase products, and generate direct and team bonuses based on the established hierarchy.

✨ Features
Add users to the platform with an optional referrer (referrer_id).

Users can purchase pre-defined products: Package 1 and Package 2.

Direct bonus (10%) is paid instantly to the inviter.

Team bonus (5%) is scheduled 1 hour later for all upline members.

PostgreSQL database with migrations and seeds.

Express.js backend API.

Integration tests included.

💡 Assumptions
No authentication is implemented (open API).

Products are pre-defined in the database:

Package 1 - $100.00

Package 2 - $500.00

Team bonus delay is exactly 1 hour.

Database transactions ensure atomicity for purchases and bonuses.

🛠️ Tech Stack
Node.js + Express.js

PostgreSQL

Knex.js for query building, migrations, and seeds

Docker + Docker Compose

Nodemon for development

Dotenv for environment variables

🏁 Getting Started
1. Clone the Repository
Clone the project and navigate into the directory:

Bash

git clone https://github.com/Vitomirov/UpgradeTask
cd UpgradeTask
2. Create .env File
Create a file named .env in the root directory.

Example .env:

PG_HOST=db
PG_USER=upgrade
PG_PASSWORD=upgrade123
PG_DATABASE=upgrade_db
PORT=3000
3. Start the Backend Environment
This script handles setup, migrations, and starting the server using Docker Compose.

Bash

npm run start
This script will perform the following actions:

Stop any running containers.

Remove the old database volume.

Build Docker images.

Start containers (backend + Postgres).

Run database migrations.

Seed products and initial users (Marko, Milan, Dejan).

Start the backend server with Nodemon.

💡 Note: Check the logs to see the Bonus Worker running, which processes team bonuses every 60 seconds.

🧪 Run Integration Test
Execute the full suite of integration tests:

Bash

npm run test
This test will:

Check the health endpoint.

Create test users with referrals (Marko, Milan, Dejan).

Verify the upline hierarchy.

Create a purchase.

Check the bonuses table for direct and team bonuses.

Expected Output: The bonuses table will have the correct amounts, statuses, and scheduled times, confirming the bonus logic works as designed.

📝 Notes
Team Bonus Worker
The Team Bonus Worker runs every 60 seconds to process pending bonuses (status = pending) that are exactly 1 hour past their purchase time.

Backend logs show bonus processing in real-time:

Bonus Worker started, running every 60s.
Bonus Worker: found 2 bonuses to pay.
Bonus Worker: successfully paid 2 bonuses: [1, 2]