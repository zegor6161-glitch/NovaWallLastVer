# Permissions Justification (Chrome Web Store)

This file maps declared permissions and host matching patterns to concrete wallet features and code locations.

## Extension permissions

| Permission | Where used in code | Why needed | User-facing feature | Reviewer can understand easily? | Can be removed safely? |
|---|---|---|---|---|---|
| `storage` | `src/manifest/manifest.base.ts`; state/storage wrappers in `src/libs/common/browser-storage.ts`, `src/libs/settings-state/index.ts`, `src/libs/activity-state/index.ts`, `src/libs/tokens-state/index.ts` | Persist wallet/application state locally (encrypted wallet material, settings, account/network/token/activity caches). | Wallet remains configured between sessions; account and settings persistence. | yes | no |
| `unlimitedStorage` | `src/manifest/manifest.base.ts`; large cached/state datasets in storage-backed modules (`src/libs/nft-state/index.ts`, `src/libs/activity-state/index.ts`, `src/libs/tokens-state/index.ts`) | Prevents quota pressure for multi-network wallet metadata/history caches. | Reliable asset/activity/NFT experience across networks. | yes | no (high risk of degraded UX/data truncation) |
| `tabs` | `src/manifest/manifest.base.ts`; tab operations in `src/libs/window-promise/promise.ts`, `src/libs/utils/open-onboard.ts`, `src/libs/utils/open-hardware.ts`, `src/libs/background/index.ts` | Open/focus/update browser tabs for wallet UX and provider flows. | Open onboarding/privacy pages, hardware wallet flows, and wallet-initiated navigation. | yes | no |
| `clipboardWrite` | `src/manifest/manifest.base.ts`; copy actions in `src/ui/action/components/accounts-header/components/header-accounts.vue`, `src/ui/action/views/deposit/index.vue` | Allow explicit user-triggered copying of addresses/values. | "Copy address" and related clipboard UX. | yes | mostly no (would break copy UX) |

## Host permissions / host matching

> Note: host scope is effectively required by declared content script matching for wallet provider injection and dApp connectivity.

| Host pattern / domain | Where used in code | Why needed | Risk level | Note for reviewer |
|---|---|---|---|---|
| `http://*/*` and `https://*/*` | `configs/vite/transform-manifest.ts` (content script + inject script matching), `src/scripts/inject.ts` (provider injection), `src/scripts/contentscript.ts` | dApp pages can detect/connect to injected wallet providers and communicate with extension wallet flows. | medium | Broad host scope is standard for browser wallets with dApp injection. |
| `*://connect.trezor.io/*/*` | `configs/vite/transform-manifest.ts` (Trezor content script matching), bundled `public/vendor/trezor-content-script.js` | Hardware wallet integration path for Trezor Connect. | medium | Narrowly scoped to Trezor Connect path. |

## Honest review notes

- Current permissions align with wallet features.
- We did not identify clearly unused permissions in the reviewed manifest sources.
- If product scope changes (for example, removal of hardware flows), host matching and related scripts should be re-reviewed before release.
