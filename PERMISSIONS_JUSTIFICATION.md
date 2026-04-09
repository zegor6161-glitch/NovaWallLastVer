# PERMISSIONS_JUSTIFICATION

## permissions

### storage
- Why: Persist wallet settings, lock state, network preferences, and local wallet metadata.
- Feature: Core wallet state persistence.
- Code: `src/libs/settings-state/*`, `src/libs/keyring/*`, `src/libs/backup-state/index.ts`.
- Removable: No (core functionality).
- Review risk: Low if clearly documented.

### unlimitedStorage
- Why: Prevent quota issues for multi-chain state caches and account/activity metadata.
- Feature: Stable local wallet operation across many networks/assets.
- Code: cache/state modules under `src/libs/*-state`.
- Removable: Possibly with functional degradation and data loss risk.
- Review risk: Medium optics; justify as wallet-state reliability.

### tabs
- Why: Open/focus onboarding, support links, and wallet-triggered flows.
- Feature: User navigation from extension workflows.
- Code: `src/libs/utils/open-onboard.ts`, UI settings/support routes.
- Removable: Potentially partly, but would break expected UX.
- Review risk: Medium; explain exact user-triggered usage.

### clipboardWrite
- Why: Copy address/tx identifiers on explicit user action.
- Feature: Wallet usability.
- Code: action UI components with copy interactions.
- Removable: Yes, but degrades core UX.
- Review risk: Low-Medium.

## host permissions via content script matches

### http://*/* and https://*/*
- Why: Required for universal dApp provider availability.
- Feature: EIP-1193/EIP-6963 wallet detection and connection on arbitrary dApp origins.
- Code: `configs/vite/transform-manifest.ts`, `src/scripts/inject.ts`, `src/scripts/contentscript.ts`.
- Removable: No, without major dApp compatibility breakage.
- Review risk: High optics; mitigated by strict reviewer justification and no secret exfil behavior.

### *://connect.trezor.io/*/*
- Why: Hardware wallet integration support.
- Feature: Trezor connect content script workflow (hardware-wallet interoperability only).
- Code: `configs/vite/transform-manifest.ts`, `public/vendor/trezor-content-script.js`.
- Removable: Yes if Trezor support is fully removed through dedicated refactor; not changed in this pass to avoid breakage risk for hardware-wallet abstractions.
- Review risk: Medium.

## other manifest surfaces

- `externally_connectable`: not configured.
- `web_accessible_resources`: limited to local injection scripts for provider bridge.
- CSP: extension pages use `'self'` plus `'wasm-unsafe-eval'` for bundled local wasm crypto compatibility (e.g., `@polkadot/wasm-crypto` signing paths).
- `wasm-unsafe-eval` is not used to load or execute arbitrary remote code; extension logic is shipped in-package.


## non-core surfaces

- Promo/reward/survey UI surfaces are non-core and are disabled in current builds, including CWS review builds, to preserve a wallet-only reviewer experience.
