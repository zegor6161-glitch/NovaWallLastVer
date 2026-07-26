# Security Overview (High-Level)

Terenval Wallet is a client-side browser wallet. Sensitive credentials are handled locally for wallet creation, restore, unlock, and signing flows.

## Design principles

- Local handling of seed/private key/password material
- Explicit user approvals for signature/transaction actions
- Provider injection for dApp interoperability
- Storage-backed wallet state with lock/unlock workflows

## Operational boundaries

- Network requests are required for blockchain functionality and asset data.
- Third-party RPC/indexing/provider services are part of normal wallet operation.
- Security also depends on user endpoint hygiene (device, browser profile, backups, phishing awareness).

## Important limitation

No software wallet can eliminate all risk. Users remain responsible for protecting seed phrases, passwords, and transaction approvals.
