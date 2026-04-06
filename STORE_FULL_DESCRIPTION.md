# Nova Wallet

Nova Wallet is a browser extension cryptocurrency wallet for managing accounts, connecting to decentralized applications (dApps), and approving blockchain transactions on supported networks.

## Single-purpose product

Nova Wallet is built for one core purpose: **self-custody wallet functionality in the browser**.

## Core capabilities

- Create or restore wallet accounts
- Manage supported network accounts and assets
- View balances, token holdings, and NFT-related data (where supported)
- Connect to compatible dApps through injected wallet providers
- Review and approve signature and transaction requests
- Send assets and interact with supported network features

## Privacy and credential handling summary

- Sensitive credentials (seed phrase, private keys, wallet password) are handled locally in wallet workflows.
- Public account identifiers (such as wallet addresses) are processed as needed for wallet operations such as balance checks and transaction handling.
- The extension does not sell user data.

## Network activity you should expect

As part of normal wallet operation, the extension may contact:

- blockchain RPC and infrastructure endpoints,
- token/NFT/transaction data providers,
- feature-specific provider APIs (for example, swap/buy integrations when used),
- optional operational services used by the product.

## Important notice

No wallet can guarantee absolute security. Users should protect seed phrases, verify transaction details, and keep browser/device environments secure.
