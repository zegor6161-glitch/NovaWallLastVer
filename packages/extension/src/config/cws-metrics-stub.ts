type MetricArguments = readonly unknown[];

const noOp = (..._args: MetricArguments): void => undefined;

export const trackNetwork = noOp;
export const trackSwapEvents = noOp;
export const trackBuyEvents = noOp;
export const trackSendEvents = noOp;
export const trackNFTEvents = noOp;
export const trackDAppsEvents = noOp;
export const optOutofMetrics = noOp;
export const trackGenericEvents = noOp;
export const trackUpdatesEvents = noOp;
export const trackSolanaStakingBanner = noOp;
