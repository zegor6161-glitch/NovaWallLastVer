import type { Plugin } from 'vite';

const forbiddenFragments = [
  '/src/providers/solana/',
  '/src/providers/polkadot/',
  '/src/providers/kadena/',
  '/src/providers/massa/',
  '/src/ui/onboard/hardware-wallet/',
  '/src/ui/action/views/swap/',
  '/packages/hw-wallets/',
  '/packages/swap/',
  '@enkryptcom/hw-wallets',
  '@enkryptcom/swap',
  '@massalabs/',
  '@polkadot/',
  '@solana/',
  '@kadena/',
  '@amplitude/',
];

export default function releaseScopePlugin(): Plugin {
  return {
    name: 'terenval:cws-release-scope',
    apply: 'build',
    generateBundle(_options, bundle) {
      const violations = new Set<string>();

      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        for (const moduleId of Object.keys(output.modules)) {
          const normalized = moduleId.replaceAll('\\', '/');
          if (forbiddenFragments.some(fragment => normalized.includes(fragment))) {
            violations.add(normalized);
          }
        }
      }

      if (violations.size > 0) {
        this.error(
          `Disabled providers, hardware, swap or telemetry entered the CWS bundle:\n${[
            ...violations,
          ].join('\n')}`,
        );
      }

      this.info('CWS module graph contains only approved Ethereum/L2 and Bitcoin modules.');
    },
  };
}
