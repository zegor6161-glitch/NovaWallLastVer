# REMOTE_CODE_AUDIT

## Summary

No first-party runtime remote executable code loading was identified for extension logic replacement.

## Findings

1. `new Function('return this')` in `packages/extension/public/vendor/trezor-content-script.js`
   - Type: vendor bundle pattern
   - Risk: optics risk only; bundled vendor content script, not dynamic remote fetch
   - Reviewer note: mention as third-party library bootstrap behavior

2. Dynamic import in firefox background (`src/scripts/firefox/background.ts`)
   - Type: first-party code split import
   - Risk: low; imports local packaged module only

3. Remote data/config fetches (not code execution)
   - Token lists / dapp lists / version JSON fetched over HTTPS in multiple files
   - Type: data retrieval
   - Risk: medium optics; clarify these are data sources and not executed as extension JS

## Action

- Keep reviewer documentation explicit that remote executable code is not fetched/injected.
