import { ProviderName } from '@/types/provider';
import { NetworkNames } from '@enkryptcom/types';
import {
  BuyEventType,
  DAppsEventType,
  GenericEvents,
  NFTEventType,
  NetworkChangeEvents,
  NetworkType,
  SendEventType,
  SwapEventType,
  UpdatesEventType,
  UpdatesOpenLocation,
  SolanaStakingBannerEvents,
} from './types';
import { track as trackAnalytics, setAnalyticsEnabled } from '@/libs/analytics';

const trackGenericEvents = (event: GenericEvents) => {
  if (event === GenericEvents.login_success) {
    void trackAnalytics('wallet_unlocked', {
      unlock_method: 'password',
      wallet_type: 'srp',
    });
  }
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
  if (
    event === NetworkChangeEvents.NetworkChangeAPI ||
    event === NetworkChangeEvents.NetworkChangePopup ||
    event === NetworkChangeEvents.NetworkActiveChanged
  ) {
    void trackAnalytics('network_switched', {
      chain_id: options.customChainId || String(options.network || ''),
      network_family: options.provider || 'evm',
      screen: 'network_selector',
    });
  }
};

const trackSwapEvents = (
  event: SwapEventType,
  options: {
    network: NetworkNames;
    fromToken?: string;
    toToken?: string;
    swapProvider?: string;
    error?: string;
    amountUsdBucket?: string;
  },
) => {
  if (event === SwapEventType.SwapOpen) {
    void trackAnalytics('swap_started', {
      chain_id: String(options.network),
      feature: 'swap',
      token_in_symbol: options.fromToken,
      token_out_symbol: options.toToken,
      wallet_type: 'srp',
      screen: 'swap_page',
      amount_usd_bucket: options.amountUsdBucket,
    });
  }
  if (event === SwapEventType.SwapComplete) {
    void trackAnalytics('swap_submitted', {
      chain_id: String(options.network),
      feature: 'swap',
      token_in_symbol: options.fromToken,
      token_out_symbol: options.toToken,
      route_type: options.swapProvider || 'aggregated',
      amount_usd_bucket: options.amountUsdBucket,
    });
  }
};

const trackBuyEvents = (_event: BuyEventType, _options: { network: NetworkNames }) => undefined;

const trackSendEvents = (
  event: SendEventType,
  options: {
    network: NetworkNames;
    error?: string;
    amountUsdBucket?: string;
    assetSymbol?: string;
    source?: string;
  },
) => {
  if (event === SendEventType.SendOpen || event === SendEventType.SendAPIVerify) {
    void trackAnalytics('send_started', {
      chain_id: String(options.network),
      screen: 'send_page',
      amount_usd_bucket: options.amountUsdBucket,
      asset_symbol: options.assetSymbol,
      source: options.source || 'manual_send',
    });
  }
  if (event === SendEventType.SendComplete || event === SendEventType.SendAPIComplete) {
    void trackAnalytics('send_submitted', {
      chain_id: String(options.network),
      source: options.source || 'manual_send',
      amount_usd_bucket: options.amountUsdBucket,
      asset_symbol: options.assetSymbol,
    });
  }
};

const trackNFTEvents = (_event: NFTEventType, _options: { network: NetworkNames }) => undefined;
const trackDAppsEvents = (_event: DAppsEventType, _options: { network: NetworkNames }) => undefined;
const trackUpdatesEvents = (
  _event: UpdatesEventType,
  _options: { network: NetworkNames; location?: UpdatesOpenLocation; duration?: number },
): void => undefined;
const optOutofMetrics = (optOut: boolean) => {
  void setAnalyticsEnabled(!optOut);
};
const trackSolanaStakingBanner = (_event: SolanaStakingBannerEvents) => undefined;

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
