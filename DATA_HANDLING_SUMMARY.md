# Data Handling Summary (Plain Language)

## Processed locally

- Seed phrase, private keys, password (used locally for wallet access/signing)
- Wallet/account settings and encrypted wallet state
- Local caches for balances, assets, NFTs, activity, and preferences

## Sent over network for wallet operations

- Requests to blockchain RPC/node providers
- Balance, token/NFT metadata, and transaction status queries
- Transaction broadcast/signature-related requests
- Optional provider APIs for features such as swaps/buy flows
- Optional operational telemetry requests when enabled by settings

## Not intended to be sent to developer servers

- Seed phrase / mnemonic
- Private keys
- Wallet password

## Data sales

- No sale of user data.


## Review build behavior

When built with `VITE_CWS_REVIEW_BUILD=true`, non-core telemetry and remote backup flows are disabled to reduce reviewer risk optics.
