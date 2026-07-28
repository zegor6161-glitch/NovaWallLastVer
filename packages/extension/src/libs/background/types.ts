import BitcoinProvider from '@/providers/bitcoin';
import type EthereumProvider from '@/providers/ethereum';

export interface TabProviderType {
  [key: string]: Record<number, EthereumProvider | BitcoinProvider>;
}

export interface ProviderType {
  [key: string]: typeof EthereumProvider | typeof BitcoinProvider;
}

export interface ExternalMessageOptions {
  savePersistentEvents: boolean;
}
