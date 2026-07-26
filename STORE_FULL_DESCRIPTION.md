# Terenval Wallet

Terenval Wallet is a browser extension cryptocurrency wallet for **Bitcoin, Ethereum/EVM, and Solana**.

## Single purpose

Terenval Wallet has one core purpose: **self-custody wallet functionality in the browser**.

## Core wallet actions

- Create a new wallet or import an existing wallet
- View wallet addresses, balances, and supported asset data
- Connect to compatible dApps through injected wallet providers
- Review and approve or reject signature requests
- Review and approve or reject transaction requests

## Permission rationale (plain language)

- Broad website matching is used so compatible dApps can detect/connect to the wallet provider on sites the user opens.
- Storage permissions persist encrypted wallet state and user settings locally.
- Tabs permission supports wallet-initiated navigation flows (for example onboarding/support/hardware-wallet steps).
- Clipboard write is used for explicit user copy actions (for example copying a public address).

## Data handling summary

- **Handled locally:** seed phrase, private keys, wallet password, encrypted wallet state.
- **Sent for wallet operation:** blockchain RPC requests, balance/state queries, transaction-related requests, and optional user-invoked provider APIs (for example swap/buy paths when used).
- **Never intentionally sent as plaintext by the extension:** seed phrase, private keys, wallet password.
- The extension does **not** sell user data.

## Review-build note for moderation

For Chrome Web Store review builds (`VITE_CWS_REVIEW_BUILD=true`), non-core telemetry and remote backup flows are disabled so review scope remains on core wallet behavior.

## Security reminder

No software wallet can guarantee absolute security. Users should protect their recovery phrase, verify transaction details, and keep browser/device environments secure.
