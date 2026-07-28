# Terenval Wallet Privacy Policy

**Effective date:** July 28, 2026  
**Contact:** support@terenval.com

This Privacy Policy explains how the Terenval Wallet browser extension (the “Extension”) processes information. The Chrome Web Store release is a non-custodial wallet for Ethereum, selected Ethereum Layer 2 networks, custom EVM networks, and Bitcoin.

## 1. Non-custodial design

Seed phrases, private keys, wallet passwords, PINs, and signing operations are handled on the user’s device. Terenval Wallet does not transmit this secret material to Terenval servers, blockchain RPC providers, analytics services, block explorers, market-data providers, or connected websites.

Terenval Wallet cannot recover a lost seed phrase, private key, or wallet password.

## 2. Information processed locally

The Extension processes and stores information locally as needed to operate the wallet, including:

- encrypted wallet state and key material;
- public wallet addresses and public keys;
- account names and derivation metadata;
- selected accounts, networks, custom EVM network settings, and preferences;
- balances, token information, pending transaction state, and locally saved activity;
- connected-site permissions and the account/network selected for each approved site;
- the active tab URL, domain, title, favicon, and tab identifier when handling a website wallet request;
- analytics consent status, consent version, and consent timestamp.

Website information is used to identify the requesting dApp, route the request to the correct tab, and remember permissions. It is not included in Terenval product analytics.

## 3. Blockchain and market-data requests

To display balances and prices, estimate fees, read blockchain state, and broadcast user-approved transactions, the Extension sends requests to third-party services. Depending on the selected network and action, those requests may contain:

- a public wallet address or public key;
- contract addresses, token identifiers, chain IDs, and JSON-RPC method parameters;
- transaction hashes when checking status or opening an explorer;
- a signed raw transaction when the user approves broadcasting it;
- an IP address and standard connection metadata that the receiving service can observe as part of an HTTPS request.

Built-in networks in the Chrome Web Store release are Ethereum, Optimism, Arbitrum One, Base, Polygon, zkSync Era, Linea, Scroll, and Bitcoin. If the user adds a custom EVM network, requests are sent to the RPC and explorer endpoints entered by the user.

The release uses network RPC endpoints configured in the Extension, `mempool.space` for Bitcoin data and broadcast, `api-v3.ethvm.dev` and `mainnet.mewwallet.dev` for market information, and the applicable public block explorer when the user opens an explorer link. These independent providers apply their own privacy and retention practices.

## 4. Optional product analytics

Product analytics is disabled until the user explicitly chooses **Enable usage analytics**. The user can instead choose **Continue without analytics** and can later change the setting under **Settings → General → Usage analytics**.

When enabled, analytics may contain:

- an allowlisted event type, such as wallet creation/import, unlock, network switch, send initiation/submission, dApp connection approval, or signature-request approval/rejection;
- network family and chain ID;
- feature, operation, screen, route, or source category;
- asset symbol where applicable;
- an approximate USD value bucket rather than an exact amount;
- Extension version, consent version, and an event timestamp rounded to the hour.

Analytics does not contain:

- seed phrases, private keys, passwords, or PINs;
- wallet addresses, public keys, or account names;
- transaction hashes, signatures, signed raw transactions, or full transaction payloads;
- exact transaction amounts, exact balances, or exact fees;
- website URLs, domains, titles, favicons, browsing history, or search history;
- names, email addresses, phone numbers, advertising identifiers, or a persistent analytics user identifier.

Analytics events are sent over HTTPS to `analytics.terenval.com`. The JSON event does not contain an IP address, but the server can technically observe the source IP address and basic request metadata.

## 5. Features excluded from the Chrome Web Store release

The submitted release does not include swap services, hardware-wallet integrations, Solana, Polkadot, Kadena, Massa, Litecoin, or Dogecoin providers. It also disables remote settings backup and does not send data to legacy Enkrypt/MEW analytics, screening, backup, swap, or RPC services.

## 6. Retention and deletion

- Locally stored wallet data remains until the user removes it, resets the wallet, clears Extension storage, or uninstalls the Extension.
- Disabling analytics stops future analytics events.
- Terenval’s production policy is to retain analytics event records for no longer than 12 months and access logs containing IP addresses for no longer than 7 days, except where longer retention is required for security incident investigation or legal compliance.
- Analytics events contain no wallet address or persistent analytics identifier, so previously received anonymous events generally cannot be linked back to a particular wallet for individual deletion.

## 7. Use and sharing

Terenval Wallet does not sell wallet data, browsing activity, or analytics data. Information is used only to provide and improve the wallet, maintain security and reliability, prevent abuse, and comply with applicable law. It is not used for targeted advertising, credit decisions, insurance decisions, or unrelated profiling.

Third-party RPC, blockchain-data, market-data, explorer, and hosting providers receive only the information required to perform the requested service.

## 8. Security

The Extension uses local handling of secret key material, encrypted local storage where implemented by the wallet keyring, HTTPS transport for network requests, analytics field allowlisting, and automated release scanning. No software or transmission method is completely secure. Users remain responsible for protecting their device, browser profile, wallet password, and seed phrase and for reviewing every connection, signature, and transaction request.

## 9. Children

Terenval Wallet is not directed to children and is not intended for anyone who cannot legally use cryptocurrency wallet software in their jurisdiction.

## 10. Changes

This policy may be updated when functionality, providers, or legal requirements change. A material change to analytics purpose or schema requires an updated disclosure and, where appropriate, renewed consent before collection begins.

## 11. Contact

Privacy and support requests may be sent to **support@terenval.com**.
