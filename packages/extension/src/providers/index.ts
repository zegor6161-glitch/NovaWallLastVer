import EthereumProvider from '@/providers/ethereum';
import BitcoinProvider from '@/providers/bitcoin';
import { ProviderName } from '@/types/provider';

export default {
  [ProviderName.ethereum]: EthereumProvider,
  [ProviderName.bitcoin]: BitcoinProvider,
};
