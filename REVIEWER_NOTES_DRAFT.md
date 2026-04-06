# REVIEWER_NOTES_DRAFT

Nova Wallet is a self-custody browser wallet extension.

- Single purpose: local wallet management + dApp connection/signing.
- Sensitive credentials (seed phrase/private key/password) are handled locally.
- Any account exposure/signing/transaction action requires explicit user approval in extension UI.
- Broad host matching is used only for wallet provider interoperability with arbitrary dApp origins.
- MAIN world injection is used for EIP-1193/EIP-6963 provider visibility.
- No remote executable code is injected into pages.
- `VITE_CWS_REVIEW_BUILD=true` disables promo surfaces, telemetry, and remote backup behavior for review-focused builds.
