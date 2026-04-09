# DATA_DISCLOSURE_SUMMARY

## Processed locally

- Seed phrase, private keys, wallet password during wallet setup/unlock/signing.
- Encrypted wallet state, account metadata, settings, and local caches.

## Sent over network for wallet functionality

- Blockchain RPC requests/responses for account state and transaction workflows.
- Public account identifiers (for example wallet addresses) when needed for balance/history/NFT/transaction operations.
- Optional user-invoked provider API traffic (for example swap/buy-related providers when those features are used).

## Optional and controlled

- Telemetry (opt-in by settings; disabled in CWS review build mode).
- Remote backup network flows (optional feature; disabled in CWS review build mode).

## Never intentionally transmitted as plaintext by the extension

- Seed phrase / mnemonic.
- Private keys.
- Wallet password.

## Additional disclosure

- The extension does **not** sell user data.
