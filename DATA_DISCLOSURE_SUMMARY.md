# DATA_DISCLOSURE_SUMMARY

Processed locally:
- Wallet state, account metadata, settings, and caches.
- Seed phrase/private keys/password during local wallet operations.

Sent over network for wallet functionality:
- RPC requests, token/NFT/transaction data queries, transaction broadcast.

Optional/controlled:
- Telemetry (opt-in, disabled in CWS review build).
- Remote backup (feature-gated off in CWS review build).

Never intentionally transmitted as plaintext:
- Seed phrase, private keys, password.
