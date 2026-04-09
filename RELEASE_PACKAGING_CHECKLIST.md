# RELEASE_PACKAGING_CHECKLIST (Chrome Web Store Submission)

Use this checklist before uploading the final package.
Focus: clean extension artifact + consistent reviewer/disclosure materials.

## 1) Build/profile verification

- [ ] Confirm submission artifact is produced from intended release commit/tag.
- [ ] Confirm moderation build profile used for review package (`VITE_CWS_REVIEW_BUILD=true`, if this is the selected review strategy).
- [ ] Confirm manifest/permissions in built package match documented rationale.
- [ ] Confirm no debug/dev-only flags were accidentally enabled in the submission artifact.

## 2) Required upload artifact contents

- [ ] Include only required extension runtime build files for Chrome Web Store upload.
- [ ] Include packaged local assets required by runtime (icons, static vendor assets, wasm files used by bundled crypto libs, etc.).
- [ ] Confirm bundle starts and opens extension UI without missing asset/runtime errors.

## 3) Files that must NOT be in submission archive

- [ ] No test fixtures, local diagnostics, temporary scripts, or ad-hoc debug artifacts.
- [ ] No source maps or internal build traces unless intentionally required.
- [ ] No private keys/seeds/secrets, local `.env` files, or credentials.
- [ ] No unrelated documentation/dev notes inside runtime upload archive.

## 4) Reviewer-facing materials to keep ready

Keep these documents synchronized and ready to paste/attach as needed:

- [ ] `CHROME_WEB_STORE_REVIEW_NOTES.md`
- [ ] `PERMISSIONS_JUSTIFICATION.md`
- [ ] `THIRD_PARTY_ENDPOINTS.md`
- [ ] `DATA_DISCLOSURE_SUMMARY.md`
- [ ] `TELEMETRY_DISCLOSURE.md`
- [ ] `BACKUP_DATA_FLOW.md`
- [ ] `REVIEWER_TEST_STEPS.md`

## 5) Store/listing consistency checks

- [ ] `STORE_SHORT_DESCRIPTION.txt` and `STORE_FULL_DESCRIPTION.md` describe the same single-purpose wallet narrative.
- [ ] Listing copy matches reviewer notes for permissions rationale and core scope.
- [ ] Listing copy includes concrete disclosure language for local-sensitive data handling and network usage.
- [ ] Listing copy does not promise unsupported behaviors/features.

## 6) Privacy/support contact verification (manual)

- [ ] Replace TODO placeholders in `SUPPORT.md` and `PRIVACY_POLICY.md` with production values.
- [ ] Verify support/privacy contacts match Chrome Web Store listing fields exactly.
- [ ] Verify privacy policy URL/support URL resolve correctly in a logged-out browser.

## 7) Endpoint/disclosure verification (manual)

- [ ] Reconfirm active endpoint families against current build/runtime config (especially optional providers/custom RPC behavior).
- [ ] Reconfirm telemetry behavior matches settings + review profile assumptions.
- [ ] Reconfirm remote backup behavior matches review-profile documentation.

## 8) Final go/no-go gate

- [ ] Re-run `GO_NO_GO_ASSESSMENT.md` blockers before upload.
- [ ] Confirm no unresolved high-risk contradiction remains between listing, reviewer notes, and privacy/disclosure docs.
- [ ] Archive final submission package + exact reviewer copy used for moderation responses.
