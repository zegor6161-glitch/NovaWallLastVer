# STORE_DESCRIPTION_DRAFT

Working draft aligned with `STORE_SHORT_DESCRIPTION.txt` and `STORE_FULL_DESCRIPTION.md`.
Use this file only as an editing helper; submit final copy from the canonical store files.

Nova Wallet is a self-custody browser wallet for Bitcoin, Ethereum/EVM, and Solana.

Core capabilities:
- Create/import wallet accounts.
- View addresses, balances, and asset state.
- Connect to compatible dApps.
- Approve/reject signature and transaction requests.

Disclosure summary:
- Seed phrase/private keys/password are handled locally.
- Broad host matching is for dApp provider interoperability on user-visited sites.
- Telemetry/remote backup non-core paths are disabled in CWS review build mode (`VITE_CWS_REVIEW_BUILD=true`).
- No remote executable code is used to replace extension runtime logic.
