# Terenval Wallet Privacy Policy

**Effective date:** July 28, 2026  
**Contact:** support@terenval.com

This Privacy Policy explains how the Terenval Wallet browser extension (the “Extension”) processes information. Terenval Wallet is a non-custodial wallet for Ethereum, selected Ethereum Layer 2 networks, and Bitcoin.

## 1. Non-custodial design

Your seed phrase, private keys, passwords, PINs, and locally generated signing material remain on your device. They are encrypted in browser extension storage where applicable and are never transmitted to Terenval analytics servers, RPC providers, block explorers, market-data providers, or websites by Terenval Wallet.

Terenval Wallet cannot recover your seed phrase or private keys.

## 2. Information processed locally

The Extension processes the following information locally to provide wallet functionality:

- wallet public addresses and public keys;
- account names, selected network, selected account, and user preferences;
- balances, tokens, transaction history, pending transaction state, and locally saved activity;
- the current website URL, origin/domain, page title, favicon, and browser tab identifier when a website requests wallet access;
- the association between an approved website/domain and the account selected for that website;
- analytics consent status and the date/version of the consent decision.

Website URL, domain, title, favicon, and domain-to-account associations are used to display connection requests and remember permissions. They are not included in Terenval product analytics.

## 3. Blockchain and third-party network requests

To display balances, estimate fees, broadcast transactions, and show market information, the Extension may send public blockchain information to third-party services. Depending on the selected network and action, this may include:

- a public wallet address;
- a transaction hash or signed raw transaction when broadcasting;
- contract addresses, token identifiers, chain IDs, and JSON-RPC requests;
- the user’s IP address as an unavoidable part of an HTTPS connection.

The reduced Chrome Web Store release includes only:

- Ethereum;
- Optimism;
- Arbitrum One;
- Base;
- Polygon;
- zkSync Era;
- Linea;
- Scroll;
- Bitcoin.

Built-in requests may be sent to the RPC endpoints configured for those networks, block explorers, mempool.space for Bitcoin data and broadcast, and market-data providers used by the Extension. If you add a custom EVM network, requests are sent to the RPC and explorer endpoints you configure.

These providers process data under their own privacy policies. Terenval Wallet does not control their independent retention practices.

## 4. Optional product analytics

Terenval Wallet offers optional first-party product analytics to understand which networks and wallet functions are useful and to guide product development.

Analytics does not begin until the user makes an explicit choice on the analytics screen. If the user selects “Enable usage analytics,” analytics remains enabled until disabled in **Settings → General → Usage analytics**. If the user declines, no product analytics events are sent.

When enabled, analytics may include:

- event type, such as wallet creation/import, unlock, network switch, send start/submission, dApp connection approval, or signature request approval/rejection;
- network family and chain ID;
- operation category and screen/source category;
- asset symbol where applicable;
- an approximate USD value bucket, such as under $10, $10–$50, $50–$100, $100–$500, $500–$1,000, $1,000–$5,000, or $5,000+;
- Extension version, analytics consent version, and an event timestamp rounded to the hour.

Analytics never includes:

- seed phrase or mnemonic;
- private keys, passwords, or PINs;
- wallet addresses or public keys;
- transaction hashes, signatures, raw transactions, or full transaction payloads;
- exact transaction amounts or exact balances;
- website URLs, domains, titles, favicons, browsing history, or search history;
- email address, name, phone number, or advertising identifier.

Analytics is sent over HTTPS to `analytics.terenval.com`. The event payload contains no persistent analytics user identifier. As with any HTTPS service, the server may temporarily receive the source IP address and basic request metadata in infrastructure access logs.

## 5. Screening in the Chrome Web Store release

The reduced Chrome Web Store release does not send wallet addresses or IP/geolocation screening requests to MEWAPI or Enkrypt screening services. If a future release introduces address or jurisdiction screening, this policy and the in-product disclosure must be updated before collection begins.

## 6. Retention and deletion

- Analytics event records are retained for up to 12 months and then deleted or aggregated into non-identifying statistics.
- Infrastructure access logs that may contain an IP address are retained for no longer than 7 days, except where a longer period is necessary to investigate abuse, security incidents, or comply with law.
- Wallet data and permission associations stored locally remain until the user removes them, resets the wallet, clears Extension storage, or uninstalls the Extension.
- Disabling analytics stops future analytics transmission. Because analytics events contain no wallet address, account identifier, or persistent analytics identifier, previously collected anonymous events generally cannot be linked back to a particular user for individual deletion.

## 7. Data sharing and sale

Terenval Wallet does not sell personal information, wallet data, browsing activity, or analytics data. Analytics data is used only for product operation, security, reliability, and development. It is not used for targeted advertising, credit decisions, insurance decisions, or unrelated profiling.

Service providers may process limited data only to host Terenval infrastructure or deliver the blockchain/RPC functionality requested by the user.

## 8. Security

We use data minimization, HTTPS transport, allowlisted analytics fields, local encryption for sensitive wallet material, and automated release scanning. No software or transmission method is completely secure, and users remain responsible for protecting their device, password, and seed phrase.

## 9. Children

Terenval Wallet is not directed to children and is not intended for use by persons who cannot legally use cryptocurrency wallet software in their jurisdiction.

## 10. Changes

We may update this Privacy Policy when wallet functionality, service providers, or legal requirements change. Material changes affecting analytics or data transmission will be reflected in the Extension and may require renewed consent.

## 11. Contact

Questions or privacy requests may be sent to **support@terenval.com**.
