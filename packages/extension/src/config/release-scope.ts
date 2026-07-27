import { ProviderName } from '@/types/provider';

/**
 * Provider families shipped in the Chrome Web Store release.
 *
 * Ethereum includes the built-in EVM and Layer 2 networks. Bitcoin remains a
 * separate provider family. Other provider implementations stay in the source
 * tree for future work, but they are intentionally not imported by the release
 * entry points and therefore must not be bundled into the publish artifact.
 */
export const ENABLED_PROVIDER_NAMES = [
  ProviderName.ethereum,
  ProviderName.bitcoin,
] as const;

export type EnabledProviderName = (typeof ENABLED_PROVIDER_NAMES)[number];

const ENABLED_PROVIDER_SET = new Set<ProviderName>(ENABLED_PROVIDER_NAMES);

export const isProviderEnabled = (
  provider: ProviderName,
): provider is EnabledProviderName => ENABLED_PROVIDER_SET.has(provider);
