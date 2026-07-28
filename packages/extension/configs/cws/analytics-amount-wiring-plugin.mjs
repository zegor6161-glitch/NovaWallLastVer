const normalizeId = id => id.split('?')[0].replaceAll('\\', '/');

const ANALYTICS_IMPORT =
  "import { bucketizeUsdAmount } from '@/libs/analytics';";

const targets = [
  {
    suffix:
      '/providers/ethereum/ui/send-transaction/verify-transaction/index.vue',
    label: 'Ethereum manual send',
    replacements: [
      {
        from: "import { SendEventType } from '@/libs/metrics/types';",
        to: `import { SendEventType } from '@/libs/metrics/types';\n${ANALYTICS_IMPORT}`,
      },
      {
        from: `trackSendEvents(SendEventType.SendComplete, {
          network: network.value.name,
        });`,
        to: `trackSendEvents(SendEventType.SendComplete, {
          network: network.value.name,
          amountUsdBucket: isNft.value
            ? 'unknown'
            : bucketizeUsdAmount(Number(txData.toToken.valueUSD)),
          assetSymbol: isNft.value ? 'NFT' : txData.toToken.symbol,
          source: 'manual_send',
        });`,
      },
    ],
  },
  {
    suffix:
      '/providers/bitcoin/ui/send-transaction/verify-transaction/index.vue',
    label: 'Bitcoin manual send',
    replacements: [
      {
        from: "import { SendEventType } from '@/libs/metrics/types';",
        to: `import { SendEventType } from '@/libs/metrics/types';\n${ANALYTICS_IMPORT}`,
      },
      {
        from: `trackSendEvents(SendEventType.SendComplete, {
            network: network.value.name,
          });`,
        to: `trackSendEvents(SendEventType.SendComplete, {
            network: network.value.name,
            amountUsdBucket: isNft.value
              ? 'unknown'
              : bucketizeUsdAmount(Number(txData.toToken.valueUSD)),
            assetSymbol: isNft.value ? 'NFT' : txData.toToken.symbol,
            source: 'manual_send',
          });`,
      },
    ],
  },
  {
    suffix: '/providers/ethereum/ui/eth-verify-transaction.vue',
    label: 'Ethereum dApp transaction',
    replacements: [
      {
        from: "import { SendEventType } from '@/libs/metrics/types';",
        to: `import { SendEventType } from '@/libs/metrics/types';\n${ANALYTICS_IMPORT}`,
      },
      {
        from: `trackSendEvents(SendEventType.SendAPIComplete, {
              network: network.value.name,
            });`,
        to: `trackSendEvents(SendEventType.SendAPIComplete, {
              network: network.value.name,
              amountUsdBucket: isApproval.value
                ? 'unknown'
                : bucketizeUsdAmount(Number(fiatValue.value)),
              assetSymbol:
                decodedTx.value?.tokenSymbol || network.value.currencyName,
              source: isApproval.value ? 'dapp_approval' : 'dapp_send',
            });`,
      },
    ],
  },
  {
    suffix: '/providers/bitcoin/ui/btc-verify-transaction.vue',
    label: 'Bitcoin dApp PSBT signing',
    replacements: [
      {
        from: "import { SendEventType } from '@/libs/metrics/types';",
        to: `import { SendEventType } from '@/libs/metrics/types';\n${ANALYTICS_IMPORT}`,
      },
      {
        from: `trackSendEvents(SendEventType.SendAPIComplete, {
      network: network.value.name,
    });`,
        to: `trackSendEvents(SendEventType.SendAPIComplete, {
      network: network.value.name,
      amountUsdBucket: bucketizeUsdAmount(Number(fiatValue.value)),
      assetSymbol: network.value.currencyName,
      source: 'dapp_psbt_sign',
    });`,
      },
      {
        from: `trackSendEvents(SendEventType.SendAPIComplete, {
      network: network.value.name,
      error: e.error,
    });`,
        to: `trackSendEvents(SendEventType.SendAPIFailed, {
      network: network.value.name,
      error: e?.error || e?.message || 'PSBT signing failed',
    });`,
      },
    ],
  },
];

const replaceExactlyOnce = (code, replacement, label) => {
  const occurrences = code.split(replacement.from).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `[CWS analytics] ${label}: expected one source match, found ${occurrences}`,
    );
  }
  return code.replace(replacement.from, replacement.to);
};

export const wireAnalyticsAmountBuckets = (code, id) => {
  const normalizedId = normalizeId(id);
  const target = targets.find(item => normalizedId.endsWith(item.suffix));
  if (!target) return null;

  const transformed = target.replacements.reduce(
    (current, replacement) =>
      replaceExactlyOnce(current, replacement, target.label),
    code,
  );

  return { code: transformed, map: null, label: target.label };
};

export default function analyticsAmountWiringPlugin() {
  const transformedTargets = new Set();

  return {
    name: 'terenval-cws-analytics-amount-wiring',
    enforce: 'pre',
    transform(code, id) {
      const result = wireAnalyticsAmountBuckets(code, id);
      if (!result) return null;
      transformedTargets.add(result.label);
      return { code: result.code, map: result.map };
    },
    buildEnd(error) {
      if (error) return;
      const missing = targets
        .map(target => target.label)
        .filter(label => !transformedTargets.has(label));
      if (missing.length) {
        this.error(
          `[CWS analytics] Amount-bucket wiring did not run for: ${missing.join(', ')}`,
        );
      }
    },
  };
}
