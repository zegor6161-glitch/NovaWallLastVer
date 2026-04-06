# Nova Wallet Extension Privacy Policy

**Last updated:** April 1, 2026

This Privacy Policy describes how the Nova Wallet browser extension processes data when you use wallet features in the extension.

## 1) Scope

This policy applies to the Nova Wallet browser extension package distributed through the Chrome Web Store.

## 2) Data processed locally on your device

For core wallet operation, the extension stores and processes data in browser extension storage (and related local state), including:

- wallet configuration and encrypted wallet state;
- public wallet addresses and account labels;
- selected networks and custom network configuration;
- token, NFT, activity, and UI preference caches;
- security/session settings (for example, lock state and related preferences).

Sensitive credentials such as **seed phrase (mnemonic), private keys, and wallet password** are handled locally by the extension for wallet creation, restore, unlock, and signing workflows.

## 3) Sensitive credentials and transmission

The extension is designed so that seed phrases, private keys, and wallet passwords are handled locally and are **not transmitted by the extension to developer-operated servers** as part of normal wallet operation.

The extension does not use hidden collection flows intended to exfiltrate seed phrases, private keys, or wallet passwords.

## 4) Network requests required for wallet functionality

To provide wallet features, the extension may send network requests to third-party infrastructure and partner services selected by wallet logic and user actions, including:

- blockchain RPC endpoints (read/write operations);
- balance and transaction state retrieval;
- token and NFT metadata retrieval;
- transaction preparation, submission, and status-related requests;
- optional swap/buy/provider endpoints when those user-facing features are used;
- optional operational endpoints such as analytics/telemetry when enabled in product settings.

These requests can include public account identifiers (such as wallet addresses), network identifiers, and transaction-related public data as required for the requested wallet operation.

## 5) Public account identifiers

Wallet addresses and other public account identifiers may be processed and transmitted only to the extent necessary to provide wallet features (for example, querying balances, history, NFTs, network state, and broadcasting transactions).

## 6) Data sales and advertising

The extension does **not** sell personal data.

## 7) Third-party services

Wallet functionality depends on external blockchain and infrastructure services. Your use of those services may also be subject to their own privacy terms.

## 8) Security limitations and user responsibility

No software wallet can guarantee absolute security. You are responsible for:

- safeguarding your device and browser profile;
- protecting your seed phrase and password;
- verifying transaction details before approval;
- using trusted networks and keeping your software updated.

If your device, browser profile, or backups are compromised, wallet assets may be at risk.

## 9) Your choices

Where available in extension settings, you can change privacy-related controls (for example, analytics preferences).

## 10) Contact

For privacy questions or requests, contact:

- **Privacy contact email:** `TODO: set production privacy email before Chrome Web Store submission`
- **Support URL:** `TODO: set production support URL before Chrome Web Store submission`

## 11) Changes to this policy

This policy may be updated to reflect product, legal, or operational changes. The “Last updated” date above indicates the current revision.
