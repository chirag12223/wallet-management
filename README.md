# Wallet Management System

This project implements a high-integrity, ledger-based wallet service for a closed-loop
virtual currency system (e.g. gaming credits or reward points). The system guarantees
correct balances, supports high concurrency, and prevents duplicate transactions.

🔌 API Testing (Postman)

Postman collection:

https://www.postman.com/mission-architect-2278183/wallet-management/collection/38236892-cc5e73a3-2225-41e9-a1e1-75559ea61bdf

---

## Technology Choices

- **NestJS (Node.js)**
  - Clean modular architecture
  - Dependency injection
  - Easy transactional boundaries

- **PostgreSQL**
  - Strong ACID guarantees
  - Serializable isolation support
  - Industry standard for financial systems

- **Prisma ORM**
  - Type-safe queries
  - Explicit transaction control
  - Clear schema and migrations

- **Ledger-Based Accounting**
  - Append-only ledger entries
  - Wallet balance is derived, not blindly trusted
  - Full auditability of all credit movements

- **Docker**
  - Reproducible environment
  - Easy database setup

---

## Database Design (High Level)

- **users** – wallet owners  
- **assets** – supported currencies (e.g. GOLD)  
- **wallets** – one wallet per `(userId, assetId)`  
- **transactions** – business actions (TOPUP, BONUS, SPEND)  
- **ledger_entries** – actual balance mutations  
- **idempotency_keys** – prevents duplicate execution  

---

## Seed Data

Seed script location: Inside the prisma folder.


The seed script inserts:
- Assets (e.g. GOLD)
- Users
- Wallets linked to users and assets
- Initial balances

---

## Running with Docker (Recommended)


```bash
docker compose up -d


or inside the .env file
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wallet_db"


npx prisma migrate dev
psql $DATABASE_URL -f prisma/seed.sql **or** docker exec -i wallet-db psql \
  -U postgres \
  -d wallet_db \
  < prisma/seed.sql


  




