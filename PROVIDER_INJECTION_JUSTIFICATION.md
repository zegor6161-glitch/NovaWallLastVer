# PROVIDER_INJECTION_JUSTIFICATION

## Why global injection exists

Wallet/dApp interoperability requires exposing provider objects in arbitrary dApp pages.
Without this, EIP-1193/EIP-6963 discovery and request flows fail for most dApps.

## Why MAIN world is used

Provider objects must exist in page JavaScript context (`window`) to be visible to dApp code.
Isolated world injection is insufficient for standard wallet detection paths.

## Security boundaries

- Injected script is packaged with extension bundle, not remote JS.
- Provider object exposes request APIs; it does not expose seed phrase/private key/password.
- Account access, signature, and transaction flows require explicit user confirmation in extension UI.
- Sensitive operations are mediated through extension background/message handlers.

## Scope notes

- Broad URL matches (`http://*/*`, `https://*/*`) are retained for compatibility with user-selected dApps.
- This is standard behavior for browser wallet extensions; reducing to a static allowlist breaks expected wallet functionality.
