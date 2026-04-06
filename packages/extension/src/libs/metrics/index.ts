import { ProviderName } from '@/types/provider';
import { NetworkNames } from '@enkryptcom/types';
import Metrics from './amplitude';
import {
  BuyEventType,
  DAppsEventType,
  GenericEvents,
  NFTEventType,
  NetworkChangeEvents,
  NetworkType,
  SendEventType,
  SettingEventType,
  SwapEventType,
  UpdatesEventType,
  UpdatesOpenLocation,
  SolanaStakingBannerEvents,
} from './types';

const metrics = new Metrics();

const redactText = (value?: string) => {
  if (!value) return undefined;
  return `len:${value.length}`;
};

const trackGenericEvents = (event: GenericEvents) => {
  metrics.track('generic', { event });
};

const trackNetwork = (
  event: NetworkChangeEvents,
  options: {
    provider?: ProviderName;
    network?: NetworkNames;
    networkTab?: string;
    networkType?: NetworkType;
    isPinned?: boolean;
    sortOption?: string;
    customRpcUrl?: string;
    customNetworkName?: string;
    customNetworkNameLong?: string;
    customNetworkCurrency?: string;
    customNetworkCurrencyLong?: string;
    customChainId?: string;
    customBlockExplorerUrlTx?: string;
    customBlockExplorerUrlAddr?: string;
  },
) => {
  metrics.track('network', {
    event,
    provider: options.provider,
    network: options.network,
    networkTab: options.networkTab,
    networkType: options.networkType,
    isPinned: options.isPinned,
    sortOption: options.sortOption,
    hasCustomRpcUrl: Boolean(options.customRpcUrl),
    hasCustomBlockExplorerUrlTx: Boolean(options.customBlockExplorerUrlTx),
    hasCustomBlockExplorerUrlAddr: Boolean(options.customBlockExplorerUrlAddr),
    customNetworkNameLength: redactText(options.customNetworkName),
    customNetworkNameLongLength: redactText(options.customNetworkNameLong),
    customNetworkCurrencyLength: redactText(options.customNetworkCurrency),
    customNetworkCurrencyLongLength: redactText(options.customNetworkCurrencyLong),
    customChainIdLength: redactText(options.customChainId),
  });
};

const trackSwapEvents = (
  event: SwapEventType,
  options: {
    network: NetworkNames;
    fromToken?: string;
    toToken?: string;
    swapProvider?: string;
    error?: string;
  },
) => {
  metrics.track('swap', {
    event,
    network: options.network,
    fromToken: options.fromToken,
    toToken: options.toToken,
    swapProvider: options.swapProvider,
    hasError: Boolean(options.error),
    errorLength: redactText(options.error),
  });
};

const trackBuyEvents = (
  event: BuyEventType,
  options: {
    network: NetworkNames;
  },
) => {
  metrics.track('buy', { event, ...options });
};

const trackSendEvents = (
  event: SendEventType,
  options: {
    network: NetworkNames;
    error?: string;
  },
) => {
  metrics.track('send', {
    event,
    network: options.network,
    hasError: Boolean(options.error),
    errorLength: redactText(options.error),
  });
};

const trackNFTEvents = (
  event: NFTEventType,
  options: {
    network: NetworkNames;
  },
) => {
  metrics.track('nft', { event, ...options });
};

const trackDAppsEvents = (
  event: DAppsEventType,
  options: {
    network: NetworkNames;
  },
) => {
  metrics.track('dapps', { event, ...options });
};

const trackUpdatesEvents = (
  event: UpdatesEventType,
  options: {
    network: NetworkNames;
    location?: UpdatesOpenLocation;
    duration?: number;
  },
): void => {
  metrics.track('updatesClick', { event, ...options });
};
const optOutofMetrics = (optOut: boolean) => {
  if (!__IS_FIREFOX__) {
    metrics.setOptOut(false);
    metrics.track('settings', {
      event: SettingEventType.OptOut,
      value: optOut ? 1 : 0,
    });
  }
  metrics.setOptOut(optOut);
};

const trackSolanaStakingBanner = (event: SolanaStakingBannerEvents) => {
  metrics.track('solStakingBanner', { event });
};

export {
  trackNetwork,
  trackSwapEvents,
  trackBuyEvents,
  trackSendEvents,
  trackNFTEvents,
  trackDAppsEvents,
  optOutofMetrics,
  trackGenericEvents,
  trackUpdatesEvents,
  trackSolanaStakingBanner,
};
