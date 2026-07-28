# Chrome Web Store Privacy Practices — Terenval Wallet

Use this document when completing the Chrome Web Store Privacy Practices form. Re-check the final ZIP and production server before submission.

## Single purpose

**Purpose:** A non-custodial browser wallet that lets users create/import accounts, view assets, connect to dApps, sign requests, and send transactions on Ethereum, selected Ethereum Layer 2 networks, and Bitcoin.

## Data categories processed

### Personally identifiable information

- **Not collected by Terenval analytics.**
- The Extension does not request name, email, phone number, or government identifier for core wallet use.

### Financial and payment information

- **Yes — processed.** Public wallet addresses, balances, tokens, transaction data, and signed transactions are processed to provide wallet functionality.
- Public addresses and transaction data may be transmitted to RPC, blockchain-data, explorer, market-data, and broadcast providers when required by the user’s action.
- Seed phrases and private keys are not transmitted.

### Authentication information

- **Yes — processed locally.** Wallet password and encrypted key material are used locally for unlock and signing.
- Passwords, seed phrases, and private keys are not transmitted to Terenval servers.

### Personal communications

- **No.**

### Location

- **Not included in analytics payloads.**
- RPC and analytics servers technically receive the connection IP address. Terenval analytics infrastructure may retain IP-containing access logs for no more than 7 days and does not perform product analytics geolocation enrichment.

### Web history / browsing activity

- **Processed locally, not collected by Terenval analytics.** The Extension reads the active tab URL/origin, title, favicon, and tab ID to display dApp connection requests and remember domain permissions.
- These fields are not transmitted in product analytics.

### User activity

- **Yes, only after explicit consent.** Product analytics may include event type, selected network/chain, feature category, asset symbol, approximate USD amount bucket, app version, consent version, and hour-rounded timestamp.
- No wallet address, transaction hash, exact amount, URL, domain, or persistent analytics identifier is included.

### Website content

- **Limited local processing.** Page title and favicon are used to identify the requesting dApp in the approval UI. They are not collected by Terenval analytics.

## Data usage certifications

The developer should certify that user data is used only to:

- provide and improve the wallet’s disclosed single purpose;
- maintain security, reliability, and prevent abuse;
- comply with applicable law.

User data is not:

- sold;
- used for targeted advertising;
- used for creditworthiness or lending decisions;
- transferred for unrelated purposes;
- used to create unrelated user profiles.

## Analytics consent

- Analytics transmission is disabled until the user explicitly chooses **Enable usage analytics**.
- The alternative **Continue without analytics** is available on the same screen.
- The user can withdraw consent in **Settings → General → Usage analytics**.
- Consent version and timestamp are stored locally.

## Privacy policy URL

Publish the repository policy at:

`https://terenval.com/privacy/`

The public page must match `PRIVACY_POLICY.md` and be accessible without login before submission.

## Permission justifications

- `storage`: encrypted wallet state, accounts, settings, permissions, and local activity.
- `tabs`: identify the active dApp request and display its origin/title/favicon; associate an approved domain with the selected account.
- `clipboardWrite`: copy wallet addresses and transaction-related public values after a user action.
- `unlimitedStorage`: remove unless the final audited build demonstrates a documented core-wallet need that cannot be met by ordinary extension storage.
- broad HTTPS content-script matches: inject the wallet provider so compatible dApps can discover and request wallet access. No account is exposed without user approval.

## Pre-submission checks

1. Verify `analytics.terenval.com` is operational, HTTPS-only, and does not log request bodies.
2. Verify access-log retention is at most 7 days and event retention is at most 12 months.
3. Verify the final ZIP contains no Enkrypt/MEW analytics or screening endpoints.
4. Verify analytics remains off before explicit consent and stops immediately after opt-out.
5. Verify emitted analytics payloads contain no address, tx hash, exact amount, URL/domain, signature, raw transaction, seed phrase, private key, or password.
6. Publish the privacy policy and use the same support contact in the listing.
7. Ensure screenshots and description show only Ethereum, the approved L2 networks, and Bitcoin.
