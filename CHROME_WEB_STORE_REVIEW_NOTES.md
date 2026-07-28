# Chrome Web Store Reviewer Notes — Terenval Wallet

## Product and single purpose

Terenval Wallet is a non-custodial browser wallet for Ethereum, selected Ethereum Layer 2 networks, custom EVM networks, and Bitcoin. Its single purpose is to let users manage wallet accounts, view assets, connect to compatible dApps, review signing requests, and submit user-approved transactions.

Built-in networks in this release: Ethereum, Optimism, Arbitrum One, Base, Polygon, zkSync Era, Linea, Scroll, and Bitcoin.

The submitted build excludes Solana, Polkadot, Kadena, Massa, Litecoin, Dogecoin, swaps, hardware-wallet integrations, promotions, surveys, and remote settings backup.

## Secret material

Seed phrases, private keys, wallet passwords, PINs, and signing operations remain on the user’s device. They are not transmitted to Terenval, RPC providers, analytics, market-data providers, block explorers, or connected websites. Terenval cannot recover lost credentials.

## dApp access and broad site matching

Packaged content scripts run at `document_start` on HTTPS pages so compatible dApps can discover the Ethereum/EIP-1193/EIP-6963 and Bitcoin/Unisat-compatible providers. The bridge forwards wallet requests between the page and the Extension.

This access is not used to scrape page text, forms, credentials, communications, or browsing history. Account access, signatures, and transactions are never auto-approved; the user must approve them in Extension UI.

## Permissions

- `storage`: persists encrypted wallet state, public account metadata, settings, custom networks, connected-site permissions, local activity, and analytics consent.
- `tabs`: reads the active tab ID, URL/domain, title, and favicon to identify the requesting dApp, associate permissions with the correct origin, and route the response to the correct tab.
- `clipboardWrite`: copies public wallet addresses or other public values only after a user clicks a copy control.

The release does not request `unlimitedStorage`.

## Network traffic

Expected traffic is limited to:

- the configured Ethereum/EVM RPC for balance/state reads, fee estimation, and broadcasting user-approved signed transactions;
- `mempool.space` for Bitcoin balance, UTXO, transaction-status, fee, and broadcast operations;
- `api-v3.ethvm.dev` and `mainnet.mewwallet.dev` for market information;
- `analytics.terenval.com/product-events` only after explicit analytics opt-in;
- a block explorer opened by explicit user action;
- a custom EVM RPC/explorer entered by the user.

The release scanner rejects legacy Enkrypt/MEW RPC, screening, backup, swap, and analytics endpoints.

## Optional analytics

Analytics is off until the user chooses **Enable usage analytics**. A **Continue without analytics** option is available on the same screen, and the user can opt out later in Settings.

Allowlisted analytics is limited to event type, network/chain, feature/source category, asset symbol, approximate USD amount bucket, Extension version, consent version, and hour-rounded timestamp. It excludes addresses, public keys, transaction hashes, signatures, raw transactions, exact values, website information, secret credentials, PII, and persistent analytics identifiers.

## Remote code

All executable Extension logic is packaged in the submitted ZIP. The build scanner rejects `eval`, `Function` constructors, remote `importScripts`, remote dynamic imports, and remote script tags. RPC, blockchain, market, and analytics responses are data and do not replace Extension logic.

`wasm-unsafe-eval` is present only to support bundled local WebAssembly cryptographic dependencies. No WebAssembly or JavaScript is downloaded and executed from a remote host.

## Reviewer test flow

No external test account is required.

1. Install the submitted unpacked ZIP or store package.
2. Create a temporary wallet or import a disposable test recovery phrase. Do not use a wallet containing real funds.
3. On the analytics screen, verify both opt-in and continue-without-analytics choices are available.
4. Verify the network selector contains only the documented Ethereum/L2 networks and Bitcoin, plus the custom EVM option.
5. Verify account creation/import, address copying, balance display, and manual send review.
6. Open a compatible Ethereum dApp and verify the site domain is shown before account connection, signing, or transaction approval.
7. Verify declining a request returns a rejection and does not expose an account or sign data.
8. Verify **Settings → General → Usage analytics** can disable future analytics.
9. Verify there is no swap, hardware-wallet, Solana, Polkadot, Kadena, Massa, Litecoin, Dogecoin, or remote-backup interface.

## Build identification

The canonical package is generated with:

`node packages/extension/configs/cws/release.mjs`

That command enables `CWS_RELEASE=true` and `VITE_CWS_REVIEW_BUILD=true`, builds the exact Chrome production graph, scans the artifact, and creates `packages/extension/release/terenval-wallet-cws.zip`.
