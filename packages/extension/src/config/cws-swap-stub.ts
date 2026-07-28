const disabled = () => {
  throw new Error('Swap is not available in the Terenval Chrome Web Store release.');
};

export class SwapToken {
  constructor() {
    disabled();
  }
}

export const TokenType = Object.freeze({});
export const TokenTypeTo = Object.freeze({});
export const WalletIdentifier = Object.freeze({ enkrypt: 'enkrypt' });
export const SupportedNetworkName = Object.freeze({});
export const NetworkType = Object.freeze({});
export const TransactionType = Object.freeze({});
export const TransactionStatus = Object.freeze({});
export const PROVIDER_INFO = Object.freeze({});

export const isSupportedNetwork = () => false;
export const getSupportedNetworks = () => [];
export const getNetworkInfoByName = () => undefined;
export const sortByRank = <T>(value: T): T => value;
export const sortNativeToFront = <T>(value: T): T => value;

export type NetworkInfo = never;
export type ProviderQuoteResponse = never;
export type ProviderSwapResponse = never;
export type GenericTransaction = never;
export type SolanaTransaction = never;
export type EVMTransaction = never;
export type StatusOptionsResponse = never;
export type StatusOptions = never;
export type ToTokenType = never;

export default class DisabledSwap {
  constructor() {
    disabled();
  }
}
