# 🚀 Upgrade job application test

---

## 📚 Table of Contents

- [Features](#-features)
- [Assumptions](#-assumptions)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Create an .env File](#2-create-an-env-file)
  - [Start the Backend Environment](#3-start-the-backend-environment)
- [Run Integration Tests](#-run-integration-tests)
- [Team Bonus Worker](#-team-bonus-worker)

---

## ✨ Features

- Add users with optional `referrer_id`
- Two predefined products:
  - **Package 1 — $100**
  - **Package 2 — $500**
- **10% direct bonus** paid instantly to the inviter
- **5% team bonus** scheduled exactly 1 hour after purchase
- PostgreSQL database with migrations and seed data
- Express.js REST API
- Integration tests included

---

## 💡 Assumptions

- Open API (no authentication)
- Products are predefined in the database
- Team bonus delay is exactly **1 min**
- Database transactions ensure atomicity

---

## 🛠️ Tech Stack

- Node.js + Express.js  
- PostgreSQL  
- Knex.js (migrations, seeds, query builder)  
- Docker + Docker Compose  
- Nodemon  
- Dotenv  

---

# 🏁 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Vitomirov/UpgradeTask
cd UpgradeTask
```

---

## 2. Create an .env File

Create a `.env` file in the project root:

```env
PG_HOST=db
PG_USER=<your username>
PG_PASSWORD=<your password>
PG_DATABASE=upgrade_db
PORT=3000
```

---

## 3. Start the Backend Environment

This command resets the database, builds Docker images, runs migrations and seeds, and starts the backend server.

```bash
npm run start
```

This script performs:

- Stops running containers  
- Removes old DB volume  
- Builds Docker images  
- Starts backend + PostgreSQL  
- Runs migrations  
- Seeds initial users and products  
- Starts backend with Nodemon  

💡 **Bonus Worker runs every 60 seconds** — check logs to see scheduled team bonus processing.

---

# 🧪 Run Integration Tests

```bash
npm run test
```

The test suite checks:

- Health endpoint  
- User creation with referral chain  
- Upline hierarchy  
- Purchase simulation  
- Direct & team bonuses  

Expected outcome:  
The `bonuses` table contains correct bonus amounts, statuses, and scheduled times.

---

# 📝 Team Bonus Worker

The Team Bonus Worker runs every **60 seconds** and processes all team bonuses whose `scheduled_for` is due.

Example output:

```
Bonus Worker started, running every 60s.
Bonus Worker: found 2 bonuses to pay.
Bonus Worker: successfully paid 2 bonuses: [1, 2]
```
