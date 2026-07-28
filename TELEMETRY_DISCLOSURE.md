# Terenval Wallet Telemetry Disclosure

## Pipeline

The release uses one first-party product analytics pipeline:

- endpoint: `https://analytics.terenval.com/product-events`;
- optional development override: `VITE_ANALYTICS_ENDPOINT`, accepted only for HTTPS Terenval subdomains or localhost during development;
- legacy Amplitude and Enkrypt/MEW analytics endpoints are not used by the CWS release.

## Consent and controls

- No analytics event is transmitted before the user makes an explicit choice on the onboarding analytics screen.
- Selecting **Enable usage analytics** stores a versioned consent record locally.
- Analytics remains enabled until the user disables **Settings → General → Usage analytics**.
- Selecting **Continue without analytics** keeps transmission disabled.
- A material schema or purpose change must increment `ANALYTICS_CONSENT_VERSION` and request renewed consent.

## Events

Permitted high-level events include:

- wallet lifecycle: `wallet_created`, `wallet_imported`, `wallet_unlocked`;
- network selection: `network_switched`;
- sends: `send_started`, `send_submitted`;
- dApp approval and signature-request approval/rejection;
- other explicitly allowlisted product events.

## Permitted fields

- event name;
- timestamp rounded to the hour;
- extension version and consent schema version;
- network family and chain ID;
- operation/feature/screen/source category;
- asset symbol where applicable;
- approximate USD amount bucket: under $10, $10–$50, $50–$100, $100–$500, $500–$1,000, $1,000–$5,000, or $5,000+.

## Prohibited fields

The sender and sanitizer must reject:

- seed phrase, mnemonic, private key, password, or PIN;
- wallet address, public key, or account label;
- transaction hash, signature, raw transaction, or full transaction payload;
- exact amount, exact balance, or exact fee;
- website URL, origin/domain, title, favicon, browsing history, or search history;
- email address, name, phone number, or advertising identifier;
- persistent analytics user identifier.

## IP and retention

The JSON event payload does not contain an IP address. The HTTPS server can technically observe the source IP and may record it in infrastructure access logs. Production requirements:

- analytics events: retain no longer than 12 months, then delete or aggregate;
- access logs containing IP addresses: retain no longer than 7 days unless required for incident investigation or law;
- do not enrich analytics with IP geolocation, advertising IDs, fingerprints, wallet addresses, or third-party profiles;
- do not use analytics for advertising, credit, insurance, or unrelated profiling.

## Server requirements

- HTTPS only;
- no query-string event ingestion;
- strict JSON schema and request-size limit;
- discard unknown fields server-side;
- disable request-body logging;
- restrict staff access and document access controls;
- provide deletion/retention jobs and security monitoring;
- publish the matching policy at `https://terenval.com/privacy/` before CWS submission.
