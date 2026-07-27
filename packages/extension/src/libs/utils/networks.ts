import { ProviderName } from '@/types/provider';
import { NetworkNames } from '@enkryptcom/types';
import EthereumNetworks from '@/providers/ethereum/networks';
import BitcoinNetworks from '@/providers/bitcoin/networks';
import { BaseNetwork } from '@/types/base-network';
import CustomNetworksState from '../custom-networks-state';
import { CustomEvmNetwork } from '@/providers/ethereum/types/custom-evm-network';
import Ethereum from '@/providers/ethereum/networks/eth';
import Bitcoin from '@/providers/bitcoin/networks/bitcoin';

const providerNetworks: Partial<
  Record<ProviderName, Record<string, BaseNetwork>>
> = {
  [ProviderName.ethereum]: EthereumNetworks,
  [ProviderName.bitcoin]: BitcoinNetworks,
  [ProviderName.enkrypt]: {},
};

const getAllNetworks = async (
  includeCustom: boolean = true,
): Promise<BaseNetwork[]> => {
  const customNetworksState = new CustomNetworksState();
  const customNetworks = (
    await customNetworksState.getAllCustomEVMNetworks()
  ).map(options => new CustomEvmNetwork(options));

  const allNetworks = (Object.values(EthereumNetworks) as BaseNetwork[]).concat(
    Object.values(BitcoinNetworks) as BaseNetwork[],
  );

  return includeCustom ? allNetworks.concat(customNetworks) : allNetworks;
};

const getNetworkByName = async (
  name: string,
): Promise<BaseNetwork | undefined> =>
  (await getAllNetworks()).find(net => net.name === name);

const getProviderNetworkByName = async (
  provider: ProviderName,
  networkName: string,
): Promise<BaseNetwork | undefined> => {
  let networks = Object.values(providerNetworks[provider] ?? {});

  if (provider === ProviderName.ethereum) {
    const customNetworkState = new CustomNetworksState();
    const customNetworks = (
      await customNetworkState.getAllCustomEVMNetworks()
    ).map(options => new CustomEvmNetwork(options));
    networks = [...customNetworks, ...networks];
  }

  return networks.find(net => net.name === networkName);
};

const DEFAULT_EVM_NETWORK_NAME = NetworkNames.Ethereum;
const DEFAULT_BTC_NETWORK_NAME = NetworkNames.Bitcoin;
const DEFAULT_EVM_NETWORK = Ethereum;
const DEFAULT_BTC_NETWORK = Bitcoin;

const POPULAR_NAMES = [
  NetworkNames.Bitcoin,
  NetworkNames.Ethereum,
  NetworkNames.Matic,
  NetworkNames.Binance,
  NetworkNames.Rootstock,
  NetworkNames.Optimism,
  NetworkNames.Arbitrum,
];

export {
  getAllNetworks,
  getNetworkByName,
  getProviderNetworkByName,
  DEFAULT_EVM_NETWORK_NAME,
  DEFAULT_BTC_NETWORK_NAME,
  POPULAR_NAMES,
  DEFAULT_EVM_NETWORK,
  DEFAULT_BTC_NETWORK,
};
