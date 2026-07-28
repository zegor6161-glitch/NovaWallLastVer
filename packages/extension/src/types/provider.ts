import type { InjectedProvider as EthereumProvider } from '../providers/ethereum/types';
import type { InjectedProvider as BitcoinProvider } from '@/providers/bitcoin/types';
import EventEmitter from 'eventemitter3';
import {
  MiddlewareFunction,
  NetworkNames,
  OnMessageResponse,
  RPCRequestType,
  SignerType,
} from '@enkryptcom/types';
import { RouteRecordRaw } from 'vue-router';
import PublicKeyRing from '@/libs/keyring/public-keyring';
import { RoutesType } from './ui';
import { NFTCollection } from './nft';
import { BaseNetwork } from './base-network';
import { BaseToken } from './base-token';
import { BTCRawInfo, EthereumRawInfo } from './activity';

export enum ProviderName {
  enkrypt = 'enkrypt',
  ethereum = 'ethereum',
  bitcoin = 'bitcoin',
  // Kept for storage migration and explicit rejection of legacy requests.
  polkadot = 'polkadot',
  kadena = 'kadena',
  solana = 'solana',
  massa = 'massa',
}
export enum InternalStorageNamespace {
  keyring = 'KeyRing',
  persistentEvents = 'PersistentEvents',
  domainState = 'DomainState',
  evmAccountsState = 'EVMAccountsState',
  substrateAccountsState = 'SubstrateAccountsState',
  bitcoinAccountsState = 'BitcoinAccountsState',
  kadenaAccountsState = 'KadenaAccountsState',
  solanaAccountsState = 'SolanaAccountsState',
  activityState = 'ActivityState',
  marketData = 'MarketData',
  cacheFetch = 'CacheFetch',
  nftState = 'NFTState',
  networksState = 'NetworksState',
  settingsState = 'SettingsState',
  tokensState = 'TokensState',
  customNetworksState = 'CustomNetworksState',
  rateState = 'RateState',
  recentlySentAddresses = 'RecentlySentAddresses',
  updatesState = 'UpdatesState',
  backupState = 'BackupState',
  menuState = 'MenuState',
  bannersState = 'BannersState',
}
export enum EnkryptProviderEventMethods {
  persistentEvents = 'PersistentEvents',
  chainChanged = 'enkrypt_chainChanged',
}
export type StorageNamespace = ProviderName | InternalStorageNamespace;
export enum ProviderType {
  evm,
  bitcoin,
  // Legacy values remain stable for persisted data and migrations.
  substrate,
  kadena,
  solana,
  massa,
}

export type SendMessageHandler = (
  provider: ProviderName,
  message: string,
) => Promise<any>;

export interface ProviderOptions {
  name: ProviderName;
  type: ProviderType;
  sendMessageHandler: SendMessageHandler;
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: `data:image/svg+xml;base64,${string}`;
  rdns: string;
}

export enum EIP6963Events {
  request = 'eip6963:requestProvider',
  announce = 'eip6963:announceProvider',
}

export abstract class ProviderInterface extends EventEmitter {
  name: ProviderName;
  type: ProviderType;
  version = '';
  sendMessageHandler: SendMessageHandler;
  constructor(options: ProviderOptions) {
    super();
    this.name = options.name;
    this.type = options.type;
    this.sendMessageHandler = options.sendMessageHandler;
  }
  abstract handleMessage(msg: string): void;
}

export abstract class BackgroundProviderInterface extends EventEmitter {
  middlewares: MiddlewareFunction[] = [];
  abstract namespace: string;
  abstract KeyRing: PublicKeyRing;
  abstract UIRoutes: RoutesType;
  abstract toWindow: (message: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_toWindow: (message: string) => void, options: unknown) {
    super();
  }
  abstract setRequestProvider(network: BaseNetwork): void;
  abstract request(request: ProviderRPCRequest): Promise<OnMessageResponse>;
  abstract getUIPath(page: string): string;
  abstract isPersistentEvent(request: ProviderRPCRequest): Promise<boolean>;
  abstract sendNotification(notif: string): Promise<void>;
}

/**
 * Common network functionality used by the CWS Ethereum/L2 and Bitcoin build.
 */
export abstract class ProviderAPIInterface {
  abstract node: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(node: string, options?: unknown) {}
  abstract init(): Promise<void>;
  abstract getBalance(address: string): Promise<string>;
  abstract getTransactionStatus(
    hash: string,
  ): Promise<EthereumRawInfo | BTCRawInfo | null>;
}

export type handleIncomingMessage = (
  provider: Provider,
  message: string,
) => void;

export type handleOutgoingMessage = (
  provider: Provider,
  message: string,
) => Promise<any>;

export { EthereumProvider, BitcoinProvider };
export type Provider = EthereumProvider | BitcoinProvider;

export interface ProviderRequestOptions {
  url: string;
  domain: string;
  faviconURL: string;
  title: string;
  tabId: number;
}

export interface ProviderRPCRequest extends RPCRequestType {
  options?: ProviderRequestOptions;
}

export interface UIExportOptions {
  providerName: ProviderName;
  routes: RouteRecordRaw[];
}

export interface NodeType {
  name: NetworkNames;
  name_long: string;
  homePage: string;
  blockExplorerTX: string;
  blockExplorerAddr: string;
  isTestNetwork: boolean;
  currencyName: string;
  icon: any;
  signer: SignerType[];
  node: string;
  displayAddress: (address: string) => string;
  api?: () => Promise<ProviderAPIInterface>;
  provider: ProviderName;
  coingeckoID?: string;
  NFTHandler?: (network: NodeType, address: string) => Promise<NFTCollection[]>;
  identicon: (address: string, options?: any) => string;
  assetsHandler?: (network: NodeType, address: string) => Promise<AssetsType[]>;
  basePath: string;
}

export interface AssetsType {
  name: string;
  symbol: string;
  icon: string;
  balance: string;
  balancef: string;
  balanceUSD: number;
  balanceUSDf: string;
  value: string;
  valuef: string;
  contract?: string;
  decimals: number;
  sparkline: string;
  priceChangePercentage: number;
  baseToken?: BaseToken;
}
