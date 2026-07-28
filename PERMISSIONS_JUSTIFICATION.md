# Chrome Web Store Permission Justifications — Terenval Wallet

These explanations must match the final `manifest.json` in the submitted ZIP.

## `storage`

Terenval Wallet uses extension storage to persist encrypted wallet state, public account metadata, selected accounts and networks, custom EVM configurations, connected-site permissions, local transaction activity, preferences, lock state, and analytics consent. Without this permission the wallet could not preserve accounts and settings between browser sessions.

## `tabs`

The wallet reads the active tab ID, URL/domain, page title, and favicon when processing a dApp request. This lets the approval screen identify the requesting website, associate the approved account/network with the correct origin, and return the result to the correct browser tab. The permission is not used for browsing-history analytics, advertising, page scraping, or monitoring unrelated activity.

## `clipboardWrite`

The wallet writes to the clipboard only after an explicit user action, such as clicking a control to copy a public wallet address or public transaction-related value.

## Broad HTTPS content-script matches

Compatible dApps can exist on arbitrary HTTPS origins and expect a wallet provider to be present in page context at load time. Packaged bridge scripts therefore run at `document_start` to expose Ethereum and Bitcoin provider interfaces and forward user-initiated requests to the Extension.

No account is exposed, signature created, or transaction submitted without a separate user decision in Extension UI. The scripts do not scrape website content, credentials, forms, communications, or browsing history and do not load remote executable code.

## `web_accessible_resources`

Only the packaged provider bridge script is exposed to HTTPS pages so the Extension can place its provider in the page’s MAIN world. It is not a general remote-code loader.

## Content Security Policy

Extension pages use `script-src 'self' 'wasm-unsafe-eval'; object-src 'self'`. The WebAssembly allowance is required only for bundled cryptographic dependencies. The release scanner rejects remote script execution patterns.

## Permissions intentionally absent

The Chrome Web Store release does not request `unlimitedStorage`, history, cookies, downloads, geolocation, notifications, identity, webRequest, debugger, nativeMessaging, or hardware-device permissions.
