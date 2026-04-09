# REVIEWER_TEST_STEPS (Chrome Web Store)

This script is for reviewer-facing validation of **core wallet behavior**.
It avoids promo/reward/survey surfaces and focuses on wallet intent.

## Preconditions

- Load the review package build prepared for Chrome Web Store moderation.
- Confirm release notes/build notes indicate `VITE_CWS_REVIEW_BUILD=true`.
- Use a clean browser profile.

## Test steps

1. **Install extension**
   - Load the submitted extension package in Chrome and pin/open Nova Wallet.

2. **Open wallet UI**
   - Verify first-run onboarding appears and clearly presents wallet setup options.

3. **Create or import wallet**
   - Choose either “Create new wallet” or “Import existing wallet” and complete required onboarding prompts.

4. **Confirm onboarding intent**
   - Verify onboarding is wallet-focused (account setup/security prompts), not ad-tech or unrelated data collection.

5. **View account/address**
   - Open main wallet screen and confirm account address and basic balance/asset panel are visible.

6. **Open a wallet-compatible dApp/test page**
   - Navigate to a dApp or wallet test page that can request provider connection.

7. **Approve connection request**
   - Trigger wallet connect from the page and approve in extension UI.
   - Confirm connected account is shown to the page only after approval.

8. **Sign message (approve path)**
   - Trigger a message-signature request and approve it in the wallet.
   - Confirm request details are shown before confirmation.

9. **Sign message (reject path)**
   - Trigger another signature request and reject it in the wallet.
   - Confirm rejection is returned to the requesting page.

10. **Open transaction approval flow**
    - Trigger a transaction request from the connected page (testnet/safe environment preferred).
    - Confirm wallet shows transaction review details before approval.

11. **Reject transaction**
    - Reject the transaction and confirm the page receives a rejection outcome.

12. **Approve transaction (safe path)**
    - If a safe non-mainnet test is available, approve one transaction and verify normal approval flow.
    - If no safe test path is available in reviewer environment, mark as **manual verification required** instead of forcing real mainnet value transfer.

13. **Verify core wallet scope**
    - Confirm extension behavior is consistent with wallet purpose: account access, dApp connectivity, signing, transaction approval.

14. **Verify review-build expectations**
    - Confirm reviewer package notes indicate non-core telemetry and remote backup flows are disabled for review build mode.

15. **Conclusion**
    - Conclude extension acts as a browser crypto wallet with user-approved connect/sign/send decisions in extension UI.

## Notes for moderation context

- Seed phrase/private keys/password are expected to remain local in wallet workflows.
- Broad site matching is expected for provider interoperability across user-visited dApps.
