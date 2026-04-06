# Chrome Web Store Reviewer Notes — Nova Wallet

## 1) What this extension is

Nova Wallet is a **browser extension cryptocurrency wallet**. It provides account management, signing, and transaction workflows for supported networks, and injects wallet providers for dApp connectivity.

## 2) Single purpose

**Single purpose:** provide end users with a multi-chain self-custody wallet in the browser (account access, balance/asset viewing, transaction signing, and dApp connection).

## 3) Sensitive credentials handling

- Seed phrase (mnemonic), private keys, and wallet password are handled locally in extension workflows.
- Recent hardening removed prior direct mnemonic/seed transmission paths and hidden wallet mapping transmission behavior.

Additional security/privacy clarification for review:

The extension does not transmit seed phrases, private keys, or passwords to any external servers.

All sensitive cryptographic material is generated, stored, and processed locally within the extension.

Network requests are limited to blockchain RPC endpoints and related services necessary for wallet functionality (balances, transactions, token metadata).

The extension does not perform hidden data collection, tracking, or user profiling.

## 4) Permission rationale (high-level)

- `storage`, `unlimitedStorage`: persist encrypted wallet state, settings, account metadata, tokens/NFT/activity caches.
- `tabs`: open/focus wallet-related tabs (onboarding, hardware wallet flows, external links) and handle wallet-initiated tab interactions.
- `clipboardWrite`: user-triggered copy actions (for example, copy public address).

## 5) Host permissions / broad site matching rationale

The extension uses content scripts and provider injection on user-visited websites (`http://*/*`, `https://*/*`) so dApps can detect/connect to the wallet provider and request signatures/accounts with explicit user interaction.

Additional targeted matching is used for Trezor connect integration paths.

## 6) Remote code / runtime logic

Extension logic is shipped in the extension package. The extension makes network/API requests for wallet operations, but is not intended to use remote code to dynamically replace extension logic at runtime.

## 7) Legitimate expected network traffic

Expected traffic includes:

- blockchain RPC and node infrastructure requests;
- balance, token, NFT, and transaction history/status queries;
- transaction broadcast/signature-related requests;
- optional swap/buy/provider requests when user uses those features;
- optional operational telemetry endpoints (for example analytics) according to product settings.

## 8) Sensitive permission to user-feature mapping

- Global site matching + injection: dApp connection/provider functionality.
- Storage permissions: wallet persistence and state.
- Tabs permission: wallet UX flows requiring controlled tab operations.
- Clipboard write: explicit user copy actions.

## 9) Reviewer quick assurance

This extension is submitted as a wallet product, not surveillance software:

- permissions are tied to wallet functionality;
- sensitive credentials are processed locally;
- no hidden seed/private key collection behavior is intended.
