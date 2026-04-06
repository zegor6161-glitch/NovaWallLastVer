# BACKUP_DATA_FLOW

## Feature status for Chrome review builds

- `VITE_CWS_REVIEW_BUILD=true` disables remote backup list/get/create/delete/restore traffic.
- Gate: `src/configs/review-build.ts -> isBackupFeatureAllowed()`.

## Normal (non-review) backup flow

Server base URL: `https://backupstore.enkrypt.com/`.

### Upload (`POST /backups/{pubkey}/users/{userId}`)

Sent fields:
- URL params: public key, signature query param.
- JSON body: `{ payload: <encrypted backup blob> }`.

Encrypted payload logical fields before encryption:
- `accounts[]` with:
  - `basePath`
  - `pathIndex`
  - `name`
  - `signerType`
  - `walletType`
- `uuid`

### List (`GET /backups/{pubkey}`)

Sent fields:
- public key path param
- signature query param

Returns backup metadata list (`userId`, `updatedAt`, etc.).

### Fetch (`GET /backups/{pubkey}/users/{userId}`)

Sent fields:
- public key path param
- backup `userId`
- signature query param

Returns encrypted payload.

### Delete (`DELETE /backups/{pubkey}/users/{userId}`)

Sent fields:
- public key path param
- backup `userId`
- signature query param

## Sensitive-data assurance

- Seed phrase/private key/password are not uploaded in plaintext.
- Account metadata is encrypted client-side before upload.
- Signature is user-key based auth proof, not a seed/private-key disclosure.
