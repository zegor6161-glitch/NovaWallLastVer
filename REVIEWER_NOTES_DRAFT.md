# REVIEWER_NOTES_DRAFT

Terenval Wallet is a self-custody browser wallet extension for Bitcoin, Ethereum/EVM, and Solana.

- Single purpose: local wallet management + dApp connection/signing.
- Sensitive credentials (seed phrase/private key/password) are handled locally.
- Any account exposure/signing/transaction action requires explicit user approval in extension UI.
- Broad host matching is used only for wallet provider interoperability with arbitrary dApp origins.
- MAIN world injection is used for EIP-1193/EIP-6963 provider visibility.
- No remote executable code is injected into pages.
- Promo/reward/survey surfaces are not part of the current wallet UX; `VITE_CWS_REVIEW_BUILD=true` additionally disables telemetry and remote backup behavior for review-focused builds.
- CSP includes `wasm-unsafe-eval` only for bundled local wasm crypto compatibility (no arbitrary remote code execution).
- Trezor integration uses a static bundled content script asset and is not a generic remote code loader.
