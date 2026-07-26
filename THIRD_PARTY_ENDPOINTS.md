# THIRD_PARTY_ENDPOINTS (Reviewer Disclosure)

This document summarizes external domains/service families used by Terenval Wallet.
It is reviewer-facing and focused on purpose, data scope, and review-build behavior.

## Notes for reviewers

- Scope: endpoint families observed in repository configuration and source references.
- This is not a legal policy; it is an implementation-oriented review aid.
- Where exact runtime host lists can vary (for example by enabled networks or custom RPC settings), entries are marked **to verify from build/runtime config**.

---

## 1) Blockchain RPC / node access

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `nodes.mewapi.io` (e.g., `/rpc/eth`, `/rpc/bsc`, `/rpc/arb`, `/rpc/sol`) | Default RPC access for supported chains; balance/state/tx reads and tx broadcasting via network modules | Public wallet addresses, chain IDs, RPC method params/results, signed tx payloads when user sends | Required for core wallet operation (when these defaults are selected) | Yes | No | Core wallet network traffic. |
| Chain-specific RPC hosts from network configs (multiple domains) | Multi-network on-chain access across supported networks | Same RPC-class data as above | Required for any enabled network; exact host depends on selected network | Yes | No | **To verify from build/runtime config** for exact active host set. |
| User-added custom RPC endpoints | User-configured network access (custom EVM RPC) | RPC request/response payloads chosen by user | Optional | Yes (if user adds custom network) | No | Endpoint chosen explicitly by user. |

## 2) Token / asset metadata

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `raw.githubusercontent.com/enkryptcom/dynamic-data/...` | Token lists, dApp lists, swap lists, and related static config JSON | Public list/config payloads; no seed/private key/password | Optional for enriched discovery/list UX; core signing wallet can still function without some lists | Yes | No | Content/config fetches, not remote executable extension logic. |
| `partners.mewapi.io/nftsv2/`, `development.mewwallet.dev/v3/`, `evmapi.confluxscan.org` | NFT metadata/collection lookups for supported chains | Public address + NFT query parameters/results | Optional (NFT surfaces) | Yes | No | Used for asset display and metadata enrichment. |

## 3) Price / market data

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `mainnet.mewwallet.dev/v2/prices/exchange-rates` | Fiat/market rate display in wallet UI | Asset symbols/IDs and pricing responses | Optional (display enhancement) | Yes | No | Non-custodial market data feed. |
| `api-v3.ethvm.dev` | Gas/fee and market-related supporting data for EVM flows | Network/fee query parameters and returned market data | Optional enhancement | Yes | No | No sensitive credential material expected. |

## 4) Wallet connectivity and safety services

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `partners.mewapi.io/o/ipcomply` | Regional/compliance gating checks | Client network/IP-context level response | Optional compliance/safety control | Yes | No | Used to determine availability restrictions. |
| `partners.mewapi.io/o/walletscreen?address=...` | Wallet screening/risk checks | Public wallet address query + risk response | Optional compliance/safety control | Yes | No | Address-based screening endpoint. |

## 5) Swap / exchange aggregation services (optional feature set)

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `partners.mewapi.io/oneinch/v6.0/`, `partners.mewapi.io/zeroxv2`, `partners.mewapi.io/changelly-v2`, `partners.mewapi.io/okxswapv6` | Partner-routed swap quotes/transactions | From/to assets, amounts, slippage, destination/refund address fields, quote/route payloads | Optional | Yes (when user opens swap feature) | No (based on review flag scope currently implemented) | Activated by user swap actions only. |
| `apiv5.paraswap.io`, `fusion.1inch.io`, `api.rango.exchange`, `lite-api.jup.ag` | Direct aggregator APIs (quotes, routing, token data) | Quote parameters and routing/transaction payloads | Optional | Yes (when corresponding provider is used) | No (based on review flag scope currently implemented) | **To verify from build/runtime provider configuration** for exact active provider set. |

## 6) Analytics / telemetry

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `analytics-enkrypt.mewwallet.dev/product-events` (or `VITE_ANALYTICS_ENDPOINT`) | Product event telemetry pipeline | Event names, timestamps, sanitized non-sensitive event properties, local analytics identifier | Optional | Yes (when telemetry setting enabled) | **Yes** (`VITE_CWS_REVIEW_BUILD=true`) | Review build gate explicitly blocks telemetry sending paths. |
| `analytics-enkrypt.mewwallet.dev/record` (legacy metrics path) | Legacy metrics pipeline | Non-sensitive metrics/event payloads | Optional | Yes | **Yes** (`VITE_CWS_REVIEW_BUILD=true`) | Disabled by same review-build telemetry gate. |

## 7) Backup / sync / support services

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `backupstore.enkrypt.com` | Remote encrypted backup list/get/create/delete/restore | Public key path params, signature query param, encrypted backup payload blob (account metadata encrypted client-side) | Optional, non-core | Yes (if user enables/uses backup) | **Yes** (`VITE_CWS_REVIEW_BUILD=true`) | Review build disables remote backup network flows. |
| Terenval support links (`terenval.com/support/`, support mail links) | User support documentation/navigation | Standard link navigation only | Optional | Yes | No | Informational/support resources, not wallet transaction backends. |

## 8) Third-party hardware wallet integrations

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| `connect.trezor.io` | Trezor Connect bridge for hardware wallet workflows | Hardware-wallet session and signing request metadata (not seed phrase/private key export) | Optional (only for Trezor users) | Yes (when user uses Trezor flow) | No | Hardware-wallet integration endpoint family. |
| Ledger transport stack (WebUSB) | Ledger hardware signing transport | Device/app interaction payloads over local transport | Optional (only for Ledger users) | Yes | No | Primarily local hardware transport; external service hosts **to verify from vendor/runtime behavior**. |

## 9) Other external services

| Domain / service | Purpose | Data involved | Required or optional | Used in normal build? | Disabled in review build? | Reviewer note |
|---|---|---|---|---|---|---|
| Public explorer/NFT links opened by user action (e.g., `rarible.com`, `magiceden.io`, `ordinals.com`) | Open external page for user to inspect asset/transaction data | Link target identifiers (contract, token ID, inscription, tx hash) | Optional | Yes (only when user clicks) | No | Navigation action initiated by user from UI. |

---

## Review-build interpretation

With `VITE_CWS_REVIEW_BUILD=true`, the project explicitly gates off telemetry and remote backup flows, leaving core wallet behavior for review.

Promo/reward/survey surfaces are not part of the current wallet UX and are therefore not included in this endpoint disclosure scope.
