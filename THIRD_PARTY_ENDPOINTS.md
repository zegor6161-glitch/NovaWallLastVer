# Third-Party Endpoints — Chrome Web Store Release

This implementation-oriented disclosure describes the external services expected in the exact Terenval Wallet Chrome Web Store package. It must be checked against the generated ZIP before every submission.

## Built-in blockchain RPC endpoints

| Service | Purpose | Data that may be sent |
|---|---|---|
| `cloudflare-eth.com` | Ethereum JSON-RPC | Public address, chain state queries, transaction parameters, signed raw transaction after approval |
| `mainnet.optimism.io` | Optimism JSON-RPC | Same RPC-class data |
| `arb1.arbitrum.io` | Arbitrum One JSON-RPC | Same RPC-class data |
| `mainnet.base.org` | Base JSON-RPC | Same RPC-class data |
| `polygon-rpc.com` | Polygon JSON-RPC | Same RPC-class data |
| `mainnet.era.zksync.io` | zkSync Era JSON-RPC | Same RPC-class data |
| `rpc.linea.build` | Linea JSON-RPC | Same RPC-class data |
| `rpc.scroll.io` | Scroll JSON-RPC | Same RPC-class data |
| `mempool.space` | Bitcoin balances, UTXOs, transaction data/status, fees, and broadcast | Public Bitcoin address/public key, transaction hash, signed raw transaction after approval |

The receiving server also observes the source IP address and standard HTTPS request metadata.

## User-configured EVM endpoints

When a user adds a custom EVM network, the Extension sends JSON-RPC requests to the RPC endpoint entered by that user and opens the explorer endpoint entered by that user. Terenval does not select or control those services.

## Market information

| Service | Purpose | Data that may be sent |
|---|---|---|
| `api-v3.ethvm.dev` | Asset IDs, token metadata, and USD market data | Asset IDs, symbols, contract addresses, market-data query |
| `mainnet.mewwallet.dev/v2/prices/exchange-rates` | Fiat exchange-rate data | Requested public rate data; no secret wallet material |

## Optional first-party analytics

| Service | Purpose | Data that may be sent |
|---|---|---|
| `analytics.terenval.com/product-events` | Optional product analytics after explicit consent | Allowlisted event type, network/chain, feature/source category, asset symbol, approximate USD bucket, Extension version, consent version, hour-rounded timestamp |

Analytics does not include wallet addresses, public keys, transaction hashes, signatures, raw transactions, exact values, website information, credentials, PII, or persistent analytics identifiers.

## Explorer links opened by the user

The Extension can open the applicable public explorer after a user clicks an explorer link. Relevant families include Etherscan, Optimistic Etherscan, Arbiscan, Basescan, Polygonscan, zkSync Explorer, Lineascan, Scrollscan, and mempool.space. The URL can contain a public address or transaction hash.

## Explicitly absent from the CWS release

The artifact scanner rejects executable references to:

- legacy Enkrypt/MEW RPC, screening, backup, and analytics endpoints;
- swap and exchange aggregators;
- Trezor or other hardware-wallet services;
- Solana, Polkadot/Substrate, Kadena, Massa, Litecoin, and Dogecoin providers;
- remotely hosted executable scripts or modules.

## Verification

Run `node packages/extension/configs/cws/release.mjs`, unpack `terenval-wallet-cws.zip`, and search executable files for URLs. Any endpoint not listed here must be investigated and this disclosure and the privacy policy updated before submission.
