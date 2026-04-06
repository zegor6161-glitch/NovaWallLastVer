# TELEMETRY_DISCLOSURE

## Pipelines

1. Product events pipeline (`src/libs/analytics/*`)
   - Endpoint: `VITE_ANALYTICS_ENDPOINT` or default `https://analytics-enkrypt.mewwallet.dev/product-events`.
2. Legacy metrics pipeline (`src/libs/metrics/amplitude.ts`)
   - Endpoint: `https://analytics-enkrypt.mewwallet.dev/record` (prod) or dev endpoint.

## Runtime controls

- Telemetry is opt-in via `settings.enkrypt.isMetricsEnabled`.
- `VITE_CWS_REVIEW_BUILD=true` disables telemetry collection/transmission paths.
- Central review gate: `src/configs/review-build.ts -> isTelemetryAllowed()`.

## Events (high-level)

- Wallet lifecycle: `wallet_created`, `wallet_imported`, `wallet_unlocked`.
- Core usage: `network_switched`, `send_started`, `send_submitted`, `swap_started`, `swap_submitted`.
- Security/user approval: `dapp_connection_approved`, `signature_request_approved`, `signature_request_rejected`.

## Data sent (minimized)

- Event name, timestamp.
- Sanitized non-sensitive properties (feature/screen/network family/buckets).
- Random analytics identifier from local settings.

## Data never sent

- Seed phrase / mnemonic.
- Private keys.
- Password / PIN.
- Raw signature payloads.
- Full transaction payloads.

## Notes

- Sanitization enforced in `src/libs/analytics/sanitize.ts`.
- Additional hardening comments are embedded in analytics sender code to prevent sensitive logging changes.
