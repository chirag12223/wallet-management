BEGIN;

-- =========================
-- ASSETS
-- =========================
INSERT INTO assets (id, code, name, "createdAt")
VALUES
  ('asset-gold', 'GOLD', 'Gold Coins', NOW()),
  ('asset-diamond', 'DIAMOND', 'Diamonds', NOW()),
  ('asset-points', 'POINTS', 'Loyalty Points', NOW());

-- =========================
-- USERS
-- =========================
INSERT INTO users (id, name, "createdAt")
VALUES
  ('user-1', 'Alice', NOW()),
  ('user-2', 'Bob', NOW());

-- =========================
-- WALLETS (USER WALLETS)
-- =========================
INSERT INTO wallets (id, "userId", "assetId", "createdAt")
VALUES
  ('wallet-user1-gold', 'user-1', 'asset-gold', NOW()),
  ('wallet-user2-gold', 'user-2', 'asset-gold', NOW());

-- =========================
-- SYSTEM WALLET (TREASURY)
-- =========================
INSERT INTO wallets (id, "userId", "assetId", "createdAt")
VALUES
  ('wallet-treasury-gold', NULL, 'asset-gold', NOW());

-- =========================
-- LEDGER ACCOUNTS
-- =========================
-- User accounts
INSERT INTO ledger_accounts (id, "walletId", type, name, "createdAt")
VALUES
  ('ledger-user1', 'wallet-user1-gold', 'USER', 'User 1 GOLD Account', NOW()),
  ('ledger-user2', 'wallet-user2-gold', 'USER', 'User 2 GOLD Account', NOW());

-- System account
INSERT INTO ledger_accounts (id, "walletId", type, name, "createdAt")
VALUES
  ('ledger-treasury', 'wallet-treasury-gold', 'SYSTEM', 'Treasury GOLD Account', NOW());

-- =========================
-- INITIAL BALANCE TRANSACTION
-- =========================
INSERT INTO transactions (id, type, reference, "createdAt")
VALUES
  ('txn-seed-1', 'TOPUP', 'Initial Seed Balance', NOW());

-- =========================
-- LEDGER ENTRIES (DOUBLE ENTRY)
-- User 1 gets 100 GOLD
INSERT INTO ledger_entries (
  id, "transactionId", "accountId", amount, "createdAt"
)
VALUES
  ('entry-seed-1a', 'txn-seed-1', 'ledger-user1', 100, NOW()),
  ('entry-seed-1b', 'txn-seed-1', 'ledger-treasury', -100, NOW());

-- User 2 gets 50 GOLD
INSERT INTO ledger_entries (
  id, "transactionId", "accountId", amount, "createdAt"
)
VALUES
  ('entry-seed-2a', 'txn-seed-1', 'ledger-user2', 50, NOW()),
  ('entry-seed-2b', 'txn-seed-1', 'ledger-treasury', -50, NOW());

COMMIT;
